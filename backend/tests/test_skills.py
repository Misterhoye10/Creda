from unittest.mock import patch


def get_auth_token(client, email="skills_user@creda.app"):
    res = client.post("/api/auth/signup", json={
        "email": email,
        "password": "Password123!",
        "name": "Skills Candidate"
    })
    return res.json()["access_token"]


def test_extract_skills_no_evidence_fails(client):
    token = get_auth_token(client, "empty_evidence@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.post("/api/skills/extract", headers=headers)
    assert response.status_code == 400
    assert "No evidence found" in response.json()["detail"]


@patch("app.api.v1.endpoints.skills.extract_skills_from_evidence")
def test_extract_skills_success(mock_extractor, client):
    token = get_auth_token(client, "extract_success@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # First add a project evidence
    proj_res = client.post("/api/evidence/project", json={
        "title": "Creda Backend",
        "technologies": ["Python", "FastAPI", "PostgreSQL"]
    }, headers=headers)
    ev_id = proj_res.json()["id"]

    # Mock extractor return
    mock_extractor.return_value = [
        {
            "name": "Python",
            "category": "Languages",
            "level": "Advanced",
            "confidence": 92,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "Primary language used in Creda Backend"
        },
        {
            "name": "FastAPI",
            "category": "Backend",
            "level": "Intermediate",
            "confidence": 85,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "Core REST framework used for project"
        }
    ]

    response = client.post("/api/skills/extract", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["skills_extracted_count"] == 2
    assert data["skills"][0]["name"] == "Python"
    assert data["skills"][0]["confidence"] == 92


@patch("app.api.v1.endpoints.skills.extract_skills_from_evidence")
def test_get_skills_and_filter(mock_extractor, client):
    token = get_auth_token(client, "filter_skills@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    proj = client.post("/api/evidence/project", json={"title": "Demo"}, headers=headers)
    ev_id = proj.json()["id"]

    mock_extractor.return_value = [
        {
            "name": "React",
            "category": "Frontend",
            "level": "Advanced",
            "confidence": 90,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "React UI built"
        },
        {
            "name": "PostgreSQL",
            "category": "Database",
            "level": "Intermediate",
            "confidence": 80,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "Relational schema designed"
        }
    ]

    client.post("/api/skills/extract", headers=headers)

    # Get all
    all_res = client.get("/api/skills", headers=headers)
    assert all_res.status_code == 200
    assert all_res.json()["total"] == 2

    # Filter category=Frontend
    frontend_res = client.get("/api/skills?category=Frontend", headers=headers)
    assert frontend_res.status_code == 200
    assert frontend_res.json()["total"] == 1
    assert frontend_res.json()["items"][0]["name"] == "React"


@patch("app.api.v1.endpoints.skills.extract_skills_from_evidence")
def test_get_skill_detail_with_citations(mock_extractor, client):
    token = get_auth_token(client, "detail_skills@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    proj = client.post("/api/evidence/project", json={"title": "AI Engine"}, headers=headers)
    ev_id = proj.json()["id"]

    mock_extractor.return_value = [
        {
            "name": "Docker",
            "category": "DevOps & Cloud",
            "level": "Intermediate",
            "confidence": 75,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "Containerized application"
        }
    ]

    extract_res = client.post("/api/skills/extract", headers=headers)
    skill_id = extract_res.json()["skills"][0]["id"]

    # Fetch detail
    detail_res = client.get(f"/api/skills/{skill_id}", headers=headers)
    assert detail_res.status_code == 200
    detail_data = detail_res.json()
    assert detail_data["name"] == "Docker"
    assert len(detail_data["citations"]) == 1
    assert detail_data["citations"][0]["evidence_id"] == ev_id
    assert detail_data["citations"][0]["reason"] == "Containerized application"


@patch("app.api.v1.endpoints.skills.extract_skills_from_evidence")
def test_update_and_delete_skill(mock_extractor, client):
    token = get_auth_token(client, "crud_skills@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    proj = client.post("/api/evidence/project", json={"title": "Web App"}, headers=headers)
    ev_id = proj.json()["id"]

    mock_extractor.return_value = [
        {
            "name": "TypeScript",
            "category": "Languages",
            "level": "Beginner",
            "confidence": 60,
            "evidence_count": 1,
            "evidence_ids": [ev_id],
            "justification": "Used for frontend components"
        }
    ]

    extract_res = client.post("/api/skills/extract", headers=headers)
    skill_id = extract_res.json()["skills"][0]["id"]

    # Update skill
    update_res = client.put(f"/api/skills/{skill_id}", json={
        "level": "Advanced",
        "confidence": 88
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["level"] == "Advanced"
    assert update_res.json()["confidence"] == 88

    # Delete skill
    del_res = client.delete(f"/api/skills/{skill_id}", headers=headers)
    assert del_res.status_code == 200
    assert "deleted successfully" in del_res.json()["message"]

    # Verify not found
    get_res = client.get(f"/api/skills/{skill_id}", headers=headers)
    assert get_res.status_code == 404

from unittest.mock import patch


def get_auth_token(client, email="jobs_user@creda.app"):
    res = client.post("/api/auth/signup", json={
        "email": email,
        "password": "Password123!",
        "name": "Job Candidate"
    })
    return res.json()["access_token"]


@patch("app.api.v1.endpoints.jobs.match_job_against_skills")
def test_match_job_success(mock_matcher, client):
    token = get_auth_token(client, "matcher@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    mock_matcher.return_value = {
        "match_percentage": 82,
        "matching_skills": [
            {
                "name": "Python",
                "category": "Languages",
                "user_level": "Advanced",
                "required_level": "Intermediate",
                "confidence": 92,
                "status": "match",
                "importance": "required"
            },
            {
                "name": "FastAPI",
                "category": "Backend",
                "user_level": "Intermediate",
                "required_level": "Intermediate",
                "confidence": 85,
                "status": "match",
                "importance": "required"
            }
        ],
        "missing_skills": [
            {
                "name": "AWS",
                "category": "DevOps & Cloud",
                "user_level": None,
                "required_level": "Intermediate",
                "confidence": None,
                "status": "missing",
                "importance": "required"
            }
        ],
        "recommendations": "Deploy your FastAPI backend on AWS ECS to qualify for 95%+ match."
    }

    payload = {
        "job_title": "Senior Backend Engineer",
        "job_description": "We are seeking a Backend Engineer skilled in Python, FastAPI, and AWS deployment."
    }

    response = client.post("/api/jobs/match", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["job_title"] == "Senior Backend Engineer"
    assert data["match_percentage"] == 82
    assert len(data["matching_skills"]) == 2
    assert len(data["missing_skills"]) == 1
    assert data["missing_skills"][0]["name"] == "AWS"
    assert "AWS ECS" in data["recommendations"]


@patch("app.api.v1.endpoints.jobs.match_job_against_skills")
def test_list_and_get_job_matches(mock_matcher, client):
    token = get_auth_token(client, "list_jobs@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    mock_matcher.return_value = {
        "match_percentage": 75,
        "matching_skills": [],
        "missing_skills": [],
        "recommendations": "Keep building."
    }

    # Create 2 job matches
    client.post("/api/jobs/match", json={
        "job_title": "Role 1",
        "job_description": "Requirements 1"
    }, headers=headers)

    res2 = client.post("/api/jobs/match", json={
        "job_title": "Role 2",
        "job_description": "Requirements 2"
    }, headers=headers)
    match2_id = res2.json()["id"]

    # List all
    list_res = client.get("/api/jobs/matches", headers=headers)
    assert list_res.status_code == 200
    assert list_res.json()["total"] == 2

    # Get single
    single_res = client.get(f"/api/jobs/matches/{match2_id}", headers=headers)
    assert single_res.status_code == 200
    assert single_res.json()["job_title"] == "Role 2"

    # Delete
    del_res = client.delete(f"/api/jobs/matches/{match2_id}", headers=headers)
    assert del_res.status_code == 200

    # Verify 404 after delete
    get_again = client.get(f"/api/jobs/matches/{match2_id}", headers=headers)
    assert get_again.status_code == 404


@patch("app.api.v1.endpoints.jobs.match_job_against_skills")
def test_job_match_user_isolation(mock_matcher, client):
    token1 = get_auth_token(client, "user_a@creda.app")
    token2 = get_auth_token(client, "user_b@creda.app")

    mock_matcher.return_value = {
        "match_percentage": 70,
        "matching_skills": [],
        "missing_skills": [],
        "recommendations": "None."
    }

    # User 1 creates match
    create_res = client.post("/api/jobs/match", json={
        "job_title": "Private Job",
        "job_description": "Description"
    }, headers={"Authorization": f"Bearer {token1}"})
    match_id = create_res.json()["id"]

    # User 2 tries to view
    unauth_get = client.get(
        f"/api/jobs/matches/{match_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert unauth_get.status_code == 404

    # User 2 tries to delete
    unauth_del = client.delete(
        f"/api/jobs/matches/{match_id}",
        headers={"Authorization": f"Bearer {token2}"}
    )
    assert unauth_del.status_code == 404

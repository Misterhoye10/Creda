import pytest
from app.models.skill import Skill, SkillEvidence
from app.models.evidence import Evidence


def get_auth_token(client, email="profile_user@creda.app"):
    res = client.post("/api/auth/signup", json={
        "email": email,
        "password": "Password123!",
        "name": "Original Name"
    })
    return res.json()["access_token"], res.json()["user"]["id"]


def test_get_profile_authenticated(client):
    token, user_id = get_auth_token(client, "profile1@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get("/api/user/profile", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == user_id
    assert data["email"] == "profile1@creda.app"
    assert data["name"] == "Original Name"
    assert data["is_public"] is True
    assert "completeness_percentage" in data


def test_update_profile_success(client):
    token, user_id = get_auth_token(client, "profile2@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    update_payload = {
        "name": "Kwame Mensah",
        "professional_title": "Full Stack Engineer",
        "location": "Accra, Ghana",
        "years_experience": 4,
        "bio": "Building high scale fintech solutions across West Africa.",
        "avatar_url": "https://creda.app/avatars/kwame.jpg",
        "public_url": "kwame-mensah",
        "github_url": "https://github.com/kwamemensah",
        "linkedin_url": "https://linkedin.com/in/kwamemensah",
        "website_url": "https://kwamemensah.dev",
        "is_public": True
    }

    response = client.put("/api/user/profile", json=update_payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Kwame Mensah"
    assert data["professional_title"] == "Full Stack Engineer"
    assert data["location"] == "Accra, Ghana"
    assert data["years_experience"] == 4
    assert data["public_url"] == "kwame-mensah"
    assert data["github_url"] == "https://github.com/kwamemensah"
    assert data["completeness_percentage"] > 0


def test_update_profile_duplicate_slug_rejected(client):
    token1, _ = get_auth_token(client, "user1@creda.app")
    token2, _ = get_auth_token(client, "user2@creda.app")

    # User 1 claims slug
    res1 = client.put("/api/user/profile", json={"public_url": "star-developer"}, headers={"Authorization": f"Bearer {token1}"})
    assert res1.status_code == 200

    # User 2 tries to claim same slug
    res2 = client.put("/api/user/profile", json={"public_url": "star-developer"}, headers={"Authorization": f"Bearer {token2}"})
    assert res2.status_code == 400
    assert "already taken" in res2.json()["detail"]


def test_get_skills_summary(client, db_session):
    token, user_id = get_auth_token(client, "summary_user@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # Add an evidence item directly
    evidence = Evidence(
        user_id=user_id,
        type="Project",
        title="Creda Mobile App",
        description="Cross-platform Flutter application",
        url="https://github.com/example/creda-flutter"
    )
    db_session.add(evidence)
    db_session.flush()

    # Add a skill
    skill = Skill(
        user_id=user_id,
        name="Flutter",
        category="Mobile",
        level="Intermediate",
        confidence=88,
        evidence_count=1
    )
    db_session.add(skill)
    db_session.commit()

    response = client.get("/api/user/skills-summary", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_skills"] == 1
    assert data["total_evidence"] == 1
    assert data["average_confidence"] == 88.0
    assert data["skills_by_level"]["Intermediate"] == 1
    assert data["evidence_by_type"]["Project"] == 1
    assert data["completeness_percentage"] > 30


def test_public_passport_by_slug_and_id(client, db_session):
    token, user_id = get_auth_token(client, "public_user@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # Update profile with public details
    client.put("/api/user/profile", json={
        "name": "Amina Bello",
        "professional_title": "AI Engineer",
        "location": "Nairobi, Kenya",
        "bio": "Developing NLP models for low-resource languages.",
        "public_url": "amina-bello",
        "github_url": "https://github.com/aminabello",
        "is_public": True
    }, headers=headers)

    # Add evidence & skill with citation
    ev = Evidence(
        user_id=user_id,
        type="GitHub",
        title="swahili-nlp-transformer",
        description="HuggingFace model for Swahili sentiment analysis",
        url="https://github.com/aminabello/swahili-nlp"
    )
    db_session.add(ev)
    db_session.flush()

    sk = Skill(
        user_id=user_id,
        name="NLP",
        category="AI / ML",
        level="Advanced",
        confidence=94,
        evidence_count=1
    )
    db_session.add(sk)
    db_session.flush()

    link = SkillEvidence(
        skill_id=sk.id,
        evidence_id=ev.id,
        confidence_score=94
    )
    db_session.add(link)
    db_session.commit()

    # 1. Access by slug without authentication headers
    public_res = client.get("/api/passport/amina-bello")
    assert public_res.status_code == 200
    data = public_res.json()

    assert data["id"] == user_id
    assert data["name"] == "Amina Bello"
    assert data["professional_title"] == "AI Engineer"
    assert data["public_url"] == "amina-bello"
    assert data["is_creda_verified"] is True
    assert data["verified_skills_count"] == 1
    assert data["average_confidence"] == 94.0

    # Verify sensitive data is NOT exposed
    assert "email" not in data
    assert "password_hash" not in data

    # Verify skills and citations
    assert len(data["skills"]) == 1
    skill_item = data["skills"][0]
    assert skill_item["name"] == "NLP"
    assert skill_item["confidence"] == 94
    assert len(skill_item["citations"]) == 1
    assert skill_item["citations"][0]["evidence_type"] == "GitHub"

    # Verify evidence item
    assert len(data["evidence"]) == 1
    assert data["evidence"][0]["title"] == "swahili-nlp-transformer"

    # 2. Access by user_id without authentication headers
    id_res = client.get(f"/api/passport/{user_id}")
    assert id_res.status_code == 200
    assert id_res.json()["name"] == "Amina Bello"


def test_public_passport_private_profile_returns_404(client):
    token, user_id = get_auth_token(client, "private_user@creda.app")
    headers = {"Authorization": f"Bearer {token}"}

    # Set profile to private
    client.put("/api/user/profile", json={
        "name": "Secret Agent",
        "public_url": "secret-agent",
        "is_public": False
    }, headers=headers)

    # Unauthenticated request should get 404
    res = client.get("/api/passport/secret-agent")
    assert res.status_code == 404
    assert "private" in res.json()["detail"]


def test_public_passport_nonexistent_returns_404(client):
    res = client.get("/api/passport/non-existent-user-slug-999")
    assert res.status_code == 404

from unittest.mock import patch


def test_full_candidate_journey_e2e(client):
    """
    End-to-End integration test covering the entire candidate lifecycle:
    1. Signup & Authentication
    2. Submit Project Evidence
    3. Connect GitHub Profile
    4. AI-Powered Skill Extraction
    5. Job Matching & Skill Gap Analysis
    6. Candidate Profile Customization
    7. Skills Summary & Completeness Score
    8. Unauthenticated Public Skill Passport Access
    9. Security Headers Verification
    10. Privacy Toggle & 404 Guard
    """

    # 1. Candidate Signup
    signup_res = client.post("/api/auth/signup", json={
        "email": "e2e_candidate@creda.app",
        "password": "Password123!",
        "name": "E2E Candidate"
    })
    assert signup_res.status_code == 201
    auth_data = signup_res.json()
    token = auth_data["access_token"]
    user_id = auth_data["user"]["id"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Submit Project Evidence
    proj_res = client.post("/api/evidence/project", json={
        "title": "Creda Platform",
        "description": "Skills verification system for African tech talent",
        "technologies": ["Python", "FastAPI", "PostgreSQL", "Docker"],
        "github_url": "https://github.com/creda/backend",
        "live_url": "https://creda.app"
    }, headers=headers)
    assert proj_res.status_code == 201
    proj_id = proj_res.json()["id"]

    # 3. Connect GitHub Profile (Mocked API)
    with patch("app.api.v1.endpoints.evidence.fetch_github_profile_and_repos") as mock_github:
        mock_github.return_value = {
            "title": "GitHub: @e2e-dev",
            "url": "https://github.com/e2e-dev",
            "source": "github_api",
            "description": "GitHub profile with 12 repos. Top languages: Python (80%), TypeScript (20%)",
            "raw_text": "GitHub Profile for e2e-dev\nLanguages: Python, TypeScript\nRepositories: creda-api",
            "metadata_json": '{"profile": {"username": "e2e-dev"}, "languages": [{"language": "Python", "percentage": 80.0}]}'
        }

        gh_res = client.post("/api/evidence/github", json={
            "username": "e2e-dev"
        }, headers=headers)
        assert gh_res.status_code == 200



    # 4. AI-Powered Skill Extraction (Mocked OpenAI)
    with patch("app.api.v1.endpoints.skills.extract_skills_from_evidence") as mock_extractor:
        mock_extractor.return_value = [
            {
                "name": "Python",
                "category": "Languages",
                "level": "Advanced",
                "confidence": 95,
                "evidence_ids": [proj_id],
                "reason": "Corroborated by production project and active GitHub code"
            },
            {
                "name": "FastAPI",
                "category": "Backend",
                "level": "Advanced",
                "confidence": 92,
                "evidence_ids": [proj_id],
                "reason": "Primary framework used in Creda Platform"
            }
        ]

        extract_res = client.post("/api/skills/extract", headers=headers)
        assert extract_res.status_code == 200
        extracted = extract_res.json()
        assert extracted["skills_extracted_count"] >= 2


    # 5. Verify Skills List
    skills_res = client.get("/api/skills", headers=headers)
    assert skills_res.status_code == 200
    skills_data = skills_res.json()
    assert skills_data["total"] >= 2

    # 6. Job Matching & Gap Analysis (Mocked Matcher)
    with patch("app.api.v1.endpoints.jobs.match_job_against_skills") as mock_job:
        mock_job.return_value = {
            "match_percentage": 88,
            "matching_skills": [
                {
                    "name": "Python",
                    "category": "Languages",
                    "user_level": "Advanced",
                    "required_level": "Intermediate",
                    "confidence": 95,
                    "status": "match",
                    "importance": "required"
                },
                {
                    "name": "FastAPI",
                    "category": "Backend",
                    "user_level": "Advanced",
                    "required_level": "Intermediate",
                    "confidence": 92,
                    "status": "match",
                    "importance": "required"
                }
            ],
            "missing_skills": [
                {
                    "name": "Kubernetes",
                    "category": "DevOps",
                    "user_level": None,
                    "required_level": "Beginner",
                    "confidence": None,
                    "status": "missing",
                    "importance": "preferred"
                }
            ],
            "recommendations": "Deploy your FastAPI container on a managed k8s cluster."
        }

        job_res = client.post("/api/jobs/match", json={
            "job_title": "Senior Backend Engineer",
            "job_description": "We need a Python FastAPI expert with basic Kubernetes knowledge."
        }, headers=headers)
        assert job_res.status_code == 201
        assert job_res.json()["match_percentage"] == 88

    # 7. Candidate Profile Customization
    profile_res = client.put("/api/user/profile", json={
        "name": "Amina Touré",
        "professional_title": "Senior Cloud Backend Engineer",
        "location": "Dakar, Senegal",
        "years_experience": 5,
        "bio": "Specialized in Python distributed services and AI tooling.",
        "avatar_url": "https://creda.app/avatars/amina.jpg",
        "public_url": "amina-toure",
        "github_url": "https://github.com/aminatoure",
        "linkedin_url": "https://linkedin.com/in/aminatoure",
        "website_url": "https://aminatoure.dev",
        "is_public": True
    }, headers=headers)
    assert profile_res.status_code == 200
    assert profile_res.json()["public_url"] == "amina-toure"

    # 8. Skills Summary & Completeness Check
    summary_res = client.get("/api/user/skills-summary", headers=headers)
    assert summary_res.status_code == 200
    summary_data = summary_res.json()
    assert summary_data["completeness_percentage"] >= 80
    assert summary_data["total_skills"] >= 2
    assert summary_data["average_confidence"] > 90

    # 9. Public Skill Passport Access (NO AUTH TOKEN)
    public_res = client.get("/api/passport/amina-toure")
    assert public_res.status_code == 200
    passport = public_res.json()
    assert passport["id"] == user_id
    assert passport["name"] == "Amina Touré"
    assert passport["is_creda_verified"] is True
    assert passport["verified_skills_count"] >= 2
    assert "email" not in passport
    assert "password_hash" not in passport

    # 10. Security Headers Verification
    assert public_res.headers.get("X-Content-Type-Options") == "nosniff"
    assert public_res.headers.get("X-Frame-Options") == "DENY"
    assert public_res.headers.get("X-XSS-Protection") == "1; mode=block"

    # 11. Privacy Toggle & 404 Guard
    client.put("/api/user/profile", json={"is_public": False}, headers=headers)
    hidden_res = client.get("/api/passport/amina-toure")
    assert hidden_res.status_code == 404

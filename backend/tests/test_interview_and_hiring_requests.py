import pytest
from fastapi.testclient import TestClient


def test_interview_request_and_response_loop(client: TestClient):
    # 1. Register a Tech Talent
    talent_payload = {
        "email": "candidate.test@creda.app",
        "password": "Password123!",
        "name": "David Candidate",
        "account_type": "talent",
        "professional_title": "Full Stack Engineer",
        "location": "Lagos, Nigeria",
        "country": "Nigeria",
        "city": "Lagos",
    }
    res_talent = client.post("/api/auth/signup", json=talent_payload)
    assert res_talent.status_code == 201
    talent_token = res_talent.json()["access_token"]
    talent_id = res_talent.json()["user"]["id"]

    # 2. Register a Hiring Team Recruiter
    recruiter_payload = {
        "email": "recruiter.test@technova.com",
        "password": "Password123!",
        "name": "Sarah Recruiter",
        "account_type": "recruiter",
        "company_name": "TechNova",
        "company_website": "https://technova.io",
        "hiring_role": "Head of Talent Acquisition",
    }
    res_recruiter = client.post("/api/auth/signup", json=recruiter_payload)
    assert res_recruiter.status_code == 201
    recruiter_token = res_recruiter.json()["access_token"]

    # 3. Recruiter sends Interview Request to Talent
    invite_payload = {
        "talent_id": talent_id,
        "company_name": "TechNova",
        "role_title": "Senior Backend Engineer",
        "work_type": "Full-Time Remote",
        "compensation": "$75,000 - $95,000 / year",
        "message": "We loved your AST code records on Creda and want to discuss an offer.",
    }
    res_invite = client.post(
        "/api/recruiter/requests",
        json=invite_payload,
        headers={"Authorization": f"Bearer {recruiter_token}"}
    )
    assert res_invite.status_code == 201
    request_id = res_invite.json()["request_id"]
    assert res_invite.json()["status"] == "pending"

    # 4. Talent checks received requests inbox
    res_inbox = client.get(
        "/api/talent/requests",
        headers={"Authorization": f"Bearer {talent_token}"}
    )
    assert res_inbox.status_code == 200
    inbox_items = res_inbox.json()
    assert len(inbox_items) >= 1
    target = next((item for item in inbox_items if item["id"] == request_id), None)
    assert target is not None
    assert target["company_name"] == "TechNova"
    assert target["role_title"] == "Senior Backend Engineer"
    assert target["status"] == "pending"

    # 5. Talent Responds: Accepts the interview request
    res_respond = client.post(
        f"/api/talent/requests/{request_id}/respond",
        json={"action": "accept", "response_note": "Thank you! I am excited to connect."},
        headers={"Authorization": f"Bearer {talent_token}"}
    )
    assert res_respond.status_code == 200
    assert res_respond.json()["status"] == "accepted"

    # 6. Recruiter checks sent requests: Status is now accepted!
    res_recruiter_list = client.get(
        "/api/recruiter/requests",
        headers={"Authorization": f"Bearer {recruiter_token}"}
    )
    assert res_recruiter_list.status_code == 200
    recruiter_items = res_recruiter_list.json()
    sent_req = next((item for item in recruiter_items if item["id"] == request_id), None)
    assert sent_req is not None
    assert sent_req["status"] == "accepted"
    assert sent_req["talent_email"] == "candidate.test@creda.app"  # Unlocked upon acceptance!


def test_hiring_request_and_evidence_gap_matching(client: TestClient):
    # Register recruiter
    recruiter_payload = {
        "email": "hr.lead@fintech.africa",
        "password": "Password123!",
        "name": "Kofi HR",
        "account_type": "recruiter",
        "company_name": "Fintech Africa",
    }
    res_recruiter = client.post("/api/auth/signup", json=recruiter_payload)
    token = res_recruiter.json()["access_token"]

    # Create hiring request
    hiring_req_payload = {
        "role_title": "Lead Python & React Engineer",
        "company_name": "Fintech Africa",
        "location": "Remote Worldwide",
        "employment_type": "Full-Time",
        "required_skills": "Python, React, PostgreSQL",
        "nice_to_have_skills": "Docker, Kubernetes",
        "experience_years": 3,
    }
    res_create = client.post(
        "/api/recruiter/hiring-requests",
        json=hiring_req_payload,
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res_create.status_code == 201
    req_id = res_create.json()["hiring_request"]["id"]

    # Match candidates against this hiring request
    res_match = client.post(
        f"/api/recruiter/hiring-requests/{req_id}/matches",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert res_match.status_code == 200
    data = res_match.json()
    assert "matches" in data
    assert data["role_title"] == "Lead Python & React Engineer"

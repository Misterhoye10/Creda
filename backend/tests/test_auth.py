def test_signup_success(client):
    payload = {
        "email": "dev@creda.app",
        "password": "strongPassword123",
        "name": "Chidi Anagonye",
        "professional_title": "Full Stack Engineer",
        "location": "Lagos, Nigeria"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "dev@creda.app"
    assert data["user"]["name"] == "Chidi Anagonye"
    assert data["user"]["professional_title"] == "Full Stack Engineer"
    assert data["user"]["location"] == "Lagos, Nigeria"
    assert "password" not in data["user"]
    assert "password_hash" not in data["user"]


def test_signup_duplicate_email(client):
    payload = {
        "email": "duplicate@creda.app",
        "password": "password123",
        "name": "First User"
    }
    res1 = client.post("/api/auth/signup", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/signup", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]


def test_signup_short_password(client):
    payload = {
        "email": "short@creda.app",
        "password": "123", # Less than 6 characters
        "name": "Short Pwd"
    }
    response = client.post("/api/auth/signup", json=payload)
    assert response.status_code == 422


def test_login_success(client):
    # First sign up
    client.post("/api/auth/signup", json={
        "email": "login_test@creda.app",
        "password": "correct_password",
        "name": "Login Tester"
    })

    # Then log in
    response = client.post("/api/auth/login", json={
        "email": "login_test@creda.app",
        "password": "correct_password"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "login_test@creda.app"


def test_login_wrong_password(client):
    client.post("/api/auth/signup", json={
        "email": "wrong_pwd@creda.app",
        "password": "correct_password"
    })

    response = client.post("/api/auth/login", json={
        "email": "wrong_pwd@creda.app",
        "password": "wrong_password"
    })
    assert response.status_code == 401
    assert "Invalid email or password" in response.json()["detail"]


def test_login_nonexistent_user(client):
    response = client.post("/api/auth/login", json={
        "email": "nobody@creda.app",
        "password": "anypassword"
    })
    assert response.status_code == 401


def test_get_me_authenticated(client):
    # Sign up to get token
    signup_res = client.post("/api/auth/signup", json={
        "email": "me_test@creda.app",
        "password": "password123",
        "name": "Self Tester"
    })
    token = signup_res.json()["access_token"]

    # Call /api/auth/me with Bearer token
    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "me_test@creda.app"
    assert data["name"] == "Self Tester"


def test_get_me_unauthorized(client):
    # No auth header
    response = client.get("/api/auth/me")
    assert response.status_code == 401

    # Invalid auth header
    response_invalid = client.get(
        "/api/auth/me",
        headers={"Authorization": "Bearer bad.token.value"}
    )
    assert response_invalid.status_code == 401


def test_logout(client):
    response = client.post("/api/auth/logout")
    assert response.status_code == 200
    assert response.json()["message"] == "Successfully logged out."

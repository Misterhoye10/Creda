import requests
import json

base_url = "http://127.0.0.1:8000/api"

# Login
login_res = requests.post(f"{base_url}/auth/login", json={
    "email": "test@creda.work",
    "password": "password123"
})
print("Login status:", login_res.status_code)
token = login_res.json().get("access_token")

headers = {"Authorization": f"Bearer {token}"}

# Get Profile
prof_res = requests.get(f"{base_url}/user/profile", headers=headers)
print("GET /user/profile status:", prof_res.status_code)
print("Initial completeness:", prof_res.json().get("completeness_percentage"), "%")

# Update Profile
update_data = {
    "name": "Amina Adeleke",
    "professional_title": "Principal Systems Architect",
    "location": "Lagos, Nigeria // Global Remote",
    "bio": "Distributed systems engineer specializing in Go microservices, AST complexity analysis, and fault-tolerant architecture.",
    "public_url": "amina-adeleke-lead",
    "is_public": True,
    "github_url": "https://github.com/amina-dev",
    "linkedin_url": "https://linkedin.com/in/amina-adeleke"
}
put_res = requests.put(f"{base_url}/user/profile", json=update_data, headers=headers)
print("PUT /user/profile status:", put_res.status_code)
data = put_res.json()
print("Updated Name:", data.get("name"))
print("Updated Title:", data.get("professional_title"))
print("Updated Slug:", data.get("public_url"))
print("Updated Completeness:", data.get("completeness_percentage"), "%")

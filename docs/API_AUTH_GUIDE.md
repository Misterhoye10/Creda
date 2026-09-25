# Creda API — Frontend Integration Guide: Authentication

Welcome to the backend API! This document provides everything the frontend team needs to connect React/Vite to the Creda authentication endpoints.

---

## 🌐 Base URL & Interactive Docs

- **Local Base URL:** `http://localhost:8000`
- **Interactive Swagger UI:** `http://localhost:8000/docs`
- **OpenAPI Schema (JSON):** `http://localhost:8000/openapi.json`

> **Note on CORS:** CORS is pre-configured to accept requests from `http://localhost:3000`, `http://localhost:5173`, `http://127.0.0.1:3000`, and `http://127.0.0.1:5173` with credentials and custom headers enabled.

---

## 🔐 Authentication Endpoints

### 1. User Sign Up
Registers a new user, hashes their password, automatically creates their initial public passport URL slug, and logs them in immediately.

- **URL:** `/api/auth/signup`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "email": "candidate@example.com",
  "password": "securePassword123",
  "name": "Amina Bello",
  "professional_title": "Full Stack Developer",
  "location": "Lagos, Nigeria"
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `email` | string | **Yes** | Valid email address |
| `password` | string | **Yes** | Minimum 6 characters |
| `name` | string | No | User's full display name |
| `professional_title` | string | No | e.g. "Frontend Engineer", "Data Scientist" |
| `location` | string | No | e.g. "Abuja, Nigeria" |

#### Success Response (`201 Created`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
    "email": "candidate@example.com",
    "name": "Amina Bello",
    "professional_title": "Full Stack Developer",
    "location": "Lagos, Nigeria",
    "years_experience": 0,
    "bio": null,
    "avatar_url": null,
    "public_url": "amina-bello",
    "created_at": "2026-09-25T13:40:00Z",
    "updated_at": "2026-09-25T13:40:00Z"
  }
}
```

#### Error Responses:
- `400 Bad Request`:
  ```json
  { "detail": "A user with this email address already exists." }
  ```
- `422 Unprocessable Entity`: Validation failure (e.g. password < 6 characters or invalid email format).

---

### 2. User Login
Authenticates an existing candidate and returns a fresh JWT access token.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "email": "candidate@example.com",
  "password": "securePassword123"
}
```

#### Success Response (`200 OK`):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "token_type": "bearer",
  "user": {
    "id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
    "email": "candidate@example.com",
    "name": "Amina Bello",
    "professional_title": "Full Stack Developer",
    "location": "Lagos, Nigeria",
    "years_experience": 0,
    "bio": null,
    "avatar_url": null,
    "public_url": "amina-bello",
    "created_at": "2026-09-25T13:40:00Z",
    "updated_at": "2026-09-25T13:40:00Z"
  }
}
```

#### Error Response (`401 Unauthorized`):
```json
{ "detail": "Invalid email or password." }
```

---

### 3. Get Current User Profile (`/me`)
Retrieves the logged-in candidate's profile data. Use this on application load or page refresh to verify if the saved token is still valid.

- **URL:** `/api/auth/me`
- **Method:** `GET`
- **Headers:** 
  ```http
  Authorization: Bearer <access_token>
  ```

#### Success Response (`200 OK`):
```json
{
  "id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
  "email": "candidate@example.com",
  "name": "Amina Bello",
  "professional_title": "Full Stack Developer",
  "location": "Lagos, Nigeria",
  "years_experience": 0,
  "bio": null,
  "avatar_url": null,
  "public_url": "amina-bello",
  "created_at": "2026-09-25T13:40:00Z",
  "updated_at": "2026-09-25T13:40:00Z"
}
```

#### Error Response (`401 Unauthorized`):
```json
{ "detail": "Invalid or expired token" }
```

---

### 4. User Logout
- **URL:** `/api/auth/logout`
- **Method:** `POST`

#### Success Response (`200 OK`):
```json
{ "message": "Successfully logged out." }
```
*(On the frontend, remove the stored token from `localStorage` or state).*

---

## 💻 Frontend Code Example (Axios)

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

// Automatically attach Bearer token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('creda_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Example Login Function
export async function loginUser(email: string, password: string) {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { access_token, user } = response.data;
    localStorage.setItem('creda_token', access_token);
    return user;
  } catch (error: any) {
    throw error.response?.data?.detail || 'Login failed';
  }
}

// Example Check Auth on App Mount
export async function fetchCurrentUser() {
  const token = localStorage.getItem('creda_token');
  if (!token) return null;
  
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch {
    localStorage.removeItem('creda_token');
    return null;
  }
}
```

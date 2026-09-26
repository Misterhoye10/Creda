# Creda API — Frontend Integration Guide: Evidence Management

This guide explains how to connect your React/Vite frontend to Creda's **Evidence Management** endpoints (Phase 3).

---

## 🌐 Overview & Headers

All Evidence endpoints require the user to be authenticated with their JWT token:
```http
Authorization: Bearer <access_token>
```

---

## 📂 Endpoints Breakdown

### 1. Upload CV (`POST /api/evidence/upload-cv`)
Accepts a PDF resume file via `multipart/form-data`, extracts text content on the backend, stores the file, and links it to the candidate's profile.

- **URL:** `/api/evidence/upload-cv`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Form Field Name:** `file` (Must be a `.pdf` file, max 10MB)

#### Axios Example:
```typescript
export async function uploadCandidateCV(file: File) {
  const token = localStorage.getItem('creda_token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('http://localhost:8000/api/evidence/upload-cv', formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
}
```

#### Success Response (`201 Created`):
```json
{
  "id": "e4f8b2d1-0987-4321-bcde-567890abcdef",
  "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
  "type": "CV",
  "title": "Amina_Bello_Resume.pdf",
  "description": "Uploaded CV: Amina_Bello_Resume.pdf",
  "source": "upload",
  "file_url": "/uploads/cvs/4a1c9e8b_Amina_Bello_Resume.pdf",
  "raw_text": "Amina Bello\nSenior Full Stack Developer\nExperience: 4 years with React, Node.js, and PostgreSQL...",
  "metadata_json": "{\"filename\": \"Amina_Bello_Resume.pdf\", \"size_bytes\": 154200}",
  "created_at": "2026-09-25T14:30:00Z"
}
```

---

### 2. Connect GitHub Profile (`POST /api/evidence/github`)
Connects a candidate's GitHub handle, inspects their public repositories, extracts language usage breakdowns, star counts, and summarizes their open-source presence.

- **URL:** `/api/evidence/github`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "username": "Misterhoye10"
}
```

#### Success Response (`200 OK`):
```json
{
  "id": "7b2a1c9d-1122-3344-5566-778899aabbcc",
  "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
  "type": "GitHub",
  "title": "GitHub: @Misterhoye10",
  "description": "GitHub profile with 12 repos. Top languages: Python (55.4%), TypeScript (32.1%)",
  "url": "https://github.com/Misterhoye10",
  "source": "github_api",
  "raw_text": "GitHub Developer Profile: Hoye (@Misterhoye10)...",
  "metadata_json": "{\"profile\": {...}, \"languages\": [{\"language\": \"Python\", \"percentage\": 55.4}], \"top_repositories\": [...]}",
  "created_at": "2026-09-25T14:31:00Z"
}
```

---

### 3. Submit Portfolio Project (`POST /api/evidence/project`)
Allows candidates to manually record completed projects with links and technologies.

- **URL:** `/api/evidence/project`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "title": "Creda Skill Passport",
  "description": "AI skills verification platform for African engineers.",
  "technologies": ["React", "FastAPI", "PostgreSQL", "OpenAI"],
  "github_url": "https://github.com/Misterhoye10/Creda",
  "live_url": "https://creda.app"
}
```

#### Success Response (`201 Created`):
```json
{
  "id": "3c9d1a8f-9988-7766-5544-332211aabbcc",
  "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
  "type": "Project",
  "title": "Creda Skill Passport",
  "description": "AI skills verification platform for African engineers.",
  "url": "https://creda.app",
  "source": "manual",
  "created_at": "2026-09-25T14:32:00Z"
}
```

---

### 4. List User Evidence (`GET /api/evidence`)
Fetches all evidence records belonging to the authenticated user.

- **URL:** `/api/evidence`
- **Optional Query Parameter:** `?type=CV`, `?type=GitHub`, or `?type=Project`

#### Success Response (`200 OK`):
```json
{
  "total": 3,
  "items": [
    {
      "id": "e4f8b2d1-0987-4321-bcde-567890abcdef",
      "type": "CV",
      "title": "Amina_Bello_Resume.pdf",
      "source": "upload"
    },
    {
      "id": "7b2a1c9d-1122-3344-5566-778899aabbcc",
      "type": "GitHub",
      "title": "GitHub: @Misterhoye10",
      "source": "github_api"
    }
  ]
}
```

---

### 5. Delete Evidence (`DELETE /api/evidence/{id}`)
Removes an evidence item and cleans up any uploaded files from storage.

- **URL:** `/api/evidence/e4f8b2d1-0987-4321-bcde-567890abcdef`
- **Method:** `DELETE`

#### Success Response (`200 OK`):
```json
{
  "message": "Evidence deleted successfully."
}
```

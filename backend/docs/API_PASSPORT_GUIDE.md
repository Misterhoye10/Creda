# Creda — Phase 6: Public Skill Passport & Profile API Guide

This guide is designed for the frontend team working on `frontend/develop` to integrate the **Candidate Profile Management** and the **Public Skill Passport** viewing system.

---

## 📌 Summary of Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user/profile` | **Yes** (Bearer) | Get authenticated candidate's private profile, completeness score, and statistics. |
| `PUT` | `/api/user/profile` | **Yes** (Bearer) | Update profile fields, custom handle/slug (`public_url`), and visibility toggle (`is_public`). |
| `GET` | `/api/user/skills-summary` | **Yes** (Bearer) | Get aggregated dashboard metrics: completeness %, skills count by level, average confidence score, and evidence count. |
| `GET` | `/api/passport/{identifier}` | **No** (Public) | Public Skill Passport viewable by recruiters and external visitors. Accepts candidate UUID or custom slug (e.g. `/api/passport/kwame-mensah`). |

---

## 1. Candidate Profile (`/api/user/profile`)

### GET `/api/user/profile`
**Headers**: `Authorization: Bearer <token>`

**Response `200 OK`**:
```json
{
  "id": "02e82ad8-fe84-489a-b28c-f4f410c82622",
  "email": "candidate@creda.app",
  "name": "Kwame Mensah",
  "professional_title": "Full Stack Engineer",
  "location": "Accra, Ghana",
  "years_experience": 4,
  "bio": "Building robust, scalable fintech infrastructure across Africa.",
  "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "public_url": "kwame-mensah",
  "is_public": true,
  "github_url": "https://github.com/kwamemensah",
  "linkedin_url": "https://linkedin.com/in/kwamemensah",
  "website_url": "https://kwamemensah.dev",
  "completeness_percentage": 90,
  "total_skills": 8,
  "total_evidence": 3,
  "created_at": "2026-09-25T14:00:00Z",
  "updated_at": "2026-09-25T20:30:00Z"
}
```

### PUT `/api/user/profile`
**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Kwame Mensah",
  "professional_title": "Lead Software Engineer",
  "location": "Accra, Ghana",
  "years_experience": 5,
  "bio": "Specialized in Python, FastAPI, distributed systems and payments.",
  "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "public_url": "kwame-mensah",
  "is_public": true,
  "github_url": "https://github.com/kwamemensah",
  "linkedin_url": "https://linkedin.com/in/kwamemensah",
  "website_url": "https://kwamemensah.dev"
}
```

> [!NOTE]
> If a requested `public_url` slug is already taken by another user, the API returns `400 Bad Request` with `{"detail": "Public URL slug is already taken. Please choose another."}`.

---

## 2. Dashboard Skills Summary (`GET /api/user/skills-summary`)

Use this endpoint to render the candidate dashboard overview widgets, charts, and progress bars.

**Headers**: `Authorization: Bearer <token>`

**Response `200 OK`**:
```json
{
  "completeness_percentage": 85,
  "total_skills": 10,
  "skills_by_level": {
    "Beginner": 1,
    "Intermediate": 6,
    "Advanced": 3,
    "Expert": 0
  },
  "average_confidence": 87.4,
  "total_evidence": 4,
  "evidence_by_type": {
    "CV": 1,
    "GitHub": 1,
    "Project": 2
  }
}
```

---

## 3. Public Skill Passport (`GET /api/passport/{identifier}`)

This endpoint powers the public URL shared with recruiters (e.g., `creda.app/p/kwame-mensah` or `creda.app/passport/02e82ad8...`).

- **No authentication required** — recruiters and hiring managers do not need a Creda account.
- **Privacy Shield**: Sensitive data (`email`, `password_hash`, raw server file paths) are completely stripped out.
- **Privacy Enforcement**: Returns `404 Not Found` if candidate has toggled `is_public: false`.

### GET `/api/passport/kwame-mensah`

**Response `200 OK`**:
```json
{
  "id": "02e82ad8-fe84-489a-b28c-f4f410c82622",
  "name": "Kwame Mensah",
  "professional_title": "Full Stack Engineer",
  "location": "Accra, Ghana",
  "bio": "Building robust, scalable fintech infrastructure across Africa.",
  "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
  "years_experience": 4,
  "public_url": "kwame-mensah",
  "github_url": "https://github.com/kwamemensah",
  "linkedin_url": "https://linkedin.com/in/kwamemensah",
  "website_url": "https://kwamemensah.dev",
  "verified_skills_count": 5,
  "average_confidence": 89.2,
  "is_creda_verified": true,
  "skills": [
    {
      "id": "skill-1",
      "name": "FastAPI",
      "level": "Advanced",
      "confidence": 94,
      "evidence_count": 2,
      "citations": [
        {
          "evidence_type": "GitHub",
          "title": "creda-backend",
          "confidence_score": 95
        },
        {
          "evidence_type": "CV",
          "title": "Kwame_Resume.pdf",
          "confidence_score": 93
        }
      ]
    },
    {
      "id": "skill-2",
      "name": "Python",
      "level": "Advanced",
      "confidence": 92,
      "evidence_count": 2,
      "citations": [
        {
          "evidence_type": "GitHub",
          "title": "creda-backend",
          "confidence_score": 92
        }
      ]
    }
  ],
  "evidence": [
    {
      "id": "ev-1",
      "type": "GitHub",
      "title": "creda-backend",
      "description": "FastAPI asynchronous REST API with PostgreSQL and OpenAI integration",
      "source_url": "https://github.com/Misterhoye10/Creda",
      "created_at": "2026-09-25T15:20:00Z"
    }
  ]
}
```

---

## 4. Frontend Example: Next.js / React Public Passport View

```tsx
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicPassportPage() {
  const { slug } = useParams();
  const [passport, setPassport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/passport/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error("Skill Passport is private or does not exist.");
        return res.json();
      })
      .then(data => {
        setPassport(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <div>Loading verified Skill Passport...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-lg">
      <div className="flex items-center space-x-4 mb-6">
        <img
          src={passport.avatar_url || "/default-avatar.png"}
          alt={passport.name}
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            {passport.name}
            {passport.is_creda_verified && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                ✓ Creda Verified
              </span>
            )}
          </h1>
          <p className="text-gray-600">{passport.professional_title} • {passport.location}</p>
          <p className="text-sm text-gray-500 mt-1">{passport.bio}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h2 className="text-xl font-semibold mb-4">Verified Skills ({passport.verified_skills_count})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passport.skills.map(skill => (
            <div key={skill.id} className="p-3 border rounded bg-slate-50">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-gray-800">{skill.name}</span>
                <span className="text-sm font-bold text-blue-600">{skill.confidence}% Confidence</span>
              </div>
              <div className="text-xs text-gray-500">Level: {skill.level}</div>
              <div className="mt-2 text-xs text-gray-600">
                Backed by {skill.evidence_count} verified source(s)
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

# Creda API — Frontend Integration Guide: Job Matching & Gap Analysis

This guide explains how to connect your React/Vite frontend to Creda's **AI Job Matching Engine** (Phase 5).

---

## 🌐 Overview & Authentication

All Job Matching endpoints require authentication:
```http
Authorization: Bearer <access_token>
```

---

## 💼 Endpoints Breakdown

### 1. Match Job Description Against Verified Skills (`POST /api/jobs/match`)
Takes a job title and job description, parses the requirements, compares against the candidate's verified skills, calculates a compatibility match percentage, identifies missing skills, and suggests concrete steps to close the gap.

- **URL:** `/api/jobs/match`
- **Method:** `POST`
- **Content-Type:** `application/json`

#### Request Body:
```json
{
  "job_title": "Senior Backend Engineer",
  "job_description": "We are seeking a Backend Engineer with strong proficiency in Python and FastAPI. Experience with PostgreSQL is required. Familiarity with React is a plus. Knowledge of AWS cloud infrastructure and Docker is required."
}
```

#### Success Response (`201 Created`):
```json
{
  "id": "j1a2b3c4-9876-5432-abcd-ef0123456789",
  "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
  "job_title": "Senior Backend Engineer",
  "job_description": "We are seeking a Backend Engineer...",
  "match_percentage": 82,
  "matching_skills": [
    {
      "name": "Python",
      "category": "Languages",
      "user_level": "Advanced",
      "required_level": "Intermediate",
      "confidence": 94,
      "status": "match",
      "importance": "required"
    },
    {
      "name": "FastAPI",
      "category": "Backend",
      "user_level": "Intermediate",
      "required_level": "Intermediate",
      "confidence": 88,
      "status": "match",
      "importance": "required"
    },
    {
      "name": "PostgreSQL",
      "category": "Database",
      "user_level": "Intermediate",
      "required_level": "Intermediate",
      "confidence": 80,
      "status": "match",
      "importance": "required"
    }
  ],
  "missing_skills": [
    {
      "name": "AWS",
      "category": "DevOps & Cloud",
      "user_level": null,
      "required_level": "Intermediate",
      "confidence": null,
      "status": "missing",
      "importance": "required"
    }
  ],
  "recommendations": "To reach a 95%+ match: 1) Deploy a Dockerized FastAPI service to AWS ECS or App Runner. 2) Connect AWS RDS to demonstrate cloud database infrastructure.",
  "created_at": "2026-09-25T20:30:00Z"
}
```

---

### 2. List Saved Job Matches (`GET /api/jobs/matches`)
Returns all job match reports saved by the logged-in candidate.

- **URL:** `/api/jobs/matches`
- **Method:** `GET`

#### Success Response (`200 OK`):
```json
{
  "total": 3,
  "items": [
    {
      "id": "j1a2b3c4-9876-5432-abcd-ef0123456789",
      "job_title": "Senior Backend Engineer",
      "match_percentage": 82,
      "created_at": "2026-09-25T20:30:00Z"
    }
  ]
}
```

---

### 3. Get Single Job Match Report (`GET /api/jobs/matches/{id}`)
Retrieves full details of a specific match report.

- **URL:** `/api/jobs/matches/j1a2b3c4-9876-5432-abcd-ef0123456789`
- **Method:** `GET`

---

### 4. Delete Job Match Report (`DELETE /api/jobs/matches/{id}`)
Removes a saved job match report.

- **URL:** `/api/jobs/matches/j1a2b3c4-9876-5432-abcd-ef0123456789`
- **Method:** `DELETE`

#### Success Response (`200 OK`):
```json
{
  "message": "Job match report deleted successfully."
}
```

---

## 💻 React UI Component Example

```tsx
import React from 'react';

export function JobMatchCard({ match }: { match: any }) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <div className="border rounded-xl p-6 bg-white shadow-sm space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">{match.job_title}</h3>
        <span className={`px-4 py-1.5 rounded-full text-lg font-black border ${getScoreColor(match.match_percentage)}`}>
          {match.match_percentage}% Match
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="font-semibold text-emerald-700 text-sm mb-2">Matching Verified Skills:</h4>
          <div className="flex flex-wrap gap-1.5">
            {match.matching_skills.map((s: any) => (
              <span key={s.name} className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-md font-medium">
                ✓ {s.name} ({s.confidence}%)
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-rose-700 text-sm mb-2">Missing / Skill Gaps:</h4>
          <div className="flex flex-wrap gap-1.5">
            {match.missing_skills.map((s: any) => (
              <span key={s.name} className="px-2.5 py-1 bg-rose-100 text-rose-800 text-xs rounded-md font-medium">
                ✕ {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {match.recommendations && (
        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
          <strong>💡 AI Career Advice:</strong> {match.recommendations}
        </div>
      )}
    </div>
  );
}
```

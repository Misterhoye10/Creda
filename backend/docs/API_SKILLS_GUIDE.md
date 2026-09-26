# Creda API — Frontend Integration Guide: AI Skill Extraction

This guide explains how to connect your React/Vite frontend to Creda's **AI Skill Extraction Engine** (Phase 4).

---

## 🌐 Overview & Authentication

All Skills endpoints require the Bearer JWT token header:
```http
Authorization: Bearer <access_token>
```

---

## 🧠 Endpoints Breakdown

### 1. Trigger AI Skill Extraction (`POST /api/skills/extract`)
Triggers OpenAI to audit all candidate evidence (CV, GitHub analysis, and Project submissions). It standardizes skills, detects proficiency levels, links evidence citations, and calculates confidence scores (up to 98% with multi-evidence corroboration).

- **URL:** `/api/skills/extract`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** None (extracts from user's saved evidence in DB)

#### Success Response (`200 OK`):
```json
{
  "message": "Successfully extracted and verified 8 skills.",
  "skills_extracted_count": 8,
  "skills": [
    {
      "id": "s1a2b3c4-9876-5432-abcd-ef0123456789",
      "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
      "name": "Python",
      "category": "Languages",
      "level": "Advanced",
      "confidence": 94,
      "evidence_count": 2,
      "created_at": "2026-09-25T15:00:00Z"
    },
    {
      "id": "s2b3c4d5-8765-4321-bcde-fa1234567890",
      "user_id": "c138b301-e0e6-42d7-98fa-1209b5ca3d41",
      "name": "FastAPI",
      "category": "Backend",
      "level": "Intermediate",
      "confidence": 88,
      "evidence_count": 2,
      "created_at": "2026-09-25T15:00:00Z"
    }
  ]
}
```

---

### 2. List Candidate Skills (`GET /api/skills`)
Returns the list of verified skills, ordered by confidence descending.

- **URL:** `/api/skills`
- **Method:** `GET`
- **Optional Query Parameter:** `?category=Frontend`, `?category=Backend`, `?category=Database`, `?category=DevOps & Cloud`

#### Success Response (`200 OK`):
```json
{
  "total": 8,
  "items": [
    {
      "id": "s1a2b3c4-9876-5432-abcd-ef0123456789",
      "name": "Python",
      "category": "Languages",
      "level": "Advanced",
      "confidence": 94,
      "evidence_count": 2
    }
  ]
}
```

---

### 3. Get Skill Details & Proof Citations (`GET /api/skills/{id}`)
Fetches a single skill along with the exact evidence items (CV, GitHub repositories, Projects) that verified it and the AI justification.

- **URL:** `/api/skills/s1a2b3c4-9876-5432-abcd-ef0123456789`
- **Method:** `GET`

#### Success Response (`200 OK`):
```json
{
  "id": "s1a2b3c4-9876-5432-abcd-ef0123456789",
  "name": "Python",
  "category": "Languages",
  "level": "Advanced",
  "confidence": 94,
  "evidence_count": 2,
  "citations": [
    {
      "evidence_id": "e1-uuid",
      "evidence_type": "GitHub",
      "evidence_title": "GitHub: @Misterhoye10",
      "confidence_score": 94,
      "reason": "Verified in active repositories: Creda, 55.4% of total code written."
    },
    {
      "evidence_id": "e2-uuid",
      "evidence_type": "CV",
      "evidence_title": "Resume.pdf",
      "confidence_score": 94,
      "reason": "Listed as primary backend language with 4 years commercial experience."
    }
  ]
}
```

---

### 4. Delete Skill (`DELETE /api/skills/{id}`)
Removes a skill from the candidate's profile.

- **URL:** `/api/skills/{id}`
- **Method:** `DELETE`

#### Success Response (`200 OK`):
```json
{
  "message": "Skill deleted successfully."
}
```

---

## 💻 React UI Component Example

```tsx
import React, { useState } from 'react';
import axios from 'axios';

export function SkillBadge({ skill }: { skill: any }) {
  const getBadgeColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (confidence >= 65) return 'bg-blue-100 text-blue-800 border-blue-300';
    return 'bg-amber-100 text-amber-800 border-amber-300';
  };

  return (
    <div className={`p-3 rounded-lg border ${getBadgeColor(skill.confidence)} flex justify-between items-center`}>
      <div>
        <h4 className="font-bold text-md">{skill.name}</h4>
        <span className="text-xs uppercase tracking-wider">{skill.category} • {skill.level}</span>
      </div>
      <div className="text-right">
        <span className="text-lg font-extrabold">{skill.confidence}%</span>
        <div className="text-xs text-gray-500">{skill.evidence_count} evidence items</div>
      </div>
    </div>
  );
}
```

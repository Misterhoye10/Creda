import json
import logging
from typing import Dict, Any, List, Optional
from github import Github, GithubException, Auth
from app.core.config import settings

logger = logging.getLogger("creda.github")


def get_github_client(token: Optional[str] = None) -> Github:
    """Initialize PyGithub client with configured token or anonymously."""
    if token and token.strip():
        auth = Auth.Token(token.strip())
        return Github(auth=auth)
    if settings.GITHUB_TOKEN:
        auth = Auth.Token(settings.GITHUB_TOKEN)
        return Github(auth=auth)
    return Github()


def calculate_github_telemetry_score(
    public_repos_count: int,
    total_stars: int,
    total_forks: int,
    total_bytes: int,
    language_count: int,
    followers_count: int
) -> int:
    """
    Computes algorithmic Proof-of-Work score (50 - 98) based on genuine GitHub metrics:
    - Base Trust: 50 (authenticated GitHub account)
    - Repo Scale: up to +18 (1 -> +2, 5 -> +8, 10 -> +12, 25 -> +15, 50+ -> +18)
    - Stars: up to +15 (1 -> +3, 5 -> +7, 20 -> +11, 50+ -> +15)
    - Source Bytes: up to +10 (>20KB -> +2, >100KB -> +5, >500KB -> +8, >1.5MB -> +10)
    - Language Breadth: up to +7 (2 -> +3, 3-4 -> +5, 5+ -> +7)
    - Community Impact: up to +5 (followers/forks)
    Total capped at 98.
    """
    score = 50

    # 1. Repositories Volume & Consistency
    if public_repos_count >= 50:
        score += 18
    elif public_repos_count >= 25:
        score += 15
    elif public_repos_count >= 10:
        score += 12
    elif public_repos_count >= 5:
        score += 8
    elif public_repos_count >= 2:
        score += 5
    elif public_repos_count >= 1:
        score += 2

    # 2. Peer Stars & Recognition
    if total_stars >= 50:
        score += 15
    elif total_stars >= 20:
        score += 11
    elif total_stars >= 5:
        score += 7
    elif total_stars >= 1:
        score += 3

    # 3. Source Codebase Depth
    if total_bytes >= 1_500_000:
        score += 10
    elif total_bytes >= 500_000:
        score += 8
    elif total_bytes >= 100_000:
        score += 5
    elif total_bytes >= 20_000:
        score += 2

    # 4. Multi-Language Breadth
    if language_count >= 5:
        score += 7
    elif language_count >= 3:
        score += 5
    elif language_count >= 2:
        score += 3

    # 5. Community Followers & Forks
    if followers_count >= 30 or total_forks >= 15:
        score += 5
    elif followers_count >= 10 or total_forks >= 5:
        score += 3
    elif followers_count >= 2 or total_forks >= 1:
        score += 2

    return min(98, score)


def fetch_github_profile_and_repos(username: str, token: Optional[str] = None) -> Dict[str, Any]:
    """
    Fetch GitHub user details, top repositories (public or authenticated private), and language statistics.
    Synthesizes a structured raw_text profile for AI skill extraction.
    """
    g = get_github_client(token=token)

    try:
        if token and token.strip():
            try:
                auth_user = g.get_user()
                if auth_user.login.lower() == username.lower():
                    gh_user = auth_user
                    repos = gh_user.get_repos(visibility="all", sort="updated")
                else:
                    gh_user = g.get_user(username)
                    repos = gh_user.get_repos(type="all", sort="updated")
            except Exception:
                gh_user = g.get_user(username)
                repos = gh_user.get_repos(type="public", sort="updated")
        else:
            gh_user = g.get_user(username)
            repos = gh_user.get_repos(type="public", sort="updated")
    except GithubException as e:
        if e.status == 404:
            raise ValueError(f"GitHub user '{username}' was not found.")
        elif e.status == 403:
            raise PermissionError("GitHub API rate limit exceeded. Please try again later.")
        else:
            raise RuntimeError(f"GitHub API error: {e.data.get('message', str(e))}")

    # Gather profile info
    user_info = {
        "username": gh_user.login,
        "name": gh_user.name or gh_user.login,
        "bio": gh_user.bio or "",
        "company": gh_user.company or "",
        "location": gh_user.location or "",
        "public_repos_count": getattr(gh_user, "total_private_repos", 0) + (gh_user.public_repos or 0) if token else (gh_user.public_repos or 0),
        "followers_count": gh_user.followers,
        "avatar_url": gh_user.avatar_url,
        "html_url": gh_user.html_url
    }

    # Fetch and analyze public repositories (up to 15 recent/starred)
    repos = gh_user.get_repos(type="public", sort="updated")
    repos_analyzed = []
    total_language_bytes: Dict[str, int] = {}
    total_stars = 0
    total_forks = 0

    count = 0
    for repo in repos:
        if repo.fork:
            continue  # Focus on original repositories created by user

        repo_languages = {}
        try:
            repo_languages = repo.get_languages()
            for lang, byte_count in repo_languages.items():
                total_language_bytes[lang] = total_language_bytes.get(lang, 0) + byte_count
        except Exception:
            pass

        stars = repo.stargazers_count or 0
        forks = repo.forks_count or 0
        total_stars += stars
        total_forks += forks

        repo_entry = {
            "name": repo.name,
            "description": repo.description or "No description provided",
            "language": repo.language or "Unknown",
            "stars": stars,
            "forks": forks,
            "html_url": repo.html_url,
            "languages": list(repo_languages.keys())[:5],
            "topics": getattr(repo, "topics", [])
        }
        repos_analyzed.append(repo_entry)
        count += 1
        if count >= 15:
            break

    # Calculate overall language percentages
    total_bytes = sum(total_language_bytes.values())
    language_breakdown: List[Dict[str, Any]] = []
    if total_bytes > 0:
        sorted_languages = sorted(total_language_bytes.items(), key=lambda x: x[1], reverse=True)
        for lang, byte_cnt in sorted_languages[:8]:
            pct = round((byte_cnt / total_bytes) * 100, 1)
            language_breakdown.append({"language": lang, "percentage": pct, "bytes": byte_cnt})

    # Algorithmic Proof-of-Work Telemetry Score
    telemetry_score = calculate_github_telemetry_score(
        public_repos_count=user_info["public_repos_count"],
        total_stars=total_stars,
        total_forks=total_forks,
        total_bytes=total_bytes,
        language_count=len(language_breakdown),
        followers_count=user_info["followers_count"]
    )

    # Synthesize clean raw text for OpenAI skill detection
    lang_summary = ", ".join([f"{l['language']} ({l['percentage']}%)" for l in language_breakdown])
    repos_summary = "\n".join([
        f"- {r['name']}: {r['description']} [Primary: {r['language']}, Stars: {r['stars']}, Tech: {', '.join(r['languages'])}]"
        for r in repos_analyzed
    ])

    raw_text = f"""GitHub Developer Profile: {user_info['name']} (@{user_info['username']})
Bio: {user_info['bio']}
Location: {user_info['location']}
Public Repositories: {user_info['public_repos_count']} | Followers: {user_info['followers_count']} | Total Stars: {total_stars} | Forks: {total_forks}
Audited Code Depth: {round(total_bytes / 1024, 1)} KB across {len(repos_analyzed)} public repositories
Primary Languages: {lang_summary if lang_summary else 'Not specified'}
Calculated Proof-of-Work Trust Score: {telemetry_score}%

Key Repositories Analyzed:
{repos_summary if repos_summary else 'No public repositories found.'}
""".strip()

    metadata = {
        "profile": user_info,
        "languages": language_breakdown,
        "top_repositories": repos_analyzed,
        "telemetry_score": telemetry_score,
        "total_stars": total_stars,
        "total_forks": total_forks,
        "total_bytes": total_bytes
    }

    return {
        "title": f"GitHub: @{user_info['username']}",
        "url": user_info["html_url"],
        "source": "github_api",
        "description": f"GitHub profile with {user_info['public_repos_count']} repos ({telemetry_score}% Proof-of-Work score). Top languages: {lang_summary[:80]}",
        "raw_text": raw_text,
        "metadata_json": json.dumps(metadata)
    }

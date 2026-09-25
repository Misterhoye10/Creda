import json
import logging
from typing import Dict, Any, List
from github import Github, GithubException, Auth
from app.core.config import settings

logger = logging.getLogger("creda.github")


def get_github_client() -> Github:
    """Initialize PyGithub client with configured token or anonymously."""
    if settings.GITHUB_TOKEN:
        auth = Auth.Token(settings.GITHUB_TOKEN)
        return Github(auth=auth)
    return Github()


def fetch_github_profile_and_repos(username: str) -> Dict[str, Any]:
    """
    Fetch GitHub user details, top repositories, and language statistics.
    Synthesizes a structured raw_text profile for AI skill extraction.
    """
    g = get_github_client()

    try:
        gh_user = g.get_user(username)
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
        "public_repos_count": gh_user.public_repos,
        "followers_count": gh_user.followers,
        "avatar_url": gh_user.avatar_url,
        "html_url": gh_user.html_url
    }

    # Fetch and analyze public repositories (up to 15 recent/starred)
    repos = gh_user.get_repos(type="public", sort="updated")
    repos_analyzed = []
    total_language_bytes: Dict[str, int] = {}

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

        repo_entry = {
            "name": repo.name,
            "description": repo.description or "No description provided",
            "language": repo.language or "Unknown",
            "stars": repo.stargazers_count,
            "forks": repo.forks_count,
            "html_url": repo.html_url,
            "languages": list(repo_languages.keys())[:5],
            "topics": getattr(repo, "topics", [])
        }
        repos_analyzed.append(repo_entry)
        count += 1
        if count >= 10:
            break

    # Calculate overall language percentages
    total_bytes = sum(total_language_bytes.values())
    language_breakdown: List[Dict[str, Any]] = []
    if total_bytes > 0:
        sorted_languages = sorted(total_language_bytes.items(), key=lambda x: x[1], reverse=True)
        for lang, byte_cnt in sorted_languages[:8]:
            pct = round((byte_cnt / total_bytes) * 100, 1)
            language_breakdown.append({"language": lang, "percentage": pct})

    # Synthesize clean raw text for OpenAI skill detection (Phase 4)
    lang_summary = ", ".join([f"{l['language']} ({l['percentage']}%)" for l in language_breakdown])
    repos_summary = "\n".join([
        f"- {r['name']}: {r['description']} [Primary: {r['language']}, Stars: {r['stars']}, Tech: {', '.join(r['languages'])}]"
        for r in repos_analyzed
    ])

    raw_text = f"""GitHub Developer Profile: {user_info['name']} (@{user_info['username']})
Bio: {user_info['bio']}
Location: {user_info['location']}
Public Repositories: {user_info['public_repos_count']} | Followers: {user_info['followers_count']}
Primary Languages: {lang_summary if lang_summary else 'Not specified'}

Key Repositories Analyzed:
{repos_summary if repos_summary else 'No public repositories found.'}
""".strip()

    metadata = {
        "profile": user_info,
        "languages": language_breakdown,
        "top_repositories": repos_analyzed
    }

    return {
        "title": f"GitHub: @{user_info['username']}",
        "url": user_info["html_url"],
        "source": "github_api",
        "description": f"GitHub profile with {user_info['public_repos_count']} repos. Top languages: {lang_summary[:80]}",
        "raw_text": raw_text,
        "metadata_json": json.dumps(metadata)
    }

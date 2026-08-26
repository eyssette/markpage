#!/usr/bin/env python3

import subprocess
import sys
import difflib
import re


def normalize(text: str) -> str:
    """
    Normalise un message de commit pour améliorer la comparaison.
    """
    text = text.lower()

    # Retire les guillemets et apostrophes
    text = text.replace('"', "").replace("'", "")

    # Remplace la ponctuation par des espaces
    text = re.sub(r"[^\w\s-]", " ", text)

    # Réduit les espaces multiples
    text = re.sub(r"\s+", " ", text).strip()

    return text


def get_commits():
    """
    Retourne la liste des commits (hash, message).
    """
    output = subprocess.check_output(
        [
            "git",
            "log",
            "--all",
            "--pretty=format:%H%x00%s",
        ],
        text=True,
    )

    commits = []

    for line in output.splitlines():
        if "\0" not in line:
            continue

        sha, message = line.split("\0", 1)
        commits.append((sha, message))

    return commits


def find_exact(message):
    """
    Recherche exacte via git.
    """
    try:
        # bearer:disable python_lang_os_command_injection
        result = subprocess.check_output(
            [
                "git",
                "log",
                "--all",
                "--fixed-strings",
                f"--grep={message}",
                "--pretty=format:%H",
            ],
            text=True,
        )

        return result.splitlines()[0] if result else None

    except subprocess.CalledProcessError:
        return None


def find_similar(message, commits, limit=10):
    """
    Retourne les commits les plus proches.
    """
    target = normalize(message)

    matches = []

    for sha, commit_message in commits:
        score = difflib.SequenceMatcher(
            None,
            target,
            normalize(commit_message),
        ).ratio()

        matches.append(
            (
                score,
                sha,
                commit_message,
            )
        )

    return sorted(
        matches,
        reverse=True,
    )[:limit]


def main():
    if len(sys.argv) < 2:
        print("❌ Veuillez fournir un message de commit.")
        sys.exit(1)

    message = sys.argv[1]

    # 1. Recherche exacte
    commit_hash = find_exact(message)

    if commit_hash:
        print(commit_hash)
        return

    # 2. Recherche approximative
    commits = get_commits()
    matches = find_similar(message, commits)

    if not matches:
        print("❌ Aucun commit trouvé.")
        sys.exit(1)

    best_score, best_sha, best_message = matches[0]
    second_score = matches[1][0] if len(matches) > 1 else 0

    # Correspondance quasi certaine
    if best_score >= 0.90 and second_score < 0.70:
        print(best_sha)
        return

    # Sinon afficher les candidats
    print("⚠️ Aucun commit exact trouvé.")
    print("🔎 Commits les plus proches :")
    print()

    for score, sha, commit_message in matches:
    # Affiche le score, le hash et le message du commit seulement si le score est supérieur à 0.6
        if score > 0.6:
            print(
                f"{score:.0%}  {sha[:12]}  {commit_message}"
            )


if __name__ == "__main__":
    main()
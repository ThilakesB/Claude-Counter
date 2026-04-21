# GitHub Streak

Automated GitHub contribution streak maintainer using GitHub Actions.

> If a README contains full HTML page tags (`<!DOCTYPE html>`, `<head>`, `<style>`, `<script>`), GitHub strips/sanitizes most of it, which can make it look broken or like plain text. This README is now GitHub-compatible Markdown.

## How it works

1. A scheduled GitHub Actions workflow runs multiple times daily.
2. It appends a new timestamp line to `streak.txt`.
3. It commits and pushes the update to `main`.
4. Each commit keeps your contribution graph active.

## Setup

1. Fork or clone this repository.
2. Ensure the default branch is `main`.
3. In your repository settings, enable workflow write permission:
   - **Settings → Actions → General → Workflow permissions → Read and write permissions**
4. Make sure GitHub Actions is enabled for the repository.

## Workflow file

Path: `.github/workflows/streak.yml`

```yaml
name: GitHub Streak Automator

on:
  schedule:
    - cron: "0 0 * * *"   # 12:00 AM UTC
    - cron: "0 6 * * *"   # 6:00 AM UTC
    - cron: "0 10 * * *"  # 10:00 AM UTC
    - cron: "0 14 * * *"  # 2:00 PM UTC
    - cron: "0 18 * * *"  # 6:00 PM UTC
  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-streak:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Configure Git
        run: |
          git config --global user.name "ThilakesB"
          git config --global user.email "200460169+ThilakesB@users.noreply.github.com"

      - name: Sync with remote
        run: |
          git pull --rebase origin main

      - name: Update streak file
        run: |
          echo "Update $(date)" >> streak.txt

      - name: Commit changes
        run: |
          git add streak.txt
          git commit -m "chore: update GitHub streak" || echo "No changes to commit"

      - name: Push changes
        run: |
          git push origin main
```

## Repository structure

```text
github-streak/
├── .github/
│   └── workflows/
│       └── streak.yml
├── streak.txt
└── README.md
```

## Manual run

Go to **Actions → GitHub Streak Automator → Run workflow**.

## Notes

- `streak.txt` is expected to grow over time.
- Keep `contents: write` permission enabled for automated commits.

---

Built with GitHub Actions.

# github-streak

Automated GitHub contribution streak maintainer. This repository uses GitHub Actions to automatically run a workflow daily.

## How it Works (Detailed Explanation)

This project uses a **GitHub Actions workflow** (`.github/workflows/streak.yml`) to keep your GitHub contribution streak alive automatically. Here is exactly what it does step-by-step:

1. **Daily Schedule**: Every day at **Midnight UTC** (which is defined by the cron schedule `0 0 * * *`), GitHub automatically triggers the workflow. 
2. **Setup Server**: GitHub spins up a hidden, temporary Ubuntu server and checks out your repository's code.
3. **Update the Text File**: The script runs a short command to append the current date and time to the bottom of the `streak.txt` file. For example, it writes a new line like: `Streak updated on Sun Mar 15 00:00:00 UTC 2026`.
4. **Commit & Push**: 
   - It configures a built-in virtual GitHub bot (`github-actions[bot]`) to act as the user.
   - It stages the newly changed `streak.txt` file.
   - It creates a new code commit with the message `"chore: update GitHub streak"`.
   - Finally, it pushes this new commit directly to the `main` branch of your repository.

### Why does this work?
GitHub counts any commit made to the default branch of a repository (in this case, `main`) as a **contribution**. Because this GitHub Action automatically makes a commit to your repository every single day, GitHub sees daily activity. This will continuously light up the green squares on your profile, keeping your contribution streak going without you needing to do any manual coding!

## Manual Override
You can also run this manually at any single point in time. Go to the **"Actions"** tab on your GitHub repository page on the web, click on **"GitHub Streak Automator"** on the left menu, and click the **"Run workflow"** button. This will force an immediate commit.

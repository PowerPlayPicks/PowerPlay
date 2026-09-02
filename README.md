# PowerPlay Site

A free, static recreation of the PowerPlay site (originally on Netlify), built as
plain HTML/CSS/JS so it can be hosted for free on **GitHub Pages** — no build step,
no server, no monthly cost.

## What's here

```
powerplay-site/
├── index.html                       the page structure
├── styles.css                       all styling (dark theme, cards, table, etc.)
├── script.js                        editable picks/leaderboard content, plus site logic
├── shorts.json                      auto-updated list of every short (don't hand-edit)
├── fetch-shorts.mjs                 checks YouTube and updates shorts.json
├── .github/workflows/update-shorts.yml   runs the script above on a schedule
└── README.md                        this file
```

## How to edit content

Open `script.js`. Everything above the line that says:

```
Nothing below this line needs to be edited to update content.
```

is a plain JavaScript list you can edit like a spreadsheet — picks, the stats
row, and the leaderboard. Save the file and refresh the page; no rebuild
needed.

### Podcast shorts (fully automatic)

Shorts are **not** entered by hand. A scheduled job (a GitHub Action) checks
the "Power Play Picks" YouTube channel every 4 hours for new shorts and adds
them to `shorts.json`, which the site reads and displays as one grid — newest
first. Nothing needs to be uploaded or pasted in manually.

Clicking a short opens it in a vertical popup player right on the page, so
visitors never leave the site. Thumbnails are pulled automatically from
YouTube — nothing to upload.

**One-time setup** (do this once, right after uploading these files):

1. Get a free YouTube API key:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a project (any name)
   - Search "YouTube Data API v3" → open it → click **Enable**
   - Go to "Credentials" → **Create Credentials → API key** → copy the key
2. Add it as a secret in this repo: **Settings → Secrets and variables →
   Actions → New repository secret** → name it `YOUTUBE_API_KEY` → paste
   the key → Save.
3. In the repo, go to **Settings → Actions → General**, scroll to "Workflow
   permissions," select **"Read and write permissions,"** and Save. (This
   lets the scheduled job commit its updates back to the repo.)
4. Go to the **Actions** tab, click "Update shorts from YouTube," then
   click **Run workflow** to trigger it once by hand and confirm it works
   (it should finish green in under a minute).

After that it just runs itself every 4 hours. Want it to check more or
less often? Edit the `cron` line in
`.github/workflows/update-shorts.yml` — `"0 */4 * * *"` means every 4
hours; `"0 */1 * * *"` would mean every hour.

The API key is free — YouTube gives 10,000 requests/day, and this uses
about 2 per run.

### Betting odds / picks

These are the hosts' own picks, not live sportsbook odds (matching the
"Demo picks for layout" note on the original site), so they're just plain
text in the `PICKS` array — edit the numbers directly whenever the picks
change.

## Deploying to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `powerplay-site`). Public repos get
   free Pages hosting; private repos need a paid plan for Pages, so keep it
   public unless you already have GitHub Pro/Team.
2. Upload all the files/folders above to the repo, keeping `.github/`
   as an actual folder (GitHub Actions only works if the workflow file is
   at the exact path `.github/workflows/update-shorts.yml`) — the easiest
   way is "Add file → Upload files" and dragging the whole unzipped
   project folder in at once, or `git push` if you're comfortable with git.
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a live URL in a minute or two, usually:
   `https://<your-github-username>.github.io/powerplay-site/`
6. Follow the **one-time setup** steps above under "Podcast shorts" so the
   auto-update job is allowed to run.
7. Optional: to use a custom domain (e.g. `powerplaypicks.com`), add it under
   **Settings → Pages → Custom domain** and point your domain's DNS at
   GitHub Pages (GitHub shows the exact records to add).

That's the whole cost: $0/month, forever, as long as the repo stays public
(or you have GitHub Pro).

## Notes

- Fully responsive — the nav collapses to a hamburger menu under ~980px wide.
- No tracking, no analytics, no dependencies beyond a Google Fonts (Inter)
  request — everything else is plain HTML/CSS/JS.
- If you'd rather not depend on Google Fonts, delete the two `<link>` tags
  in `index.html`'s `<head>` and the page falls back to the system font.

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
├── data/shorts.json                 auto-updated list of shorts per host (don't hand-edit)
├── scripts/fetch-shorts.mjs         checks YouTube and updates data/shorts.json
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
the "Power Play Picks" YouTube channel every 4 hours, reads the title of
each short, and figures out which host it belongs to by matching the
host's name (Dustin, Gavin, Izzy, Austin, DJ, Mejia) in the title — then
saves that into `data/shorts.json`, which the site reads automatically.
Nothing needs to be uploaded or pasted in manually going forward.

**What this means day to day:** a host posts a short with their name in
the title (which the channel already does) → within a few hours it shows
up on their tab on the site → done. No code, no GitHub, no copy-pasting IDs.

**One-time setup** (do this once, right after uploading these files):

1. In the repo, go to **Settings → Actions → General**.
2. Scroll to "Workflow permissions" and select **"Read and write
   permissions"**, then Save. (This lets the scheduled job commit its
   updates back to the repo — it's off by default on new repos.)
3. Go to the **Actions** tab, click "Update shorts from YouTube" in the
   sidebar, then click **Run workflow** to trigger it once by hand and
   confirm it works (it should finish green in under a minute).

After that it just runs itself every 4 hours. Want it to check more or
less often? Edit the `cron` line in
`.github/workflows/update-shorts.yml` — `"0 */4 * * *"` means every 4
hours; `"0 */1 * * *"` would mean every hour.

**If a short doesn't show up:** the title needs to contain the host's
name exactly (case doesn't matter, but it has to be a real word match —
"Dustin" matches "Dustin's Best Bet" but not "Dustinator"). Anything that
doesn't match any host's name lands in a fallback "Other" tab on the site
instead of getting lost, so you can always check there and either rename
the YouTube title or adjust `HOST_NAMES` in `script.js` and the matching
`scripts/fetch-shorts.mjs` if a host goes by more than one name.

Thumbnails are pulled automatically from YouTube — nothing to upload.
Clicking a short opens it in a vertical popup player right on the page,
so visitors never leave the site.

### Betting odds / picks

These are the hosts' own picks, not live sportsbook odds (matching the
"Demo picks for layout" note on the original site), so they're just plain
text in the `PICKS` array — edit the numbers directly whenever the picks
change.

## Deploying to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `powerplay-site`). Public repos get
   free Pages hosting; private repos need a paid plan for Pages, so keep it
   public unless you already have GitHub Pro/Team.
2. Upload all the files/folders above to the repo, keeping the folder
   structure intact (`data/`, `scripts/`, and `.github/workflows/` need to
   stay as folders, not get flattened) — drag-and-drop on github.com
   preserves folders if you drag the whole unzipped project folder in, or
   use `git push` if you're comfortable with git.
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

# PowerPlay Site

A free, static recreation of the PowerPlay site (originally on Netlify), built as
plain HTML/CSS/JS so it can be hosted for free on **GitHub Pages** — no build step,
no server, no monthly cost.

## What's here

```
powerplay-site/
├── index.html     the page structure
├── styles.css     all styling (dark theme, cards, table, etc.)
├── script.js      all editable content lives at the TOP of this file
└── README.md      this file
```

## How to edit content

Open `script.js`. Everything above the line that says:

```
Nothing below this line needs to be edited to update content.
```

is a plain JavaScript list you can edit like a spreadsheet — picks, the stats
row, the leaderboard, the host names, and the podcast episodes. Save the file
and refresh the page; no rebuild needed.

### Podcast shorts (YouTube)

Content is organized by host, matching how the channel actually posts —
each host has their own tab, and clicking it shows a grid of their shorts.
Clicking a short opens it in a vertical popup player right on the page, so
visitors never leave the site.

To add or update shorts, edit the `HOSTS` list in `script.js`. Each host
looks like this:

```js
{
  name: "Dustin",
  shorts: [
    { title: "Ohtani prop breakdown", youtubeId: "REPLACE_WITH_SHORT_ID" },
    { title: "Why I'm on the Under tonight", youtubeId: "REPLACE_WITH_SHORT_ID" }
  ]
}
```

Get the ID from the short's URL:

```
https://www.youtube.com/shorts/dQw4w9WgXcQ
                                ^^^^^^^^^^^ this part is the ID
```

To add a new short, copy one of the `{ title, youtubeId }` lines inside that
host's `shorts` array and change the values — the list can grow as long as
you need, there's no limit. A host with an empty `shorts: []` array just
shows "No shorts posted yet" until you add their first one.

Thumbnails are pulled automatically from YouTube, so you don't need to
upload or generate them yourself.

### Betting odds / picks

These are the hosts' own picks, not live sportsbook odds (matching the
"Demo picks for layout" note on the original site), so they're just plain
text in the `PICKS` array — edit the numbers directly whenever the picks
change.

## Deploying to GitHub Pages (free)

1. Create a new GitHub repository (e.g. `powerplay-site`). Public repos get
   free Pages hosting; private repos need a paid plan for Pages, so keep it
   public unless you already have GitHub Pro/Team.
2. Upload these four files to the repo (drag-and-drop on github.com works,
   or `git push` if you're comfortable with git).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub gives you a live URL in a minute or two, usually:
   `https://<your-github-username>.github.io/powerplay-site/`
6. Optional: to use a custom domain (e.g. `powerplaypicks.com`), add it under
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

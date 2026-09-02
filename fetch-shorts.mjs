#!/usr/bin/env node
// Checks the Power Play Picks YouTube channel for new shorts and files each
// one under the right host based on the host's name appearing in the
// title. Never deletes anything — it only ever adds new shorts it hasn't
// seen before, so the site's history only grows.
//
// Run manually with: node scripts/fetch-shorts.mjs
// Runs automatically on a schedule via .github/workflows/update-shorts.yml

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "shorts.json");

// Power Play Picks — https://www.youtube.com/@PowerPlay_Picks
const CHANNEL_ID = "UCYdFoQ8fT6QR3Snro7RN-rA";
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Must match the host tab names in script.js (HOST_NAMES). If a title
// doesn't contain any of these names, the short is filed under "Unsorted"
// instead of being dropped, so nothing silently disappears.
const HOST_NAMES = ["Dustin", "Gavin", "Izzy", "Austin", "DJ", "Mejia"];

function decodeEntities(str) {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function parseFeed(xml) {
  const entries = [];
  const blocks = xml.split("<entry>").slice(1);
  for (const block of blocks) {
    const idMatch = block.match(/<yt:videoId>(.*?)<\/yt:videoId>/);
    const titleMatch = block.match(/<title>(.*?)<\/title>/);
    const publishedMatch = block.match(/<published>(.*?)<\/published>/);
    if (!idMatch || !titleMatch) continue;
    entries.push({
      id: idMatch[1].trim(),
      title: decodeEntities(titleMatch[1].trim()),
      publishedAt: publishedMatch ? publishedMatch[1].trim() : null
    });
  }
  return entries;
}

function matchHost(title) {
  const lower = title.toLowerCase();
  for (const name of HOST_NAMES) {
    const pattern = new RegExp(`\\b${name.toLowerCase()}\\b`);
    if (pattern.test(lower)) return name;
  }
  return "Unsorted";
}

function loadExisting() {
  if (!existsSync(DATA_PATH)) return {};
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const res = await fetch(FEED_URL, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; PowerPlayShortsBot/1.0)" }
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch feed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const entries = parseFeed(xml);

  const data = loadExisting();
  let added = 0;

  for (const entry of entries) {
    const host = matchHost(entry.title);
    if (!data[host]) data[host] = [];
    const alreadyHave = data[host].some(s => s.id === entry.id);
    if (!alreadyHave) {
      data[host].push({
        id: entry.id,
        title: entry.title,
        publishedAt: entry.publishedAt
      });
      added++;
    }
  }

  for (const host of Object.keys(data)) {
    data[host].sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
  }

  mkdirSync(path.dirname(DATA_PATH), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2) + "\n");

  console.log(`Checked ${entries.length} feed entries, added ${added} new short(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

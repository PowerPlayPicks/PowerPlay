#!/usr/bin/env node
// Checks the Power Play Picks YouTube channel for new shorts and adds any
// new ones to shorts.json. Never deletes anything — it only ever adds
// shorts it hasn't seen before, so the site's history only grows.
//
// Uses the official YouTube Data API (not the public RSS feed — that feed
// can get blocked when requested from cloud servers like GitHub Actions'
// runners, even though the URL itself is fine).
//
// Needs a YOUTUBE_API_KEY environment variable — see README.md for how to
// get one (it's free) and add it as a GitHub Actions secret.
//
// Run manually with: YOUTUBE_API_KEY=your_key node fetch-shorts.mjs
// Runs automatically on a schedule via .github/workflows/update-shorts.yml

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "shorts.json");

// Power Play Picks — https://www.youtube.com/@PowerPlay_Picks
const CHANNEL_ID = "UCYdFoQ8fT6QR3Snro7RN-rA";

const API_KEY = process.env.YOUTUBE_API_KEY;

function loadExisting() {
  if (!existsSync(DATA_PATH)) return [];
  try {
    const parsed = JSON.parse(readFileSync(DATA_PATH, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function getUploadsPlaylistId() {
  const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Channel lookup failed: ${res.status} ${JSON.stringify(body)}`);
  }
  const channel = body.items && body.items[0];
  if (!channel) {
    throw new Error("No channel found for that channel ID.");
  }
  return channel.contentDetails.relatedPlaylists.uploads;
}

async function getRecentUploads(playlistId, maxResults = 50) {
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=${maxResults}&key=${API_KEY}`;
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Playlist lookup failed: ${res.status} ${JSON.stringify(body)}`);
  }
  return (body.items || []).map(item => ({
    id: item.snippet.resourceId.videoId,
    title: item.snippet.title,
    publishedAt: item.snippet.publishedAt
  }));
}

async function main() {
  if (!API_KEY) {
    throw new Error(
      "Missing YOUTUBE_API_KEY. Set it as a GitHub Actions secret (Settings → " +
      "Secrets and variables → Actions) — see README.md for how to get a free key."
    );
  }

  const uploadsPlaylistId = await getUploadsPlaylistId();
  const entries = await getRecentUploads(uploadsPlaylistId);

  const existing = loadExisting();
  const existingIds = new Set(existing.map(s => s.id));

  let added = 0;
  for (const entry of entries) {
    if (!existingIds.has(entry.id)) {
      existing.push({ id: entry.id, title: entry.title, publishedAt: entry.publishedAt });
      existingIds.add(entry.id);
      added++;
    }
  }

  existing.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  writeFileSync(DATA_PATH, JSON.stringify(existing, null, 2) + "\n");

  console.log(`Checked ${entries.length} uploads, added ${added} new short(s).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

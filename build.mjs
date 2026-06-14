#!/usr/bin/env node
/**
 * Build script for the Apex Health Resilience Self-Help Guides site.
 *
 * Reads Jane's original interactive HTML fragments at the repo root and
 * wraps each in a full HTML5 document with the Apex brand chrome. Mindfulness
 * is fully self-contained so it gets a lighter treatment (favicon + back link).
 *
 * Run with:    node build.mjs
 * Output goes to ./dist (the folder deployed to Cloudflare Pages).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC  = __dirname;
const DIST = path.join(__dirname, 'dist');

if (!fs.existsSync(DIST)) fs.mkdirSync(DIST, { recursive: true });
if (!fs.existsSync(path.join(DIST, 'assets'))) fs.mkdirSync(path.join(DIST, 'assets'), { recursive: true });

const HEADER_TPL = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{TITLE}} — Apex Health Resilience Self-Help Guides</title>
<meta name="description" content="{{DESC}}">
<link rel="icon" type="image/png" href="assets/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@2.47.0/tabler-icons.min.css" rel="stylesheet">
<link rel="stylesheet" href="assets/tokens.css">
<link rel="stylesheet" href="assets/site.css">
</head>
<body>
<div class="site-shell">
  <header class="site-bar">
    <a href="index.html" class="brand" aria-label="Apex Health — Resilience Self-Help Guides">
      <img src="assets/apex-logo.png" alt="Apex Health" class="brand-logo">
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="brand-series">Resilience Self-Help Guides</span>
    </a>
    <div class="bar-actions">
      <a class="bar-link" href="index.html"><i class="ti ti-arrow-left" aria-hidden="true"></i><span class="label">All guides</span></a>
      <button id="themeBtn" class="theme-btn" aria-label="Toggle theme"><i class="ti ti-moon" aria-hidden="true"></i></button>
    </div>
  </header>
  <main class="guide-frame">
`;

const FOOTER = `  </main>
  <footer class="site-foot">
    <strong>Private.</strong> This tool runs entirely in your browser — nothing you type is sent to Apex Health or stored on a server.
    <div class="foot-row">
      <a href="index.html"><i class="ti ti-arrow-left" aria-hidden="true"></i> Back to all guides</a>
      <span>© Apex Health Group · Resilience Self-Help Guides</span>
    </div>
  </footer>
</div>
<script src="assets/site.js"></script>
</body>
</html>
`;

const GUIDES = [
  { src: 'PPR_series_interactive_guide.html',          slug: 'ppr-series',                title: 'PPR Series — Introduction & Navigation', desc: 'Self-assessment and navigation across the Apex Health Resilience Self-Help Guides.' },
  { src: 'tgrow_resilience_tool.html',                 slug: 'tgrow',                     title: 'TGROW Resilience Tool',                   desc: 'A five-stage self-coaching reflection: Topic, Goal, Reality, Options, Way Forward.' },
  { src: 'values_compassion_empathy_guide.html',       slug: 'values-compassion-empathy', title: 'Values, Compassion & Empathy',            desc: 'Reconnect with what matters most in this work — and protect compassion as a renewable but finite resource.' },
  { src: 'post_incident_debrief_guide.html',           slug: 'post-incident-debrief',     title: 'Post-Incident Structured Debrief',        desc: 'A guided, confidential walk-through for processing a difficult clinical event, stage by stage.' },
  { src: 'peer_coaching_circle_guide.html',            slug: 'peer-coaching-circle',      title: 'Peer Coaching Circle',                    desc: 'A structured format for groups of three to six colleagues to think together — how to host, present, and listen well.' },
  { src: 'cognitive_reframing_interactive_guide.html', slug: 'cognitive-reframing',       title: 'Cognitive Reframing',                     desc: 'Notice unhelpful thinking, work through the ABCDE model, and build a four-week reframing practice.' },
  { src: 'energy_management_recovery_guide.html',      slug: 'energy-management',         title: 'Energy Management & Recovery',            desc: 'Audit your physical, emotional, mental, and spiritual energy, and design recovery rituals that actually replenish you.' },
];

function buildWrapped() {
  for (const g of GUIDES) {
    const fragPath = path.join(SRC, g.src);
    if (!fs.existsSync(fragPath)) {
      console.error('!! missing source:', fragPath);
      process.exit(1);
    }
    const frag = fs.readFileSync(fragPath, 'utf8');
    const header = HEADER_TPL.replaceAll('{{TITLE}}', g.title).replaceAll('{{DESC}}', g.desc);
    const out = header + '\n' + frag + '\n' + FOOTER;
    fs.writeFileSync(path.join(DIST, g.slug + '.html'), out, 'utf8');
    console.log('  built  ' + g.slug + '.html');
  }
}

function buildMindfulness() {
  const src  = path.join(SRC, 'mindfulness_regulation_guide.html');
  const dst  = path.join(DIST, 'mindfulness.html');
  if (!fs.existsSync(src)) {
    console.error('!! missing source: mindfulness_regulation_guide.html');
    return;
  }
  let content = fs.readFileSync(src, 'utf8');
  const injection = `<a href="index.html" style="position:fixed;top:14px;left:14px;z-index:1000;display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:#1F2C5C;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;padding:6px 12px 6px 8px;border-radius:24px;border:1px solid #DDD9D3;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-decoration:none;transition:all .15s" onmouseover="this.style.background='#E8EBF3';this.style.borderColor='#1F2C5C';" onmouseout="this.style.background='#FFFFFF';this.style.borderColor='#DDD9D3';"><img src="assets/apex-logo.png" alt="Apex Health" style="height:18px;width:auto;display:block"><span style="border-left:1px solid #DDD9D3;padding-left:8px">&larr; All guides</span></a>`;
  content = content.replace(/(<body[^>]*>)/, '$1\n' + injection);
  content = content.replace(/<title>[^<]*<\/title>/, '<title>Mindfulness &amp; Regulation Skills — Apex Health Resilience Self-Help Guides</title>');
  content = content.replace(/(<\/title>)/, '$1\n<link rel="icon" type="image/png" href="assets/favicon.png">');
  fs.writeFileSync(dst, content, 'utf8');
  console.log('  built  mindfulness.html');
}

console.log('Building Apex Health Resilience Self-Help Guides …');
buildWrapped();
buildMindfulness();
console.log('Done. Output: ' + DIST);

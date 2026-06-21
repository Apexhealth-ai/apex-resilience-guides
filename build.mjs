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
<body class="guide-page{{PAD}}">
<div class="site-shell">
  <header class="site-bar">
    <a href="index.html" class="brand" aria-label="Apex Health — Resilience Self-Help Guides">
      <img src="assets/apex-logo.png" alt="Apex Health" class="brand-logo">
      <span class="brand-divider" aria-hidden="true"></span>
      <span class="brand-series">Resilience Self-Help Guides</span>
    </a>
    <div class="bar-actions">
      <a class="bar-link" href="index.html"><i class="ti ti-arrow-left" aria-hidden="true"></i><span class="label">All guides</span></a>
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
  // Guides whose fragments already pad their own text (and/or have a full-width
  // sticky sub-nav) must NOT get the extra host gutter. Everything else does.
  const NO_PAD = new Set(['ppr-series']);

  for (const g of GUIDES) {
    const fragPath = path.join(SRC, g.src);
    if (!fs.existsSync(fragPath)) {
      console.error('!! missing source:', fragPath);
      process.exit(1);
    }
    const frag = fs.readFileSync(fragPath, 'utf8');
    const padClass = NO_PAD.has(g.slug) ? '' : ' guide-pad';
    const header = HEADER_TPL
      .replaceAll('{{TITLE}}', g.title)
      .replaceAll('{{DESC}}', g.desc)
      .replaceAll('{{PAD}}', padClass);
    const out = header + '\n' + frag + '\n' + FOOTER;
    fs.writeFileSync(path.join(DIST, g.slug + '.html'), out, 'utf8');
    console.log('  built  ' + g.slug + '.html' + (padClass ? '  (+gutter)' : ''));
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

  // ── 1. Back-link pill (top-left, Apex-branded) ─────────────────
  const backLink = `<a href="index.html" style="position:fixed;top:14px;left:14px;z-index:1000;display:inline-flex;align-items:center;gap:8px;background:#FFFFFF;color:#1F2C5C;font-family:'DM Sans',sans-serif;font-size:12.5px;font-weight:500;padding:6px 12px 6px 8px;border-radius:24px;border:1px solid #DDD9D3;box-shadow:0 2px 8px rgba(0,0,0,0.06);text-decoration:none;transition:all .15s" onmouseover="this.style.background='#E8EBF3';this.style.borderColor='#1F2C5C';" onmouseout="this.style.background='#FFFFFF';this.style.borderColor='#DDD9D3';"><img src="assets/apex-logo.png" alt="Apex Health" style="height:18px;width:auto;display:block"><span style="border-left:1px solid #DDD9D3;padding-left:8px">&larr; All guides</span></a>`;
  content = content.replace(/(<body[^>]*>)/, '$1\n' + backLink);

  // ── 2. Guided audio, driven by Jane's own Start buttons ───────────
  // No separate players: pressing "Start" (breathing) plays the selected
  // pattern's audio; pressing "Start scan" plays the body-scan voice;
  // Pause/Reset stop it; switching tabs stops everything. We wrap Jane's
  // global functions so her visuals and our audio stay in lock-step.
  const audioScript = `
<audio id="apexBreathAudio" loop preload="none" data-box="assets/audio/breathing-box.mp3" data-478="assets/audio/breathing-478.mp3"></audio>
<audio id="apexScanAudio" preload="none" src="assets/audio/bodyscan-voice.mp3"></audio>
<script>
(function(){
  var bAudio = document.getElementById('apexBreathAudio');
  var sAudio = document.getElementById('apexScanAudio');
  if(!bAudio || !sAudio) return;
  var curTech = 'box';
  function srcFor(t){ return t==='box' ? bAudio.getAttribute('data-box') : t==='478' ? bAudio.getAttribute('data-478') : null; }
  function loadBreath(t){ var s=srcFor(t); if(s){ if(!bAudio.src || bAudio.src.indexOf(s)<0){ bAudio.src=s; } } }
  function stopBreath(){ bAudio.pause(); try{bAudio.currentTime=0;}catch(e){} }
  function stopScan(){ sAudio.pause(); try{sAudio.currentTime=0;}catch(e){} }
  function wrap(name, after){ if(typeof window[name]==='function'){ var orig=window[name]; window[name]=function(){ var r=orig.apply(this,arguments); try{ after.apply(this,arguments); }catch(e){} return r; }; } }

  // Breathing technique chosen → load matching audio (sigh has no track).
  wrap('selBreath', function(t){ curTech=t; stopBreath(); loadBreath(t); });
  // Start / Pause / Resume → mirror the circle's running state.
  wrap('toggleBreath', function(){
    var running = (document.getElementById('bstart')||{}).textContent === 'Pause';
    if(running){ if(curTech==='sigh'){ stopBreath(); } else { loadBreath(curTech); bAudio.play().catch(function(){}); } }
    else { bAudio.pause(); }
  });
  wrap('resetBreath', stopBreath);

  // Body scan Start → play the 10-min voice; Pause stops it; Reset rewinds.
  wrap('startScan', function(){
    var running = (document.getElementById('scanbtn')||{}).textContent === 'Pause';
    if(running){ sAudio.play().catch(function(){}); } else { sAudio.pause(); }
  });
  wrap('resetScan', stopScan);

  // Switching tabs stops all audio so nothing bleeds across sections.
  document.querySelectorAll('.nav-btn').forEach(function(nav){
    nav.addEventListener('click', function(){ stopBreath(); stopScan(); });
  });
})();
</script>`;

  // Inject the hidden audio + wrapper script before </body>
  content = content.replace(/<\/body>/i, audioScript + '\n</body>');

  // ── 4. Title + favicon ────────────────────────────────────────────
  content = content.replace(/<title>[^<]*<\/title>/, '<title>Mindfulness &amp; Regulation Skills — Apex Health Resilience Self-Help Guides</title>');
  content = content.replace(/(<\/title>)/, '$1\n<link rel="icon" type="image/png" href="assets/favicon.png">');

  fs.writeFileSync(dst, content, 'utf8');
  console.log('  built  mindfulness.html  (+ button-driven guided audio)');
}

console.log('Building Apex Health Resilience Self-Help Guides …');
buildWrapped();
buildMindfulness();
console.log('Done. Output: ' + DIST);

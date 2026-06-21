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

  // ── 2. Audio-player CSS + helper script (one copy, end of body) ────
  const audioStyleAndScript = `
<style>
.apex-audio{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 1.25rem;background:#E6F0EC;border:1px solid #C7DDD3;border-radius:12px;font-family:'DM Sans',sans-serif}
.apex-audio-btn{flex-shrink:0;width:42px;height:42px;border-radius:50%;border:none;background:#4A7C6B;color:#fff;font-size:16px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:background .15s;padding:0}
.apex-audio-btn:hover{background:#2D5247}
.apex-audio-btn:focus{outline:2px solid #2D5247;outline-offset:2px}
.apex-audio-info{flex:1;min-width:0}
.apex-audio-title{font-size:13px;font-weight:500;color:#2D5247;line-height:1.3;margin-bottom:2px}
.apex-audio-credit{font-size:11px;color:#5C5C5C;line-height:1.3}
.apex-audio-vol{flex-shrink:0;width:90px;height:4px;-webkit-appearance:none;appearance:none;background:#C7DDD3;border-radius:4px;outline:none;cursor:pointer}
.apex-audio-vol::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:50%;background:#4A7C6B;cursor:pointer;border:0}
.apex-audio-vol::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:#4A7C6B;cursor:pointer;border:0}
.apex-audio-vol-wrap{display:flex;align-items:center;gap:6px;color:#8A8A8A;font-size:13px}
.apex-breathe-toggle{display:flex;gap:6px;margin-top:6px;flex-wrap:wrap}
.apex-pat{font-family:'DM Sans',sans-serif;font-size:11.5px;font-weight:500;padding:4px 11px;border-radius:20px;border:1px solid #C7DDD3;background:#fff;color:#4A7C6B;cursor:pointer;transition:all .15s}
.apex-pat:hover{border-color:#4A7C6B}
.apex-pat.active{background:#4A7C6B;border-color:#4A7C6B;color:#fff}
@media (max-width:480px){.apex-audio{flex-wrap:wrap}.apex-audio-vol-wrap{order:3;width:100%;justify-content:flex-end}.apex-audio-vol{flex:1;max-width:none}}
</style>
<script>
(function(){
  function icon(btn,playing){ btn.innerHTML = playing ? '&#10074;&#10074;' : '&#9654;'; btn.setAttribute('aria-label', playing ? 'Pause' : 'Play'); }
  // Pause every other player that shares the same group (group 'bg' = ambient
  // music, group 'voice' = guides). Different groups can play together, so
  // ambient music + a breathing/scan voice run at the same time.
  function pauseGroup(except){
    var grp = except.getAttribute('data-apex-group');
    document.querySelectorAll('audio[data-apex-audio]').forEach(function(a){
      if(a!==except && a.getAttribute('data-apex-group')===grp && !a.paused){
        a.pause(); var b=a.closest('.apex-audio').querySelector('.apex-audio-btn'); if(b) icon(b,false);
      }
    });
  }
  function setupAudio(card){
    var audio = card.querySelector('audio');
    var btn   = card.querySelector('.apex-audio-btn');
    var vol   = card.querySelector('.apex-audio-vol');
    if(!audio || !btn) return;
    audio.volume = vol ? (vol.value/100) : 0.6;
    btn.addEventListener('click', function(){
      if(audio.paused){ pauseGroup(audio); audio.play(); icon(btn,true); }
      else { audio.pause(); icon(btn,false); }
    });
    if(vol){ vol.addEventListener('input', function(){ audio.volume = vol.value/100; }); }
    audio.addEventListener('ended', function(){ icon(btn,false); });
    // Breathing pattern toggle: swap source, keep playing if already playing.
    card.querySelectorAll('.apex-pat').forEach(function(pat){
      pat.addEventListener('click', function(){
        card.querySelectorAll('.apex-pat').forEach(function(p){ p.classList.remove('active'); });
        pat.classList.add('active');
        var wasPlaying = !audio.paused;
        audio.src = pat.getAttribute('data-src');
        var t = card.querySelector('.apex-audio-title'); if(t && pat.getAttribute('data-title')) t.textContent = pat.getAttribute('data-title');
        if(wasPlaying){ audio.play(); icon(btn,true); }
      });
    });
  }
  document.querySelectorAll('.apex-audio').forEach(setupAudio);
  // Stop any audio when switching tabs so nothing bleeds across sections.
  document.querySelectorAll('.nav-btn').forEach(function(nav){
    nav.addEventListener('click', function(){
      document.querySelectorAll('audio[data-apex-audio]').forEach(function(a){
        if(!a.paused){ a.pause(); var b=a.closest('.apex-audio').querySelector('.apex-audio-btn'); if(b) icon(b,false); }
      });
    });
  });
})();
</script>`;

  // ── 3. The audio cards, scoped to each section ────────────────────
  // group 'bg' = ambient music, group 'voice' = guides; different groups can
  // play together (music + voice). loop=false for finite voice tracks.
  function audioCard(title, credit, src, opts) {
    opts = opts || {};
    const loopAttr = opts.loop === false ? '' : ' loop';
    const group = opts.group || 'bg';
    return `<div class="apex-audio${opts.voice ? ' apex-audio--voice' : ''}" role="region" aria-label="${title}">
  <button class="apex-audio-btn" type="button" aria-label="Play">&#9654;</button>
  <div class="apex-audio-info">
    <div class="apex-audio-title">${title}</div>
    <div class="apex-audio-credit">${credit}</div>
  </div>
  <div class="apex-audio-vol-wrap" title="Volume"><span aria-hidden="true">&#128264;</span><input class="apex-audio-vol" type="range" min="0" max="100" value="${opts.voice ? 100 : 55}" aria-label="Volume"></div>
  <audio src="${src}"${loopAttr} preload="none" data-apex-audio data-apex-group="${group}"></audio>
</div>`;
  }

  // Breathing — ambient music (optional background, Jane likes it).
  const breathingMusicCard = audioCard(
    'Background music — Voxscape (optional)',
    'Eugenio Mininni · Mixkit Free License · loops while you practise',
    'assets/audio/breathing-voxscape.mp3',
    { group: 'bg' }
  );
  // Breathing — guided pacing per pattern; plays OVER the music (voice group).
  const breathingGuideCard = `<div class="apex-audio apex-audio--voice" role="region" aria-label="Guided breathing">
  <button class="apex-audio-btn" type="button" aria-label="Play">&#9654;</button>
  <div class="apex-audio-info">
    <div class="apex-audio-title">Box breathing · 4-4-4-4</div>
    <div class="apex-audio-credit">Audio guide · loops · plays over the music if you want both</div>
    <div class="apex-breathe-toggle">
      <button type="button" class="apex-pat active" data-src="assets/audio/breathing-box.mp3" data-title="Box breathing · 4-4-4-4">Box · 4-4-4-4</button>
      <button type="button" class="apex-pat" data-src="assets/audio/breathing-478.mp3" data-title="4-7-8 calming breath">4-7-8 calming</button>
    </div>
  </div>
  <div class="apex-audio-vol-wrap" title="Volume"><span aria-hidden="true">&#128264;</span><input class="apex-audio-vol" type="range" min="0" max="100" value="100" aria-label="Volume"></div>
  <audio src="assets/audio/breathing-box.mp3" loop preload="none" data-apex-audio data-apex-group="voice"></audio>
</div>`;
  // Body scan: guided VOICE only (no music), Jane's request. Does not loop.
  const bodyScanCard = audioCard(
    'Guided body scan — press play and close your eyes',
    '10-minute voice meditation · courtesy of Fostering Resilience',
    'assets/audio/bodyscan-voice.mp3',
    { loop: false, voice: true, group: 'voice' }
  );

  // Inject right after the s-head of each panel
  content = content.replace(
    /(<div class="panel" id="p-breath">\s*<div class="s-head">.*?<\/div><\/div>)/s,
    '$1\n    ' + breathingMusicCard + '\n    ' + breathingGuideCard
  );
  content = content.replace(
    /(<div class="panel" id="p-scan">\s*<div class="s-head">.*?<\/div><\/div>)/s,
    '$1\n    ' + bodyScanCard
  );

  // Inject the player CSS + JS before </body>
  content = content.replace(/<\/body>/i, audioStyleAndScript + '\n</body>');

  // ── 4. Title + favicon ────────────────────────────────────────────
  content = content.replace(/<title>[^<]*<\/title>/, '<title>Mindfulness &amp; Regulation Skills — Apex Health Resilience Self-Help Guides</title>');
  content = content.replace(/(<\/title>)/, '$1\n<link rel="icon" type="image/png" href="assets/favicon.png">');

  fs.writeFileSync(dst, content, 'utf8');
  console.log('  built  mindfulness.html  (+ audio players for breathing & body scan)');
}

console.log('Building Apex Health Resilience Self-Help Guides …');
buildWrapped();
buildMindfulness();
console.log('Done. Output: ' + DIST);

# Deploying — resilience.agnt-x.ai

This folder is a fully static site. Drop it on any static host. Recommended path: **Cloudflare Pages** (free, fast, and `agnt-x.ai` is presumably already on Cloudflare DNS so the subdomain is one click).

---

## Option A — Cloudflare Pages (recommended, ~5 minutes)

1. Open https://dash.cloudflare.com → **Workers & Pages** → **Create application** → **Pages** → **Upload assets**.
2. Project name: `resilience-agnt-x` (or anything — it only matters for the internal `*.pages.dev` URL).
3. Drag-and-drop the contents of this `dist/` folder (the *contents*, not the folder itself — so `index.html` sits at the root of the upload).
4. Click **Deploy site**. Cloudflare gives you a temporary URL like `resilience-agnt-x.pages.dev` to verify.
5. In the project, go to **Custom domains** → **Set up a custom domain** → type `resilience.agnt-x.ai`. If `agnt-x.ai` is already on Cloudflare DNS, the DNS record is created automatically (one click). If not, Cloudflare shows you the CNAME to add at your DNS provider.
6. Wait 1–3 minutes for the certificate to issue. Done.

### Subsequent updates

When Jane sends a new revision of any guide:

- Replace the source HTML in the parent `C:\Users\Admin\Documents\Jane\` folder.
- Re-run the build (see *Rebuilding* below).
- In Cloudflare Pages → your project → **Create new deployment** → drag the updated `dist/` folder again.

Or wire it to a GitHub repo so any push auto-deploys — let me know and I'll set that up.

---

## Option B — Netlify Drop (even faster, no account needed for first deploy)

1. Open https://app.netlify.com/drop.
2. Drag the entire `dist/` folder onto the page.
3. You'll get a `*.netlify.app` URL immediately.
4. To attach `resilience.agnt-x.ai`: in the Netlify site dashboard → **Domain settings** → **Add a domain** → enter `resilience.agnt-x.ai`. Netlify will give you a CNAME target — add a CNAME record at Cloudflare DNS pointing `resilience` → `<your-site>.netlify.app`.

---

## DNS — what you actually need to add

Where `agnt-x.ai` DNS is hosted, add:

| Type  | Name         | Value                                 | Proxy / Notes        |
|-------|--------------|---------------------------------------|----------------------|
| CNAME | `resilience` | `<your-pages-project>.pages.dev`      | Proxied (Cloudflare) |

(Cloudflare Pages does this for you automatically if the domain is on the same account.)

---

## Rebuilding after Jane sends new content

The build is a one-line PowerShell that wraps each fragment with the site header/footer and copies in the assets folder. From `C:\Users\Admin\Documents\Jane`:

```powershell
# 1. Replace the source .html file(s) in this folder
# 2. Re-run the build script (ask Claude to "rebuild the dist folder" — the
#    instructions are in this conversation thread, or paste this command set)
```

The structure to preserve:

```
dist/
├── index.html                         ← landing page
├── ppr-series.html                    ← Introduction & navigation
├── tgrow.html                         ← Guide 01
├── mindfulness.html                   ← Guide 02 (self-contained design)
├── values-compassion-empathy.html     ← Guide 03
├── post-incident-debrief.html         ← Guide 04
├── peer-coaching-circle.html          ← Guide 05
├── cognitive-reframing.html           ← Guide 06
├── energy-management.html             ← Guide 07
└── assets/
    ├── tokens.css     ← design system tokens (light + dark)
    ├── site.css       ← header, footer, landing styles
    └── site.js        ← theme toggle
```

---

## What was changed vs. Jane's originals

**Content: zero changes.** Every fragment is embedded byte-for-byte, including all interactive scripts, copy, and styling.

**Frontend additions only:**
- A landing page (`index.html`) with cards for each of the 8 guides.
- A shared top bar on each guide with brand mark and "All guides" link.
- A shared footer with a privacy reassurance and a back-link.
- Inter + Lora web fonts and Tabler Icons loaded from CDN (Jane's fragments expected these to exist in the host).
- A design-token CSS file that fills in the `var(--color-*)`, `var(--font-*)`, and `var(--border-radius-*)` tokens Jane's fragments referenced.
- A light/dark theme toggle (defaults to light to keep contrast clean inside the guides).

# Apex Health — Resilience Self-Help Guides

Live: **https://resilience.draift.ai** (Cloudflare Pages)
Default URL: https://resilience-4mi.pages.dev

A seven-guide self-help series for Apex Health Group staff, plus an introduction & navigation guide. Original interactive HTML by **Jane** (Training); UI chrome and design system wrapper by Apex.

---

## Repo layout

```
.
├── *.html                          ← Jane's original interactive guide fragments (source of truth)
│   ├── PPR_series_interactive_guide.html
│   ├── tgrow_resilience_tool.html
│   ├── mindfulness_regulation_guide.html
│   ├── values_compassion_empathy_guide.html
│   ├── post_incident_debrief_guide.html
│   ├── peer_coaching_circle_guide.html
│   ├── cognitive_reframing_interactive_guide.html
│   └── energy_management_recovery_guide.html
├── build.mjs                       ← wraps each fragment in the Apex chrome → dist/
├── dist/                           ← built static site (deployed to Cloudflare Pages)
│   ├── index.html                  ← landing page (custom, not from a fragment)
│   ├── ppr-series.html             ← wrapped guide
│   ├── … one .html per guide
│   └── assets/
│       ├── apex-logo.png           ← navy + red logo (light backgrounds)
│       ├── apex-logo-white.png     ← white version (dark backgrounds)
│       ├── favicon.png
│       ├── tokens.css              ← design tokens (light + dark themes, Apex palette)
│       ├── site.css                ← header / footer / landing chrome
│       └── site.js                 ← theme toggle
├── .github/workflows/deploy.yml    ← CI: build + deploy to Cloudflare Pages on every push to main
└── README.md
```

## Updating a guide

1. Drop Jane's new HTML into the repo root (overwriting the matching file).
2. Commit and push to `main`.
3. GitHub Actions rebuilds `dist/` and redeploys to https://resilience.draift.ai. Takes ~60 seconds.

Or to preview locally first:

```bash
node build.mjs
# then open dist/index.html in a browser
```

## Adding a new guide

1. Drop the new fragment into the repo root.
2. Add a row to the `GUIDES` array in `build.mjs` (source filename, slug, title, description).
3. Add a matching card to the grid in `dist/index.html`.
4. Commit + push.

## Conventions

- **Zero changes** to Jane's content. The build wraps each fragment in a chrome — header/footer/back-link — but the interactive markup, scripts, and styles inside stay exactly as Jane sent them.
- The `mindfulness_regulation_guide.html` file is fully self-contained with its own sage palette; the build only injects a small Apex-branded back-link, nothing else.
- All design tokens live in `dist/assets/tokens.css`. The Apex navy is `#1F2C5C`, accent red is `#E63946`.

## Hosting

- **Cloudflare Pages project:** `resilience` (account: Omar.misirlioglu@gmail.com)
- **Custom domain:** `resilience.draift.ai` (CNAME → `resilience-4mi.pages.dev`, proxied)
- **SSL:** Google-issued, auto-provisioned by Cloudflare

## Secrets (configured in GitHub repo → Settings → Secrets)

| Secret | What it is |
| ----------------------- | ----------- |
| `CLOUDFLARE_API_TOKEN`  | Token with **Cloudflare Pages — Edit** scope on the account |
| `CLOUDFLARE_ACCOUNT_ID` | Apex Health Cloudflare account ID |

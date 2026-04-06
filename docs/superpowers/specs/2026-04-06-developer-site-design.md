# Developer Site Design — binario.dev.br

**Date:** 2026-04-06  
**Status:** Approved  
**Domain:** www.binario.dev.br (GitHub Pages)

---

## 1. Overview

Personal developer portfolio site for Anderson Binário, serving three purposes:

1. **Developer page** for Google Play Store and Apple App Store store listings
2. **Portfolio** showcasing mobile games (Infectors 3volution, Square Maze, Maze)
3. **Promotional pages** per game, SEO-optimized to drive player acquisition

---

## 2. Technical Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Stack | HTML/CSS/JS pure | Zero dependencies, instant deploy on GitHub Pages, no build step |
| i18n | JS switcher (data-i18n attributes + JSON) | EN indexed by Google; PT-BR accessible via toggle; one HTML per page |
| Default language | English | Broader SEO reach; store reviewers expect EN |
| Visual style | Dark professional | Sober dark background, no neon excess; credible and game-adjacent |

---

## 3. File Structure

```
AndersonBinario.github.io/
├── index.html                    ← Homepage (EN default)
│
├── infectors3/
│   ├── index.html                ← Promotional page — Infectors 3volution
│   └── privacy.html              ← Privacy policy (EN only, no i18n switcher)
│
├── squaremaze/
│   ├── index.html                ← Promotional page — Square Maze
│   └── privacy.html              ← Privacy policy (EN only)
│
├── maze/
│   └── privacy.html              ← Privacy policy placeholder (no promo page yet)
│
├── assets/
│   ├── css/
│   │   ├── style.css             ← Global design system (colors, typography, components)
│   │   └── game.css              ← Game page-specific styles
│   ├── js/
│   │   ├── i18n.js               ← Language switcher engine
│   │   └── main.js               ← General interactivity
│   ├── lang/
│   │   ├── en.json               ← All strings in English
│   │   └── pt-br.json            ← All strings in Portuguese (BR)
│   └── img/
│       ├── infectors3/           ← Icon, screenshots, art
│       ├── squaremaze/           ← Icon, screenshots, art
│       └── maze/                 ← Reserved
│
├── sitemap.xml                   ← All public pages for SEO
├── robots.txt
├── app-ads.txt                   ← Already exists
└── CNAME                         ← Already exists (www.binario.dev.br)
```

---

## 4. Pages

### 4.1 Homepage (`index.html`)

Sections in order:

1. **Nav** — sticky, semi-transparent with backdrop blur. Left: logo/name. Right: `Games`, `About`, `Contact`, `EN | PT-BR` toggle.
2. **Hero** — dark background with subtle texture. Large tagline (e.g. *"Crafting mobile games, one mechanic at a time."*). One-line subtitle. Two CTAs: `→ See my games` (anchor) and `→ Google Play` (dev profile link).
3. **Games** — card grid. Two active cards (Infectors 3volution, Square Maze) + one "Coming soon" card (Maze). Each card: app icon, name, one-line tagline, platform badges (Android / iOS), `Learn more` button → promo page.
4. **About** — compact block: avatar/photo, 2–3 short paragraphs covering who, where, what kind of games, main stack (Kotlin + LibGDX).
5. **Contact** — single line: email + GitHub + LinkedIn links. No form.
6. **Footer** — copyright, privacy policy links per game, language toggle.

### 4.2 Promotional Pages (`/infectors3/`, `/squaremaze/`)

Sections in order:

1. **Nav** — global nav + `← Games` back link.
2. **Game Hero** — large app icon + name + tagline. Dark background with game-specific accent color. Primary CTAs: `Download on Google Play` + `Download on App Store`. Rating badge when available.
3. **Screenshots** — grid layout, mobile portrait ratio (no JS dependency). Short caption per screenshot highlighting the mechanic shown. Expandable as new art is produced. Carousel can be added later as a progressive enhancement.
4. **Features** — alternating blocks (text left / image right, then inverted). Content sourced from existing `store/` files in each game repo.
   - Infectors 3volution: Real-Time Strategy, DNA Evolution System, Special Skills, Hundreds of Stages
   - Square Maze: Isometric Puzzle, Procedural Generation, Star Progression System
5. **Final CTA** — *"Ready to play?"* + download buttons repeated.
6. **Footer** — global footer + link to the game's privacy policy.

**Per-game accent colors:**

| Game | Accent Color |
|---|---|
| Infectors 3volution | Green/purple (references cell teams) |
| Square Maze | Icy blue (references penguin + snow environment) |
| Maze (future) | TBD |

### 4.3 Privacy Policy Pages (`/[game]/privacy.html`)

- **Language:** English only (no i18n switcher). Legal document reviewed by store teams.
- **Nav:** Global nav, no distraction.
- **Sections:** Last updated date, What data we collect, How we use it, Third-party services (Google AdMob, Firebase Analytics, Crashlytics, Google Play Games / Apple Game Center, IAP), Children's privacy (COPPA), Contact.
- **Footer:** Global footer.

---

## 5. i18n System

Every text element in HTML receives `data-i18n="key"`. On page load, `i18n.js`:

1. Reads language from `localStorage` (key: `lang`) or falls back to `en`
2. Accepts `?lang=pt-br` URL parameter to override
3. Fetches `/assets/lang/{lang}.json` (absolute path — works from any subdirectory)
4. Sets `textContent` (or `innerHTML` for rich text) on all `[data-i18n]` elements
5. Updates `<html lang="...">` attribute
6. Saves selection to `localStorage`

Privacy policy pages are excluded from the i18n system — static EN content only.

---

## 6. SEO Strategy

| Page | Title target | Meta description focus |
|---|---|---|
| `index.html` | "Anderson Binário — Mobile Game Developer" | Indie developer, Kotlin + LibGDX, Brazil |
| `/infectors3/` | "Infectors 3volution — Cell Strategy Game" | Real-time strategy, evolve cells, Android & iOS |
| `/squaremaze/` | "Square Maze — Isometric Puzzle Game" | Isometric maze puzzle, penguin, procedural levels |
| Privacy pages | "[Game] Privacy Policy" | No SEO focus — functional only |

Each page includes:
- `<title>` and `<meta name="description">`
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`)
- `<link rel="alternate" hreflang>` pointing to same page (EN only for now)
- `sitemap.xml` listing all public pages
- `robots.txt` allowing all crawlers

---

## 7. Store URLs

| App | Field | URL |
|---|---|---|
| Infectors 3volution | Developer URL | `https://www.binario.dev.br` |
| Infectors 3volution | Privacy Policy | `https://www.binario.dev.br/infectors3/privacy` |
| Square Maze | Developer URL | `https://www.binario.dev.br` |
| Square Maze | Privacy Policy | `https://www.binario.dev.br/squaremaze/privacy` |
| Maze (future) | Privacy Policy | `https://www.binario.dev.br/maze/privacy` |

---

## 8. Out of Scope

- Server-side rendering or build tools
- Contact form (static site, no backend)
- Blog or news section
- Analytics integration (can be added later as a script tag)
- Maze promotional page (game not ready)
- PT-BR indexing (EN-only SEO is sufficient for this phase)

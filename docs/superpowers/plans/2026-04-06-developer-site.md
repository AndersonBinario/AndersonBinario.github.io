# Developer Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (EN/PT-BR) personal developer portfolio at www.binario.dev.br using pure HTML/CSS/JS, serving as developer page for app store listings and promotional landing pages for Infectors 3volution and Square Maze.

**Architecture:** Static HTML pages per route, shared CSS design system and JS i18n engine loaded via absolute paths so subdirectory pages (`/infectors3/`, `/squaremaze/`) reference the same assets. Language switching via `data-i18n` attributes + JSON files + localStorage, with EN as default (indexed by Google).

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JS (ES5-compatible), Google Fonts (Inter), GitHub Pages.

---

## Image Assets — Required Before Implementing Pages

Place the following files before starting Task 5. The pages use `onerror` fallbacks so missing images don't break layout, but these must be in place for the real result.

```
assets/img/
  avatar.jpg                       ← Developer photo (any square ratio)
  og-home.png                      ← 1200×630 Open Graph image for homepage
  infectors3/
    icon.png                       ← App icon 512×512
    og.png                         ← 1200×630 OG image
    screenshot-1.png               ← Portrait screenshot (store format)
    screenshot-2.png
    screenshot-3.png
    screenshot-4.png
    feature-1.png                  ← Can reuse screenshots initially
    feature-2.png
    feature-3.png
    feature-4.png
  squaremaze/
    icon.png
    og.png
    screenshot-1.png
    screenshot-2.png
    screenshot-3.png
    screenshot-4.png
    feature-1.png
    feature-2.png
    feature-3.png
    feature-4.png
```

Screenshot naming: use store screenshots in order. Feature images can be the same screenshots initially — they degrade gracefully to "Art coming soon" placeholder if missing.

**Store URLs:** When apps go live, replace `href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"` on download buttons with the specific app URL. For now, all download buttons point to the developer profile page, which is functional.

---

## Task 1: Project Scaffolding

**Files:**
- Create: directory structure listed below

- [ ] **Step 1: Create directories**

```bash
mkdir -p assets/css assets/js assets/lang
mkdir -p assets/img/infectors3 assets/img/squaremaze assets/img/maze
mkdir -p infectors3 squaremaze maze
```

- [ ] **Step 2: Start local server for development**

```bash
python -m http.server 8080
```

Open http://localhost:8080 in a browser. Keep this running throughout development.

- [ ] **Step 3: Commit scaffolding**

```bash
git add assets/ infectors3/ squaremaze/ maze/
git commit -m "chore: scaffold directory structure"
```

---

## Task 2: Global CSS Design System

**Files:**
- Create: `assets/css/style.css`

- [ ] **Step 1: Write `assets/css/style.css`**

```css
/* ============================================================
   DESIGN SYSTEM — binario.dev.br
   ============================================================ */

/* --- Variables --- */
:root {
  /* Colors */
  --bg:           #080810;
  --bg-surface:   #0f0f1a;
  --bg-card:      #13131f;
  --border:       #1e1e30;
  --border-hover: #2e2e48;

  --text-primary:   #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted:     #4a5568;

  --accent:       #6366f1;
  --accent-light: #818cf8;
  --accent-dim:   rgba(99, 102, 241, 0.12);

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

  /* Layout */
  --max-width:  1100px;
  --nav-height: 64px;
  --radius:     12px;
  --radius-sm:  6px;
  --radius-lg:  20px;

  /* Spacing scale */
  --sp-1:  0.25rem;
  --sp-2:  0.5rem;
  --sp-3:  0.75rem;
  --sp-4:  1rem;
  --sp-6:  1.5rem;
  --sp-8:  2rem;
  --sp-12: 3rem;
  --sp-16: 4rem;
  --sp-20: 5rem;

  /* Transitions */
  --transition: 200ms ease;
}

/* --- Reset --- */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; font-size: 16px; }
body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; }

/* --- Layout --- */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--sp-6);
}
.section { padding: var(--sp-20) 0; }
.section-title {
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 700;
  margin-bottom: var(--sp-12);
  text-align: center;
}

/* --- Nav --- */
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--nav-height);
  background: rgba(8, 8, 16, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}
.nav-logo {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}
.nav-logo span { color: var(--accent); }

.nav-back {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition);
}
.nav-back:hover { color: var(--text-primary); }

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
}
.nav-links a {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color var(--transition);
}
.nav-links a:hover { color: var(--text-primary); }

/* Language Toggle */
.lang-toggle {
  display: flex;
  align-items: center;
  gap: var(--sp-1);
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--sp-1);
}
.lang-toggle button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px var(--sp-2);
  font-size: 0.7rem;
  font-weight: 600;
  font-family: var(--font-sans);
  color: var(--text-muted);
  border-radius: 4px;
  transition: all var(--transition);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.lang-toggle button.active {
  background: var(--accent);
  color: #fff;
}

/* Burger (mobile) */
.nav-burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--sp-2);
  color: var(--text-primary);
}
.nav-burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: currentColor;
  border-radius: 2px;
  transition: var(--transition);
}

/* --- Hero (Homepage) --- */
.hero {
  min-height: calc(100vh - var(--nav-height));
  display: flex;
  align-items: center;
  background-image:
    radial-gradient(ellipse 60% 50% at 70% 40%, rgba(99,102,241,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 20% 60%, rgba(99,102,241,0.05) 0%, transparent 60%);
  padding: var(--sp-20) 0;
}
.hero-content { max-width: 700px; }
.hero-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: var(--sp-4);
}
.hero-title {
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: var(--sp-6);
}
.hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin-bottom: var(--sp-8);
  line-height: 1.7;
}
.hero-ctas { display: flex; gap: var(--sp-4); flex-wrap: wrap; }

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: var(--sp-3) var(--sp-6);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition);
  border: none;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99,102,241,0.4);
}
.btn-outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--border-hover);
}
.btn-outline:hover { border-color: var(--accent); color: var(--accent-light); }

/* --- Games Grid --- */
.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-6);
}
.game-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: var(--sp-6);
  transition: border-color var(--transition), box-shadow var(--transition);
  display: flex;
  flex-direction: column;
}
.game-card:hover {
  border-color: var(--border-hover);
  box-shadow: 0 4px 16px rgba(0,0,0,0.5);
}
.game-card-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  margin-bottom: var(--sp-4);
  object-fit: cover;
}
.game-card-icon-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: var(--bg-surface);
  border: 1px solid var(--border);
  margin-bottom: var(--sp-4);
}
.game-card h3 { font-size: 1.25rem; font-weight: 700; margin-bottom: var(--sp-2); }
.game-card p { font-size: 0.875rem; color: var(--text-secondary); margin-bottom: var(--sp-4); flex: 1; }
.game-badges { display: flex; gap: var(--sp-2); margin-bottom: var(--sp-6); }
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px var(--sp-2);
  border-radius: var(--radius-sm);
  background: var(--bg-surface);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.badge-soon {
  border-color: rgba(99,102,241,0.3);
  color: var(--accent-light);
  background: var(--accent-dim);
}

/* --- About --- */
.about-inner {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--sp-12);
  align-items: start;
}
.about-avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--border);
}
.about-avatar-placeholder {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: var(--bg-surface);
  border: 2px solid var(--border);
}
.about-text h2 { font-size: 1.875rem; font-weight: 700; margin-bottom: var(--sp-4); }
.about-text p { color: var(--text-secondary); margin-bottom: var(--sp-4); max-width: 600px; }
.stack-tags { display: flex; flex-wrap: wrap; gap: var(--sp-2); margin-top: var(--sp-4); }
.stack-tag {
  font-size: 0.75rem;
  padding: var(--sp-1) var(--sp-3);
  border-radius: var(--radius-sm);
  background: var(--accent-dim);
  color: var(--accent-light);
  border: 1px solid rgba(99,102,241,0.2);
  font-weight: 500;
}

/* --- Contact --- */
.contact-links {
  display: flex;
  gap: var(--sp-6);
  justify-content: center;
  flex-wrap: wrap;
}
.contact-link {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: 1rem;
  color: var(--text-secondary);
  transition: color var(--transition);
}
.contact-link:hover { color: var(--accent-light); }

/* --- Footer --- */
.footer {
  padding: var(--sp-8) 0;
  border-top: 1px solid var(--border);
  background: var(--bg-surface);
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  text-align: center;
}
.footer-privacy {
  display: flex;
  gap: var(--sp-6);
  flex-wrap: wrap;
  justify-content: center;
}
.footer-privacy a {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color var(--transition);
}
.footer-privacy a:hover { color: var(--text-secondary); }
.footer-copy { font-size: 0.75rem; color: var(--text-muted); }

/* --- Privacy pages --- */
.privacy-main {
  padding: var(--sp-16) 0;
  min-height: calc(100vh - var(--nav-height) - 120px);
}
.privacy-container { max-width: 720px; }
.privacy-container h1 { font-size: 2.25rem; font-weight: 800; margin-bottom: var(--sp-2); }
.privacy-subtitle { font-size: 1.25rem; color: var(--accent-light); margin-bottom: var(--sp-2); }
.privacy-updated { font-size: 0.875rem; color: var(--text-muted); margin-bottom: var(--sp-12); }
.privacy-container section { margin-bottom: var(--sp-8); }
.privacy-container h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: var(--sp-3);
  padding-bottom: var(--sp-2);
  border-bottom: 1px solid var(--border);
}
.privacy-container h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: var(--sp-4) 0 var(--sp-2);
}
.privacy-container p { color: var(--text-secondary); margin-bottom: var(--sp-3); line-height: 1.8; }
.privacy-container ul { list-style: disc; padding-left: var(--sp-6); margin-bottom: var(--sp-3); }
.privacy-container li { color: var(--text-secondary); margin-bottom: var(--sp-2); line-height: 1.7; }
.privacy-container a { color: var(--accent-light); text-decoration: underline; }
.privacy-container a:hover { color: var(--text-primary); }

/* --- Responsive --- */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-direction: column;
    padding: var(--sp-4) var(--sp-6);
    gap: var(--sp-4);
    align-items: flex-start;
  }
  .nav-links.open { display: flex; }
  .nav-burger { display: flex; }
  .about-inner { grid-template-columns: 1fr; }
  .about-avatar, .about-avatar-placeholder { margin: 0 auto; }
  .games-grid { grid-template-columns: 1fr; }
  .contact-links { flex-direction: column; align-items: center; }
}
```

- [ ] **Step 2: Open http://localhost:8080 and verify page background is dark (`#080810`)**

No HTML yet — the CSS file will be empty visually until Task 4. This step just confirms the server is running and the file saves without syntax errors by checking the browser console (F12) shows no 404 on `/assets/css/style.css` once linked.

- [ ] **Step 3: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: add global CSS design system"
```

---

## Task 3: i18n Engine

**Files:**
- Create: `assets/js/i18n.js`

- [ ] **Step 1: Write `assets/js/i18n.js`**

```javascript
(function () {
  'use strict';

  var STORAGE_KEY = 'lang';
  var DEFAULT_LANG = 'en';
  var SUPPORTED = ['en', 'pt-br'];

  function getLang() {
    var urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && SUPPORTED.indexOf(urlParam) !== -1) {
      localStorage.setItem(STORAGE_KEY, urlParam);
      return urlParam;
    }
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  function applyStrings(strings) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (strings[key] !== undefined) {
        if (el.hasAttribute('data-i18n-html')) {
          el.innerHTML = strings[key];
        } else {
          el.textContent = strings[key];
        }
      }
    });
  }

  function applyLang(lang) {
    fetch('/assets/lang/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + lang);
        return res.json();
      })
      .then(function (strings) {
        applyStrings(strings);
        document.documentElement.lang = lang === 'pt-br' ? 'pt-BR' : 'en';
        document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
          btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
        });
        localStorage.setItem(STORAGE_KEY, lang);
      })
      .catch(function (err) {
        console.error('[i18n]', err);
      });
  }

  function init() {
    applyLang(getLang());
    document.querySelectorAll('[data-lang-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyLang(btn.getAttribute('data-lang-btn'));
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add assets/js/i18n.js
git commit -m "feat: add i18n engine"
```

---

## Task 4: Language Strings

**Files:**
- Create: `assets/lang/en.json`
- Create: `assets/lang/pt-br.json`

- [ ] **Step 1: Write `assets/lang/en.json`**

```json
{
  "nav.games":    "Games",
  "nav.about":    "About",
  "nav.contact":  "Contact",
  "nav.back":     "Games",

  "hero.label":       "Mobile Game Developer",
  "hero.tagline":     "Crafting mobile games, one mechanic at a time.",
  "hero.subtitle":    "Indie developer building strategy and puzzle games for Android & iOS using Kotlin and LibGDX.",
  "hero.cta.games":   "See my games",
  "hero.cta.playstore": "Google Play",

  "section.games":     "My Games",
  "game.learn_more":   "Learn more",
  "badge.android":     "Android",
  "badge.ios":         "iOS",
  "badge.coming_soon": "Coming soon",

  "game.infectors3.tagline": "Cell strategy: infect, evolve and dominate.",
  "game.squaremaze.tagline": "Isometric maze puzzle with a penguin.",
  "game.maze.tagline":       "A new maze adventure. Coming soon.",

  "section.about": "About",
  "about.name":    "Anderson Binário",
  "about.p1":      "I'm an indie mobile game developer based in Brazil, publishing games under the Nuclear² label.",
  "about.p2":      "I build games with Kotlin and LibGDX — focusing on mechanics that are simple to learn but difficult to master.",
  "about.p3":      "Currently working on expanding my catalog to iOS and growing each title through organic discovery.",

  "section.contact": "Contact",

  "footer.copyright":          "© 2026 Anderson Binário. All rights reserved.",
  "footer.privacy.infectors3": "Infectors 3volution — Privacy",
  "footer.privacy.squaremaze": "Square Maze — Privacy",
  "footer.privacy.maze":       "Maze — Privacy",

  "game.infectors3.name":           "Infectors 3volution",
  "game.infectors3.hero.tagline":   "Cell strategy: infect, evolve and dominate.",
  "game.infectors3.hero.subtitle":  "Command a microscopic army in real-time battles of total domination. Be the last team standing.",
  "game.infectors3.download.android": "Download on Google Play",
  "game.infectors3.download.ios":     "Download on App Store",
  "game.infectors3.s1.caption": "Real-time cell combat",
  "game.infectors3.s2.caption": "DNA evolution system",
  "game.infectors3.s3.caption": "Special skills",
  "game.infectors3.s4.caption": "Hundreds of stages",
  "game.infectors3.f1.title": "Real-Time Strategy",
  "game.infectors3.f1.desc":  "Select cells, pick your targets, and strike at the right moment. Dominate neutral cells to grow and neutralize enemies before they reach you.",
  "game.infectors3.f2.title": "Evolve Your Army",
  "game.infectors3.f2.desc":  "Distribute DNA points across four attributes: Attack, Defense, Regeneration, and Speed. Each path shapes your playstyle and unlocks devastating combinations.",
  "game.infectors3.f3.title": "Special Skills",
  "game.infectors3.f3.desc":  "Unlock and master unique powers in the Lab: Explosion, Sacrifice, Growth, Battery, Hibernation, Fast Area, Slow Area. Use them at the right moment to turn impossible matches around.",
  "game.infectors3.f4.title": "Hundreds of Stages",
  "game.infectors3.f4.desc":  "Maps with unique layouts — circular, star, diamond, pinwheel, border and more — guarantee variety and new challenges every stage.",
  "game.infectors3.cta":      "Ready to infect?",

  "game.squaremaze.name":           "Square Maze",
  "game.squaremaze.hero.tagline":   "Isometric maze puzzle with a penguin.",
  "game.squaremaze.hero.subtitle":  "Navigate procedurally generated mazes, collect stars and solve puzzles. Every level is a new challenge.",
  "game.squaremaze.download.android": "Download on Google Play",
  "game.squaremaze.download.ios":     "Download on App Store",
  "game.squaremaze.s1.caption": "Isometric maze navigation",
  "game.squaremaze.s2.caption": "Procedural level generation",
  "game.squaremaze.s3.caption": "Box-pushing puzzles",
  "game.squaremaze.s4.caption": "Star collection and progression",
  "game.squaremaze.f1.title": "Isometric Puzzle",
  "game.squaremaze.f1.desc":  "Guide your penguin through an isometric grid, sliding across icy surfaces, avoiding traps and collecting stars to progress.",
  "game.squaremaze.f2.title": "Procedural Generation",
  "game.squaremaze.f2.desc":  "Every maze is generated from a unique seed — no two levels are alike. The grid grows as you advance, from 17×17 to 31×31, increasing complexity naturally.",
  "game.squaremaze.f3.title": "Push & Solve",
  "game.squaremaze.f3.desc":  "Push boxes into holes, press buttons to open doors, and navigate puzzle zones that require planning ahead to escape.",
  "game.squaremaze.f4.title": "Star Progression",
  "game.squaremaze.f4.desc":  "Collect stars to unlock new characters. Track your best time and lowest action count — challenge yourself to perfect every level.",
  "game.squaremaze.cta":      "Ready to solve?"
}
```

- [ ] **Step 2: Write `assets/lang/pt-br.json`**

```json
{
  "nav.games":    "Jogos",
  "nav.about":    "Sobre",
  "nav.contact":  "Contato",
  "nav.back":     "Jogos",

  "hero.label":       "Desenvolvedor de Jogos Mobile",
  "hero.tagline":     "Criando jogos mobile, uma mecânica de cada vez.",
  "hero.subtitle":    "Desenvolvedor indie criando jogos de estratégia e puzzle para Android e iOS com Kotlin e LibGDX.",
  "hero.cta.games":   "Ver meus jogos",
  "hero.cta.playstore": "Google Play",

  "section.games":     "Meus Jogos",
  "game.learn_more":   "Saiba mais",
  "badge.android":     "Android",
  "badge.ios":         "iOS",
  "badge.coming_soon": "Em breve",

  "game.infectors3.tagline": "Estratégia celular: infecte, evolua e domine.",
  "game.squaremaze.tagline": "Puzzle isométrico de labirinto com um pinguim.",
  "game.maze.tagline":       "Uma nova aventura em labirinto. Em breve.",

  "section.about": "Sobre",
  "about.name":    "Anderson Binário",
  "about.p1":      "Sou um desenvolvedor indie de jogos mobile baseado no Brasil, publicando jogos pela label Nuclear².",
  "about.p2":      "Desenvolvo jogos com Kotlin e LibGDX — focando em mecânicas simples de aprender e difíceis de dominar.",
  "about.p3":      "Atualmente expandindo meu catálogo para iOS e crescendo cada título por descoberta orgânica.",

  "section.contact": "Contato",

  "footer.copyright":          "© 2026 Anderson Binário. Todos os direitos reservados.",
  "footer.privacy.infectors3": "Infectors 3volution — Privacidade",
  "footer.privacy.squaremaze": "Square Maze — Privacidade",
  "footer.privacy.maze":       "Maze — Privacidade",

  "game.infectors3.name":           "Infectors 3volution",
  "game.infectors3.hero.tagline":   "Estratégia celular: infecte, evolua e domine.",
  "game.infectors3.hero.subtitle":  "Comande um exército microscópico em batalhas de dominação total em tempo real. Seja o último time de pé.",
  "game.infectors3.download.android": "Baixar no Google Play",
  "game.infectors3.download.ios":     "Baixar na App Store",
  "game.infectors3.s1.caption": "Combate celular em tempo real",
  "game.infectors3.s2.caption": "Sistema de evolução DNA",
  "game.infectors3.s3.caption": "Habilidades especiais",
  "game.infectors3.s4.caption": "Centenas de estágios",
  "game.infectors3.f1.title": "Estratégia em Tempo Real",
  "game.infectors3.f1.desc":  "Selecione células, escolha seus alvos e ataque no momento certo. Domine células neutras para crescer e neutralize inimigos antes que cheguem até você.",
  "game.infectors3.f2.title": "Evolua Seu Exército",
  "game.infectors3.f2.desc":  "Distribua pontos de DNA em quatro atributos: Ataque, Defesa, Regeneração e Velocidade. Cada caminho molda seu estilo de jogo e desbloqueia combinações devastadoras.",
  "game.infectors3.f3.title": "Habilidades Especiais",
  "game.infectors3.f3.desc":  "Desbloqueie e domine powers únicos no Lab: Explosão, Sacrifício, Crescimento, Bateria, Hibernação, Área Rápida, Área Lenta. Use-os na hora certa para virar partidas impossíveis.",
  "game.infectors3.f4.title": "Centenas de Estágios",
  "game.infectors3.f4.desc":  "Mapas com layouts únicos — circular, estrela, diamante, pinwheel, borda e mais — garantem variedade e novos desafios a cada fase.",
  "game.infectors3.cta":      "Pronto para infectar?",

  "game.squaremaze.name":           "Square Maze",
  "game.squaremaze.hero.tagline":   "Puzzle isométrico de labirinto com um pinguim.",
  "game.squaremaze.hero.subtitle":  "Navegue por labirintos gerados proceduralmente, colete estrelas e resolva puzzles. Cada nível é um novo desafio.",
  "game.squaremaze.download.android": "Baixar no Google Play",
  "game.squaremaze.download.ios":     "Baixar na App Store",
  "game.squaremaze.s1.caption": "Navegação pelo labirinto isométrico",
  "game.squaremaze.s2.caption": "Geração procedural de fases",
  "game.squaremaze.s3.caption": "Puzzles de empurrar caixas",
  "game.squaremaze.s4.caption": "Coleta de estrelas e progressão",
  "game.squaremaze.f1.title": "Puzzle Isométrico",
  "game.squaremaze.f1.desc":  "Guie seu pinguim por um grid isométrico, deslizando em superfícies geladas, evitando armadilhas e coletando estrelas para progredir.",
  "game.squaremaze.f2.title": "Geração Procedural",
  "game.squaremaze.f2.desc":  "Cada labirinto é gerado a partir de uma semente única — dois níveis nunca são iguais. O grid cresce conforme você avança, de 17×17 a 31×31, aumentando a complexidade naturalmente.",
  "game.squaremaze.f3.title": "Empurre e Resolva",
  "game.squaremaze.f3.desc":  "Empurre caixas em buracos, pressione botões para abrir portas e navegue por zonas de puzzle que exigem planejamento para escapar.",
  "game.squaremaze.f4.title": "Progressão por Estrelas",
  "game.squaremaze.f4.desc":  "Colete estrelas para desbloquear novos personagens. Acompanhe seu melhor tempo e menor contagem de ações — desafie-se a completar cada nível com perfeição.",
  "game.squaremaze.cta":      "Pronto para resolver?"
}
```

- [ ] **Step 3: Commit**

```bash
git add assets/lang/
git commit -m "feat: add EN and PT-BR language strings"
```

---

## Task 5: Homepage

**Files:**
- Create: `index.html`
- Create: `assets/js/main.js`

- [ ] **Step 1: Write `assets/js/main.js`**

```javascript
(function () {
  'use strict';

  var burger = document.getElementById('nav-burger');
  var navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', function (e) {
      if (!burger.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
```

- [ ] **Step 2: Write `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anderson Binário — Mobile Game Developer</title>
  <meta name="description" content="Indie mobile game developer from Brazil building strategy and puzzle games for Android and iOS with Kotlin and LibGDX.">

  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://www.binario.dev.br/">
  <meta property="og:title"       content="Anderson Binário — Mobile Game Developer">
  <meta property="og:description" content="Indie mobile game developer from Brazil building strategy and puzzle games for Android and iOS.">
  <meta property="og:image"       content="https://www.binario.dev.br/assets/img/og-home.png">
  <link rel="canonical" href="https://www.binario.dev.br/">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/" class="nav-logo">Anderson <span>Binário</span></a>
      <div class="nav-links" id="nav-links">
        <a href="#games"   data-i18n="nav.games">Games</a>
        <a href="#about"   data-i18n="nav.about">About</a>
        <a href="#contact" data-i18n="nav.contact">Contact</a>
        <div class="lang-toggle">
          <button data-lang-btn="en">EN</button>
          <button data-lang-btn="pt-br">PT</button>
        </div>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <p class="hero-label" data-i18n="hero.label">Mobile Game Developer</p>
        <h1 class="hero-title" data-i18n="hero.tagline">Crafting mobile games, one mechanic at a time.</h1>
        <p class="hero-subtitle" data-i18n="hero.subtitle">Indie developer building strategy and puzzle games for Android &amp; iOS using Kotlin and LibGDX.</p>
        <div class="hero-ctas">
          <a href="#games" class="btn btn-primary" data-i18n="hero.cta.games">See my games</a>
          <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
             target="_blank" rel="noopener"
             class="btn btn-outline"
             data-i18n="hero.cta.playstore">Google Play</a>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="games">
    <div class="container">
      <h2 class="section-title" data-i18n="section.games">My Games</h2>
      <div class="games-grid">

        <div class="game-card">
          <img src="/assets/img/infectors3/icon.png"
               alt="Infectors 3volution icon"
               class="game-card-icon"
               onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <div class="game-card-icon-placeholder" style="display:none"></div>
          <h3>Infectors 3volution</h3>
          <p data-i18n="game.infectors3.tagline">Cell strategy: infect, evolve and dominate.</p>
          <div class="game-badges">
            <span class="badge" data-i18n="badge.android">Android</span>
            <span class="badge" data-i18n="badge.ios">iOS</span>
          </div>
          <a href="/infectors3/" class="btn btn-outline" data-i18n="game.learn_more">Learn more</a>
        </div>

        <div class="game-card">
          <img src="/assets/img/squaremaze/icon.png"
               alt="Square Maze icon"
               class="game-card-icon"
               onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <div class="game-card-icon-placeholder" style="display:none"></div>
          <h3>Square Maze</h3>
          <p data-i18n="game.squaremaze.tagline">Isometric maze puzzle with a penguin.</p>
          <div class="game-badges">
            <span class="badge" data-i18n="badge.android">Android</span>
            <span class="badge" data-i18n="badge.ios">iOS</span>
          </div>
          <a href="/squaremaze/" class="btn btn-outline" data-i18n="game.learn_more">Learn more</a>
        </div>

        <div class="game-card">
          <div class="game-card-icon-placeholder"></div>
          <h3>Maze</h3>
          <p data-i18n="game.maze.tagline">A new maze adventure. Coming soon.</p>
          <div class="game-badges">
            <span class="badge badge-soon" data-i18n="badge.coming_soon">Coming soon</span>
          </div>
        </div>

      </div>
    </div>
  </section>

  <section class="section" id="about">
    <div class="container">
      <div class="about-inner">
        <div>
          <img src="/assets/img/avatar.jpg"
               alt="Anderson Binário"
               class="about-avatar"
               onerror="this.style.display='none';this.nextElementSibling.style.display='block'">
          <div class="about-avatar-placeholder" style="display:none"></div>
        </div>
        <div class="about-text">
          <h2 data-i18n="about.name">Anderson Binário</h2>
          <p data-i18n="about.p1">I'm an indie mobile game developer based in Brazil, publishing games under the Nuclear² label.</p>
          <p data-i18n="about.p2">I build games with Kotlin and LibGDX — focusing on mechanics that are simple to learn but difficult to master.</p>
          <p data-i18n="about.p3">Currently working on expanding my catalog to iOS and growing each title through organic discovery.</p>
          <div class="stack-tags">
            <span class="stack-tag">Kotlin</span>
            <span class="stack-tag">LibGDX</span>
            <span class="stack-tag">Android</span>
            <span class="stack-tag">iOS</span>
            <span class="stack-tag">RoboVM</span>
            <span class="stack-tag">Firebase</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" id="contact">
    <div class="container">
      <h2 class="section-title" data-i18n="section.contact">Contact</h2>
      <div class="contact-links">
        <a href="mailto:anderson.binario@gmail.com" class="contact-link">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="m2 7 10 7 10-7"/>
          </svg>
          anderson.binario@gmail.com
        </a>
        <a href="https://github.com/AndersonBinario" target="_blank" rel="noopener" class="contact-link">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/andersonperes/" target="_blank" rel="noopener" class="contact-link">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy" data-i18n="footer.privacy.infectors3">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy" data-i18n="footer.privacy.squaremaze">Square Maze — Privacy</a>
        <a href="/maze/privacy"       data-i18n="footer.privacy.maze">Maze — Privacy</a>
      </div>
      <div class="lang-toggle">
        <button data-lang-btn="en">EN</button>
        <button data-lang-btn="pt-br">PT</button>
      </div>
      <p class="footer-copy" data-i18n="footer.copyright">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Open http://localhost:8080 and verify:**
  - Dark background renders
  - Hero text visible
  - Three game cards in grid
  - About and Contact sections render
  - Lang toggle buttons appear in nav and footer
  - Click "PT" — texts switch to Portuguese
  - Click "EN" — texts switch back to English
  - Resize to mobile width (< 768px) — burger button appears
  - Click burger — nav links drop down

- [ ] **Step 4: Commit**

```bash
git add index.html assets/js/main.js
git commit -m "feat: add homepage"
```

---

## Task 6: Game Page CSS

**Files:**
- Create: `assets/css/game.css`

- [ ] **Step 1: Write `assets/css/game.css`**

```css
/* ============================================================
   GAME PAGE STYLES — binario.dev.br
   ============================================================ */

/* Per-game accent color tokens (set on <body class="game-*">) */
body.game-infectors3 {
  --game-accent:     #22c55e;
  --game-accent-dim: rgba(34, 197, 94, 0.1);
}

body.game-squaremaze {
  --game-accent:     #38bdf8;
  --game-accent-dim: rgba(56, 189, 248, 0.1);
}

/* --- Game Hero --- */
.game-hero {
  min-height: 70vh;
  display: flex;
  align-items: center;
  padding: var(--sp-20) 0;
  background-image:
    radial-gradient(ellipse 60% 60% at 80% 40%, var(--game-accent-dim) 0%, transparent 70%),
    radial-gradient(ellipse 30% 40% at 10% 70%, rgba(0,0,0,0.3) 0%, transparent 60%);
}

.game-hero-icon {
  width: 100px;
  height: 100px;
  border-radius: 22px;
  margin-bottom: var(--sp-6);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}

.game-hero-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin-bottom: var(--sp-4);
}

.game-hero-tagline {
  font-size: 1.25rem;
  color: var(--game-accent);
  font-weight: 600;
  margin-bottom: var(--sp-4);
}

.game-hero-subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
  max-width: 520px;
  margin-bottom: var(--sp-8);
  line-height: 1.7;
}

.game-hero-ctas { display: flex; gap: var(--sp-4); flex-wrap: wrap; }

.btn-game {
  background: var(--game-accent);
  color: #000;
  font-weight: 700;
}
.btn-game:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-game-outline {
  border: 1px solid var(--game-accent);
  color: var(--game-accent);
  background: transparent;
}
.btn-game-outline:hover { background: var(--game-accent-dim); }

/* --- Screenshots Grid --- */
.screenshots {
  padding: var(--sp-20) 0;
  background: var(--bg-surface);
}

.screenshots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--sp-4);
}

.screenshot-item {
  border-radius: var(--radius);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-card);
}

.screenshot-item img {
  width: 100%;
  aspect-ratio: 9 / 16;
  object-fit: cover;
  display: block;
}

.screenshot-caption {
  padding: var(--sp-3) var(--sp-4);
  font-size: 0.7rem;
  color: var(--text-muted);
  text-align: center;
}

/* --- Features --- */
.features { padding: var(--sp-20) 0; }

.feature-block {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-16);
  align-items: center;
  margin-bottom: var(--sp-20);
}
.feature-block:last-child { margin-bottom: 0; }

.feature-block.reverse { direction: rtl; }
.feature-block.reverse > * { direction: ltr; }

.feature-text::before {
  content: '';
  display: block;
  width: 40px;
  height: 3px;
  background: var(--game-accent);
  border-radius: 2px;
  margin-bottom: var(--sp-4);
}

.feature-icon { font-size: 2.5rem; margin-bottom: var(--sp-4); }

.feature-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: var(--sp-3);
}

.feature-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.8;
}

.feature-image {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border);
  background: var(--bg-card);
  aspect-ratio: 9 / 16;
  max-height: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature-image-placeholder {
  width: 100%;
  text-align: center;
  padding: var(--sp-12);
  color: var(--text-muted);
  font-size: 0.875rem;
}

/* --- Final CTA --- */
.game-cta {
  padding: var(--sp-20) 0;
  background: var(--bg-surface);
  text-align: center;
  border-top: 1px solid var(--border);
}

.game-cta-title {
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: 800;
  margin-bottom: var(--sp-6);
}

.game-cta-title span { color: var(--game-accent); }

.game-cta-buttons {
  display: flex;
  gap: var(--sp-4);
  justify-content: center;
  flex-wrap: wrap;
}

/* --- Responsive (game pages) --- */
@media (max-width: 768px) {
  .feature-block {
    grid-template-columns: 1fr;
    gap: var(--sp-8);
  }
  .feature-block.reverse { direction: ltr; }
  .screenshots-grid { grid-template-columns: repeat(2, 1fr); }
}
```

- [ ] **Step 2: Commit**

```bash
git add assets/css/game.css
git commit -m "feat: add game page CSS"
```

---

## Task 7: Infectors 3volution Page

**Files:**
- Create: `infectors3/index.html`

- [ ] **Step 1: Write `infectors3/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infectors 3volution — Cell Strategy Game | Android &amp; iOS</title>
  <meta name="description" content="Command a microscopic army in real-time battles. Infect, evolve with DNA points and master special skills to dominate the enemy. Free on Android and iOS.">

  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://www.binario.dev.br/infectors3/">
  <meta property="og:title"       content="Infectors 3volution — Cell Strategy Game">
  <meta property="og:description" content="Command a microscopic army in real-time battles. Infect, evolve and dominate.">
  <meta property="og:image"       content="https://www.binario.dev.br/assets/img/infectors3/og.png">
  <link rel="canonical" href="https://www.binario.dev.br/infectors3/">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/game.css">
</head>
<body class="game-infectors3">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/" class="nav-back">← <span data-i18n="nav.back">Games</span></a>
      <div class="nav-links" id="nav-links">
        <a href="/#games"   data-i18n="nav.games">Games</a>
        <a href="/#about"   data-i18n="nav.about">About</a>
        <a href="/#contact" data-i18n="nav.contact">Contact</a>
        <div class="lang-toggle">
          <button data-lang-btn="en">EN</button>
          <button data-lang-btn="pt-br">PT</button>
        </div>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <section class="game-hero">
    <div class="container">
      <img src="/assets/img/infectors3/icon.png"
           alt="Infectors 3volution"
           class="game-hero-icon"
           onerror="this.style.display='none'">
      <h1 class="game-hero-title" data-i18n="game.infectors3.name">Infectors 3volution</h1>
      <p class="game-hero-tagline"  data-i18n="game.infectors3.hero.tagline">Cell strategy: infect, evolve and dominate.</p>
      <p class="game-hero-subtitle" data-i18n="game.infectors3.hero.subtitle">Command a microscopic army in real-time battles of total domination. Be the last team standing.</p>
      <div class="game-hero-ctas">
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game"
           data-i18n="game.infectors3.download.android">Download on Google Play</a>
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game-outline"
           data-i18n="game.infectors3.download.ios">Download on App Store</a>
      </div>
    </div>
  </section>

  <section class="screenshots">
    <div class="container">
      <h2 class="section-title">Screenshots</h2>
      <div class="screenshots-grid">
        <div class="screenshot-item">
          <img src="/assets/img/infectors3/screenshot-1.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.infectors3.s1.caption">Real-time cell combat</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/infectors3/screenshot-2.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.infectors3.s2.caption">DNA evolution system</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/infectors3/screenshot-3.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.infectors3.s3.caption">Special skills</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/infectors3/screenshot-4.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.infectors3.s4.caption">Hundreds of stages</p>
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">

      <div class="feature-block">
        <div class="feature-text">
          <div class="feature-icon">⚔️</div>
          <h2 class="feature-title" data-i18n="game.infectors3.f1.title">Real-Time Strategy</h2>
          <p class="feature-desc"  data-i18n="game.infectors3.f1.desc">Select cells, pick your targets, and strike at the right moment. Dominate neutral cells to grow and neutralize enemies before they reach you.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/infectors3/feature-1.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block reverse">
        <div class="feature-text">
          <div class="feature-icon">🧬</div>
          <h2 class="feature-title" data-i18n="game.infectors3.f2.title">Evolve Your Army</h2>
          <p class="feature-desc"  data-i18n="game.infectors3.f2.desc">Distribute DNA points across four attributes: Attack, Defense, Regeneration, and Speed. Each path shapes your playstyle and unlocks devastating combinations.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/infectors3/feature-2.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block">
        <div class="feature-text">
          <div class="feature-icon">⚡</div>
          <h2 class="feature-title" data-i18n="game.infectors3.f3.title">Special Skills</h2>
          <p class="feature-desc"  data-i18n="game.infectors3.f3.desc">Unlock and master unique powers in the Lab: Explosion, Sacrifice, Growth, Battery, Hibernation, Fast Area, Slow Area. Use them at the right moment to turn impossible matches around.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/infectors3/feature-3.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block reverse">
        <div class="feature-text">
          <div class="feature-icon">🔬</div>
          <h2 class="feature-title" data-i18n="game.infectors3.f4.title">Hundreds of Stages</h2>
          <p class="feature-desc"  data-i18n="game.infectors3.f4.desc">Maps with unique layouts — circular, star, diamond, pinwheel, border and more — guarantee variety and new challenges every stage.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/infectors3/feature-4.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

    </div>
  </section>

  <section class="game-cta">
    <div class="container">
      <h2 class="game-cta-title"><span data-i18n="game.infectors3.cta">Ready to infect?</span></h2>
      <div class="game-cta-buttons">
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game"
           data-i18n="game.infectors3.download.android">Download on Google Play</a>
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game-outline"
           data-i18n="game.infectors3.download.ios">Download on App Store</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy" data-i18n="footer.privacy.infectors3">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy" data-i18n="footer.privacy.squaremaze">Square Maze — Privacy</a>
        <a href="/maze/privacy"       data-i18n="footer.privacy.maze">Maze — Privacy</a>
      </div>
      <div class="lang-toggle">
        <button data-lang-btn="en">EN</button>
        <button data-lang-btn="pt-br">PT</button>
      </div>
      <p class="footer-copy" data-i18n="footer.copyright">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open http://localhost:8080/infectors3/ and verify:**
  - Green accent color on tagline and feature bars
  - "← Games" back link navigates to homepage
  - Screenshots section renders (images show or degrade gracefully)
  - Features alternate left/right layout
  - Final CTA section appears
  - Lang toggle works: switch to PT, texts switch
  - Mobile: resize to < 768px, features stack vertically

- [ ] **Step 3: Commit**

```bash
git add infectors3/index.html
git commit -m "feat: add Infectors 3volution promotional page"
```

---

## Task 8: Square Maze Page

**Files:**
- Create: `squaremaze/index.html`

- [ ] **Step 1: Write `squaremaze/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Square Maze — Isometric Puzzle Game | Android &amp; iOS</title>
  <meta name="description" content="Navigate procedurally generated isometric mazes with a penguin. Collect stars, push boxes and solve puzzles across infinite levels. Free on Android and iOS.">

  <meta property="og:type"        content="website">
  <meta property="og:url"         content="https://www.binario.dev.br/squaremaze/">
  <meta property="og:title"       content="Square Maze — Isometric Puzzle Game">
  <meta property="og:description" content="Navigate procedurally generated mazes with a penguin. Collect stars and solve puzzles.">
  <meta property="og:image"       content="https://www.binario.dev.br/assets/img/squaremaze/og.png">
  <link rel="canonical" href="https://www.binario.dev.br/squaremaze/">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
  <link rel="stylesheet" href="/assets/css/game.css">
</head>
<body class="game-squaremaze">

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/" class="nav-back">← <span data-i18n="nav.back">Games</span></a>
      <div class="nav-links" id="nav-links">
        <a href="/#games"   data-i18n="nav.games">Games</a>
        <a href="/#about"   data-i18n="nav.about">About</a>
        <a href="/#contact" data-i18n="nav.contact">Contact</a>
        <div class="lang-toggle">
          <button data-lang-btn="en">EN</button>
          <button data-lang-btn="pt-br">PT</button>
        </div>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <section class="game-hero">
    <div class="container">
      <img src="/assets/img/squaremaze/icon.png"
           alt="Square Maze"
           class="game-hero-icon"
           onerror="this.style.display='none'">
      <h1 class="game-hero-title" data-i18n="game.squaremaze.name">Square Maze</h1>
      <p class="game-hero-tagline"  data-i18n="game.squaremaze.hero.tagline">Isometric maze puzzle with a penguin.</p>
      <p class="game-hero-subtitle" data-i18n="game.squaremaze.hero.subtitle">Navigate procedurally generated mazes, collect stars and solve puzzles. Every level is a new challenge.</p>
      <div class="game-hero-ctas">
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game"
           data-i18n="game.squaremaze.download.android">Download on Google Play</a>
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game-outline"
           data-i18n="game.squaremaze.download.ios">Download on App Store</a>
      </div>
    </div>
  </section>

  <section class="screenshots">
    <div class="container">
      <h2 class="section-title">Screenshots</h2>
      <div class="screenshots-grid">
        <div class="screenshot-item">
          <img src="/assets/img/squaremaze/screenshot-1.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.squaremaze.s1.caption">Isometric maze navigation</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/squaremaze/screenshot-2.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.squaremaze.s2.caption">Procedural level generation</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/squaremaze/screenshot-3.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.squaremaze.s3.caption">Box-pushing puzzles</p>
        </div>
        <div class="screenshot-item">
          <img src="/assets/img/squaremaze/screenshot-4.png" alt="" loading="lazy">
          <p class="screenshot-caption" data-i18n="game.squaremaze.s4.caption">Star collection and progression</p>
        </div>
      </div>
    </div>
  </section>

  <section class="features">
    <div class="container">

      <div class="feature-block">
        <div class="feature-text">
          <div class="feature-icon">🐧</div>
          <h2 class="feature-title" data-i18n="game.squaremaze.f1.title">Isometric Puzzle</h2>
          <p class="feature-desc"  data-i18n="game.squaremaze.f1.desc">Guide your penguin through an isometric grid, sliding across icy surfaces, avoiding traps and collecting stars to progress.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/squaremaze/feature-1.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block reverse">
        <div class="feature-text">
          <div class="feature-icon">🗺️</div>
          <h2 class="feature-title" data-i18n="game.squaremaze.f2.title">Procedural Generation</h2>
          <p class="feature-desc"  data-i18n="game.squaremaze.f2.desc">Every maze is generated from a unique seed — no two levels are alike. The grid grows as you advance, from 17×17 to 31×31, increasing complexity naturally.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/squaremaze/feature-2.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block">
        <div class="feature-text">
          <div class="feature-icon">📦</div>
          <h2 class="feature-title" data-i18n="game.squaremaze.f3.title">Push &amp; Solve</h2>
          <p class="feature-desc"  data-i18n="game.squaremaze.f3.desc">Push boxes into holes, press buttons to open doors, and navigate puzzle zones that require planning ahead to escape.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/squaremaze/feature-3.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

      <div class="feature-block reverse">
        <div class="feature-text">
          <div class="feature-icon">⭐</div>
          <h2 class="feature-title" data-i18n="game.squaremaze.f4.title">Star Progression</h2>
          <p class="feature-desc"  data-i18n="game.squaremaze.f4.desc">Collect stars to unlock new characters. Track your best time and lowest action count — challenge yourself to perfect every level.</p>
        </div>
        <div class="feature-image">
          <img src="/assets/img/squaremaze/feature-4.png" alt="" loading="lazy"
               onerror="this.parentElement.innerHTML='<div class=\'feature-image-placeholder\'>Art coming soon</div>'">
        </div>
      </div>

    </div>
  </section>

  <section class="game-cta">
    <div class="container">
      <h2 class="game-cta-title"><span data-i18n="game.squaremaze.cta">Ready to solve?</span></h2>
      <div class="game-cta-buttons">
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game"
           data-i18n="game.squaremaze.download.android">Download on Google Play</a>
        <a href="https://play.google.com/store/apps/developer?id=Nuclear%C2%B2"
           target="_blank" rel="noopener"
           class="btn btn-game-outline"
           data-i18n="game.squaremaze.download.ios">Download on App Store</a>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy" data-i18n="footer.privacy.infectors3">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy" data-i18n="footer.privacy.squaremaze">Square Maze — Privacy</a>
        <a href="/maze/privacy"       data-i18n="footer.privacy.maze">Maze — Privacy</a>
      </div>
      <div class="lang-toggle">
        <button data-lang-btn="en">EN</button>
        <button data-lang-btn="pt-br">PT</button>
      </div>
      <p class="footer-copy" data-i18n="footer.copyright">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/i18n.js"></script>
  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open http://localhost:8080/squaremaze/ and verify:**
  - Icy blue (`#38bdf8`) accent on tagline and feature bars (not green from Infectors3)
  - All four feature blocks render alternating
  - Screenshots section visible
  - Lang toggle switches texts correctly

- [ ] **Step 3: Commit**

```bash
git add squaremaze/index.html
git commit -m "feat: add Square Maze promotional page"
```

---

## Task 9: Privacy Policy Pages

**Files:**
- Create: `infectors3/privacy.html`
- Create: `squaremaze/privacy.html`
- Create: `maze/privacy.html`

These pages are EN only — no i18n switcher, no `data-i18n` attributes, static content.

- [ ] **Step 1: Write `infectors3/privacy.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infectors 3volution — Privacy Policy</title>
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/infectors3/" class="nav-back">← Infectors 3volution</a>
      <div class="nav-links" id="nav-links">
        <a href="/#games">Games</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main class="privacy-main">
    <div class="container privacy-container">
      <h1>Privacy Policy</h1>
      <p class="privacy-subtitle">Infectors 3volution</p>
      <p class="privacy-updated">Last updated: April 6, 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>This Privacy Policy explains how Anderson Binário ("we", "us", or "our") collects, uses and shares information when you play Infectors 3volution (the "Game"). We are committed to protecting your privacy.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We do not directly collect personal information. The Game uses third-party services that may collect information as described below.</p>

        <h3>2.1 Device and Usage Information</h3>
        <p>Through Firebase Analytics and Firebase Crashlytics, the following may be collected automatically:</p>
        <ul>
          <li>Device type, operating system version, and language settings</li>
          <li>App version and session information</li>
          <li>Crash reports and diagnostic data</li>
          <li>In-app events (e.g., level completions, feature usage)</li>
        </ul>
        <p>This data is anonymized and used solely to improve the Game.</p>

        <h3>2.2 Advertising Identifiers</h3>
        <p>The Game displays advertisements through Google AdMob. AdMob may collect your device's advertising identifier (GAID on Android, IDFA on iOS) and related information to show relevant ads. You can reset or opt out of personalized advertising through your device settings.</p>

        <h3>2.3 Game Services Data</h3>
        <p>If you connect to Google Play Games (Android) or Apple Game Center (iOS), your player ID and game progress (achievements, scores) are stored by those services under their respective privacy policies.</p>

        <h3>2.4 In-App Purchases</h3>
        <p>Purchases are processed entirely by Google Play (Android) or the App Store (iOS). We do not receive or store your payment information.</p>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <ul>
          <li>To operate and improve the Game</li>
          <li>To diagnose and fix crashes and technical issues</li>
          <li>To display advertisements that help keep the Game free</li>
          <li>To support leaderboards and achievements via game services</li>
        </ul>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>The Game integrates the following third-party services, each governed by its own privacy policy:</p>
        <ul>
          <li><strong>Google AdMob</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
          <li><strong>Firebase Analytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Firebase Crashlytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Google Play Games</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
          <li><strong>Apple Game Center</strong> — <a href="https://www.apple.com/legal/privacy/" target="_blank" rel="noopener">apple.com/legal/privacy</a></li>
          <li><strong>Google Play Billing / Apple In-App Purchases</strong> — Payment information is handled entirely by Google or Apple.</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Retention</h2>
        <p>We do not store personal data on our own servers. Data retained by third-party services is governed by their respective retention policies. Firebase Analytics and Crashlytics data is typically retained for a limited period as defined by Google Firebase.</p>
      </section>

      <section>
        <h2>6. Children's Privacy</h2>
        <p>The Game is not directed at children under 13 years of age. We do not knowingly collect personal information from children. Ad personalization for users identified as children is disabled in compliance with applicable law (COPPA, GDPR-K). If you believe a child has provided personal information through the Game, contact us so we can take appropriate action.</p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal data, including the right to access, correct, or request deletion of data. Since we do not directly store personal data, most requests should be directed to the relevant third-party services listed in Section 4. For questions related to our processing, contact us below.</p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Game after changes constitutes acceptance of the revised policy.</p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>Questions about this Privacy Policy:</p>
        <p><a href="mailto:anderson.binario@gmail.com">anderson.binario@gmail.com</a></p>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy">Square Maze — Privacy</a>
        <a href="/maze/privacy">Maze — Privacy</a>
      </div>
      <p class="footer-copy">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Write `squaremaze/privacy.html`**

Same structure as `infectors3/privacy.html`. Replace the following:

| Field | Value |
|---|---|
| `<title>` | `Square Maze — Privacy Policy` |
| `.privacy-subtitle` text | `Square Maze` |
| `← Infectors 3volution` back link | `← Square Maze` pointing to `/squaremaze/` |
| Nav back href | `/squaremaze/` |

All other sections (third-party services, children's privacy, contact) are identical. The complete file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Square Maze — Privacy Policy</title>
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/squaremaze/" class="nav-back">← Square Maze</a>
      <div class="nav-links" id="nav-links">
        <a href="/#games">Games</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main class="privacy-main">
    <div class="container privacy-container">
      <h1>Privacy Policy</h1>
      <p class="privacy-subtitle">Square Maze</p>
      <p class="privacy-updated">Last updated: April 6, 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>This Privacy Policy explains how Anderson Binário ("we", "us", or "our") collects, uses and shares information when you play Square Maze (the "Game"). We are committed to protecting your privacy.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We do not directly collect personal information. The Game uses third-party services that may collect information as described below.</p>

        <h3>2.1 Device and Usage Information</h3>
        <p>Through Firebase Analytics and Firebase Crashlytics, the following may be collected automatically:</p>
        <ul>
          <li>Device type, operating system version, and language settings</li>
          <li>App version and session information</li>
          <li>Crash reports and diagnostic data</li>
          <li>In-app events (e.g., level completions, feature usage)</li>
        </ul>
        <p>This data is anonymized and used solely to improve the Game.</p>

        <h3>2.2 Advertising Identifiers</h3>
        <p>The Game displays advertisements through Google AdMob. AdMob may collect your device's advertising identifier (GAID on Android, IDFA on iOS) and related information to show relevant ads. You can reset or opt out of personalized advertising through your device settings.</p>

        <h3>2.3 In-App Purchases</h3>
        <p>Purchases are processed entirely by Google Play (Android) or the App Store (iOS). We do not receive or store your payment information.</p>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <ul>
          <li>To operate and improve the Game</li>
          <li>To diagnose and fix crashes and technical issues</li>
          <li>To display advertisements that help keep the Game free</li>
        </ul>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <p>The Game integrates the following third-party services, each governed by its own privacy policy:</p>
        <ul>
          <li><strong>Google AdMob</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
          <li><strong>Firebase Analytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Firebase Crashlytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Google Play Billing / Apple In-App Purchases</strong> — Payment information is handled entirely by Google or Apple.</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Retention</h2>
        <p>We do not store personal data on our own servers. Data retained by third-party services is governed by their respective retention policies.</p>
      </section>

      <section>
        <h2>6. Children's Privacy</h2>
        <p>The Game is not directed at children under 13 years of age. We do not knowingly collect personal information from children. Ad personalization for users identified as children is disabled in compliance with applicable law (COPPA, GDPR-K). If you believe a child has provided personal information through the Game, contact us so we can take appropriate action.</p>
      </section>

      <section>
        <h2>7. Your Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal data. Since we do not directly store personal data, most requests should be directed to the relevant third-party services listed in Section 4. For questions, contact us below.</p>
      </section>

      <section>
        <h2>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date. Continued use of the Game after changes constitutes acceptance of the revised policy.</p>
      </section>

      <section>
        <h2>9. Contact</h2>
        <p>Questions about this Privacy Policy:</p>
        <p><a href="mailto:anderson.binario@gmail.com">anderson.binario@gmail.com</a></p>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy">Square Maze — Privacy</a>
        <a href="/maze/privacy">Maze — Privacy</a>
      </div>
      <p class="footer-copy">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Write `maze/privacy.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Maze — Privacy Policy</title>
  <meta name="robots" content="noindex">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/css/style.css">
</head>
<body>

  <nav class="nav">
    <div class="container nav-inner">
      <a href="/" class="nav-back">← Games</a>
      <div class="nav-links" id="nav-links">
        <a href="/#games">Games</a>
        <a href="/#about">About</a>
        <a href="/#contact">Contact</a>
      </div>
      <button class="nav-burger" id="nav-burger" aria-label="Menu" aria-expanded="false">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>

  <main class="privacy-main">
    <div class="container privacy-container">
      <h1>Privacy Policy</h1>
      <p class="privacy-subtitle">Maze</p>
      <p class="privacy-updated">Last updated: April 6, 2026</p>

      <section>
        <h2>1. Introduction</h2>
        <p>This Privacy Policy explains how Anderson Binário ("we", "us", or "our") collects, uses and shares information when you play Maze (the "Game"). We are committed to protecting your privacy.</p>
      </section>

      <section>
        <h2>2. Information We Collect</h2>
        <p>We do not directly collect personal information. The Game uses third-party services that may collect information as described below.</p>

        <h3>2.1 Device and Usage Information</h3>
        <p>Through Firebase Analytics and Firebase Crashlytics, the following may be collected automatically:</p>
        <ul>
          <li>Device type, operating system version, and language settings</li>
          <li>App version and session information</li>
          <li>Crash reports and diagnostic data</li>
          <li>In-app events (e.g., level completions, feature usage)</li>
        </ul>
        <p>This data is anonymized and used solely to improve the Game.</p>

        <h3>2.2 Advertising Identifiers</h3>
        <p>The Game may display advertisements through Google AdMob. AdMob may collect your device's advertising identifier and related information. You can opt out of personalized advertising through your device settings.</p>

        <h3>2.3 In-App Purchases</h3>
        <p>Purchases are processed entirely by Google Play (Android) or the App Store (iOS). We do not receive or store your payment information.</p>
      </section>

      <section>
        <h2>3. How We Use Information</h2>
        <ul>
          <li>To operate and improve the Game</li>
          <li>To diagnose and fix crashes and technical issues</li>
          <li>To display advertisements that help keep the Game free</li>
        </ul>
      </section>

      <section>
        <h2>4. Third-Party Services</h2>
        <ul>
          <li><strong>Google AdMob</strong> — <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">policies.google.com/privacy</a></li>
          <li><strong>Firebase Analytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Firebase Crashlytics</strong> — <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">firebase.google.com/support/privacy</a></li>
          <li><strong>Google Play Billing / Apple In-App Purchases</strong> — Payment information is handled entirely by Google or Apple.</li>
        </ul>
      </section>

      <section>
        <h2>5. Data Retention</h2>
        <p>We do not store personal data on our own servers. Data retained by third-party services is governed by their respective retention policies.</p>
      </section>

      <section>
        <h2>6. Children's Privacy</h2>
        <p>The Game is not directed at children under 13 years of age. Ad personalization for users identified as children is disabled in compliance with applicable law (COPPA, GDPR-K).</p>
      </section>

      <section>
        <h2>7. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.</p>
      </section>

      <section>
        <h2>8. Contact</h2>
        <p>Questions about this Privacy Policy:</p>
        <p><a href="mailto:anderson.binario@gmail.com">anderson.binario@gmail.com</a></p>
      </section>
    </div>
  </main>

  <footer class="footer">
    <div class="container footer-inner">
      <div class="footer-privacy">
        <a href="/infectors3/privacy">Infectors 3volution — Privacy</a>
        <a href="/squaremaze/privacy">Square Maze — Privacy</a>
        <a href="/maze/privacy">Maze — Privacy</a>
      </div>
      <p class="footer-copy">© 2026 Anderson Binário. All rights reserved.</p>
    </div>
  </footer>

  <script src="/assets/js/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Verify all three privacy pages:**
  - http://localhost:8080/infectors3/privacy — back link goes to `/infectors3/`
  - http://localhost:8080/squaremaze/privacy — back link goes to `/squaremaze/`
  - http://localhost:8080/maze/privacy — back link goes to `/`
  - All third-party links open correctly

- [ ] **Step 5: Commit**

```bash
git add infectors3/privacy.html squaremaze/privacy.html maze/privacy.html
git commit -m "feat: add privacy policy pages for all three games"
```

---

## Task 10: SEO Files

**Files:**
- Create: `sitemap.xml`
- Create: `robots.txt`

- [ ] **Step 1: Write `sitemap.xml`**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.binario.dev.br/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.binario.dev.br/infectors3/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.binario.dev.br/squaremaze/</loc>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

Privacy pages are excluded — they have `noindex` and add no SEO value.

- [ ] **Step 2: Write `robots.txt`**

```
User-agent: *
Allow: /
Disallow: /docs/

Sitemap: https://www.binario.dev.br/sitemap.xml
```

- [ ] **Step 3: Commit**

```bash
git add sitemap.xml robots.txt
git commit -m "feat: add sitemap.xml and robots.txt"
```

---

## Task 11: Deploy and Verify Live

- [ ] **Step 1: Push to GitHub**

```bash
git push origin main
```

Wait ~60 seconds for GitHub Pages to rebuild.

- [ ] **Step 2: Verify live URLs**

Open in browser (not localhost):

| URL | Expected |
|---|---|
| `https://www.binario.dev.br/` | Homepage loads with dark background |
| `https://www.binario.dev.br/infectors3/` | Green accent, Infectors3 content |
| `https://www.binario.dev.br/squaremaze/` | Blue accent, Square Maze content |
| `https://www.binario.dev.br/infectors3/privacy` | Privacy policy renders |
| `https://www.binario.dev.br/squaremaze/privacy` | Privacy policy renders |
| `https://www.binario.dev.br/maze/privacy` | Privacy policy renders |
| `https://www.binario.dev.br/sitemap.xml` | XML renders |
| `https://www.binario.dev.br/robots.txt` | Plain text renders |

- [ ] **Step 3: Test i18n on live site**

On `https://www.binario.dev.br/`:
- Click PT toggle — texts switch to Portuguese
- Navigate to `/infectors3/` — PT is remembered
- Click EN — switches back

- [ ] **Step 4: After apps go live on stores, update download button `href` values**

In `infectors3/index.html` — replace both instances of `https://play.google.com/store/apps/developer?id=Nuclear%C2%B2` with the specific app URLs.

In `squaremaze/index.html` — same.

Commit with: `fix: update store download links for [game name]`

---

## Post-Implementation: Adding Art

When new screenshots or promotional art are ready:

1. Place images in `assets/img/[game]/`
2. Name feature images `feature-1.png` through `feature-4.png` (portrait 9:16 preferred)
3. For OG images: create `og.png` at 1200×630px
4. No code changes needed — pages already reference these paths

When the Maze game is closer to launch, add `maze/index.html` following the same structure as `infectors3/index.html`, using `body.game-maze` class and defining `--game-accent` in `game.css`.

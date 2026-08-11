# Dictionary App — Portfolio Project

# Description

A React web app for looking up word definitions, pronunciations, and example
usage via a public dictionary API.

## Who this is for

A dictionary web app built by **Parfait Kwon Mbadu** as a showcase project for his portfolio
(`d:\Projects\portfolio`). Demonstrates consuming a real REST API from a React frontend:
async data fetching, loading/error states, and rendering nested API responses.

**This file is a living document.** Update it as decisions change.

See `PROGRESS.md` for the build log — meaningful steps only, most recent first.

## What it does

User types a word → app fetches its entry from a public dictionary API → displays
pronunciation, meanings, definitions, and examples.

## API

**Free Dictionary API** — https://api.dictionaryapi.dev

- Endpoint: `GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- **No API key, no signup, no env vars** — chosen deliberately to keep deployment simple.
- Success returns an **array** of entries. Each entry has:
  - `word`, `phonetic` (string), `phonetics[]` (each `{ text, audio }` — audio is often `""`)
  - `meanings[]` — each `{ partOfSpeech, definitions[], synonyms[], antonyms[] }`
  - `definitions[]` — each `{ definition, example?, synonyms[], antonyms[] }`
  - `sourceUrls[]`
- A word with no entry returns **HTTP 404** with `{ title, message, resolution }` — not an
  empty array. Must be handled as its own "no definitions found" state, distinct from a
  network error.

## Scope (v1 — core only)

1. Search input — submit a word
2. Word header — the word + phonetic spelling + play button for audio pronunciation
3. Meanings — grouped by part of speech, each with its definitions and any examples
4. Synonyms — shown where the API provides them
5. States — idle, loading, not-found (404), and network/error

**Explicitly out of scope for v1** (possible v2): search history, font switcher,
light/dark theme toggle.

## Tech stack

- **Build tool:** Vite
- **Framework:** React + JavaScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Data fetching:** native `fetch` inside a custom hook — no data library
- **Deployment target:** Vercel

## Design direction

Minimal/clean, consistent with the portfolio — generous whitespace, restrained palette,
one accent color. Typography matters more than usual here: this is a reading interface,
so definition text needs comfortable line length and clear hierarchy between parts of speech.

## Conventions

- **Comments:** default to none. Only when the _why_ is non-obvious. Mark untouched
  scaffold with `// boilerplate`.
- JavaScript (`.jsx`/`.js`), functional components only.
- Tailwind utilities for styling — avoid separate CSS files.
- **Tailwind class order:** Layout → Box (spacing/sizing) → Look (bg/border/shadow) →
  Text → Modifiers (hover:, focus:, responsive, transition).
- One component per file in `src/components/`, PascalCase filenames.
  Filenames must match imports exactly — Windows is case-insensitive, Vercel's Linux
  build is not.
- API logic stays out of components: fetching lives in `src/hooks/`, the raw request in
  `src/api/`.

## Workflow

- Build step by step, explaining what each command/config/file does along the way.
- **Structure before style:** write unstyled JSX first, confirm it renders, then add
  Tailwind in a separate pass. Don't interleave.
- **Verify before advancing:** confirm the current step works before starting the next.
- **Always update PROGRESS.md before moving to the next step** — not "check whether it needs
  updating." Never describe the next step until the completed one is written down.
- **But only meaningful steps earn an entry.** `PROGRESS.md` is a reference guide for how the
  project was built, not an audit trail. A step belongs in the log if someone rebuilding the
  project would have to _do_ it, or if it involved a decision worth remembering. It does not
  belong if it's housekeeping: deleting unused files, renaming things, fixing typos, tweaking
  spacing, reordering imports. Log installs, configuration, new components/hooks/modules,
  API integration, and design or architecture decisions.
  - If work is a continuation of something already logged (a fix, tweak, or follow-on to an
    existing step), append it to that step rather than creating a new one.
  - If a step is too small to stand alone but still worth recording, fold it into the entry
    for the step it happened alongside.
  - When in doubt, fold in rather than add. A short log that reads well beats a complete one.
- **Chat-mode by default:** for setup, commands, scaffolding, AND writing/editing code,
  give Parfait the exact commands/code to enter himself with a brief explanation — don't
  run or write it directly. End by asking "Would you like me to do it for you instead?"
  Only execute directly on a yes for that specific step — a yes doesn't carry over.

## Relationship to the portfolio

Separate repo, separate Vercel deployment. Linked from the portfolio by replacing a
placeholder entry in `portfolio/src/data/projects.js` with this app's real `liveUrl`
and `repoUrl` — `Projects.jsx` already renders both.

# Build Progress Log

A running reference of the steps taken to build this project. Listed most recent first.
Updated as we go.

---

## Up next

- Step 8: audio pronunciation button in the word header
- Then: the Tailwind styling pass over the whole app (first real styling since Step 3)

---

## Step 7: Results UI — `WordResult` + `Meaning`

Replaced the temporary JSON dump with real markup, split in two: `WordResult` renders the entry
header and maps over `meanings`; `Meaning` renders one part-of-speech block with its definitions,
examples, and synonyms. Still unstyled — structure first.

The real work here was **guarding optional fields**. `entry.phonetic`, `definition.example`, and
a non-empty `synonyms` array are all absent on most words. Unguarded, they render `undefined` on
screen or leave a dangling "Synonyms:" label with nothing after it. Inspecting the actual JSON in
Step 4 is what made these predictable rather than discovered through bugs.

Two smaller decisions:

- **`key={index}` is correct here**, despite the usual advice against it. That warning applies to
  lists that get reordered, filtered, or inserted into, where React reuses the wrong DOM node.
  These lists render once from a fixed response and never mutate. `key={meaning.partOfSpeech}`
  was rejected even though it reads better — a word can carry two `noun` meanings from different
  etymologies, and duplicate keys are a real bug.
- **`synonyms.join(", ")`** renders the array as readable prose; rendering the array directly
  jams the words together with no separators.

Verified with `hello` (three parts of speech, five interjection definitions, synonyms present),
plus words that exercise the guards.

---

## Step 6: `SearchBar` + wiring it into `App`

First UI, and the first end-to-end test of the API module and hook together. Written unstyled —
structure first, Tailwind in a later pass.

`src/components/SearchBar.jsx` holds the input's own state and reports upward through a single
`onSearch` prop:

```jsx
const SearchBar = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        placeholder="Search for a word..."
      />
      <button type="submit">Search</button>
    </form>
  );
};
```

Decisions worth keeping:

- **A `<form>` with `onSubmit`, not a button with `onClick`.** The form gives Enter-to-submit for
  free and is announced correctly by screen readers. With `onClick`, keyboard users must tab to
  the button on every search.
- **`event.preventDefault()` is required** — a form's default action reloads the page, which
  wipes React state and makes the search look like it silently did nothing.
- **State is split by owner.** `term` lives in `SearchBar` because only it cares what is being
  typed; result state lives in `useDictionary`. The component knows nothing about the API.

`App.jsx` now calls the hook and switches on `status`, with a temporary
`<pre>{JSON.stringify(data, null, 2)}</pre>` standing in for the results UI — enough to prove the
full chain (input → hook → API → state → render) before investing in layout.

Verified in the browser: `hello` renders the raw JSON, `sdfgfdg` shows the not-found message,
Enter submits without clicking, and an empty box does nothing (the `!word.trim()` guard).

---

## Step 5: `useDictionary` hook (`src/hooks/useDictionary.js`)

The bridge between the plain API function and React. It owns all the request state, so
components never touch `fetch` or manage loading flags themselves:

```js
const useDictionary = () => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const search = async (word) => {
    if (!word.trim()) return;

    setStatus("loading");
    setData(null);

    try {
      const entries = await fetchWord(word);
      setData(entries[0]);
      setStatus("success");
    } catch (error) {
      setMessage(error.message);
      setStatus(error.notFound ? "notFound" : "error");
    }
  };

  return { data, status, message, search };
};
```

The main decision: **one `status` string rather than several booleans.** The obvious version is
`isLoading` / `isError` / `hasSearched`, but that permits impossible combinations (loading *and*
errored) and turns the JSX into nested ternaries. A single value that is exactly one of
`idle` | `loading` | `success` | `notFound` | `error` makes those states unrepresentable, and the
UI becomes a straightforward switch. `idle` is what keeps "hasn't searched yet" visually distinct
from "search returned nothing".

Other notes:
- `entries[0]` is where the API's array collapses to a single entry. Extra entries are rare
  same-spelling/different-etymology cases; v1 shows the first.
- The `catch` branches on `error.notFound`, the flag set in the API module — that one tag is what
  routes a 404 to a friendly message instead of a generic failure.
- Status strings must match exactly between the hook and the UI switch. A mismatch (`"not found"`
  vs `"notFound"`) matches no branch and renders a blank screen with no error — caught during
  this step.

No UI yet, so nothing to see in the browser. It gets verified end-to-end in Step 6.

---

## Step 4: API module (`src/api/dictionary.js`)

The first real piece of the app. Kept deliberately free of React — it is a plain async function,
so the fetching logic can be understood and tested on its own:

```js
const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en";

export const fetchWord = async (word) => {
  const response = await fetch(`${API_BASE}/${encodeURIComponent(word.trim())}`);

  if (response.status === 404) {
    const error = new Error(`No definition found for "${word}"`);
    error.notFound = true;
    throw error;
  }

  if (!response.ok) {
    throw new Error("Something went wrong. Please try again.");
  }

  return response.json();
};
```

Why it is written this way:

- **`encodeURIComponent`** escapes characters that would otherwise break the URL — searching
  `rock 'n' roll` sends a malformed request without it.
- **404 is handled before `!response.ok`.** This API returns a genuine 404 for an unknown word
  rather than an empty array, and that is a legitimate result to show the user, not a failure.
  The `error.notFound = true` tag is what lets the UI distinguish *"no definitions found for
  xyzzy"* from *"something went wrong"*.
- **`fetch` does not throw on 4xx/5xx** — unlike axios, a 500 resolves normally and only a
  network failure rejects. Without the explicit `!response.ok` check, an error body would be
  rendered as if it were a word entry.
- **`.json()` runs only after both status checks pass**, so an error payload never reaches the
  success path.

Verified in the browser console before building any UI. `…/entries/en/hello` returns an **array**
whose `[0]` holds `word`, `phonetics` (3), `sourceUrls`, and `meanings` (3 — noun, verb,
interjection), with each meaning holding its own `definitions` array. That nesting
(**array → meanings → definitions**) is the shape the UI has to walk. `…/entries/en/sdfgfdg`
returns 404 with `{ title, message, resolution }`, confirming the 404 branch is needed.

---

## Step 3: Install and configure Tailwind CSS v4

```powershell
npm install tailwindcss @tailwindcss/vite
```

Landed Tailwind 4.3.3. v4 configures very differently from v3: it ships a first-party Vite
plugin, so there is **no `tailwind.config.js` and no PostCSS config** — nothing to generate and
no `content` paths to declare. Two edits total:

1. `vite.config.js` — imported `@tailwindcss/vite` and added `tailwindcss()` to `plugins`
   alongside `react()`.
2. `src/index.css` — replaced the whole file with a single `@import "tailwindcss";`. That import
   is what pulls in the reset and generates the utility classes. The scaffold's version shipped
   its own body/link/button styling for the demo page, which would have fought Tailwind's reset,
   so the file was replaced rather than appended to.

Verified with `npm run dev` — `text-3xl font-bold text-blue-600` on a heading rendered large,
bold, and blue.

In the same pass, the Vite demo boilerplate was cleared out: `src/App.jsx` stripped to a bare
`App` component, and `src/App.css`, `src/assets/`, and `public/icons.svg` deleted. Kept
`public/favicon.svg` — `index.html` still links it. `src/` is now just `App.jsx`, `main.jsx`,
and `index.css`.

Gotcha: `vite.config.js` changes are **not** hot-reloaded — the dev server needs a restart after
editing it, otherwise Tailwind looks like it silently failed.

---

## Step 2: Scaffold the app with Vite

Ran, from inside the existing project folder:

```powershell
npm create vite@latest . -- --template react
npm install
```

The `.` scaffolds into the current directory instead of creating a nested one, and
`--template react` selects React + JavaScript up front, skipping the interactive
framework/variant prompts.

Because the folder already contained `CLAUDE.md` and `PROGRESS.md`, Vite prompted for how to
handle the non-empty directory. Chose **"Ignore files and continue"** — the default-highlighted
option is "Remove existing files and continue", which would have deleted the brief.

Generated: `index.html` (page shell React mounts into), `src/main.jsx` (entry point),
`src/App.jsx` (root component, starts as the Vite demo counter), `vite.config.js`,
`eslint.config.js`, `package.json`.

Landed on React 19.2.8 / Vite 8.2.0 — the same versions as the portfolio, so the tooling is
familiar ground and the new material in this project is the API integration.

Verified with `npm run dev` — dev server on `http://localhost:5173` showing the Vite + React
demo counter.

---

## Step 1: Define the project (CLAUDE.md)

Created `CLAUDE.md` at the project root to capture the brief before writing any code: what the
app does, which API it consumes, v1 scope, tech stack, design direction, conventions, and how
it links back to the portfolio.

Key decisions recorded:

- **API:** Free Dictionary API (`api.dictionaryapi.dev`) — no key, no signup, so no env vars
  and no extra deployment setup. Keyed alternatives (Merriam-Webster, Wordnik) were rejected
  for that overhead.
- **Scope:** core only for v1 (search, phonetics + audio, meanings, definitions, synonyms,
  loading/error/not-found states). Search history, font switcher, and theme toggle deferred.
- **Same stack as the portfolio** (Vite + React + Tailwind v4 + JS) — familiar ground, so the
  new material is the API integration rather than the tooling.
- **Separate repo and deployment** from the portfolio; linked only via `projects.js` data.

Two gotchas written into `CLAUDE.md` up front:

- The API returns **HTTP 404** (not an empty array) for an unknown word, with a JSON error
  body — so "not found" needs to be its own UI state, distinct from a network failure.
- Component filenames must match imports exactly. Windows is case-insensitive but Vercel's
  Linux build is not — this already broke once on the portfolio (`skills.jsx` → `Skills.jsx`).

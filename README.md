# Optimizely Experiment Builder

Build Optimizely A/B test variants by chatting with Claude. You don't need to write code — describe what you want, Claude writes the JS, you paste the result into Optimizely.

## First-time setup

1. You should already have Claude Code installed (IT set it up). If you don't, get it from them.
2. Add the `chrome-devtools` MCP to Claude Code (needed for `/debug`). Easiest: open Claude Code and ask it *"install the chrome-devtools MCP"*.
3. That's it — Claude installs everything else the first time you run `/fetch`.

## Using it

### 1. Fetch the page

In Claude Code, type:

```
/fetch https://your-landing-page.com/the-page
```

Claude will start a local server at http://localhost:3000, fetch a copy of the page, and tell you it's ready.

### 2. Open the preview

Open **http://localhost:3000** in your browser. You'll see the page exactly as Optimizely will render it (your variant JS is injected automatically).

### 3. Chat with Claude

Describe changes in plain English:

> Make the headline say "Save 50% today" in red.

> Add a sticky banner at the top saying "Free shipping until Friday".

> Hide the third feature card on the homepage.

The browser live-reloads each time Claude saves. Keep iterating until you're happy.

### 4. Copy the final JS into Optimizely

Your variant lives in `pages/<slug>/changes.js` — open that file, copy everything, and paste it into Optimizely's **Custom Code** box on your variation.

(Or ask Claude *"show me the final JS"* and it'll print it in the chat.)

## When something looks broken

Type:

```
/debug
```

(optionally with a description: `/debug the banner isn't showing on mobile`)

Claude opens the page in a controlled browser, screenshots it, reads the console, and either fixes the issue or tells you exactly what's wrong. (It only checks mobile if your description mentions mobile or the issue is viewport-specific — otherwise desktop only, to keep things fast.)

## Starting over

```
/reset
```

Wipes the current page and lets you start fresh with a new URL.

## What lives where

| Path | What it is |
|------|------------|
| `pages/<slug>/changes.js` | **Your variant.** This is what you paste into Optimizely. |
| `pages/<slug>/original.html` | Frozen copy of the fetched page. Don't edit. |
| `app/` | Implementation files. Don't touch. |
| `CLAUDE.md` | Instructions Claude follows when building experiments. |

## Optimizely tips

- Paste the **entire contents** of `changes.js` — including the wrapping `(function() { ... })();`.
- Optimizely's Custom Code runs **before** the page loads. Claude follows the right pattern automatically (helpers like `injectStyles` and `waitForElement` are baked into every fetched page).
- For QA, use Optimizely's standard QA preview flow (`?optly_qa=true&optimizely_x=<experimentId>&optimizely_log=debug`).

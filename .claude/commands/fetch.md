# Fetch a Page

Fetches a live webpage and sets it up for editing in the local preview at http://localhost:3000.

`$ARGUMENTS` is the URL to fetch.

## Steps

1. **Validate input.** If `$ARGUMENTS` is empty or doesn't look like a URL, ask the user for the URL and stop.
2. **Install deps if missing.** If `app/node_modules` doesn't exist, run `npm install --prefix app` and wait for it to finish. Tell the user "first-time setup, this takes ~30 seconds."
3. **Probe the server.** Run `curl -sS -o /dev/null -w "%{http_code}" http://localhost:3000 --max-time 2 || echo "down"`.
4. **Start the server if not running.** If the probe didn't return `200`, run `npm start --prefix app` in the background, then poll the same probe every second (max 10s) until it returns `200`. If it never comes up, surface the failure and stop.
5. **Fetch the page.** Run `node app/fetch.js "$ARGUMENTS"`. Wait for exit code 0.
6. **Report.** One line: "Ready at http://localhost:3000 — tell me what you want to change."

## Notes

- The fetched HTML lives at `page/original.html` and is never edited.
- `page/changes.js` is the only file you edit going forward. CSS goes inside it via `injectStyles()`.
- The browser preview shows `original.html` with `changes.js` injected — exactly what Optimizely will run.
- `/fetch` always wipes any previous `page/` before fetching the new URL.
- See `CLAUDE.md` for the Optimizely JS rules.

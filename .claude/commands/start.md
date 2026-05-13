# Start the Preview Server

Starts the Browser Sync preview server against the existing page in `page/`, without re-fetching the page.

## Steps

1. **Check a page exists.** Run `ls page/*.html 2>/dev/null | head -1`. If no HTML file is found in `page/`, stop and tell the user to run `/fetch <url>` first. Do NOT wipe or overwrite any existing files.
2. **Install deps if missing.** If `app/node_modules` doesn't exist, run `npm install --prefix app` and wait for it to finish.
3. **Start the server.** Run `./app/node_modules/.bin/browser-sync start --server page --files 'page/**/*' --no-notify --no-snippet > /tmp/bs-out.txt 2>&1 &` — `--no-snippet` suppresses browser-sync's auto-injected client script (we inject it manually before `<base>` to avoid URL rewriting). The glob watches any file in `page/`. Omitting `--port` lets browser-sync auto-assign a free port.
4. **Find the URL.** Wait 3 seconds, then run `grep -o 'http://localhost:[0-9]*' /tmp/bs-out.txt | head -1` to get the assigned URL.
5. **Report.** One line: "Ready at <url> — tell me what you want to change."

## Notes

- Never delete, overwrite, or modify any file in `page/`. This command only starts a server.

# Fetch a Page

Fetches a live webpage and saves it to `page/index.html` with assets injected. Does not touch `page/changes.js` or `page/changes.css`.

`$ARGUMENTS` is the URL to fetch.

## Steps

1. **Validate input.** If `$ARGUMENTS` is empty or doesn't look like a URL, ask the user for the URL and stop.

2. **Fetch the HTML.** Use the WebFetch tool to GET `$ARGUMENTS` with a browser-like User-Agent. If it fails, report the error and stop.

3. **Derive the origin.** From the URL extract `scheme://host` (e.g. `https://example.com`). This becomes the `<base>` href.

4. **Strip iframes.** Remove all `<iframe …>…</iframe>` blocks from the HTML (they break the preview and are irrelevant to the experiment).

5. **Inject into `<head>`.** Immediately after the opening `<head>` tag insert exactly these two lines (in this order):

   ```html
   <script>(()=>{const h=`${location.protocol}//${location.host}`;const l=document.createElement('link');l.rel='stylesheet';l.href=`${h}/changes.css`;document.head.appendChild(l);const s=document.createElement('script');s.src=`${h}/changes.js`;document.head.appendChild(s);const bs=document.createElement('script');bs.src=`${h}/browser-sync/browser-sync-client.js`;document.head.appendChild(bs);})()</script>
   <base href="ORIGIN/">
   ```

   Replace `ORIGIN` with the value from step 3. **Why one script:** `<base>` redirects all root-relative paths (`/changes.css`) to the origin server. By building absolute URLs from `location.protocol + '//' + location.host` at runtime, all three assets (changes.css, changes.js, browser-sync client) resolve to localhost regardless of the base tag.

6. **Write `page/index.html` only.** Overwrite (or create) `page/index.html` with the processed HTML from step 5.

   **CRITICAL — DO NOT touch `page/changes.js` or `page/changes.css` under any circumstances.** These are committed repo files the user writes their experiment code into. Overwriting them destroys their work. Only `page/index.html` is ever written by this command.

7. **Report.** One line: "Fetched — run `/start` to preview at http://localhost:3000."

## Notes

- `page/changes.js` and `page/changes.css` are committed repo files. Never overwrite, truncate, or delete them — not even to write "empty" stubs.
- Never edit `page/index.html` after writing it.
- See `CLAUDE.md` for the full Optimizely JS rules.

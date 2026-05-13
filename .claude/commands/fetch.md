# Fetch a Page

Fetches a live webpage and saves it to `page/index.html` with assets injected. Does not touch `page/changes.js` or `page/changes.css`.

`$ARGUMENTS` is the URL to fetch.

## Steps

1. **Validate input.** If `$ARGUMENTS` is empty or doesn't look like a URL, ask the user for the URL and stop.

2. **Fetch and process in one Bash command.** Run the following, substituting `$ARGUMENTS` for `URL`:

   ```bash
   curl -sL \
     -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" \
     "URL" | node -e "
   const fs = require('fs');
   const url = new URL('URL');
   const origin = url.origin;
   let html = '';
   process.stdin.setEncoding('utf8');
   process.stdin.on('data', d => html += d);
   process.stdin.on('end', () => {
     html = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, '');
     const injection = '<script>(()=>{const h=\`\${location.protocol}//\${location.host}\`;const l=document.createElement(\"link\");l.rel=\"stylesheet\";l.href=\`\${h}/changes.css\`;document.head.appendChild(l);const s=document.createElement(\"script\");s.src=\`\${h}/changes.js\`;document.head.appendChild(s);const bs=document.createElement(\"script\");bs.src=\`\${h}/browser-sync/browser-sync-client.js\`;document.head.appendChild(bs);})()</script>\n<base href=\"' + origin + '/\">';
     html = html.replace(/(<head\b[^>]*>)/i, '\$1\n' + injection);
     fs.writeFileSync('page/index.html', html);
   });
   "
   ```

   If curl or node exits non-zero, report the error and stop.

   **CRITICAL — DO NOT touch `page/changes.js` or `page/changes.css` under any circumstances.** These are committed repo files the user writes their experiment code into. Overwriting them destroys their work. Only `page/index.html` is ever written by this command.

3. **Report.** One line: "Fetched — run `/start` to preview at http://localhost:3000."

## Notes

- `page/changes.js` and `page/changes.css` are committed repo files. Never overwrite, truncate, or delete them — not even to write "empty" stubs.
- Never edit `page/index.html` after writing it.
- See `CLAUDE.md` for the full Optimizely JS rules.

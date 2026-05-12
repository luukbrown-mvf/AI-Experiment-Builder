# Reset to Clean Slate

Deletes the `page/` folder. **Do not ask for confirmation** — just run it.

## Steps

1. Run `node app/reset.js`.
2. Tell them they can now run `/fetch <url>` to start fresh.

## Notes

- Destructive — the fetched HTML and any `changes.js` work is gone.
- Does not stop the running server. The server will fall back to a placeholder page until the next `/fetch`.

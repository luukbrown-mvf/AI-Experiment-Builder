# Stop the Preview Server

Stops the running Browser Sync preview server.

## Steps

1. **Kill the process.** Run `pkill -f 'browser-sync start' 2>/dev/null; true`
2. **Confirm.** Run `lsof -ti tcp:3000 2>/dev/null | head -1` — if it returns a PID, a different process is still on port 3000 (not browser-sync); warn the user. If empty, the server is gone.
3. **Report.** One line: "Server stopped." (or the warning from step 2 if applicable).

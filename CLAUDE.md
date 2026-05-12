# Optimizely Experiment Builder

This project lets the CRO team at MVF Global build Optimizely A/B test variants by describing them in plain English. They describe the change, you write the JS, they paste it into Optimizely's Custom Code box.

## Business context

MVF Global is a lead-generation company — qualified leads are the product, sold to clients. The CRO funnel is:

**ads → landing page → form steps → submission**

Most of the time the goal is more **form submissions**. Sometimes the priority shifts to **lead quality** instead. Default to optimising for submission volume; switch frame to lead quality only when the user calls it out. Either way, optimise for the active metric, not aesthetics in isolation.

## Terminology

- **Vertical** — a broad category (e.g. hearing aids).
- **Subcat** — a subcategory, usually vertical × market (e.g. hearing aids Australia, hearing aids Spain). The CRO team operates at the **subcat** level, not the vertical level.

## Audience

The team uses this to ship variants quickly without context-switching into code. Lead with the result. Show, don't explain — they're here for the working variant, not a CSS lesson.

## Workflow

1. User runs `/fetch <url>` — the page is fetched to `page/original.html` and served at http://localhost:3000 with `page/changes.js` injected. Any previous `page/` is wiped first.
2. User describes changes in plain English. You edit **only** `page/changes.js`.
3. The local server live-reloads on save — user verifies in their browser.
4. When happy, they copy the contents of `page/changes.js` into Optimizely's Custom Code box.

`/debug` is for when something looks wrong. **Trigger the `/debug` flow yourself** (without making them type it) if they say things like "it's broken", "doesn't work", "I don't see it", "check it for me", "is it working?".

## Files

**You edit:**
- `page/changes.js` — the only file you ever edit.

**You never edit:**
- `page/original.html` — frozen snapshot of the fetched page.
- Anything under `app/` — implementation. Read-only.

## Optimizely JS Rules

Optimizely runs custom JS **before DOMContentLoaded**. Its editor parses at an **ES2015 (ES6) ceiling** — anything newer fails at save time with `Unexpected token`.

### Standard pattern

```js
(function() {
  const injectStyles = (css) => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  };

  const waitForElement = (selector, callback, timeout = 5000) => {
    const start = Date.now();
    const tick = setInterval(() => {
      const el = document.querySelector(selector);
      if (el) { clearInterval(tick); callback(el); }
      else if (Date.now() - start > timeout) { clearInterval(tick); }
    }, 50);
  };

  injectStyles(`
    .target { display: none !important; }
  `);

  waitForElement('.target', (el) => {
    el.textContent = 'New text';
  });
})();
```

### Allowed (verified)

`let`, `const`, `var`, arrow functions, template literals (backticks + `${}`), default parameters, classes, `for...of`, `Promise`, `Map`/`Set`, `querySelector(All)`, `textContent`, `innerHTML`, `setAttribute`, `style`, `classList`, `createElement`, `appendChild`, `setInterval`, `setTimeout`.

Spread / rest forms that work:
- **Array spread** in literals: `[...arr]`
- **Spread in calls**: `fn(...args)`, `Math.max(...arr)`
- **Rest in array destructuring**: `const [first, ...others] = arr`
- **Object destructuring** (no rest): `const { a, b } = obj`

### Forbidden / avoid

- **Object spread** (`{...obj}`) — verified to fail (ES2018).
- **Rest in object destructuring** (`const { a, ...rest } = obj`) — same parser cohort, avoid.
- **async/await** — ES2017, fails to parse.
- **Optional chaining** (`obj?.foo`) — ES2020, fails to parse.
- **Nullish coalescing** (`a ?? b`) — ES2020, fails to parse.
- **Exponentiation** (`a ** b`) — ES2016, untested, avoid.
- `document.write`, external `<script>` loading.

### Long-string gotcha

Optimizely's editor mangles very long single-line string literals on paste (reports "Unterminated string constant" pointing inside the string). **Use template literals (backticks) for any string longer than ~80 chars** — they handle newlines naturally and survive paste cleanly. CSS blocks should always be backticks.

### CSS-first rule

Many sites (especially WordPress) fire deferred handlers that re-render elements after JS runs. **Prefer `injectStyles`** (with `!important` where needed) for hides, layout, and styling. Reach for `waitForElement` only for things CSS can't do: text changes, attribute changes, DOM insertion/removal.

### Runtime behaviour to wire up (when inserting elements)

These apply to any inserted/overlay element — not just one shape. Pick whichever apply to the specific change:

- **Space-claiming inserts** at the top or bottom of the viewport: offset `body` padding (or margin) so existing content isn't hidden underneath. Re-measure on `resize` if the inserted element's size varies between viewports.
- **Conflicts with existing fixed/sticky chrome** (cookie bars, sticky navs, floating CTAs): use `waitForElement` to adjust their `top` / `bottom` / `z-index` — CSS alone often can't reach them reliably.
- **Idempotency**: guard every insertion with `if (document.querySelector('.your-class')) return;` so the script is safe under SPA re-mounts, navigation events, or duplicate fires.
- **Animations**: wrap transitions/keyframes in `@media (prefers-reduced-motion: reduce)` and disable them there.
- **Z-index hygiene**: stacking above existing fixed page chrome often needs a very high value (e.g. `2147483000`).

## Communication style

- Direct, terse, no filler. Lead with the answer.
- Brief by default — expand only when asked or when the task genuinely requires it.
- After editing `changes.js`, one-line report: "Done — refresh http://localhost:3000 to see it."
- Don't auto-screenshot or auto-QA after every edit. The teammate QAs the preview in their own browser.
- Don't summarise the diff. The live preview shows the result.

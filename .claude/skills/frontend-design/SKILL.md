---
name: frontend-design
description: Create distinctive, production-grade visual changes for Optimizely A/B test variants by editing page/changes.js directly. Use this skill when the user asks to add or restyle any visual element on the fetched page — banners, CTAs, modals, sticky bars, layout shifts, new components, restyled buttons, copy-with-styling. NOT for pure deletions ("hide X") or text-only edits, which don't need design thinking. Generates creative, polished code that avoids generic AI aesthetics.
---

Based on the canonical Anthropic frontend-design skill, adapted for this workflow's single-file output target. The aesthetic guidance is unmodified — the only additions are the output contract for editing `page/changes.js` in an Optimizely-compatible way.

This skill guides creation of distinctive, production-grade visual changes that avoid generic "AI slop" aesthetics. Implement real working code in `page/changes.js` with exceptional attention to aesthetic details and creative choices.

The user is modifying a page already fetched into `page/original.html`. Your job is to produce the variant JS in `page/changes.js` that — once pasted into Optimizely's Custom Code box — applies the change live.

## Output contract — read first

- Edit exactly **one** file: `page/changes.js`.
- Do **not** create files anywhere else. No `spec.html`, no `preview.html`, no `notes.md`, nothing under `.claude/skills/**` or `page/` other than `changes.js`.
- Do **not** stop after producing HTML+CSS as a "spec". The deliverable IS the working changes.js — translate as you design, not after.
- When `page/changes.js` is updated, your final reply is one line: `Done — refresh http://localhost:3000 to see it.` Then stop. Do not summarise the design.
- Do not auto-QA. Never call `webapp-testing` or any `chrome-devtools` MCP tool after editing. The user QAs the preview themselves.
- Stay within the JS rules in `CLAUDE.md` (ES2015 ceiling — no object spread, async/await, optional chaining, nullish coalescing). Use `injectStyles` for CSS and `waitForElement` for DOM ops — both helpers are pre-defined in every starter `changes.js`.

## Scope discipline — only touch what was asked

The aesthetic guidance below is for executing **the requested change** with high quality. It is **not** a license to redesign the surrounding page.

- Modify only the element(s) the user named. If they asked for a banner, ship the banner — do not also rewrite the article headline, restyle the existing CTA, or "improve" neighbouring sections.
- If you spot something else that looks suboptimal on the page, **leave it alone** unless the user asked. Flag it in your reply for them to decide on next time.
- Pulling brand cues (palette, typography) from the existing page is encouraged. **Replacing** existing brand elements is not, unless explicitly requested.
- When in doubt, prefer the smaller intervention. The user can always ask for more.

## Pull project context first (cheap, do not skip)

Before committing to a direction, look at what the existing page is. Read or grep `page/original.html` for:
- Existing palette (hex colors used by the brand).
- Existing typography (font-family declarations).
- `dataLayer` brand/subcategory hints if present (e.g. `"brand":"…","subcategory":"…"`).

Anchor design choices in what's already there. The variant should feel like part of the site, not a foreign element — unless the brief is explicitly to break with the brand.

---

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code in `page/changes.js` that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font. Load via Google Fonts inside `injectStyles` using `@import` at the very top of the CSS string.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions. Focus on high-impact moments: one well-orchestrated entrance with staggered reveals creates more delight than scattered micro-interactions. Use hover states that surprise. Always wrap in `@media (prefers-reduced-motion: reduce)` to disable for users who request reduced motion.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density. Match composition complexity to the surface (a sticky banner is not the place for diagonal flow; a hero overhaul is).
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

## Wiring runtime behaviour

Designs imply behaviour the brief won't always spell out. When inserting elements, wire whichever of these apply:
- **Space-claiming inserts** at the top or bottom of the viewport: offset `body` padding/margin so existing content isn't hidden underneath. Re-measure on `resize` if the inserted element's size varies between viewports.
- **Conflicts with existing fixed/sticky chrome** (cookie bars, sticky navs, floating elements): use `waitForElement` to adjust their `top`/`bottom`/`z-index` — CSS alone often can't reach them reliably.
- **Idempotency**: guard every insertion with `if (document.querySelector('.your-class')) return;` so the script is safe under SPA re-mounts or duplicate fires.
- **Z-index hygiene**: stacking above existing fixed page chrome often needs a very high value (e.g. `2147483000`).

## Stop conditions

- `page/changes.js` is written → reply with the single line `Done — refresh http://localhost:3000 to see it.` and stop.
- Do not write to any other file. Do not call `webapp-testing` or `chrome-devtools` MCP. Do not screenshot. Do not summarise.

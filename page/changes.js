// Optimizely Custom JS — paste this into the JS box in Optimizely when done.
// ES2015 (ES6) syntax only. AVOID: object spread {...x}, async/await, optional chaining (?.), nullish coalescing (??).
// Optimizely runs this BEFORE DOMContentLoaded — use waitForElement in the experiment section below.

// ── Framework (do not edit) ────────────────────────────────────────────────
// top-level const: NOT on window. Do not convert to a function declaration.
const _cro = (() => {
    const findInAddedNodes = (addedNodes, selector) => {
        for (const node of addedNodes) {
            if (node.nodeType !== 1) continue;
            return node.matches(selector) ? node : node.querySelector(selector);
        }
        return null;
    };

    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) { resolve(el); return; }
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    const found = findInAddedNodes(mutation.addedNodes, selector);
                    if (found) { clearTimeout(timer); observer.disconnect(); resolve(found); return; }
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    };

    return { waitForElement };
})();

// ── Experiment (edit here) ─────────────────────────────────────────────────
(() => {
    const { waitForElement } = _cro;

    // waitForElement('.hero h1').then(function(el) {
    //   el.textContent = 'New headline';
    // });
})();

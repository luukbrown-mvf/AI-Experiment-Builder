// Optimizely Custom JS — paste this into the JS box in Optimizely when done.
// ES2015 (ES6) syntax only. AVOID: object spread {...x}, async/await, optional chaining ?., nullish ??.
// Optimizely runs this BEFORE DOMContentLoaded — use waitForElement for DOM changes.
(() => {
    // Returns a Promise. Use .then() to run code after. Use Promise.all([...]) for multiple elements.
    const waitForElement = (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const el = document.querySelector(selector);
            if (el) {
                resolve(el);
                return;
            }
            const observer = new MutationObserver(() => {
                const found = document.querySelector(selector);
                if (found) {
                    clearTimeout(timer);
                    observer.disconnect();
                    resolve(found);
                }
            });
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true,
            });
            const timer = setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout: ${selector}`));
            }, timeout);
        });
    };

    // waitForElement('.hero h1').then(function(el) {
    //   el.textContent = 'New headline';
    // });
})();

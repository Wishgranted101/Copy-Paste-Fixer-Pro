/**
 * Copy-Paste Fixer Pro - Content Script
 * 
 * This script is injected into the page to re-enable copy, paste, and selection.
 * Unlike other extensions, it does NOT intercept keyboard events (keydown, keyup)
 * to avoid breaking site-specific shortcuts like YouTube's spacebar or Discord's Enter key.
 */

(function() {
    // 1. CSS Injection: Passive fix for user-select
    const style = document.createElement('style');
    style.innerHTML = `
        * {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
    `;
    document.head.appendChild(style);

    // 2. Selective Event Handling: Only target copy-protection events
    const eventsToUnblock = [
        'copy',
        'cut',
        'paste',
        'selectstart',
        'contextmenu'
    ];

    const handler = (e) => {
        e.stopPropagation();
        return true;
    };

    eventsToUnblock.forEach(eventType => {
        // Remove existing listeners if possible (though we can't easily do that for anonymous ones)
        // Instead, we add our own at the capture phase to stop propagation
        document.addEventListener(eventType, handler, true);
        
        // Also nullify the inline handlers
        document['on' + eventType] = null;
    });

    console.log('Copy-Paste Fixer Pro: Active on this site.');
})();

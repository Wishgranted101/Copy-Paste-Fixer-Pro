/**
 * Copy-Paste Fixer Pro - Background Service Worker
 * 
 * Handles the badge state and coordinates script injection.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "updateBadge") {
        const text = request.enabled ? "ON" : "";
        const color = request.enabled ? "#4CAF50" : "#808080";
        
        chrome.action.setBadgeText({
            text: text,
            tabId: sender.tab.id
        });
        
        chrome.action.setBadgeBackgroundColor({
            color: color,
            tabId: sender.tab.id
        });
    }
});

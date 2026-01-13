document.addEventListener('DOMContentLoaded', async () => {
    const toggleBtn = document.getElementById('toggleBtn');
    const statusText = document.getElementById('status');

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const domain = new URL(tab.url).hostname;

    // Check if enabled for this domain
    chrome.storage.local.get([domain], (result) => {
        const isEnabled = result[domain] || false;
        updateUI(isEnabled);
    });

    toggleBtn.addEventListener('click', () => {
        chrome.storage.local.get([domain], (result) => {
            const newState = !result[domain];
            
            // Save state
            chrome.storage.local.set({ [domain]: newState }, () => {
                updateUI(newState);
                
                if (newState) {
                    // Inject the fixer script
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ['content_script.js']
                    });
                    
                    // Update badge
                    chrome.action.setBadgeText({ text: "ON", tabId: tab.id });
                    chrome.action.setBadgeBackgroundColor({ color: "#4CAF50", tabId: tab.id });
                } else {
                    // Reload to remove effects (simplest way)
                    chrome.tabs.reload(tab.id);
                    chrome.action.setBadgeText({ text: "", tabId: tab.id });
                }
            });
        });
    });

    function updateUI(isEnabled) {
        if (isEnabled) {
            toggleBtn.textContent = "Disable on this site";
            toggleBtn.classList.add('disabled');
            statusText.textContent = "Currently: Active";
        } else {
            toggleBtn.textContent = "Enable on this site";
            toggleBtn.classList.remove('disabled');
            statusText.textContent = "Currently: Inactive";
        }
    }
});

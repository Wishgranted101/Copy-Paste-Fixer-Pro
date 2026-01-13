document.getElementById('activate').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['content_script.js']
  });

  document.getElementById('status').innerText = "Status: Active!";
  document.getElementById('activate').innerText = "Re-run Fix";
});

// V3, Promise-based, async/await
// async function sendScanMessage() {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.tabs.sendMessage(tab.id, { action: "scanAndDownload" });
// }

// V2, callback-based
function sendScanMessage() {
    chrome.tabs.query({ active: true, currentWindow: true },
        ([tab]) => chrome.tabs.sendMessage(tab.id, { action: "scanAndDownload" })
    );
}

document.getElementById("scanButton").addEventListener("click", sendScanMessage);
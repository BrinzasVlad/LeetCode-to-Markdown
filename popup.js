// V3, Promise-based, async/await
// async function sendScanMessage() {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: [ "pageScript.js" ]
//     });
// }

// V2, callback-based
function sendScanMessage() {
    chrome.tabs.query({ active: true, currentWindow: true },
        ([tab]) => chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [ "pageScript.js" ]
        })
    );
}

document.getElementById("scanButton").addEventListener("click", sendScanMessage);
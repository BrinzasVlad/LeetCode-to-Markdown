// Click-on-extension-item-to-use version
// To enable:
// - uncomment this code
// - remove "default_popup": "popup.html" from "action" in manifest.json
// - add "default_title": "Click to save description as markdown" to "action" in manifest.json
//
// Listen for extension icon being clicked
// chrome.action.onClicked.addListener((tab) => {
//     chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: [ "pageScript.js" ]
//     });
// })

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.action === "download") {

        // V3, Promise-based, .then()
        // chrome.downloads.download({
        //     url: message.url,
        //     filename: message.filename
        // }.then(() => {
        //     sendResponse({ status: "done" });
        // }));

        // V2, callback-based
        chrome.downloads.download( { url: message.url, filename: message.filename },
            (_downloadId) => sendResponse( { status: "done" } )
        );

        return true; // Required for async sendResponse
    }
});
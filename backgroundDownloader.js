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
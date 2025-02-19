// Consider injecting this via something like
// await chrome.scripting.executeScript({
//     target: { tabId: tab.id },
//     files: ["pageScript.js"]
// });
// to handle the fact that otherwise it won't work unless you refresh the page.

chrome.runtime.onMessage.addListener((message, _sender, _sendResponse) => {
    if (message.action === "scanAndDownload") {
        // const description = document.querySelector(".description"); // Adjust selector
        //const markdown = convertToMarkdown(description.innerText);
        //downloadMarkdown(markdown);
        downloadMarkdown("Hello!");
    }
});

function convertToMarkdown(text) {
    // Add your conversion logic here
    return text; // Placeholder
}

function downloadMarkdown(markdown) {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // V3, Promise-based, .then()
    // chrome.runtime.sendMessage({ action: "download", url: url, filename: "ReadMe.md" }).
    //     then( (_response) => {
    //         URL.revokeObjectURL(url);
    //     });

    chrome.runtime.sendMessage( { action: "download", url: url, filename: "ReadMe.md" },
        (_response) => {
            URL.revokeObjectURL(url);
        }
    )
}
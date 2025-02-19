
downloadMarkdown(convertToMarkdown("Hello!"));

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
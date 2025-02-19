
downloadMarkdown(pageToMarkdown());

function pageToMarkdown() {
    const problemTitle = document.querySelector(".text-title-large").firstChild.innerText;
    const problemURL = document.querySelector(".text-title-large").firstChild.href;

    const problemDescriptionHTML = document.querySelector("[data-track-load=description_content]").innerHTML;
    
    const markdown = assembleMarkdown(problemTitle, problemURL, problemDescriptionHTML);

    return markdown;
}
function assembleMarkdown(title, url, descriptionHTML) {
    let markdown = "";

    markdown += `(${title})[${url}]\n\n`;

    markdown += descriptionHTML;

    return markdown;
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
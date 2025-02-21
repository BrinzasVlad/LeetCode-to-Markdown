downloadMarkdown(pageToMarkdown());

function pageToMarkdown() {
    const problemTitle = document.querySelector(".text-title-large").firstChild.innerText;
    const problemURL = document.querySelector(".text-title-large").firstChild.href;

    const problemDescriptionHTMLElement = document.querySelector("[data-track-load=description_content]");
    
    const markdown = assembleMarkdown(problemTitle, problemURL, problemDescriptionHTMLElement);

    return markdown;
}
function assembleMarkdown(title, url, descriptionHTMLElement) {
    let markdown = "";

    markdown += `# [${title}](${url})\n\n`;

    markdown += descriptionToMarkdown(descriptionHTMLElement);

    return markdown;
}

function descriptionToMarkdown(descriptionHTMLElement) {
    // Place to do any final one-time-only adjustments on the result

    let markdown = nodeToMarkdown(descriptionHTMLElement);
    markdown = markdown.trim(); // Remove dangling start/end whitespace

    return markdown;
}

function nodeToMarkdown(htmlNode) {
    if (htmlNode.nodeType === Node.TEXT_NODE) {
        // Text nodes have ONLY textContent; innerText won't work for the processing here

        // Skip &nbsp;-only elements inside a <p>; they're only used to force newlines to appear in HTML
        if (htmlNode.textContent === '\xA0' && htmlNode.parentNode?.tagName === "P") return '';  

        // Skip extra newlines before unordered lists (<li> elements include their own)
        if (htmlNode.textContent.includes('\n') && htmlNode.nextElementSibling?.tagName === "UL") {
            return htmlNode.textContent.replaceAll('\n', '');
        }

        // Trim newlines after unordered lists down to just one // TODO: does this break things?
        if (htmlNode.textContent.includes('\n\n') && htmlNode.previousElementSibling?.tagName === "UL") {
            return htmlNode.textContent.replaceAll(/[\n]{2,}/g, '\n');
        }

        // Trim newlines before and after <pre> quote-block: we only want one, not two
        if (htmlNode.textContent === "\n\n" && htmlNode.nextElementSibling?.tagName === "PRE") return '\n';
        if (htmlNode.textContent === "\n\n" && htmlNode.previousElementSibling?.tagName === "PRE") return '\n';

        // Trim newlines before and after <pre>-like <div>: we only want one, not two
        if (htmlNode.textContent === "\n\n"
        && htmlNode.nextElementSibling?.tagName === "DIV"
        && htmlNode.nextElementSibling?.classList.contains("example-block")) {
            return '\n';
        }
        if (htmlNode.textContent === "\n\n"
        && htmlNode.nextElementSibling?.tagName === "DIV"
        && htmlNode.nextElementSibling?.classList.contains("example-block")) {
            return '\n';
        }

        // When tabs are used right before a list item, turn them into the appropriate amount of
        // double spaces for markdown list nesting (0 for base level, 2 for one nesting in, etc.)
        if (htmlNode.textContent.includes('\t') && htmlNode.nextElementSibling?.tagName === "LI") {
            return htmlNode.textContent.replaceAll(/\t+/g, tabs => "  ".repeat(tabs.length - 1));
        }

        // Otherwise, this is probably just a normal bit of text; return as-is
        return htmlNode.textContent;
    }


    const innerMarkdown = Array.from(htmlNode.childNodes).map(nodeToMarkdown).join('');

    // Description as-given already contains lots of newlines in text nodes, so there's no need to add more
    const nodeTagName = htmlNode.tagName.toLowerCase();
    switch(nodeTagName) {
        case 'p':
            return innerMarkdown;
        case 'span':
            return innerMarkdown;
        case 'strong':
            return insertFormatMarkers(innerMarkdown, "**");
        case 'em':
            return insertFormatMarkers(innerMarkdown, "_");
        case 'u':
            return insertFormatMarkers(innerMarkdown, "<ins>", "</ins>");
        case 'sub':
            return textToSubscript(innerMarkdown);
        case 'sup':
            return textToSuperscript(innerMarkdown);
        case 'code':
            return `\`${innerMarkdown}\``;
        case 'div':
            // Two cases for <div>: either it's the root <div>
            // (case in which we just return its contents), or...
            if (!htmlNode.classList.contains("example-block"))
                return innerMarkdown;

            // ...it's a <div class="example-block">, which works like a <pre>
            // (case in which fallthrough to <pre> case)
        case 'pre':
            return adjustPreMarkdown(innerMarkdown);
        case 'ul':
            return innerMarkdown; // tabs are handled in the text-node handler
        case 'li':
            return `- ${innerMarkdown}`;
        default:
            // Skip and log anything we don't understand
            console.log(`Unhandled tag: ${nodeTagName}\nContents: ${innerMarkdown}`);
            return '';
    }
}

function adjustPreMarkdown(preInnerMarkdown) {
    // Quote-style blocks, marked here with <pre>, are obtained in GitHub markdown
    // by starting every line with a > character. A congruent set of >-starting lines
    // will be treated as a singular quote block.

    const adjustedPreMarkdown = preInnerMarkdown
        .trim() // remove start/end whitespace
        .replaceAll('\t', '') // all relevant tabs should've been converted to spaces by now
        .replaceAll(/[\n]{3,}/g, "\n\n") // no more than one blank line between paragraphs
        .replaceAll('\n', "\n> "); // > at the start of every new line

    return `> ${adjustedPreMarkdown}`; // Finally, add > for the very first line of the block
}

function insertFormatMarkers(text, startFormatMarker, endFormatMarker = startFormatMarker) {
    // Insert the format markers around the text, but skipping any
    // leading / trailing whitespace (that causes markdown to break).
    //
    // I didn't find a nice enough version using JS built-ins, so I wrote my own.

    let startIndex = 0, endIndex = text.length - 1;

    // Find first non-whitespace index
    while (/\s/.test(text[startIndex])) startIndex++;

    // Find last non-whitespace index
    while (/\s/.test(text[endIndex])) endIndex--;
    endIndex++; // Set it right *after* the character

    return text.slice(0, startIndex)         // Leading whitespace
         + startFormatMarker                 // Format marker
         + text.slice(startIndex, endIndex)  // Actual text
         + endFormatMarker                   // Format marker
         + text.slice(endIndex);             // Trailing whitespace
}

function textToSubscript(text) {
    const subscriptMap = {
        '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
        '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
        'n': 'ₙ', 'k': 'ₖ'
    };

    return text.replaceAll(/[0-9nk]/g, c => subscriptMap[c]);
}

function textToSuperscript(text) {
    const superscriptMap = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹'
    };

    return text.replaceAll(/[0-9nk]/g, c => superscriptMap[c]);
}

function downloadMarkdown(markdown) {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);

    // V3, Promise-based, .then()
    // chrome.runtime.sendMessage({ action: "download", url: url, filename: "README.md" }).
    //     then( (_response) => {
    //         URL.revokeObjectURL(url);
    //     });

    chrome.runtime.sendMessage( { action: "download", url: url, filename: "README.md" },
        (_response) => {
            URL.revokeObjectURL(url);
        }
    )
}
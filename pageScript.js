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
        // Skip &nbsp;-only elements inside a <p>; they're only used to force newlines to appear in HTML
        if (htmlNode.textContent === '\xA0' && htmlNode.parentNode.tagName === "P") return '';  

        // Skip extra newlines before unordered lists
        if (htmlNode.textContent === "\n\n" && htmlNode.nextElementSibling.tagName === "UL") return '';

        // Trim newlines before and after <pre> quote-block: we only want one, not two
        if (htmlNode.textContent === "\n\n" && htmlNode.nextElementSibling.tagName === "PRE") return '\n';
        if (htmlNode.textContent === "\n\n" && htmlNode.previousElementSibling.tagName === "PRE") return '\n';

        return htmlNode.textContent; // Text nodes have ONLY textContent; innerText won't work
    }

    const innerMarkdown = Array.from(htmlNode.childNodes).map(nodeToMarkdown).join('');

    // Description as-given already contains lots of newlines in text nodes, so there's no need to add more
    const nodeTagName = htmlNode.tagName.toLowerCase();
    switch(nodeTagName) {
        case 'div':
            return innerMarkdown; // Root element is a <div>
        case 'p':
            return innerMarkdown;
        case 'strong':
            return `**${innerMarkdown}**`;
        case 'em':
            return `_${innerMarkdown}_`;
        case 'u':
            return `<ins>${innerMarkdown}</ins>`
        case 'sub':
            return textToSubscript(innerMarkdown);
        case 'sup':
            return textToSuperscript(innerMarkdown);
        case 'code':
            return `\`${innerMarkdown}\``;
        case 'pre':
            return adjustPreMarkdown(innerMarkdown);
        case 'ul':
            // Remove tabs from the list; mardown formatting is enough
            return innerMarkdown.replaceAll('\t', '');
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
    // by starting them with >, having all lines start with a space, and ending each
    // line with a double space if the quote block should continue.
    //
    // Therefore, we add > at the start, and replace all non-end-of-block newlines
    // with double-space (to indicate block continues) plus newline (for new line)
    // plus single space (the starting space of the next line).
    //
    // ( What the REGEX does is identify non-end-of-block newlines by them having
    // some extra character after, formatting them as per the above, then putting
    // the extra character back in. We need to manually select and reinsert the
    // extra character, because JavaScript regexes do not work with non-capturing
    // groups (e.g. something like /\n(?:.)/g). )

    return `> ${ preInnerMarkdown.replaceAll(/\n(.)/g, "  \n $1")}`;
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
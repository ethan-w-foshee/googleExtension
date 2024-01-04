let url
let title

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}



function addBookmark() {
    chrome.bookmarks.create(
        {
            parentId: '1',
            title: title,
            url: url
        },
    );
}

function newTab() {
    chrome.tabs.create({ url: './tab.html' });
}
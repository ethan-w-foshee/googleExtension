importScripts("./foo.js")

chrome.storage.sync.get('bookmarkListStore', function (bmks) {
    // check if data exists.
    if (bmks) {
        bookmarkListStore = bmks.bookmarkListStore;
    }
});



// Keybind command
chrome.commands.onCommand.addListener((command) => {
    if (command === "add-bookmark") {
        getCurrentTab()
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            url = tabs[0].url;
            title = tabs[0].title;
            addBookmark()
        });
    }
    if (command === "open-manager") {
        newTab()
    }
});

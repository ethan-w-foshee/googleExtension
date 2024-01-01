let bookmarkListStore
let url

chrome.storage.sync.get('bookmarkListStore', function (bmks) {
    // check if data exists.
    if (bmks) {
        bookmarkListStore = bmks.bookmarkListStore;
    }
});

// Keybind command
chrome.commands.onCommand.addListener((command) => {
    storeStuff()
});

function storeStuff() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        url = tabs[0].url;
    });
    popupCenter()
}

function popupCenter() {
    let height = 200
    let width = 350
    let left = 250
    let top = 50
    chrome.tabs.create({ url: './popup.html', type: "popup" });
}
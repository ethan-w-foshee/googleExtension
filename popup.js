// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
let url
let title
let tagsArr

async function getCurrentTab() {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
  url = tabs[0].url;
  title = tabs[0].title;
});

// Add a bookmark for current page
function addBookmark() {
  tagsArr = document.getElementById('tagsListed').value
  chrome.bookmarks.create(
    {
      parentId: '1',
      title: title,
      url: url,
    },
    (result) => {
      result.tags = tagsArr
      updateStorage(result)
      location.reload(); // Refresh the popup
    }
  );
}

// Remove the bookmark for current page
function removeBookmark() {
  chrome.bookmarks.search({ url: url }, (results) => {
    for (const result of results) {
      if (result.url === url) {
        chrome.bookmarks.remove(result.id, () => { });
      }
    }
    location.reload();
  });
}

// Add click event listeners to the buttons
document.getElementById('addButton').addEventListener('click', addBookmark);
document.getElementById('removeButton').addEventListener('click', removeBookmark);
document.getElementById('newTab').addEventListener('click', newTab)
document.getElementById('addTags').addEventListener('click', addBookmark);

function newTab() {
  chrome.tabs.create({ url: './tab.html' });
}

async function updateStorage(bookmark) {
  // bookmark = {bookmark: bookmark, "tags" : tags}
  let bookmark_id = bookmark.id
  let bookmarkListStore
  // bookmark = bookmark + tags
  chrome.storage.sync.get('bookmarkListStore', function (bmks) {
    // check if data exists.
    if (bmks) {
      bookmarkListStore = bmks.bookmarkListStore;
      bookmarkListStore.push(bookmark);
      chrome.storage.sync.set({ "bookmarkListStore": bookmarkListStore });
    }
  });
  if (Array.isArray(bookmarkListStore)) {

  }
  // else {
  //   chrome.bookmarks.getTree((tree) => {
  //     let nodes = tree[0].children;
  //     chrome.storage.sync.set({"bookmarkListSore": nodes})
  //   });
  // }
}
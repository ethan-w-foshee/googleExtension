// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
let url
let title

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

chrome.bookmarks.getTree((tree) => {
  const bookmarkList = document.getElementById('bookmarkList');
  displayBookmarks(tree[0].children, bookmarkList);
});

// Recursively display the bookmarks
function displayBookmarks(nodes, parentNode) {
  for (const node of nodes) {
    // If the node is a bookmark, create a list item and append it to the parent node
    if (node.url) {
      updateStorage(node)
      const listItem = document.createElement('li');
      const listLink = document.createElement('a');
      // Set some attributes
      listLink.href = node.url;
      listLink.target = "_blank"
      listItem.textContent = node.title;
      // Append the child
      listLink.appendChild(listItem);
      parentNode.appendChild(listLink);
    }

    // If the node has children, recursively display them
    if (node.children) {
      const sublist = document.createElement('ul');
      parentNode.appendChild(sublist);
      displayBookmarks(node.children, sublist);
    }
  }
}

// Add a bookmark for current page
function addBookmark() {
  chrome.bookmarks.create(
    {
      parentId: '1',
      title: title,
      url: url
    },
    () => {
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

function newTab() {
  chrome.tabs.create({ url: './tab.html' });
}

async function updateStorage(bookmark) {
  // console.log(bookmark)
  let bookmark_id = bookmark.id
  let bookmarkListStore = await chrome.storage.sync.get("bookmarkListStore");
  if (typeof (bookmarkListStore.bookmarkListStore) === Array) {
    bookmarkListStore.push(bookmark_id);
    await chrome.storage.sync.set({ "bookmarkListStore": bookmarkListStore });
    await chrome.storage.sync.set({ bookmark_id: bookmark_data })
  }
  else {
    await chrome.storage.sync.set({ "bookmarkListStore": [0, 1] });
    console.log(typeof(bookmarkListStore.bookmarkListStore))
    console.log(bookmarkListStore.bookmarkListStore)
  }
  chrome.storage.sync.get("bookmarkListStore", (result) => {console.log(typeof(result.bookmarkListStore))})
}
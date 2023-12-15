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

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
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
      const listItem = document.createElement('li');
      listItem.textContent = node.title;
      parentNode.appendChild(listItem);
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
      console.log('Bookmark added');
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
document
  .getElementById('removeButton')
  .addEventListener('click', removeBookmark);

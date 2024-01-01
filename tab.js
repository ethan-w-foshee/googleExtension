// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
let url
let title
let bookmarkListStore

chrome.storage.sync.get('bookmarkListStore', function(bmks) {
    // check if data exists.
    if (bmks) {
        bookmarkListStore = bmks.bookmarkListStore;
    }
  });

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
            // Create the elements needed
            const listItem = document.createElement('li');
            const listText = document.createElement('span');
            const urlLink = document.createElement('a');
            // Give them CSS identifiers
            listText.id = "listText"
            urlLink.id = "urlLink"
            listItem.className = ""
            // Assign the URL settings
            urlLink.href = node.url;
            urlLink.textContent = node.url;
            // Assign the title
            listText.textContent = node.title;
            // Append the children to the list item
            listItem.appendChild(listText);
            listItem.appendChild(urlLink);
            // Add the list item to the list
            parentNode.appendChild(listItem);
        }

        // If the node has children, recursively display them
        if (node.children) {
            const sublist = document.createElement('ul');
            sublist.setAttribute('id', 'bookList')
            parentNode.appendChild(sublist);
            displayBookmarks(node.children, sublist);
        }
    }
}

// Add click event listeners to the buttons
document.getElementById('filterBy').addEventListener('keyup', filter)

function filter(input) {
    let filterSort = input.target.value
    let bookList = document.getElementById("bookList")
    if (filterSort != "") {
        for (let i = 0; i < bookList.children.length; i++) {
            bookList.children[i].setAttribute('id', 'hidden')
        }
        let filteredArray = document.querySelectorAll(`[class*=${filterSort}]`)
        for (let i = 0; i < filteredArray.length; i++) {
            filteredArray[i].setAttribute('id', 'shown')
        }
    }
    else {
        for (let i = 0; i < bookList.children.length; i++) {
            bookList.children[i].setAttribute('id', 'shown')
        }
    }
}

 

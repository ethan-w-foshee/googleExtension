// Search the bookmarks when entering the search keyword.
// Get the bookmarks and display them in the popup
let url
let title
let bookmarkListStore
const bookmarkList = document.getElementById('bookmarkList');

chrome.storage.sync.get('bookmarkListStore', function(bmks) {
    // check if data exists.
    if (bmks) {
        bookmarkListStore = bmks.bookmarkListStore;
    }
  });

chrome.bookmarks.getTree((tree) => {
   
    displayBookmarks(tree[0].children, bookmarkList);
});

// Recursively display the bookmarks
function displayBookmarks(nodes, parentNode) {
    let i = 0
    for (const node of nodes) {
        // If the node is a bookmark, create a list item and append it to the parent node
        if (node.url) {
            // Create the elements needed
            const listItem = document.createElement('li');
            const listText = document.createElement('span');
            const delButton = document.createElement('button');
            const urlLink = document.createElement('a');
            // Give them CSS identifiers
            listText.className = "listText"
            urlLink.className = "urlLink"
            listItem.className = ""
            delButton.className = "delButton"
            // Assign the URL settings
            urlLink.href = node.url;
            urlLink.textContent = node.url;
            // Assign the title
            listText.textContent = node.title;
            // Create the button
            delButton.textContent = "Delete";
            delButton.addEventListener('click', deleteBookmark)
            // Append the children to the list item
            listItem.appendChild(listText);
            listItem.appendChild(delButton);
            listItem.appendChild(urlLink);
            // Add the list item to the list
            parentNode.appendChild(listItem);
            // Give the list item a id for distinction
            listItem.setAttribute('id', `${i}`)
            urlLink.setAttribute('id', `${i}`)
            // Iterate variable for id
            i = i + 1;
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

// Add filter function to filter bar
document.getElementById('filterBy').addEventListener('keyup', filter)

function filter(input) {
    let filterSort = input.target.value
    let bookList = document.getElementById("bookList")
    if (filterSort != "") {
        for (let i = 0; i < bookList.children.length; i++) {
            bookList.children[i].setAttribute('class', 'hidden')
        }
        let filteredArray = document.querySelectorAll(`[class*=${filterSort}]`)
        for (let i = 0; i < filteredArray.length; i++) {
            filteredArray[i].setAttribute('class', '')
        }
    }
    else {
        for (let i = 0; i < bookList.children.length; i++) {
            bookList.children[i].setAttribute('class', '')
        }
    }
}
function deleteBookmark() {
    console.log(this.parentNode.children[2].href)
    chrome.bookmarks.search({ url: url }, (results) => {
        for (const result of results) {
          if (result.url === this.parentNode.children[2].href) {
            chrome.bookmarks.remove(result.id, () => { });
          }
        }
        location.reload();
      });
}
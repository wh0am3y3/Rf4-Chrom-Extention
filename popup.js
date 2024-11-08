document.addEventListener('DOMContentLoaded', () => {
  const bookmarkList = document.getElementById('bookmark-list');

  // Function to create a list item for each bookmark
  function createBookmarkItem(bookmark) {
    const li = document.createElement('li');
    li.textContent = bookmark.title || 'Unnamed';
    li.addEventListener('click', () => {
      chrome.tabs.create({ url: bookmark.url });
    });
    bookmarkList.appendChild(li);
  }

  // Fetch bookmarks and display them
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    function processBookmarks(nodes) {
      nodes.forEach((node) => {
        if (node.url) {
          createBookmarkItem(node);
        } else if (node.children) {
          processBookmarks(node.children);
        }
      });
    }
    processBookmarks(bookmarkTreeNodes);
  });

  // Open example links in new tabs
  document.getElementById('bookmark-google').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.google.com' });
  });

  document.getElementById('bookmark-wikipedia').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.wikipedia.org' });
  });

  document.getElementById('bookmark-github').addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://www.github.com' });
  });
});


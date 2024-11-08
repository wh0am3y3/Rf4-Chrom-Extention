document.addEventListener('DOMContentLoaded', () => {
  const bookmarkList = document.getElementById('bookmark-list');
  const viewTab = document.getElementById('view-tab');
  const addTab = document.getElementById('add-tab');
  const viewBookmarks = document.getElementById('view-bookmarks');
  const addBookmark = document.getElementById('add-bookmark');
  const addBookmarkBtn = document.getElementById('add-bookmark-btn');
  const bookmarkTitle = document.getElementById('bookmark-title');
  const bookmarkURL = document.getElementById('bookmark-url');

  // Default bookmarks to initialize
  const defaultBookmarks = [
    { title: 'RF4 main forum', url: 'https://rf4game.com/forum/' },
    { title: 'KiltedJock Spreadsheet', url: 'https://docs.google.com/spreadsheets/u/0/d/1zP41qcHAHKnqYV4r6JuJ5vrqMeux2FLN9pLY3C54_Uc/htmlview#' },
    { title: 'RF4 Interactive maps | Caffe orders', url: 'https://rf4.info/en/' },
  ];

  // Initialize storage with default bookmarks if none exist
  chrome.storage.sync.get(['bookmarks'], (result) => {
    if (!result.bookmarks) {
      chrome.storage.sync.set({ bookmarks: defaultBookmarks }, () => {
        console.log("Default bookmarks have been added to storage.");
        loadBookmarks();
      });
    } else {
      loadBookmarks();
    }
  });

  // Function to load bookmarks from storage and display them
  function loadBookmarks() {
    chrome.storage.sync.get(['bookmarks'], (result) => {
      bookmarkList.innerHTML = ''; // Clear the list
      const bookmarks = result.bookmarks || [];
      bookmarks.forEach((bookmark) => createBookmarkItem(bookmark));
    });
  }

  // Function to create a list item for each bookmark
  function createBookmarkItem(bookmark) {
    const li = document.createElement('li');
    li.textContent = bookmark.title || 'Unnamed';
    li.addEventListener('click', () => {
      chrome.tabs.create({ url: bookmark.url });
    });
    bookmarkList.appendChild(li);
  }

  // Switch tabs
  function switchTab(tabToShow) {
    if (tabToShow === 'view') {
      viewTab.classList.add('active');
      addTab.classList.remove('active');
      viewBookmarks.style.display = 'block';
      addBookmark.style.display = 'none';
    } else if (tabToShow === 'add') {
      addTab.classList.add('active');
      viewTab.classList.remove('active');
      addBookmark.style.display = 'block';
      viewBookmarks.style.display = 'none';
    }
  }

  // Attach event listeners to tabs
  viewTab.addEventListener('click', () => switchTab('view'));
  addTab.addEventListener('click', () => switchTab('add'));

  // Add a new bookmark
  addBookmarkBtn.addEventListener('click', () => {
    const title = bookmarkTitle.value;
    const url = bookmarkURL.value;

    if (title && url) {
      chrome.storage.sync.get(['bookmarks'], (result) => {
        const bookmarks = result.bookmarks || [];
        const newBookmark = { title: title, url: url };

        bookmarks.push(newBookmark);
        chrome.storage.sync.set({ bookmarks: bookmarks }, () => {
          // Clear inputs
          bookmarkTitle.value = '';
          bookmarkURL.value = '';

          // Update list and switch back to view tab
          createBookmarkItem(newBookmark);
          switchTab('view');
        });
      });
    } else {
      alert("Please fill in both fields.");
    }
  });

  // Initialize to show view tab by default
  switchTab('view');
});


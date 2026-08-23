// =========================================================
// 1) DOM ELEMENTS
// =========================================================

// Main application elements
const emptyState = document.getElementById("emptyState");
const notebook = document.getElementById("notebook");

// Header buttons
const searchBtn = document.getElementById("searchBtn");
const newPageBtn = document.getElementById("newPageBtn");
const startPageBtn = document.getElementById("startPageBtn");

// Page elements
const pageTitle = document.getElementById("pageTitle");
const pageDate = document.getElementById("pageDate");
const pageCounter = document.getElementById("pageCounter");
const navigationCounter = document.getElementById("navigationCounter");
const noteContent = document.getElementById("noteContent");

// Paper style elements
const writingArea = document.querySelector(".writing-area");
const paperOptions = document.querySelectorAll(".paper-option");

// Navigation
const previousPageBtn = document.getElementById("previousPageBtn");
const nextPageBtn = document.getElementById("nextPageBtn");

// Save
const saveBtn = document.getElementById("saveBtn");
const saveStatus = document.getElementById("saveStatus");

// Page options
const optionsBtn = document.getElementById("optionsBtn");
const optionsMenu = document.getElementById("optionsMenu");

const renamePageBtn = document.getElementById("renamePageBtn");
const changePaperBtn = document.getElementById("changePaperBtn");
const clearContentBtn = document.getElementById("clearContentBtn");
const deletePageBtn = document.getElementById("deletePageBtn");

// Search
const searchOverlay = document.getElementById("searchOverlay");
const closeSearchBtn = document.getElementById("closeSearchBtn");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

// Confirmation modal
const confirmModal = document.getElementById("confirmModal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const confirmModalBtn = document.getElementById("confirmModalBtn");

// Create page modal
const createPageModal = document.getElementById("createPageModal");
const newPageTitle = document.getElementById("newPageTitle");

const modalPaperOptions =
    document.querySelectorAll(".modal-paper-option");

const cancelCreatePageBtn =
    document.getElementById("cancelCreatePageBtn");

const confirmCreatePageBtn =
    document.getElementById("confirmCreatePageBtn");


// =========================================================
// 2) APPLICATION DATA
// =========================================================

// All notebook pages are stored inside this array.
let pages = [];

// The index of the page currently being displayed.
let currentPageIndex = 0;

// The paper style selected for a new page.
let selectedNewPaper = "ruled";

// Used by the confirmation modal to know what action
// should happen after the user clicks Confirm.
let pendingAction = null;


// =========================================================
// 3) STORAGE KEY
// =========================================================

const STORAGE_KEY = "digitalNotebookPages";


// =========================================================
// 4) DATE & TIME FUNCTIONS
// =========================================================

// Returns today's date in a professional format.
// Example:
// Aug 15, 2026

function getFormattedDate() {

    const today = new Date();

    return today.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}


// Returns the current time.
// Example:
// 05:42 AM

function getFormattedTime() {

    const now = new Date();

    return now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit"
    });
}


// =========================================================
// 5) LOCAL STORAGE - LOAD DATA
// =========================================================

function loadPages() {

    const savedPages = localStorage.getItem(STORAGE_KEY);

    if (!savedPages) {
        pages = [];
        return;
    }

    try {

        pages = JSON.parse(savedPages);

    } catch (error) {

        console.error("Could not load notebook data.");

        pages = [];
    }
}


// =========================================================
// 6) LOCAL STORAGE - SAVE DATA
// =========================================================

function savePagesToStorage() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(pages)
    );
}


// =========================================================
// 7) EMPTY STATE / NOTEBOOK VISIBILITY
// =========================================================

function updateApplicationView() {

    if (pages.length === 0) {

        emptyState.style.display = "flex";
        notebook.style.display = "none";

        return;
    }

    emptyState.style.display = "none";
    notebook.style.display = "block";

    renderCurrentPage();
}


// =========================================================
// 8) CREATE PAGE OBJECT
// =========================================================

function createPage(title, paperStyle) {

    return {
        id: Date.now().toString(),

        title: title,

        content: "",

        paperStyle: paperStyle,

        date: getFormattedDate(),

        lastSaved: null
    };
}


// =========================================================
// 9) ADD NEW PAGE
// =========================================================

function addNewPage(title, paperStyle) {

    const newPage = createPage(
        title,
        paperStyle
    );

    pages.push(newPage);

    currentPageIndex = pages.length - 1;

    savePagesToStorage();

    updateApplicationView();
}


// =========================================================
// 10) RENDER CURRENT PAGE
// =========================================================

function renderCurrentPage() {

    if (pages.length === 0) {
        return;
    }

    const currentPage = pages[currentPageIndex];

    // Update title
    pageTitle.value = currentPage.title;

    // Update date
    pageDate.textContent = currentPage.date;

    // Update content
    noteContent.value = currentPage.content;

    // Update paper style
    applyPaperStyle(currentPage.paperStyle);

    // Update counters
    updatePageCounters();

    // Update save status
    updateSaveStatus(currentPage.lastSaved);
}


// =========================================================
// 11) UPDATE PAGE COUNTERS
// =========================================================

function updatePageCounters() {

    const currentNumber =
        String(currentPageIndex + 1).padStart(2, "0");

    const totalPages =
        String(pages.length).padStart(2, "0");

    const counterText =
        `Page ${currentNumber} / ${totalPages}`;

    pageCounter.textContent = counterText;

    navigationCounter.textContent = counterText;
}


// =========================================================
// 12) UPDATE SAVE STATUS
// =========================================================

function updateSaveStatus(lastSaved) {

    if (!lastSaved) {

        saveStatus.textContent =
            "Not saved yet";

        return;
    }

    saveStatus.textContent =
        `✓ Last saved: ${lastSaved}`;
}


// =========================================================
// 13) SAVE CURRENT PAGE
// =========================================================

function saveCurrentPage() {

    if (pages.length === 0) {
        return;
    }

    const currentPage = pages[currentPageIndex];

    // Get the latest values from the interface
    currentPage.title =
        pageTitle.value.trim() || "Untitled Page";

    currentPage.content =
        noteContent.value;

    currentPage.lastSaved =
        getFormattedTime();

    savePagesToStorage();

    // Keep the input synchronized
    pageTitle.value =
        currentPage.title;

    updateSaveStatus(
        currentPage.lastSaved
    );
}


// =========================================================
// 14) PAPER STYLE
// =========================================================

function applyPaperStyle(style) {

    // Remove all previous paper classes
    writingArea.classList.remove(
        "ruled",
        "grid",
        "blank"
    );

    // Add the selected paper style
    writingArea.classList.add(style);

    // Update active button
    paperOptions.forEach(option => {

        option.classList.toggle(
            "active",
            option.dataset.paper === style
        );

    });
}


// =========================================================
// 15) CHANGE PAPER STYLE
// =========================================================

function changeCurrentPaperStyle(style) {

    if (pages.length === 0) {
        return;
    }

    const currentPage = pages[currentPageIndex];

    currentPage.paperStyle = style;

    applyPaperStyle(style);

    savePagesToStorage();
}


// =========================================================
// 16) PAPER STYLE BUTTONS
// =========================================================

paperOptions.forEach(option => {

    option.addEventListener("click", () => {

        const selectedStyle =
            option.dataset.paper;

        changeCurrentPaperStyle(
            selectedStyle
        );

    });

});


// =========================================================
// 17) NEW PAGE PAPER OPTIONS
// =========================================================

modalPaperOptions.forEach(option => {

    option.addEventListener("click", () => {

        selectedNewPaper =
            option.dataset.newPaper;

        modalPaperOptions.forEach(button => {

            button.classList.remove("active");

        });

        option.classList.add("active");

    });

});


// =========================================================
// 18) CREATE PAGE MODAL
// =========================================================

function openCreatePageModal() {

    newPageTitle.value = "";

    selectedNewPaper = "ruled";

    modalPaperOptions.forEach(option => {

        option.classList.toggle(
            "active",
            option.dataset.newPaper === "ruled"
        );

    });

    createPageModal.classList.add("show");

    setTimeout(() => {
        newPageTitle.focus();
    }, 100);
}


function closeCreatePageModal() {

    createPageModal.classList.remove("show");
}


// =========================================================
// 19) CREATE PAGE BUTTONS
// =========================================================

newPageBtn.addEventListener(
    "click",
    openCreatePageModal
);


startPageBtn.addEventListener(
    "click",
    openCreatePageModal
);


cancelCreatePageBtn.addEventListener(
    "click",
    closeCreatePageModal
);


// =========================================================
// 20) CONFIRM CREATE PAGE
// =========================================================

confirmCreatePageBtn.addEventListener(
    "click",
    () => {

        const title =
            newPageTitle.value.trim();

        if (!title) {

            newPageTitle.focus();

            return;
        }

        addNewPage(
            title,
            selectedNewPaper
        );

        closeCreatePageModal();
    }
);


// =========================================================
// 21) PAGE NAVIGATION - PREVIOUS
// =========================================================

previousPageBtn.addEventListener(
    "click",
    () => {

        if (currentPageIndex === 0) {
            return;
        }

        currentPageIndex--;

        renderCurrentPage();
    }
);


// =========================================================
// 22) PAGE NAVIGATION - NEXT
// =========================================================

nextPageBtn.addEventListener(
    "click",
    () => {

        if (
            currentPageIndex >=
            pages.length - 1
        ) {
            return;
        }

        currentPageIndex++;

        renderCurrentPage();
    }
);


// =========================================================
// 23) SAVE BUTTON
// =========================================================

saveBtn.addEventListener(
    "click",
    saveCurrentPage
);


// =========================================================
// 24) PAGE TITLE UPDATE
// =========================================================

// The title can be edited at any time.
// We do not save automatically.
// The user must press Save.

pageTitle.addEventListener(
    "input",
    () => {

        if (pages.length === 0) {
            return;
        }

        pages[currentPageIndex].title =
            pageTitle.value;
    }
);


// =========================================================
// 25) PAGE CONTENT UPDATE
// =========================================================

// Update the current page data while the user is typing.
// The data is not permanently saved until Save is pressed.

noteContent.addEventListener(
    "input",
    () => {

        if (pages.length === 0) {
            return;
        }

        pages[currentPageIndex].content =
            noteContent.value;
    }
);


// =========================================================
// 26) PAGE OPTIONS MENU
// =========================================================

optionsBtn.addEventListener(
    "click",
    () => {

        optionsMenu.classList.toggle(
            "show"
        );

    }
);


// =========================================================
// 27) CLOSE OPTIONS WHEN CLICKING OUTSIDE
// =========================================================

document.addEventListener(
    "click",
    (event) => {

        const clickedInsideOptions =
            event.target.closest(".page-options");

        if (!clickedInsideOptions) {

            optionsMenu.classList.remove(
                "show"
            );

        }

    }
);


// =========================================================
// 28) RENAME PAGE
// =========================================================

renamePageBtn.addEventListener(
    "click",
    () => {

        pageTitle.focus();

        pageTitle.select();

        optionsMenu.classList.remove(
            "show"
        );

    }
);


// =========================================================
// 29) CHANGE PAPER STYLE FROM OPTIONS
// =========================================================

changePaperBtn.addEventListener(
    "click",
    () => {

        optionsMenu.classList.remove(
            "show"
        );

        // Move the user's attention to
        // the paper style controls.
        document.querySelector(
            ".paper-controls"
        ).scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    }
);


// =========================================================
// 30) CONFIRMATION MODAL
// =========================================================

function openConfirmation(
    title,
    message,
    action
) {

    modalTitle.textContent = title;

    modalMessage.textContent = message;

    pendingAction = action;

    confirmModal.classList.add("show");
}


function closeConfirmation() {

    confirmModal.classList.remove("show");

    pendingAction = null;
}


// =========================================================
// 31) CANCEL CONFIRMATION
// =========================================================

cancelModalBtn.addEventListener(
    "click",
    closeConfirmation
);


// =========================================================
// 32) CONFIRM ACTION
// =========================================================

confirmModalBtn.addEventListener(
    "click",
    () => {

        if (pendingAction) {

            pendingAction();

        }

        closeConfirmation();
    }
);


// =========================================================
// 33) CLEAR PAGE CONTENT
// =========================================================

clearContentBtn.addEventListener(
    "click",
    () => {

        optionsMenu.classList.remove(
            "show"
        );

        openConfirmation(
            "Clear Page Content?",
            "All written content on this page will be removed.",
            clearCurrentPage
        );

    }
);


function clearCurrentPage() {

    if (pages.length === 0) {
        return;
    }

    pages[currentPageIndex].content = "";

    noteContent.value = "";

    savePagesToStorage();

    updateSaveStatus(
        pages[currentPageIndex].lastSaved
    );
}


// =========================================================
// 34) DELETE CURRENT PAGE
// =========================================================

deletePageBtn.addEventListener(
    "click",
    () => {

        optionsMenu.classList.remove(
            "show"
        );

        openConfirmation(
            "Delete This Page?",
            "This page and all of its data will be permanently removed.",
            deleteCurrentPage
        );

    }
);


function deleteCurrentPage() {

    if (pages.length === 0) {
        return;
    }

    pages.splice(
        currentPageIndex,
        1
    );

    // If the deleted page was the last page
    // move the index to the previous page.
    if (
        currentPageIndex >=
        pages.length
    ) {

        currentPageIndex =
            pages.length - 1;

    }

    savePagesToStorage();

    updateApplicationView();
}


// =========================================================
// 35) SEARCH PANEL
// =========================================================

function openSearch() {

    searchOverlay.classList.add("show");

    searchInput.value = "";

    renderSearchMessage();

    setTimeout(() => {
        searchInput.focus();
    }, 100);
}


function closeSearch() {

    searchOverlay.classList.remove("show");
}


searchBtn.addEventListener(
    "click",
    openSearch
);


closeSearchBtn.addEventListener(
    "click",
    closeSearch
);


// =========================================================
// 36) SEARCH MESSAGE
// =========================================================

function renderSearchMessage() {

    searchResults.innerHTML = `
        <p class="search-empty">
            Search your notebook to find a page.
        </p>
    `;
}


// =========================================================
// 37) SEARCH NOTEBOOK
// =========================================================

function searchNotebook(searchText) {

    const query =
        searchText.trim().toLowerCase();

    if (!query) {

        renderSearchMessage();

        return;
    }

    const results = pages.filter(page => {

        const title =
            page.title.toLowerCase();

        const content =
            page.content.toLowerCase();

        return (
            title.includes(query) ||
            content.includes(query)
        );

    });

    renderSearchResults(results);
}


// =========================================================
// 38) RENDER SEARCH RESULTS
// =========================================================

function renderSearchResults(results) {

    if (results.length === 0) {

        searchResults.innerHTML = `
            <p class="search-empty">
                No pages found.
            </p>
        `;

        return;
    }

    searchResults.innerHTML = "";

    results.forEach(page => {

        const pageIndex =
            pages.findIndex(
                item => item.id === page.id
            );

        const resultButton =
            document.createElement("button");

        resultButton.className =
            "search-result";

        resultButton.innerHTML = `
            <strong>${escapeHTML(page.title)}</strong>
            <span>Page ${String(pageIndex + 1).padStart(2, "0")}</span>
        `;

        resultButton.addEventListener(
            "click",
            () => {

                currentPageIndex =
                    pageIndex;

                renderCurrentPage();

                closeSearch();

            }
        );

        searchResults.appendChild(
            resultButton
        );

    });
}


// =========================================================
// 39) SEARCH INPUT EVENT
// =========================================================

searchInput.addEventListener(
    "input",
    () => {

        searchNotebook(
            searchInput.value
        );

    }
);


// =========================================================
// 40) ESCAPE HTML
// =========================================================

// Prevents HTML code from being inserted
// directly into search results.

function escapeHTML(text) {

    const element =
        document.createElement("div");

    element.textContent = text;

    return element.innerHTML;
}


// =========================================================
// 41) CLOSE SEARCH WITH ESC
// =========================================================

document.addEventListener(
    "keydown",
    (event) => {

        if (event.key !== "Escape") {
            return;
        }

        closeSearch();

        closeCreatePageModal();

        closeConfirmation();

        optionsMenu.classList.remove(
            "show"
        );

    }
);


// =========================================================
// 42) CLOSE MODALS BY CLICKING OUTSIDE
// =========================================================

searchOverlay.addEventListener(
    "click",
    (event) => {

        if (
            event.target === searchOverlay
        ) {

            closeSearch();

        }

    }
);


createPageModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === createPageModal
        ) {

            closeCreatePageModal();

        }

    }
);


confirmModal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === confirmModal
        ) {

            closeConfirmation();

        }

    }
);


// =========================================================
// 43) INITIALIZE APPLICATION
// =========================================================

function initializeApp() {

    // Load saved notebook pages
    loadPages();

    // Set today's date
    pageDate.textContent =
        getFormattedDate();

    // Decide whether to show
    // Empty State or Notebook
    updateApplicationView();

}


// =========================================================
// 44) START APPLICATION
// =========================================================

initializeApp();
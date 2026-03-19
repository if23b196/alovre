// Initialize Icons
lucide.createIcons();

// --- 1. Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');

    // Switch icon inside button
    themeToggleBtn.innerHTML = '';
    const newIcon = document.createElement('i');
    if (htmlEl.classList.contains('dark')) {
        newIcon.setAttribute('data-lucide', 'sun');
    } else {
        newIcon.setAttribute('data-lucide', 'moon');
    }
    themeToggleBtn.appendChild(newIcon);
    lucide.createIcons();
});

// --- 2. Tab Switching Logic ---
const tabs = document.querySelectorAll('.tab');
const uploadDocSection = document.getElementById('upload-document-section');
const uploadTextSection = document.getElementById('upload-text-section');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        if (tab.dataset.tab === 'plaintext') {
            uploadDocSection.classList.add('hidden');
            uploadTextSection.classList.remove('hidden');
        } else {
            uploadTextSection.classList.add('hidden');
            uploadDocSection.classList.remove('hidden');
        }
    });
});

// --- 3. Dynamic Upload & Table Population ---
const dropzone = document.getElementById('dropzone');
const fileUploadInput = document.getElementById('file-upload');
const uploadTextBtn = document.getElementById('upload-text-btn');
const contentNameInput = document.getElementById('content-name');
const textInput = document.getElementById('text-input');

const libraryTable = document.getElementById('library-table');
const libraryBody = document.getElementById('library-body');
const emptyState = document.getElementById('empty-state');

// Helpers
function getCurrentDate() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

// Add Row Function
function addContentToTable(name, type, sizeStr) {
    emptyState.classList.add('hidden');
    libraryTable.classList.remove('hidden');

    const tr = document.createElement('tr');
    tr.classList.add('library-item');

    let badgeLabel;
    let iconName;

    // Set distinct icons and badges based on the type of upload
    if (type === 'Plain Text') {
        badgeLabel = 'TXT';
        iconName = 'align-left'; // Matches Plain Text tab icon
    } else {
        badgeLabel = type.split('.').pop().toUpperCase();
        iconName = 'file-text';  // Matches Document tab icon
    }

    tr.innerHTML = `
        <td>
            <a href="#" class="item-name">
                <i data-lucide="${iconName}" class="table-icon"></i> ${name}
            </a>
        </td>
        <td><span class="badge">${badgeLabel}</span></td>
        <td>${getCurrentDate()}</td>
        <td>${sizeStr}</td>
        <td class="status-ready"><i data-lucide="check-circle-2"></i> Ready</td>
    `;

    libraryBody.prepend(tr);
    lucide.createIcons();
}

// Handle Document Click
dropzone.addEventListener('click', () => {
    fileUploadInput.click();
});

// Handle Document Selection
fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    let name = contentNameInput.value.trim();
    if (!name) name = file.name;

    addContentToTable(name, file.name, formatSize(file.size));

    contentNameInput.value = '';
    fileUploadInput.value = '';
});

// Handle Plain Text Button
uploadTextBtn.addEventListener('click', () => {
    const text = textInput.value.trim();
    if (!text) {
        alert("Please enter some text first.");
        return;
    }

    let name = contentNameInput.value.trim();
    if (!name) name = "Untitled Text";

    const sizeBytes = new Blob([text]).size;

    addContentToTable(name, 'Plain Text', formatSize(sizeBytes));

    contentNameInput.value = '';
    textInput.value = '';
});

// --- 4. Dynamic Search Functionality ---
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = libraryBody.querySelectorAll('.library-item');

    rows.forEach(row => {
        const itemName = row.querySelector('.item-name').textContent.toLowerCase();

        if (itemName.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

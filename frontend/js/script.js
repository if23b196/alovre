// Initialize Icons
lucide.createIcons();

// --- 1. Theme Toggle ---
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

themeToggleBtn.addEventListener('click', () => {
    htmlEl.classList.toggle('dark');
    themeToggleBtn.innerHTML = '';
    const newIcon = document.createElement('i');
    newIcon.setAttribute('data-lucide', htmlEl.classList.contains('dark') ? 'sun' : 'moon');
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

// --- 3. Table & Upload Logic ---
const dropzone = document.getElementById('dropzone');
const fileUploadInput = document.getElementById('file-upload');
const uploadTextBtn = document.getElementById('upload-text-btn');
const contentNameInput = document.getElementById('content-name');
const nameError = document.getElementById('name-error');
const textInput = document.getElementById('text-input');
const textError = document.getElementById('text-error');

const libraryTable = document.getElementById('library-table');
const libraryBody = document.getElementById('library-body');
const emptyState = document.getElementById('empty-state');
const itemCountText = document.getElementById('item-count');

// Validation functions
function validateContentName() {
    const name = contentNameInput.value.trim();
    if (!name) {
        nameError.classList.remove('hidden');
        contentNameInput.style.borderColor = 'var(--destructive)';
        return false;
    }
    return name;
}

// Clear error states when user starts typing
contentNameInput.addEventListener('input', () => {
    if (contentNameInput.value.trim()) {
        nameError.classList.add('hidden');
        contentNameInput.style.borderColor = '';
    }
});

textInput.addEventListener('input', () => {
    if (textInput.value.trim()) {
        textError.classList.add('hidden');
        textInput.style.borderColor = '';
    }
});

function getCurrentDate() {
    return new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

function updateItemCount() {
    const count = libraryBody.children.length;
    if (count === 1) {
        itemCountText.textContent = "1 item";
    } else {
        itemCountText.textContent = `${count} items`;
    }
}

function checkEmptyState() {
    if (libraryBody.children.length === 0) {
        emptyState.classList.remove('hidden');
        libraryTable.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        libraryTable.classList.remove('hidden');
    }
    updateItemCount();
}

function addContentToTable(name, type, sizeStr) {
    const tr = document.createElement('tr');
    tr.classList.add('library-item');

    let badgeLabel = type === 'Plain Text' ? 'TEXT' : type.split('.').pop().toUpperCase();
    let iconName = type === 'Plain Text' ? 'align-left' : 'file-text';

    tr.innerHTML = `
        <td>
            <a href="#" class="item-name">
                <i data-lucide="${iconName}" class="table-icon"></i> 
                <span class="item-name-text">${name}</span>
            </a>
        </td>
        <td><span class="badge">${badgeLabel}</span></td>
        <td>${getCurrentDate()}</td>
        <td>${sizeStr}</td>
        <td class="status-ready"><i data-lucide="check-circle-2"></i> Ready</td>
        <td class="action-cell">
            <div class="action-buttons-wrapper">
                <button class="icon-btn edit-btn" title="Edit Name"><i data-lucide="pencil"></i></button>
                <button class="icon-btn delete-btn" title="Delete"><i data-lucide="trash-2"></i></button>
            </div>
        </td>
    `;

    // Append so the newest item goes to the top
    libraryBody.prepend(tr);
    lucide.createIcons();
    checkEmptyState();
}

// Upload triggers with validation
dropzone.addEventListener('click', () => {
    if (!validateContentName()) return;
    fileUploadInput.click();
});

fileUploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const name = validateContentName();
    if (!name) return;

    addContentToTable(name, file.name, formatSize(file.size));
    contentNameInput.value = '';
    fileUploadInput.value = '';
});

uploadTextBtn.addEventListener('click', () => {
    const name = validateContentName();
    if (!name) return;

    const text = textInput.value.trim();
    if (!text) {
        textError.classList.remove('hidden');
        textInput.style.borderColor = 'var(--destructive)';
        return;
    }

    addContentToTable(name, 'Plain Text', formatSize(new Blob([text]).size));
    contentNameInput.value = '';
    textInput.value = '';
});

// --- 4. Dynamic Search Functionality ---
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = libraryBody.querySelectorAll('.library-item');
    rows.forEach(row => {
        const itemName = row.querySelector('.item-name-text').textContent.toLowerCase();
        row.style.display = itemName.includes(searchTerm) ? '' : 'none';
    });
});

// --- 5. Edit and Delete Functionality ---
// Modal Variables
let activeRow = null;
const editModal = document.getElementById('edit-modal');
const editNameInput = document.getElementById('edit-name-input');
const deleteModal = document.getElementById('delete-modal');
const deleteItemNameText = document.getElementById('delete-item-name');

// Event Delegation for Table Buttons
libraryBody.addEventListener('click', (e) => {
    const editBtn = e.target.closest('.edit-btn');
    const deleteBtn = e.target.closest('.delete-btn');

    if (editBtn) {
        activeRow = editBtn.closest('tr');
        const currentName = activeRow.querySelector('.item-name-text').textContent;
        editNameInput.value = currentName;
        editModal.classList.remove('hidden');
    }

    if (deleteBtn) {
        activeRow = deleteBtn.closest('tr');
        const currentName = activeRow.querySelector('.item-name-text').textContent;
        deleteItemNameText.textContent = currentName;
        deleteModal.classList.remove('hidden');
    }
});

// Edit Modal Actions
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    editModal.classList.add('hidden');
    activeRow = null;
});

document.getElementById('save-edit-btn').addEventListener('click', () => {
    const newName = editNameInput.value.trim();
    if (newName && activeRow) {
        activeRow.querySelector('.item-name-text').textContent = newName;
    }
    editModal.classList.add('hidden');
    activeRow = null;
});

// Delete Modal Actions
document.getElementById('cancel-delete-btn').addEventListener('click', () => {
    deleteModal.classList.add('hidden');
    activeRow = null;
});

document.getElementById('confirm-delete-btn').addEventListener('click', () => {
    if (activeRow) {
        activeRow.remove();
        checkEmptyState();
    }
    deleteModal.classList.add('hidden');
    activeRow = null;
});
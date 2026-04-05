const API_BASE_URL = 'http://localhost:8080/api/content';
const libraryBody = document.getElementById('library-body');
const emptyState = document.getElementById('empty-state');
const libraryTable = document.getElementById('library-table');
const itemCountText = document.getElementById('item-count');

let allItems = [];
let activeRowId = null; // To track which item we are editing/deleting

// Formatting Helpers
function formatSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

function formatDate(timestampArray) {
    if (!timestampArray) return '-';
    // Spring Boot often returns LocalDateTime as an array [YYYY, M, D, H, M, S]
    if (Array.isArray(timestampArray)) {
        const date = new Date(timestampArray[0], timestampArray[1] - 1, timestampArray[2]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(timestampArray).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// --- Fetch & Polling ---
async function fetchLibraryData() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

        // Only re-render if count or data has changed to prevent UI flicker
        if (JSON.stringify(data) !== JSON.stringify(allItems)) {
            allItems = data;
            renderTable(allItems);
        }
    } catch (error) {
        console.error("Library Polling Error:", error);
    }
}

function renderTable(data) {
    libraryBody.innerHTML = '';

    if (data.length === 0) {
        emptyState.classList.remove('hidden');
        libraryTable.classList.add('hidden');
        itemCountText.textContent = "0 items";
        return;
    }

    emptyState.classList.add('hidden');
    libraryTable.classList.remove('hidden');
    itemCountText.textContent = data.length === 1 ? "1 item" : `${data.length} items`;

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('library-item');
        tr.dataset.id = item.id;

        // Logic to differentiate icons and badges based on type
        let iconName = 'file';     // default fallback
        let badgeLabel = 'FILE';

        switch (item.type) {
            case 'TEXT':
                iconName = 'align-left';
                badgeLabel = 'TEXT';
                break;

            case 'PDF':
                iconName = 'file-text';
                badgeLabel = 'PDF';
                break;

            case 'TXT':
                iconName = 'file';
                badgeLabel = 'TXT';
                break;

            default:
                iconName = 'file';
                badgeLabel = item.type || 'FILE';
        }

        const statusHtml = item.ocrProcessed
            ? `<td class="status-ready"><i data-lucide="check-circle-2"></i> Ready</td>`
            : `<td style="color: var(--muted-foreground)"><i data-lucide="loader-2" class="spin"></i> Processing</td>`;

        tr.innerHTML = `
            <td>
                <a href="#" class="item-name">
                    <i data-lucide="${iconName}" class="table-icon ${item.type === 'PLAIN_TEXT' ? 'text-icon' : ''}"></i> 
                    <span class="item-name-text">${item.title}</span>
                </a>
            </td>
            <td><span class="badge">${badgeLabel}</span></td>
            <td>${formatDate(item.uploadTimestamp)}</td>
            <td>${formatSize(item.fileSize)}</td>
            ${statusHtml}
            <td class="action-cell">
                <div class="action-buttons-wrapper">
                    <button class="icon-btn edit-btn" title="Edit Name"><i data-lucide="pencil"></i></button>
                    <button class="icon-btn delete-btn" title="Delete"><i data-lucide="trash-2"></i></button>
                </div>
            </td>
        `;
        libraryBody.appendChild(tr);
    });
    lucide.createIcons();
}

// --- Search ---
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => item.title.toLowerCase().includes(searchTerm));
    renderTable(filtered);
});

// --- Modal Logic (Edit/Delete) ---
const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const editNameInput = document.getElementById('edit-name-input');
const deleteItemNameText = document.getElementById('delete-item-name');

libraryBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    const id = row.dataset.id;
    activeRowId = id;

    if (e.target.closest('.item-name')) {
        window.location.href = `reader.html?id=${id}`;
        return;
    }

    if (e.target.closest('.edit-btn')) {
        const currentName = row.querySelector('.item-name-text').textContent;
        editNameInput.value = currentName;
        editModal.classList.remove('hidden');
    }

    if (e.target.closest('.delete-btn')) {
        const currentName = row.querySelector('.item-name-text').textContent;
        deleteItemNameText.textContent = currentName;
        deleteModal.classList.remove('hidden');
    }
});

// Modal Close logic
[document.getElementById('cancel-edit-btn'), document.getElementById('cancel-delete-btn')].forEach(btn => {
    btn.addEventListener('click', () => {
        editModal.classList.add('hidden');
        deleteModal.classList.add('hidden');
        activeRowId = null;
    });
});

document.getElementById('confirm-delete-btn').addEventListener('click', async () => {
    if (activeRowId) {
        await fetch(`${API_BASE_URL}/${activeRowId}`, {
            method: 'DELETE'
        });

        deleteModal.classList.add('hidden');
        fetchLibraryData();
    }
});

document.getElementById('save-edit-btn').addEventListener('click', async () => {
    const newName = editNameInput.value;

    if (activeRowId && newName) {
        await fetch(`${API_BASE_URL}/${activeRowId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: newName
            })
        });

        editModal.classList.add('hidden');
        fetchLibraryData();
    }
});

// Initial Load & Polling
fetchLibraryData();
setInterval(fetchLibraryData, 5000);

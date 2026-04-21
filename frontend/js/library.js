const API_BASE_URL = 'http://localhost:8080/api/content';
const libraryBody = document.getElementById('library-body');
const emptyState = document.getElementById('empty-state');
const libraryTable = document.getElementById('library-table');
const itemCountText = document.getElementById('item-count');

function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'en';
    const translations = {
        en: {
            itemCount0: '0 items',
            itemCount1: '1 item',
            itemCountMany: 'items',
            statusReady: 'Ready',
            statusProcessing: 'Processing',
            btnEditName: 'Edit Name',
            btnDelete: 'Delete'
        },
        de: {
            itemCount0: '0 Elemente',
            itemCount1: '1 Element',
            itemCountMany: 'Elemente',
            statusReady: 'Bereit',
            statusProcessing: 'Wird verarbeitet',
            btnEditName: 'Name bearbeiten',
            btnDelete: 'Löschen'
        },
        es: {
            itemCount0: '0 elementos',
            itemCount1: '1 elemento',
            itemCountMany: 'elementos',
            statusReady: 'Listo',
            statusProcessing: 'Procesando',
            btnEditName: 'Editar nombre',
            btnDelete: 'Eliminar'
        }
    };
    return (translations[lang] || translations.en)[key];
}

let allItems = [];
let activeRowId = null;

function formatSize(bytes) {
    if (!bytes) return '-';
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
}

function formatDate(timestampArray) {
    if (!timestampArray) return '-';
    if (Array.isArray(timestampArray)) {
        const date = new Date(timestampArray[0], timestampArray[1] - 1, timestampArray[2]);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return new Date(timestampArray).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

async function fetchLibraryData() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Failed to fetch');

        const data = await response.json();

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
        itemCountText.textContent = getTranslation('itemCount0');
        return;
    }

    emptyState.classList.add('hidden');
    libraryTable.classList.remove('hidden');
    if (data.length === 1) {
        itemCountText.textContent = getTranslation('itemCount1');
    } else {
        itemCountText.textContent = `${data.length} ${getTranslation('itemCountMany')}`;
    }

    data.forEach(item => {
        const tr = document.createElement('tr');
        tr.classList.add('library-item');
        tr.dataset.id = item.id;

        // If not processed, add the processing class to disable interactions
        if (!item.ocrProcessed) {
            tr.classList.add('processing');
        }

        let iconName = 'file';
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
            ? `<td class="status-ready"><i data-lucide="check-circle-2"></i> ${getTranslation('statusReady')}</td>`
            : `<td style="color: var(--muted-foreground)"><i data-lucide="loader-2" class="spin"></i> ${getTranslation('statusProcessing')}</td>`;

        // Only render action buttons if the item is fully processed
        const actionsHtml = item.ocrProcessed
            ? `<div class="action-buttons-wrapper">
                   <button class="icon-btn edit-btn" title="${getTranslation('btnEditName')}"><i data-lucide="pencil"></i></button>
                   <button class="icon-btn delete-btn" title="${getTranslation('btnDelete')}"><i data-lucide="trash-2"></i></button>
               </div>`
            : ``;

        tr.innerHTML = `
            <td>
                <a href="#" class="item-name" onclick="event.preventDefault();">
                    <i data-lucide="${iconName}" class="table-icon ${item.type === 'PLAIN_TEXT' ? 'text-icon' : ''}"></i> 
                    <span class="item-name-text">${item.title}</span>
                </a>
            </td>
            <td><span class="badge">${badgeLabel}</span></td>
            <td>${formatDate(item.uploadTimestamp)}</td>
            <td>${formatSize(item.fileSize)}</td>
            ${statusHtml}
            <td class="action-cell">
                ${actionsHtml}
            </td>
        `;
        libraryBody.appendChild(tr);
    });
    lucide.createIcons();
}

document.getElementById('search-input').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = allItems.filter(item => item.title.toLowerCase().includes(searchTerm));
    renderTable(filtered);
});

const editModal = document.getElementById('edit-modal');
const deleteModal = document.getElementById('delete-modal');
const editNameInput = document.getElementById('edit-name-input');

// Listen for language change to re-render the table immediately
window.addEventListener('languageChanged', () => {
    if (allItems.length > 0) {
        renderTable(allItems);
    }
});

libraryBody.addEventListener('click', (e) => {
    const row = e.target.closest('tr');
    if (!row) return;

    // Do absolutely nothing if the item is still processing
    if (row.classList.contains('processing')) return;

    const id = row.dataset.id;
    activeRowId = id;

    // Handle Edit Button Click
    if (e.target.closest('.edit-btn')) {
        const currentName = row.querySelector('.item-name-text').textContent;
        editNameInput.value = currentName;
        editModal.classList.remove('hidden');
        return;
    }

    // Handle Delete Button Click
    if (e.target.closest('.delete-btn')) {
        const currentName = row.querySelector('.item-name-text').textContent;
        // Re-query the element because it might have been replaced by common.js applyTranslations
        const deleteItemNameText = document.getElementById('delete-item-name');
        if (deleteItemNameText) {
            deleteItemNameText.textContent = currentName;
        }
        deleteModal.classList.remove('hidden');
        return;
    }

    // If it's not a processing row, and not an action button, open the document
    window.location.href = `reader.html?id=${id}`;
});

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

fetchLibraryData();
setInterval(fetchLibraryData, 5000);

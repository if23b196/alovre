const API_BASE_URL = 'http://localhost:8080/api/content';

const tabs = document.querySelectorAll('.tab');
const uploadDocSection = document.getElementById('upload-document-section');
const uploadTextSection = document.getElementById('upload-text-section');
const dropzone = document.getElementById('dropzone');
const fileUploadInput = document.getElementById('file-upload');
const uploadTextBtn = document.getElementById('upload-text-btn');
const contentNameInput = document.getElementById('content-name');
const languageSelect = document.getElementById('select-language');
const nameError = document.getElementById('name-error');
const textInput = document.getElementById('text-input');
const textError = document.getElementById('text-error');
const toastContainer = document.getElementById('toast-container');
const toastMessage = document.getElementById('toast-message');

// Tab Switching
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

// Validation
function validateContentName() {
    const name = contentNameInput.value.trim();
    if (!name) {
        nameError.classList.remove('hidden');
        contentNameInput.style.borderColor = 'var(--destructive)';
        return false;
    }
    return name;
}

function showToast(message, type = 'info', icon = 'info') {
    if (!toastContainer) return; // safeguard
    toastContainer.classList.remove('hidden');
    toastMessage.className = `toast ${type}`;
    const iconClass = icon === 'loader-2' ? 'spin' : '';
    toastMessage.innerHTML = `<i data-lucide="${icon}" class="${iconClass}"></i> <span>${message}</span>`;
    lucide.createIcons();
    if (type !== 'info') setTimeout(() => toastContainer.classList.add('hidden'), 3500);
}

contentNameInput.addEventListener('input', () => {
    if (contentNameInput.value.trim()) {
        nameError.classList.add('hidden');
        contentNameInput.style.borderColor = '';
    }

    updateUploadTextButtonState();
    updateDropzoneState();
});

textInput.addEventListener('input', () => {
    if (textInput.value.trim()) {
        textError.classList.add('hidden');
        textInput.style.borderColor = '';
    }

    updateUploadTextButtonState();
});

fileUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const title = validateContentName();
    if (!title) return;

    const language = languageSelect.value; // GET LANGUAGE

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('language', language);

    showToast('Uploading document...', 'info', 'loader-2');

    try {
        const response = await fetch(`${API_BASE_URL}/upload/document`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = 'library.html';
        } else {
            showToast("Failed to upload document.", "error", "alert-circle");
        }
    } catch (error) {
        console.error("Error uploading document:", error);
        showToast("Server error.", "error", "alert-circle");
    }
    fileUploadInput.value = '';
});

// 2. Upload Raw Text (JSON)
uploadTextBtn.addEventListener('click', async () => {
    const title = validateContentName();
    if (!title) return;

    const text = textInput.value.trim();
    const language = languageSelect.value; // GET LANGUAGE

    if (!text) {
        textError.classList.remove('hidden');
        textInput.style.borderColor = 'var(--destructive)';
        return;
    }

    showToast('Uploading text...', 'info', 'loader-2');

    try {
        const response = await fetch(`${API_BASE_URL}/upload/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // ADD LANGUAGE TO JSON BODY
            body: JSON.stringify({
                title: title,
                text: text,
                language: language
            })
        });

        if (response.ok) {
            window.location.href = 'library.html';
        } else {
            showToast("Failed to upload text.", "error", "alert-circle");
        }
    } catch (error) {
        console.error("Error uploading text:", error);
        showToast("Server error.", "error", "alert-circle");
    }
});

// Add this to your upload.js
dropzone.addEventListener('click', () => {
    const hasName = contentNameInput.value.trim().length > 0;

    if (!hasName) {
        nameError.classList.remove('hidden');
        contentNameInput.style.borderColor = 'var(--destructive)';
        return; // prevent opening file dialog
    }

    fileUploadInput.click();
});

// Optional: Add drag and drop support while you're at it
dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--primary)';
});

dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border)';
});

dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border)';
    if (e.dataTransfer.files.length) {
        fileUploadInput.files = e.dataTransfer.files;
        // Trigger the change event manually since setting .files doesn't fire it
        fileUploadInput.dispatchEvent(new Event('change'));
    }
});

function updateUploadTextButtonState() {
    const hasName = contentNameInput.value.trim().length > 0;
    const hasText = textInput.value.trim().length > 0;

    uploadTextBtn.disabled = !(hasName && hasText);
}

function updateDropzoneState() {
    const hasName = contentNameInput.value.trim().length > 0;

    dropzone.classList.toggle('disabled', !hasName);
}
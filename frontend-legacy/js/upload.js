const API_BASE_URL = 'http://localhost:8080/api/content';

// Existing Elements
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

// New Elements for Document Review Logic
const uploadDocBtn = document.getElementById('upload-document-btn');
const filePreview = document.getElementById('file-preview');
const fileNameDisplay = document.getElementById('file-name-display');
const removeFileBtn = document.getElementById('remove-file-btn');

let selectedFile = null; // Holds the file before manual upload

// --- Tab Switching ---
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

function getTranslation(key) {
    const lang = localStorage.getItem('language') || 'en';
    const translations = {
        en: {
            toastUploadingDoc: 'Uploading document...',
            toastUploadingText: 'Uploading text...',
            errorOnlyPdfTxt: 'Only PDF and TXT files are allowed.',
            errorUploadFail: 'Failed to upload document.',
            errorUploadTextFail: 'Failed to upload text.',
            errorServer: 'Server error.'
        },
        de: {
            toastUploadingDoc: 'Dokument wird hochgeladen...',
            toastUploadingText: 'Text wird hochgeladen...',
            errorOnlyPdfTxt: 'Nur PDF- und TXT-Dateien sind erlaubt.',
            errorUploadFail: 'Hochladen des Dokuments fehlgeschlagen.',
            errorUploadTextFail: 'Hochladen des Textes fehlgeschlagen.',
            errorServer: 'Serverfehler.'
        },
        es: {
            toastUploadingDoc: 'Subiendo documento...',
            toastUploadingText: 'Subiendo texto...',
            errorOnlyPdfTxt: 'Solo se permiten archivos PDF y TXT.',
            errorUploadFail: 'Error al subir el documento.',
            errorUploadTextFail: 'Error al subir el texto.',
            errorServer: 'Error del servidor.'
        }
    };
    return (translations[lang] || translations.en)[key];
}

// --- Validation & UI Helpers ---
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
    if (!toastContainer) return;
    toastContainer.classList.remove('hidden');
    toastMessage.className = `toast ${type}`;
    const iconClass = icon === 'loader-2' ? 'spin' : '';
    toastMessage.innerHTML = `<i data-lucide="${icon}" class="${iconClass}"></i> <span>${message}</span>`;
    lucide.createIcons();
    if (type !== 'info') setTimeout(() => toastContainer.classList.add('hidden'), 3500);
}

function updateUploadTextButtonState() {
    const hasName = contentNameInput.value.trim().length > 0;
    const hasText = textInput.value.trim().length > 0;
    uploadTextBtn.disabled = !(hasName && hasText);
}

function updateUploadDocButtonState() {
    const hasName = contentNameInput.value.trim().length > 0;
    const hasFile = selectedFile !== null;
    uploadDocBtn.disabled = !(hasName && hasFile);
}

function updateDropzoneState() {
    const hasName = contentNameInput.value.trim().length > 0;
    dropzone.classList.toggle('disabled', !hasName);
}

// --- Input Listeners ---
contentNameInput.addEventListener('input', () => {
    if (contentNameInput.value.trim()) {
        nameError.classList.add('hidden');
        contentNameInput.style.borderColor = '';
    }
    updateUploadTextButtonState();
    updateUploadDocButtonState();
    updateDropzoneState();
});

textInput.addEventListener('input', () => {
    if (textInput.value.trim()) {
        textError.classList.add('hidden');
        textInput.style.borderColor = '';
    }
    updateUploadTextButtonState();
});

// --- Document Selection Logic (The Review Part) ---
function handleFileSelection(file) {
    if (!file) return;

    // Validate File Type
    const isPdf = file.type === 'application/pdf';
    const isTxt = file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');

    if (isPdf || isTxt) {
        selectedFile = file;

        // Show Preview UI
        dropzone.classList.add('hidden');
        filePreview.classList.remove('hidden');
        fileNameDisplay.textContent = file.name;

        lucide.createIcons(); // Refresh 'X' icon
        updateUploadDocButtonState();
    } else {
        showToast(getTranslation('errorOnlyPdfTxt'), "error", "alert-circle");
        fileUploadInput.value = '';
    }
}

// Remove File Action
removeFileBtn.addEventListener('click', () => {
    selectedFile = null;
    fileUploadInput.value = '';
    filePreview.classList.add('hidden');
    dropzone.classList.remove('hidden');
    updateUploadDocButtonState();
});

// Drag and Drop Listeners
dropzone.addEventListener('click', () => fileUploadInput.click());

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
        handleFileSelection(e.dataTransfer.files[0]);
    }
});

fileUploadInput.addEventListener('change', (e) => {
    handleFileSelection(e.target.files[0]);
});

// --- Final Upload Actions ---

// 1. Upload Document
uploadDocBtn.addEventListener('click', async () => {
    const title = validateContentName();
    if (!title || !selectedFile) return;

    const language = languageSelect.value;
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', selectedFile);
    formData.append('language', language);

    showToast(getTranslation('toastUploadingDoc'), 'info', 'loader-2');
    uploadDocBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/upload/document`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = 'library.html';
        } else {
            showToast(getTranslation('errorUploadFail'), "error", "alert-circle");
            uploadDocBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error uploading document:", error);
        showToast(getTranslation('errorServer'), "error", "alert-circle");
        uploadDocBtn.disabled = false;
    }
});

// 2. Upload Plain Text
uploadTextBtn.addEventListener('click', async () => {
    const title = validateContentName();
    const text = textInput.value.trim();
    const language = languageSelect.value;

    if (!title || !text) {
        if (!text) {
            textError.classList.remove('hidden');
            textInput.style.borderColor = 'var(--destructive)';
        }
        return;
    }

    showToast(getTranslation('toastUploadingText'), 'info', 'loader-2');
    uploadTextBtn.disabled = true;

    try {
        const response = await fetch(`${API_BASE_URL}/upload/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, text, language })
        });

        if (response.ok) {
            window.location.href = 'library.html';
        } else {
            showToast(getTranslation('errorUploadTextFail'), "error", "alert-circle");
            uploadTextBtn.disabled = false;
        }
    } catch (error) {
        console.error("Error uploading text:", error);
        showToast(getTranslation('errorServer'), "error", "alert-circle");
        uploadTextBtn.disabled = false;
    }
});

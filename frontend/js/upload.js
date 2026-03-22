const API_BASE_URL = 'http://localhost:8080/api/content';

const tabs = document.querySelectorAll('.tab');
const uploadDocSection = document.getElementById('upload-document-section');
const uploadTextSection = document.getElementById('upload-text-section');
const dropzone = document.getElementById('dropzone');
const fileUploadInput = document.getElementById('file-upload');
const uploadTextBtn = document.getElementById('upload-text-btn');
const contentNameInput = document.getElementById('content-name');
const nameError = document.getElementById('name-error');
const textInput = document.getElementById('text-input');
const textError = document.getElementById('text-error');

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

// 1. Upload Document (Multipart Form Data)
dropzone.addEventListener('click', () => {
    if (!validateContentName()) return;
    fileUploadInput.click();
});

fileUploadInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const title = validateContentName();
    if (!title) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload/document`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            window.location.href = 'library.html'; // Redirect on success
        } else {
            alert("Failed to upload document.");
        }
    } catch (error) {
        console.error("Error uploading document:", error);
    }

    fileUploadInput.value = '';
});

// 2. Upload Raw Text (JSON)
uploadTextBtn.addEventListener('click', async () => {
    const title = validateContentName();
    if (!title) return;

    const text = textInput.value.trim();
    if (!text) {
        textError.classList.remove('hidden');
        textInput.style.borderColor = 'var(--destructive)';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/upload/text`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, text: text })
        });

        if (response.ok) {
            window.location.href = 'library.html'; // Redirect on success
        } else {
            alert("Failed to upload text.");
        }
    } catch (error) {
        console.error("Error uploading text:", error);
    }
});

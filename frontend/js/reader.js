const API_BASE_URL = 'http://localhost:8080/api/content';

function getContentIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

async function fetchContent() {
    const id = getContentIdFromUrl();
    if (!id) {
        console.error("No content ID provided");
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Failed to fetch content");

        const data = await response.json();

        renderContent(data);

    } catch (error) {
        console.error("Error loading content:", error);
    }
}

function renderContent(data) {
    // 1. Title
    document.getElementById('document-title').textContent = data.title;

    // 2. Text
    renderText(data.textContent);

    // 3. Tools (translations/images/audio)
    loadToolData(data);
}

function renderText(text) {
    if (!text) return;

    const tokens = text.split(/([\w'-]+)/g);

    textContainer.innerHTML = tokens.map(token => {
        if (/([\w'-]+)/g.test(token)) {
            return `<span class="word" data-word="${token.toLowerCase()}">${token}</span>`;
        }
        return token;
    }).join('');
}

function loadToolData(data) {
    // Reset state
    toolState.translate.history = [];
    toolState.image.history = [];
    toolState.audio.history = [];

    // 🧠 Translations (Annotations)
    if (data.annotations) {
        data.annotations.forEach(a => {
            toolState.translate.history.push({
                word: a.selectedText,
                result: a.generatedText
            });
        });
    }

    // 🖼 Images
    if (data.images) {
        data.images.forEach(img => {
            toolState.image.history.push({
                word: img.word,
                result: img.url
            });
        });
    }

    // 🔊 Audios
    if (data.audios) {
        data.audios.forEach(audio => {
            toolState.audio.history.push({
                word: audio.word,
                result: audio.url
            });
        });
    }

    // Reset indexes
    Object.keys(toolState).forEach(key => {
        toolState[key].currentIndex = toolState[key].history.length > 0 ? 0 : -1;
        renderToolState(key);
    });
}



const textContainer = document.getElementById('text-content');
const selectedWordDisplay = document.getElementById('selected-word-text');
let currentSelectedWord = null;

// Updated Tool Data State: History now stores { word: "...", result: "..." }
const toolState = {
    translate: { history: [], currentIndex: -1 },
    image: { history: [], currentIndex: -1 },
    audio: { history: [], currentIndex: -1 }
};

// 1. Initialize Reader Content
function initReader() {
    // UPDATED REGEX: Now includes \xAD (soft hyphen) and \u2011 (non-breaking hyphen)
    // and matches words connected by hyphens as a single token.
    const tokens = rawText.split(/([\w'-]+)/g);

    textContainer.innerHTML = tokens.map(token => {
        if (/([\w'-]+)/g.test(token)) {
            // Lowercase data attribute for easier comparison when highlighting all instances
            return `<span class="word" data-word="${token.toLowerCase()}">${token}</span>`;
        }
        return token;
    }).join('');
    lucide.createIcons();
}

// 2. Handle Word Selection & Multi-Highlight
textContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('word')) {
        const clickedWord = e.target.dataset.word;
        currentSelectedWord = e.target.textContent;

        // Reset all highlights
        document.querySelectorAll('.word').forEach(el => {
            el.classList.remove('selected', 'instance-highlight');
        });

        // Highlight ALL instances of this word
        document.querySelectorAll(`.word[data-word="${clickedWord}"]`).forEach(el => {
            el.classList.add('instance-highlight');
        });

        // Specifically mark the CLICKED one as the primary selected
        e.target.classList.add('selected');

        // Update Side Panel
        selectedWordDisplay.innerHTML = `Selected: <strong style="color: var(--primary); font-size: 1.2rem;">${currentSelectedWord}</strong>`;
        selectedWordDisplay.classList.remove('text-muted');
    }
});

// 3. Tool Generation Logic (Updated to store word in history)
function handleGenerate(toolKey, generatorFunction) {
    if (!currentSelectedWord) {
        showToast('Please select a word first.', 'error', 'alert-circle');
        return;
    }

    showToast(`Generating ${toolKey}...`, 'info', 'loader-2');

    setTimeout(() => {
        const result = generatorFunction(currentSelectedWord);

        // STORE BOTH THE RESULT AND THE WORD USED
        toolState[toolKey].history.push({
            word: currentSelectedWord,
            result: result
        });

        toolState[toolKey].currentIndex = toolState[toolKey].history.length - 1;
        renderToolState(toolKey);
        showToast('Generated!', 'success', 'check-circle-2');
    }, 800);
}

// 4. Renderers (Updated to sync button text with history)
function renderToolState(toolKey) {
    const state = toolState[toolKey];
    const resultArea = document.getElementById(`${toolKey}-result`);
    const pagination = document.getElementById(`${toolKey}-pagination`);

    if (state.history.length === 0) {
        resultArea.classList.add('empty');
        resultArea.innerHTML = `No ${toolKey} yet`;
        pagination.classList.add('hidden');
        return;
    }

    const currentEntry = state.history[state.currentIndex];
    resultArea.classList.remove('empty');
    pagination.classList.remove('hidden');

    if (toolKey === 'translate') {
        resultArea.innerHTML = `<p class="text-left-align">${currentEntry.result}</p>`;
    } else if (toolKey === 'image') {
        resultArea.innerHTML = `<img src="${currentEntry.result}" class="generated-image">`;
    } else if (toolKey === 'audio') {
        // SYNC: Button now shows the word stored in history, not the current global selection
        resultArea.innerHTML = `
            <button class="generated-audio-btn">
                <i data-lucide="play-circle"></i> Play "${currentEntry.word}"
            </button>`;
        lucide.createIcons();
    }

    const counter = pagination.querySelector('.page-counter');
    counter.textContent = `${state.currentIndex + 1} / ${state.history.length}`;
    pagination.querySelector('.prev-btn').disabled = state.currentIndex === 0;
    pagination.querySelector('.next-btn').disabled = state.currentIndex === state.history.length - 1;
}

// Initialization and Listeners remain the same...
// (Ensure handleGenerate calls match the new storage format)
document.getElementById('btn-translate').addEventListener('click', async () => {
    if (!currentSelectedWord) {
        showToast('Please select a word first.', 'error', 'alert-circle');
        return;
    }

    const contentId = getContentIdFromUrl();

    showToast('Translating...', 'info', 'loader-2');

    try {
        const response = await fetch('http://localhost:8080/api/ai/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contentId: contentId,
                word: currentSelectedWord
            })
        });

        if (!response.ok) throw new Error("Translation failed");

        const data = await response.json();

        // Push into tool state (same structure as before)
        toolState.translate.history.push({
            word: data.word,
            result: data.result
        });

        toolState.translate.currentIndex =
            toolState.translate.history.length - 1;

        renderToolState('translate');

        showToast('Translation ready!', 'success', 'check-circle-2');

    } catch (error) {
        console.error(error);
        showToast('Translation failed', 'error', 'alert-circle');
    }
});
// ... (rest of listeners)

document.getElementById('btn-image').addEventListener('click', () => {
    handleGenerate('image', (word) => `https://placehold.co/400x250/b85c2f/fff8f2?text=${word}`);
});

document.getElementById('btn-audio').addEventListener('click', () => {
    handleGenerate('audio', (word) => `Audio file for ${word}`);
});

// Setup Pagination Listeners dynamically
['translate', 'image', 'audio'].forEach(toolKey => {
    const pagination = document.getElementById(`${toolKey}-pagination`);

    pagination.querySelector('.prev-btn').addEventListener('click', () => {
        if (toolState[toolKey].currentIndex > 0) {
            toolState[toolKey].currentIndex--;
            renderToolState(toolKey);
        }
    });

    pagination.querySelector('.next-btn').addEventListener('click', () => {
        if (toolState[toolKey].currentIndex < toolState[toolKey].history.length - 1) {
            toolState[toolKey].currentIndex++;
            renderToolState(toolKey);
        }
    });
});

// Toast Notification Helper (reused from upload.js for consistency)
const toastContainer = document.getElementById('toast-container');
const toastMessage = document.getElementById('toast-message');
function showToast(message, type = 'info', icon = 'info') {
    if(!toastContainer) return; // safeguard
    toastContainer.classList.remove('hidden');
    toastMessage.className = `toast ${type}`;
    const iconClass = icon === 'loader-2' ? 'spin' : '';
    toastMessage.innerHTML = `<i data-lucide="${icon}" class="${iconClass}"></i> <span>${message}</span>`;
    lucide.createIcons();
    if (type !== 'info') setTimeout(() => toastContainer.classList.add('hidden'), 3500);
}

// Initialize on load
fetchContent();

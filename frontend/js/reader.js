const API_BASE_URL = 'http://localhost:8080/api/content';

/**
 * Helper to get a translation from common.js
 */
function getTranslation(key) {
    if (typeof window.applyTranslations !== 'function') return key;
    const lang = localStorage.getItem('language') || 'en';
    // This is a bit of a hack since we don't export the translations object,
    // but we can temporarily call applyTranslations or just trust the keys
    // For now, let's just use a simple lookup if possible or re-define what we need
    // Better: let's hope common.js is already loaded.
    // Actually, we can just access the translations if we modify common.js to expose them.
    // Or we can just re-implement a minimal version here for the dynamic parts.
    const translations = {
        en: {
            readerSelectedLabel: 'Selected',
            translateEmpty: 'No translations yet',
            imageEmpty: 'No images yet',
            audioEmpty: 'No audio yet',
            btnPlay: 'Play',
            toastTranslating: 'Translating to',
            toastGeneratingImage: 'Generating image...',
            toastGeneratingAudio: 'Generating audio...',
            toastTranslationReady: 'Translation ready!',
            toastImageReady: 'Image ready!',
            toastAudioReady: 'Audio ready!',
            toastTranslationFailed: 'Translation failed',
            toastImageFailed: 'Image generation failed',
            toastAudioFailed: 'Audio generation failed',
            toastSelectWordFirst: 'Please select a word first.',
            toastNoWordSelected: 'No word selected'
        },
        de: {
            readerSelectedLabel: 'Ausgewählt',
            translateEmpty: 'Noch keine Übersetzungen',
            imageEmpty: 'Noch keine Bilder',
            audioEmpty: 'Noch keine Audioaufnahmen',
            btnPlay: 'Abspielen',
            toastTranslating: 'Übersetze nach',
            toastGeneratingImage: 'Bild wird generiert...',
            toastGeneratingAudio: 'Audio wird generiert...',
            toastTranslationReady: 'Übersetzung bereit!',
            toastImageReady: 'Bild bereit!',
            toastAudioReady: 'Audio bereit!',
            toastTranslationFailed: 'Übersetzung fehlgeschlagen',
            toastImageFailed: 'Bildgenerierung fehlgeschlagen',
            toastAudioFailed: 'Audiogenerierung fehlgeschlagen',
            toastSelectWordFirst: 'Bitte wählen Sie zuerst ein Wort aus.',
            toastNoWordSelected: 'Kein Wort ausgewählt'
        },
        es: {
            readerSelectedLabel: 'Seleccionado',
            translateEmpty: 'Aún no hay traducciones',
            imageEmpty: 'Aún no hay imágenes',
            audioEmpty: 'Aún no hay audios',
            btnPlay: 'Reproducir',
            toastTranslating: 'Traduciendo al',
            toastGeneratingImage: 'Generando imagen...',
            toastGeneratingAudio: 'Generando audio...',
            toastTranslationReady: '¡Traducción lista!',
            toastImageReady: '¡Imagen lista!',
            toastAudioReady: '¡Audio listo!',
            toastTranslationFailed: 'Error en la traducción',
            toastImageFailed: 'Error al generar la imagen',
            toastAudioFailed: 'Error al generar el audio',
            toastTranslationReady: '¡Traducción lista!',
            toastSelectWordFirst: 'Por favor, selecciona primero una palabra.',
            toastNoWordSelected: 'Ninguna palabra seleccionada'
        }
    };
    const langData = translations[lang] || translations.en;
    return langData[key] || key;
}

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
    if (!text || text.trim() === "") {
        textContainer.innerHTML = "<p>No text available</p>";
        return;
    }

    // Split into tokens (words vs non‑words)
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

    // Translations (Annotations)
    if (data.annotations) {
        data.annotations.forEach(a => {
            toolState.translate.history.push({
                word: a.selectedText,
                result: a.generatedText
            });
        });
    }

    // Images
    if (data.images) {
        data.images.forEach(img => {
            toolState.image.history.push({
                // CORRECT
                word: img.selectedText,
                result: `http://localhost:8080/api/content/image/${img.minioObjectKey}`
            });
        });
    }

    // Audios
    if (data.audios) {
        data.audios.forEach(audio => {
            toolState.audio.history.push({
                // CORRECT
                word: audio.text,
                result: `http://localhost:8080/api/content/audio/${audio.minioObjectKey}`
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
    translate: {history: [], currentIndex: -1},
    image: {history: [], currentIndex: -1},
    audio: {history: [], currentIndex: -1}
};

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
        selectedWordDisplay.innerHTML = `${getTranslation('readerSelectedLabel')}: <strong style="color: var(--primary); font-size: 1.2rem;">${currentSelectedWord}</strong>`;
        selectedWordDisplay.classList.remove('text-muted');
    }

    updateToolButtonsState();
});

// 3. Tool Generation Logic (Updated to store word in history)
function handleGenerate(toolKey, generatorFunction) {
    if (!currentSelectedWord) {
        showToast(getTranslation('toastSelectWordFirst'), 'error', 'alert-circle');
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

    // Elements for the image word label
    const imageWordDisplay = document.getElementById('image-word-display');
    const imageWordText = document.getElementById('image-word-text');

    if (state.history.length === 0) {
        resultArea.classList.add('empty');

        // FIX: Use correct grammar for empty states instead of raw toolKey strings
        const emptyMessages = {
            'translate': getTranslation('translateEmpty'),
            'image': getTranslation('imageEmpty'),
            'audio': getTranslation('audioEmpty')
        };
        resultArea.innerHTML = emptyMessages[toolKey];

        pagination.classList.add('hidden');

        // Hide badge if there are no images
        if (toolKey === 'image' && imageWordDisplay) {
            imageWordDisplay.classList.add('hidden');
        }
        return;
    }

    const currentEntry = state.history[state.currentIndex];
    resultArea.classList.remove('empty');
    pagination.classList.remove('hidden');

    if (toolKey === 'translate') {
        resultArea.innerHTML = `<p class="text-left-align">${currentEntry.result}</p>`;
    } else if (toolKey === 'image') {
        resultArea.innerHTML = `<img src="${currentEntry.result}" class="generated-image">`;

        // Update and show the elegant badge
        if (imageWordDisplay && imageWordText) {
            imageWordText.textContent = currentEntry.word;
            imageWordDisplay.classList.remove('hidden');
        }
    } else if (toolKey === 'audio') {
        resultArea.innerHTML = `
            <button class="generated-audio-btn" data-audio="${currentEntry.result}">
                <i data-lucide="play-circle"></i> ${getTranslation('btnPlay')} "${currentEntry.word}"
            </button>
        `;

        lucide.createIcons();

        const btn = resultArea.querySelector('.generated-audio-btn');
        btn.addEventListener('click', () => {
            const audio = new Audio(btn.dataset.audio);
            audio.play();
        });
    }

    const counter = pagination.querySelector('.page-counter');
    counter.textContent = `${state.currentIndex + 1} / ${state.history.length}`;
    pagination.querySelector('.prev-btn').disabled = state.currentIndex === 0;
    pagination.querySelector('.next-btn').disabled = state.currentIndex === state.history.length - 1;
}

function getContextSentence(clickedElement) {
    const text = textContainer.innerText;

    // Split into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

    // Get full text BEFORE the clicked word
    const range = document.createRange();
    range.setStart(textContainer, 0);
    range.setEndBefore(clickedElement);

    const textBefore = range.toString();

    // Count how many sentences are before this word
    const sentencesBefore = textBefore.match(/[^.!?]+[.!?]+/g) || [];
    const index = sentencesBefore.length;

    // Get current + 6 previous sentences
    const start = Math.max(0, index - 6);
    const contextSentences = sentences.slice(start, index + 1);

    return contextSentences.join(' ').trim();
}

// Initialization and Listeners remain the same...
// (Ensure handleGenerate calls match the new storage format)
document.getElementById('btn-translate').addEventListener('click', async () => {
    if (!currentSelectedWord) {
        showToast(getTranslation('toastSelectWordFirst'), 'error', 'alert-circle');
        return;
    }

    const contentId = getContentIdFromUrl();
    const targetLanguage = document.getElementById('language-picker').value; // Get selected language
    const selectedElement = document.querySelector('.word.selected');
    if (!selectedElement) {
        showToast(getTranslation('toastNoWordSelected'), 'error');
        return;
    }
    const context = getContextSentence(selectedElement);

    const langMap = {
        English: "English",
        Spanish: "Spanish",
        German: "German",
        French: "French",
        Italian: "Italian",
        Portuguese: "Portuguese",
        Turkish: "Turkish"
    };

    showToast(`${getTranslation('toastTranslating')} ${langMap[targetLanguage]}...`, 'info', 'loader-2');

    try {
        const response = await fetch('http://localhost:8080/api/ai/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contentId: contentId,
                word: currentSelectedWord,
                language: targetLanguage,
                context: context
            })
        });

        if (!response.ok) throw new Error("Translation failed");

        const data = await response.json();

        toolState.translate.history.push({
            word: data.word,
            result: data.result
        });

        toolState.translate.currentIndex = toolState.translate.history.length - 1;
        renderToolState('translate');
        showToast(getTranslation('toastTranslationReady'), 'success', 'check-circle-2');

    } catch (error) {
        console.error(error);
        showToast(getTranslation('toastTranslationFailed'), 'error', 'alert-circle');
    }
});

document.getElementById('btn-image').addEventListener('click', async () => {
    if (!currentSelectedWord) {
        showToast(getTranslation('toastSelectWordFirst'), 'error', 'alert-circle');
        return;
    }

    const contentId = getContentIdFromUrl();
    const selectedElement = document.querySelector('.word.selected');
    if (!selectedElement) {
        showToast(getTranslation('toastNoWordSelected'), 'error');
        return;
    }
    const context = getContextSentence(selectedElement);

    showToast(getTranslation('toastGeneratingImage'), 'info', 'loader-2');

    try {
        const response = await fetch('http://localhost:8080/api/ai/image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contentId: contentId,
                word: currentSelectedWord,
                context: context
            })
        });

        if (!response.ok) throw new Error("Image generation failed");

        const data = await response.json();

        toolState.image.history.push({
            word: currentSelectedWord,
            result: `http://localhost:8080/api/content/image/${data.imageKey}`
        });

        toolState.image.currentIndex = toolState.image.history.length - 1;
        renderToolState('image');

        showToast(getTranslation('toastImageReady'), 'success', 'check-circle-2');

    } catch (error) {
        console.error(error);
        showToast(getTranslation('toastImageFailed'), 'error', 'alert-circle');
    }
});

document.getElementById('btn-audio').addEventListener('click', async () => {
    if (!currentSelectedWord) {
        showToast(getTranslation('toastSelectWordFirst'), 'error', 'alert-circle');
        return;
    }

    const contentId = getContentIdFromUrl();

    showToast(getTranslation('toastGeneratingAudio'), 'info', 'loader-2');

    try {
        const response = await fetch('http://localhost:8080/api/ai/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contentId: contentId,
                word: currentSelectedWord
            })
        });

        if (!response.ok) throw new Error("Audio generation failed");

        const data = await response.json();

        toolState.audio.history.push({
            word: currentSelectedWord,
            result: `http://localhost:8080/api/content/audio/${data.audioKey}`
        });

        toolState.audio.currentIndex = toolState.audio.history.length - 1;
        renderToolState('audio');

        showToast(getTranslation('toastAudioReady'), 'success', 'check-circle-2');

    } catch (error) {
        console.error(error);
        showToast(getTranslation('toastAudioFailed'), 'error', 'alert-circle');
    }
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
    if (!toastContainer) return; // safeguard
    toastContainer.classList.remove('hidden');
    toastMessage.className = `toast ${type}`;
    const iconClass = icon === 'loader-2' ? 'spin' : '';
    toastMessage.innerHTML = `<i data-lucide="${icon}" class="${iconClass}"></i> <span>${message}</span>`;
    lucide.createIcons();
    if (type !== 'info') setTimeout(() => toastContainer.classList.add('hidden'), 3500);
}

const translateBtn = document.getElementById('btn-translate');
const imageBtn = document.getElementById('btn-image');
const audioBtn = document.getElementById('btn-audio');

function updateToolButtonsState() {
    const hasSelection = !!currentSelectedWord;

    translateBtn.disabled = !hasSelection;
    imageBtn.disabled = !hasSelection;
    audioBtn.disabled = !hasSelection;
}

updateToolButtonsState();

// Listen for language changes to update static text and re-render dynamic parts
window.addEventListener('languageChanged', (e) => {
    const lang = e.detail.language;
    if (typeof window.applyTranslations === 'function') {
        window.applyTranslations(lang);
    }

    // Re-render "Selected: word" display if something is selected
    if (currentSelectedWord) {
        selectedWordDisplay.innerHTML = `${getTranslation('readerSelectedLabel')}: <strong style="color: var(--primary); font-size: 1.2rem;">${currentSelectedWord}</strong>`;
    }

    // Re-render tool results (empty states, Play buttons)
    ['translate', 'image', 'audio'].forEach(key => renderToolState(key));
});

// Initialize on load
fetchContent();

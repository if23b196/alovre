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
            toastSelectWordFirst: 'Por favor, selecciona primero una palabra.',
            toastNoWordSelected: 'Ninguna palabra seleccionada'
        },
        fr: {
            readerSelectedLabel: 'Sélectionné',
            translateEmpty: 'Aucune traduction pour le moment',
            imageEmpty: 'Aucune image pour le moment',
            audioEmpty: 'Aucun audio pour le moment',
            btnPlay: 'Lecture',
            toastTranslating: 'Traduction vers',
            toastGeneratingImage: 'Génération de l’image...',
            toastGeneratingAudio: 'Génération de l’audio...',
            toastTranslationReady: 'Traduction prête !',
            toastImageReady: 'Image prête !',
            toastAudioReady: 'Audio prêt !',
            toastTranslationFailed: 'Échec de la traduction',
            toastImageFailed: 'Échec de la génération de l’image',
            toastAudioFailed: 'Échec de la génération de l’audio',
            toastSelectWordFirst: 'Veuillez d’abord sélectionner un mot.',
            toastNoWordSelected: 'Aucun mot sélectionné'
        },
        it: {
            readerSelectedLabel: 'Selezionato',
            translateEmpty: 'Nessuna traduzione ancora',
            imageEmpty: 'Nessuna immagine ancora',
            audioEmpty: 'Nessun audio ancora',
            btnPlay: 'Riproduci',
            toastTranslating: 'Traduzione in corso verso',
            toastGeneratingImage: 'Generazione immagine...',
            toastGeneratingAudio: 'Generazione audio...',
            toastTranslationReady: 'Traduzione pronta!',
            toastImageReady: 'Immagine pronta!',
            toastAudioReady: 'Audio pronto!',
            toastTranslationFailed: 'Traduzione non riuscita',
            toastImageFailed: 'Generazione immagine non riuscita',
            toastAudioFailed: 'Generazione audio non riuscita',
            toastSelectWordFirst: 'Seleziona prima una parola.',
            toastNoWordSelected: 'Nessuna parola selezionata'
        },
        pt: {
            readerSelectedLabel: 'Selecionado',
            translateEmpty: 'Nenhuma tradução ainda',
            imageEmpty: 'Nenhuma imagem ainda',
            audioEmpty: 'Nenhum áudio ainda',
            btnPlay: 'Reproduzir',
            toastTranslating: 'Traduzindo para',
            toastGeneratingImage: 'Gerando imagem...',
            toastGeneratingAudio: 'Gerando áudio...',
            toastTranslationReady: 'Tradução pronta!',
            toastImageReady: 'Imagem pronta!',
            toastAudioReady: 'Áudio pronto!',
            toastTranslationFailed: 'Falha na tradução',
            toastImageFailed: 'Falha ao gerar imagem',
            toastAudioFailed: 'Falha ao gerar áudio',
            toastSelectWordFirst: 'Por favor, selecione uma palavra primeiro.',
            toastNoWordSelected: 'Nenhuma palavra selecionada'
        },
        tr: {
            readerSelectedLabel: 'Seçilen',
            translateEmpty: 'Henüz çeviri yok',
            imageEmpty: 'Henüz görsel yok',
            audioEmpty: 'Henüz ses yok',
            btnPlay: 'Oynat',
            toastTranslating: 'Şu dile çevriliyor',
            toastGeneratingImage: 'Görsel oluşturuluyor...',
            toastGeneratingAudio: 'Ses oluşturuluyor...',
            toastTranslationReady: 'Çeviri hazır!',
            toastImageReady: 'Görsel hazır!',
            toastAudioReady: 'Ses hazır!',
            toastTranslationFailed: 'Çeviri başarısız oldu',
            toastImageFailed: 'Görsel oluşturma başarısız oldu',
            toastAudioFailed: 'Ses oluşturma başarısız oldu',
            toastSelectWordFirst: 'Lütfen önce bir kelime seçin.',
            toastNoWordSelected: 'Kelime seçilmedi'
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
    // Using \p{L} for Unicode letters and \p{M} for marks to support German umlauts and other characters
    const wordRegex = /([\p{L}\p{M}0-9'-]+)/gu;
    const tokens = text.split(wordRegex);

    textContainer.innerHTML = tokens.map(token => {
        // Reset lastIndex for the regex since it has the global flag
        wordRegex.lastIndex = 0;
        if (wordRegex.test(token)) {
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
    // We use CSS.escape to handle any special characters in the data-word attribute
    document.querySelectorAll(`.word[data-word="${CSS.escape(clickedWord)}"]`).forEach(el => {
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

// 4. Renderers (Updated to sync button text and display word badges dynamically)
function renderToolState(toolKey) {
    const state = toolState[toolKey];
    const resultArea = document.getElementById(`${toolKey}-result`);
    const pagination = document.getElementById(`${toolKey}-pagination`);

    // Dynamic badge element matching based on toolKey (translate or image)
    const wordDisplay = document.getElementById(`${toolKey}-word-display`);
    const wordText = document.getElementById(`${toolKey}-word-text`);

    if (state.history.length === 0) {
        resultArea.classList.add('empty');

        const emptyMessages = {
            'translate': getTranslation('translateEmpty'),
            'image': getTranslation('imageEmpty'),
            'audio': getTranslation('audioEmpty')
        };
        resultArea.innerHTML = emptyMessages[toolKey];

        pagination.classList.add('hidden');

        // Hide badge dynamically if history is cleared/empty
        if (wordDisplay) {
            wordDisplay.classList.add('hidden');
        }
        return;
    }

    const currentEntry = state.history[state.currentIndex];
    resultArea.classList.remove('empty');
    pagination.classList.remove('hidden');

    // Update and show the badge layout automatically if it exists for the feature
    if (wordDisplay && wordText) {
        wordText.textContent = currentEntry.word;
        wordDisplay.classList.remove('hidden');
    }

    if (toolKey === 'translate') {
        resultArea.innerHTML = `<p class="text-left-align">${currentEntry.result}</p>`;
    } else if (toolKey === 'image') {
        resultArea.innerHTML = `<img src="${currentEntry.result}" class="generated-image">`;
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

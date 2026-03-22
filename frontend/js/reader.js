// Dummy text replicating the screenshot for demonstration
const rawText = `🧩 1. The Bourne Identity (2002)

The story begins with a man floating unconscious in the Mediterranean Sea, riddled with bullet wounds. Fishermen rescue him, and when he awakens, he discovers he has complete amnesia—no memory of his name, past, or why he was shot. The only clue is a laser projector embedded under his skin, revealing a Swiss bank account number.

In Zurich, he opens a safety deposit box containing multiple passports, cash in various currencies, and a U.S. passport identifying him as Jason Bourne. As he tries to piece together his identity, he realizes he possesses extraordinary combat skills, fluency in multiple languages, and tactical instincts far beyond those of a normal person.

The CIA, meanwhile, becomes aware that Bourne is alive. He was part of Operation Treadstone, a black‑ops assassination program. His last mission—an attempt to assassinate African dictator Wombosi—failed, triggering his memory loss. Treadstone’s director, Conklin, sends assassins to eliminate him.

Bourne teams up with Marie Kreutz, a German drifter who helps him escape Paris. As they grow close, Bourne confronts several Treadstone operatives, ultimately killing the last one and learning fragments of his past. He refuses to continue as a killer. Conklin is later killed by his own superiors, and Treadstone is shut down. Bourne and Marie flee to Greece to start a new life. 
💥 2. The Bourne Supremacy (2004)

Two years later, Bourne and Marie are living quietly in Goa, India. But a Russian agent named Kirill, working for corrupt oil magnate Yuri Gretkov, frames Bourne for the theft of $20 million and the murder of two CIA operatives. Kirill attempts to kill Bourne, but Marie is shot and killed instead.

Devastated, Bourne returns to Europe seeking answers and revenge. The CIA, led by Deputy Director Pamela Landy, believes Bourne is responsible for the botched operation and pursues him. Bourne uncovers that CIA official Ward Abbott orchestrated the original theft and framed him.

With help from former Treadstone technician Nicky Parsons, Bourne learns that Abbott ordered him to assassinate a Russian politician named Neski years earlier. Abbott commits suicide when confronted. Bourne then travels to Moscow to apologize to Neski’s daughter for killing her parents, showing his growing moral conscience.

The film ends with Bourne telling Landy, “Get some rest,” after calling her from New York—showing he is still one step ahead. 
🚨 3. The Bourne Ultimatum (2007)

Picking up immediately after Supremacy, Bourne is still on the run. A British journalist uncovers information about Blackbriar, a successor program to Treadstone. When the journalist is killed by CIA operatives, Bourne realizes the agency is still covering up its crimes.

He travels across Europe—London, Madrid, Tangier—evading CIA hit squads while uncovering deeper layers of the conspiracy. Nicky Parsons helps him again, revealing that Bourne volunteered for Treadstone and underwent brutal psychological conditioning.

The CIA’s Blackbriar director, Noah Vosen, tries to eliminate Bourne, but Pamela Landy secretly aids him by faxing him classified documents that reveal his true identity: David Webb, born in Nixa, Missouri.

Bourne returns to the original Treadstone training facility in New York, where he confronts Dr. Hirsch, the man who turned him into an assassin. After learning the truth, Bourne escapes onto a rooftop and is shot, falling into the East River—mirroring the opening of the first film.

But he survives and swims away, finally free of the CIA’s control. 
🔄 4. The Bourne Legacy (2012)

This film runs parallel to the events of Ultimatum but follows a new protagonist: Aaron Cross, an operative in Operation Outcome, another CIA black‑ops program. Unlike Treadstone, Outcome enhances agents’ physical and cognitive abilities through medication.

When Bourne’s exposure of Treadstone and Blackbriar threatens to reveal Outcome, CIA officials decide to eliminate all Outcome agents. Cross survives multiple assassination attempts and teams up with Dr. Marta Shearing, a scientist who worked on the program.

Though Jason Bourne never appears, his actions directly trigger the events of the film. The story expands the universe, showing that Treadstone was only one part of a much larger network of covert programs. 
🔍 5. Jason Bourne (2016)

Years after disappearing, Bourne resurfaces when Nicky Parsons hacks the CIA and uncovers files about the origins of Treadstone—and Bourne’s father, Richard Webb, who was involved in creating the program.

The CIA, now led by Director Robert Dewey, launches a manhunt. A young cyber‑ops specialist, Heather Lee, believes she can bring Bourne back into the fold, but Dewey wants him dead.

Bourne learns that his father opposed Treadstone and was killed to ensure Bourne would join the program. This revelation reignites his quest for the truth.

The film culminates in a massive chase in Las Vegas, where Bourne kills the Asset responsible for his father’s death. Heather Lee attempts to manipulate Bourne into rejoining the CIA, but he secretly records her plan.

Once again, Bourne walks away—free, but still hunted. `;

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
document.getElementById('btn-translate').addEventListener('click', () => {
    handleGenerate('translate', (word) => `(Spanish) La palabra "${word}" se traduce como...`);
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
initReader();
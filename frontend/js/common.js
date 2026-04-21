/* global lucide */
// Shared logic across all pages
document.addEventListener('DOMContentLoaded', async () => {
    // Load Navbar
    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        try {
            // Use relative path from the current html file
            // Since all html files are in the same directory, 'navbar.html' is fine
            const response = await fetch('navbar.html');
            if (response.ok) {
                navbarContainer.innerHTML = await response.text();

                // Language Selector logic - MUST BE INSIDE OR AFTER NAVBAR LOADING
                const languageSelect = document.getElementById('language-select-nav');
                const themeToggleBtn = document.getElementById('theme-toggle');
                const currentLang = localStorage.getItem('language') || 'en';

                if (languageSelect) {
                    languageSelect.value = currentLang;
                    languageSelect.addEventListener('change', (e) => {
                        const newLang = e.target.value;
                        localStorage.setItem('language', newLang);
                        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                            applyTranslations(newLang);
                        }
                    });
                }

                if (themeToggleBtn) {
                    updateThemeIcon(themeToggleBtn);
                    themeToggleBtn.addEventListener('click', () => {
                        htmlEl.classList.toggle('dark');
                        localStorage.setItem('theme', htmlEl.classList.contains('dark') ? 'dark' : 'light');
                        updateThemeIcon(themeToggleBtn);
                    });
                }

                // Initial translation if on homepage
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('/')) {
                    applyTranslations(currentLang);
                }

                // Re-initialize lucide for the new navbar content
                lucide.createIcons();
            } else {
                console.error('Failed to load navbar:', response.statusText);
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    const htmlEl = document.documentElement;

    // Load saved theme from localStorage (do this immediately to avoid flash)
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
    }

    // Initialize lucide icons for elements already on the page (like modals)
    lucide.createIcons();

    function updateThemeIcon(btn) {
        if (!btn) return;
        btn.innerHTML = '';
        const newIcon = document.createElement('i');
        newIcon.setAttribute('data-lucide', htmlEl.classList.contains('dark') ? 'sun' : 'moon');
        btn.appendChild(newIcon);
        lucide.createIcons();
    }

    function applyTranslations(lang) {
        const translations = {
            en: {
                heroTitle: 'Read what you love.<br>Learn a language naturally.',
                heroDesc: 'Master a new language by immersing yourself in your <strong>own content</strong>. Upload PDFs, TXT files, or paste raw text, and let intelligent AI turn your favorite reading material into an interactive learning experience.',
                btnUpload: 'Start Uploading',
                btnLibrary: 'View Library',
                feature1Title: 'Contextual Translation',
                feature1Desc: 'Move beyond simple dictionary lookups. Get AI-powered translations and deep grammar explanations that help you truly understand nuances and master new vocabulary organically.',
                feature2Title: 'Visual Memory',
                feature2Desc: 'Struggling to remember a word? Generate an image based on selected text. Creating visual associations is a proven way to lock new vocabulary into your long-term memory.',
                feature3Title: 'Perfect Pronunciation',
                feature3Desc: 'Never guess how a word sounds. Use high-fidelity Text-to-Speech to hear the correct pronunciation, improving your listening skills and speaking confidence.',
                faqTitle: 'Frequently Asked Questions',
                faq1Q: 'How do I navigate the platform?',
                faq1A: 'The navigation bar at the top is your control center. Click the <strong>alovre</strong> logo anytime to return home. Use <strong>Upload</strong> to add new material or <strong>Library</strong> to view your saved content.',
                faq2Q: 'How do I upload new content?',
                faq2A: 'Head to the Upload page. Provide a mandatory name, select the source language, and choose your format:',
                faq2Doc: 'Document:',
                faq2DocDesc: 'Drag and drop or click to upload PDF/TXT files.',
                faq2Text: 'Plain Text:',
                faq2TextDesc: 'Paste raw text directly into the field.',
                faq3Q: 'Where can I manage my uploaded files?',
                faq3A: 'Your <strong>Library</strong> displays all uploads in a structured table. You can search by name, delete old content or rename your files. Clicking on any item in the table will open the Reader Mode.',
                faq4Q: 'How do the AI learning tools work?',
                faq4A: 'Inside the Reader Mode, simply <strong>click any word</strong> in the text to select it. Then use the tools on the right:',
                faq4Translate: 'Translate:',
                faq4TranslateDesc: 'Get contextual translations into a language of choice and explanation in the contents language.',
                faq4Image: 'Image:',
                faq4ImageDesc: 'Generate a visual association for the word.',
                faq4Pronounce: 'Pronounce:',
                faq4PronounceDesc: 'Hear the word read aloud by clicking the generated Play button.',
                navUpload: 'Upload',
                navLibrary: 'Library',
                techBadge: 'Powered by Google AI Services'
            },
            de: {
                heroTitle: 'Lies, was du liebst.<br>Lerne eine Sprache natürlich.',
                heroDesc: 'Meistere eine neue Sprache, indem du in deine <strong>eigenen Inhalte</strong> eintauchst. Lade PDFs, TXT-Dateien hoch oder füge Rohtext ein und lass intelligente KI dein Lieblingslesematerial in ein interaktives Lernerlebnis verwandeln.',
                btnUpload: 'Upload starten',
                btnLibrary: 'Bibliothek anzeigen',
                feature1Title: 'Kontextuelle Übersetzung',
                feature1Desc: 'Gehe über einfache Wörterbuchsuche hinaus. Erhalte KI-gestützte Übersetzungen und tiefe Grammatikerklärungen, die dir helfen, Nuancen wirklich zu verstehen und neues Vokabular organisch zu meistern.',
                feature2Title: 'Visuelles Gedächtnis',
                feature2Desc: 'Schwierigkeiten, sich an ein Wort zu erinnern? Generiere ein Bild basierend auf ausgewähltem Text. Das Erstellen visueller Assoziationen ist ein bewährter Weg, um neues Vokabular im Langzeitgedächtnis zu verankern.',
                feature3Title: 'Perfekte Aussprache',
                feature3Desc: 'Rate niemals, wie ein Wort klingt. Nutze High-Fidelity Text-to-Speech, um die korrekte Aussprache zu hören und deine Hörfähigkeiten sowie dein Sprechvertrauen zu verbessern.',
                faqTitle: 'Häufig gestellte Fragen',
                faq1Q: 'Wie navigiere ich auf der Plattform?',
                faq1A: 'Die Navigationsleiste oben ist dein Kontrollzentrum. Klicke jederzeit auf das <strong>alovre</strong>-Logo, um zur Startseite zurückzukehren. Nutze <strong>Upload</strong>, um neues Material hinzuzufügen, oder <strong>Library</strong>, um deine gespeicherten Inhalte anzuzeigen.',
                faq2Q: 'Wie lade ich neue Inhalte hoch?',
                faq2A: 'Gehe zur Upload-Seite. Gib einen obligatorischen Namen an, wähle die Quellsprache und wähle dein Format:',
                faq2Doc: 'Dokument:',
                faq2DocDesc: 'Drag & Drop oder klicken, um PDF/TXT-Dateien hochzuladen.',
                faq2Text: 'Klartext:',
                faq2TextDesc: 'Füge Rohtext direkt in das Feld ein.',
                faq3Q: 'Wo kann ich meine hochgeladenen Dateien verwalten?',
                faq3A: 'Deine <strong>Bibliothek</strong> zeigt alle Uploads in einer strukturierten Tabelle an. Du kannst nach Namen suchen, alte Inhalte löschen oder deine Dateien umbenennen. Ein Klick auf ein Element in der Tabelle öffnet den Reader-Modus.',
                faq4Q: 'Wie funktionieren die KI-Lerntools?',
                faq4A: 'Klicke im Reader-Modus einfach auf ein <strong>beliebiges Wort</strong> im Text, um es auszuwählen. Nutze dann die Tools auf der rechten Seite:',
                faq4Translate: 'Übersetzen:',
                faq4TranslateDesc: 'Erhalte kontextuelle Übersetzungen in eine Sprache deiner Wahl und Erklärungen in der Sprache des Inhalts.',
                faq4Image: 'Bild:',
                faq4ImageDesc: 'Generiere eine visuelle Assoziation für das Wort.',
                faq4Pronounce: 'Aussprache:',
                faq4PronounceDesc: 'Höre das Wort laut vorlesen, indem du auf den generierten Play-Button klickst.',
                navUpload: 'Upload',
                navLibrary: 'Bibliothek',
                techBadge: 'Unterstützt von Google AI Services'
            },
            es: {
                heroTitle: 'Lee lo que amas.<br>Aprende un idioma de forma natural.',
                heroDesc: 'Domina un nuevo idioma sumergiéndote en tu <strong>propio contenido</strong>. Sube archivos PDF, TXT o pega texto sin formato, y deja que la IA inteligente convierta tu material de lectura favorito en una experiencia de aprendizaje interactiva.',
                btnUpload: 'Empezar a subir',
                btnLibrary: 'Ver biblioteca',
                feature1Title: 'Traducción Contextual',
                feature1Desc: 'Ve más allá de las simples búsquedas en el diccionario. Obtén traducciones impulsadas por IA y explicaciones gramaticales profundas que te ayudarán a comprender realmente los matices y dominar el nuevo vocabulario de forma orgánica.',
                feature2Title: 'Memoria Visual',
                feature2Desc: '¿Te cuesta recordar una palabra? Genera una imagen basada en el texto seleccionado. Crear asociaciones visuales es una forma comprobada de fijar el nuevo vocabulario en tu memoria a largo plazo.',
                feature3Title: 'Pronunciación Perfecta',
                feature3Desc: 'Nunca adivines cómo suena una palabra. Utiliza Text-to-Speech de alta fidelidad para escuchar la pronunciación correcta, mejorando tus habilidades auditivas y tu confianza al hablar.',
                faqTitle: 'Preguntas Frecuentes',
                faq1Q: '¿Cómo navego por la plataforma?',
                faq1A: 'La barra de navegación en la parte superior es tu centro de control. Haz clic en el logotipo de <strong>alovre</strong> en cualquier momento para volver al inicio. Usa <strong>Upload</strong> para añadir material nuevo o <strong>Library</strong> para ver tu contenido guardado.',
                faq2Q: '¿Cómo subo contenido nuevo?',
                faq2A: 'Ve a la página de subida. Proporciona un nombre obligatorio, selecciona el idioma de origen y elige tu formato:',
                faq2Doc: 'Documento:',
                faq2DocDesc: 'Arrastra y suelta o haz clic para subir archivos PDF/TXT.',
                faq2Text: 'Texto sin formato:',
                faq2TextDesc: 'Pega el texto directamente en el campo.',
                faq3Q: '¿Dónde puedo gestionar mis archivos subidos?',
                faq3A: 'Tu <strong>Library</strong> muestra todas las subidas en una tabla estructurada. Puedes buscar por nombre, eliminar contenido antiguo o renombrar tus archivos. Al hacer clic en cualquier elemento de la tabla, se abrirá el modo de lectura.',
                faq4Q: '¿Cómo funcionan las herramientas de aprendizaje de IA?',
                faq4A: 'Dentro del modo de lectura, simplemente haz <strong>clic en cualquier palabra</strong> del texto para seleccionarla. Luego usa las herramientas de la derecha:',
                faq4Translate: 'Traducir:',
                faq4TranslateDesc: 'Obtén traducciones contextuales al idioma que elijas y explicaciones en el idioma del contenido.',
                faq4Image: 'Imagen:',
                faq4ImageDesc: 'Generera una asociación visual para la palabra.',
                faq4Pronounce: 'Pronunciar:',
                faq4PronounceDesc: 'Escucha la palabra leída en voz alta haciendo clic en el botón de reproducción generado.',
                navUpload: 'Subir',
                navLibrary: 'Biblioteca',
                techBadge: 'Impulsado por Google AI Services'
            }
        };

        const t = translations[lang] || translations.en;

        // Navbar (Global)
        const navActions = document.querySelector('.nav-actions');
        if (navActions) {
            const navButtons = navActions.querySelectorAll('.nav-btn');
            navButtons.forEach(btn => {
                const href = btn.getAttribute('href');
                if (href === 'upload.html') {
                    btn.innerHTML = `<i data-lucide="upload"></i> ${t.navUpload}`;
                } else if (href === 'library.html') {
                    btn.innerHTML = `<i data-lucide="library"></i> ${t.navLibrary}`;
                }
            });
        }

        // Hero Section
        const h1 = document.querySelector('.hero-section h1');
        if (h1) h1.innerHTML = t.heroTitle;

        const heroP = document.querySelector('.hero-section p');
        if (heroP) heroP.innerHTML = t.heroDesc;

        const btnPrimary = document.querySelector('.hero-actions .btn-primary');
        if (btnPrimary) {
            btnPrimary.innerHTML = `<i data-lucide="upload-cloud"></i> ${t.btnUpload}`;
        }

        const btnSecondary = document.querySelector('.hero-actions .btn-secondary');
        if (btnSecondary) {
            btnSecondary.innerHTML = `<i data-lucide="library"></i> ${t.btnLibrary}`;
        }

        // Features
        const features = document.querySelectorAll('.feature-card');
        if (features.length >= 3) {
            features[0].querySelector('.feature-title').textContent = t.feature1Title;
            features[0].querySelector('.feature-desc').textContent = t.feature1Desc;
            features[1].querySelector('.feature-title').textContent = t.feature2Title;
            features[1].querySelector('.feature-desc').textContent = t.feature2Desc;
            features[2].querySelector('.feature-title').textContent = t.feature3Title;
            features[2].querySelector('.feature-desc').textContent = t.feature3Desc;
        }

        // FAQ
        const faqTitle = document.querySelector('.faq-section .section-title');
        if (faqTitle) faqTitle.textContent = t.faqTitle;

        const faqItems = document.querySelectorAll('.faq-item');
        if (faqItems.length >= 4) {
            faqItems[0].querySelector('summary span').textContent = t.faq1Q;
            faqItems[0].querySelector('.faq-content p').innerHTML = t.faq1A;
            faqItems[1].querySelector('summary span').textContent = t.faq2Q;

            // Update main text paragraph
            const faq2P = faqItems[1].querySelector('.faq-content p');
            if (faq2P) {
                // Remove any UL that might be inside if browser moved it there
                const existingUl = faq2P.querySelector('ul');
                if (existingUl) existingUl.remove();
                faq2P.innerHTML = t.faq2A;
            }

            // Update the list items
            const faq2ListItems = faqItems[1].querySelectorAll('.faq-content ul li');
            if (faq2ListItems.length >= 2) {
                faq2ListItems[0].innerHTML = `<strong>${t.faq2Doc}</strong> ${t.faq2DocDesc}`;
                faq2ListItems[1].innerHTML = `<strong>${t.faq2Text}</strong> ${t.faq2TextDesc}`;
            }

            faqItems[2].querySelector('summary span').textContent = t.faq3Q;
            faqItems[2].querySelector('.faq-content p').innerHTML = t.faq3A;
            faqItems[3].querySelector('summary span').textContent = t.faq4Q;

            const faq4P = faqItems[3].querySelector('.faq-content p');
            if (faq4P) {
                const existingUl = faq4P.querySelector('ul');
                if (existingUl) existingUl.remove();
                faq4P.innerHTML = t.faq4A;
            }

            const faq4ListItems = faqItems[3].querySelectorAll('.faq-content ul li');
            if (faq4ListItems.length >= 3) {
                faq4ListItems[0].innerHTML = `<strong>${t.faq4Translate}</strong> ${t.faq4TranslateDesc}`;
                faq4ListItems[1].innerHTML = `<strong>${t.faq4Image}</strong> ${t.faq4ImageDesc}`;
                faq4ListItems[2].innerHTML = `<strong>${t.faq4Pronounce}</strong> ${t.faq4PronounceDesc}`;
            }
        }

        // Tech Badge
        const techBadge = document.querySelector('.tech-badge');
        if (techBadge) {
            techBadge.innerHTML = `<i data-lucide="sparkles"></i> ${t.techBadge}`;
        }

        // Re-run lucide to restore icons in modified elements
        lucide.createIcons();
    }
});

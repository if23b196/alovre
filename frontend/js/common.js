const htmlEl = document.documentElement;

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
                        if (window.location.pathname.endsWith('index.html') ||
                            window.location.pathname === '/' ||
                            window.location.pathname.endsWith('/') ||
                            window.location.pathname.endsWith('upload.html') ||
                            window.location.pathname.endsWith('library.html') ||
                            window.location.pathname.endsWith('reader.html')) {
                            applyTranslations(newLang);
                        }
                        // Dispatch a global event so other scripts can react to language change
                        window.dispatchEvent(new CustomEvent('languageChanged', {detail: {language: newLang}}));
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

                // Initial translation if on homepage, upload page, library page or reader page
                if (window.location.pathname.endsWith('index.html') ||
                    window.location.pathname === '/' ||
                    window.location.pathname.endsWith('/') ||
                    window.location.pathname.endsWith('upload.html') ||
                    window.location.pathname.endsWith('library.html') ||
                    window.location.pathname.endsWith('reader.html')) {
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

    // Load saved theme from localStorage (do this immediately to avoid flash)
    if (localStorage.getItem('theme') === 'dark') {
        htmlEl.classList.add('dark');
    }

    // Initialize lucide icons for elements already on the page (like modals)
    lucide.createIcons();

    // Export functions to window object
    window.applyTranslations = applyTranslations;

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
                techBadge: 'Powered by Google AI Services',
                uploadTitle: 'Upload Content',
                labelContentName: 'Content Name',
                placeholderContentName: 'Enter a name for your content...',
                errorContentName: 'Please provide a name for your content first.',
                labelContentLanguage: 'Content Language',
                tabDocument: 'Document',
                tabPlainText: 'Plain Text',
                dropzoneText: 'Click to upload or drag and drop',
                fileHint: 'PDF, TXT files',
                btnUploadDocument: 'Upload Document',
                placeholderPlainText: 'Type or paste your plain text here...',
                errorPlainText: 'Please enter some text before uploading.',
                btnUploadText: 'Upload Text',
                toastUploadingDoc: 'Uploading document...',
                toastUploadingText: 'Uploading text...',
                errorOnlyPdfTxt: 'Only PDF and TXT files are allowed.',
                errorUploadFail: 'Failed to upload document.',
                errorUploadTextFail: 'Failed to upload text.',
                errorServer: 'Server error.',
                libraryTitle: 'Your Library',
                itemCount0: '0 items',
                itemCount1: '1 item',
                itemCountMany: 'items',
                placeholderSearch: 'Search your library...',
                emptyStateText: 'No documents uploaded yet. Upload your first document to get started.',
                thName: 'Name',
                thType: 'Type',
                thDate: 'Date',
                thSize: 'Size',
                thStatus: 'Status',
                statusReady: 'Ready',
                statusProcessing: 'Processing',
                btnEditName: 'Edit Name',
                btnDelete: 'Delete',
                modalEditTitle: 'Edit Content Name',
                placeholderNewName: 'Enter new name...',
                btnCancel: 'Cancel',
                btnSave: 'Save Changes',
                modalDeleteTitle: 'Delete Content',
                deleteConfirmText: 'Are you sure you want to delete',
                deleteUndoText: 'This cannot be undone.',
                readerBackToLibrary: 'Back to Library',
                readerSelectedPrompt: 'Select a word from the text on the left side to use AI tools!',
                readerSelectedLabel: 'Selected',
                btnTranslate: 'Translate & Explain',
                btnImage: 'Image',
                btnPronounce: 'Pronounce',
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
                techBadge: 'Unterstützt von Google AI Services',
                uploadTitle: 'Inhalt hochladen',
                labelContentName: 'Name des Inhalts',
                placeholderContentName: 'Geben Sie einen Namen für Ihren Inhalt ein...',
                errorContentName: 'Bitte geben Sie zuerst einen Namen für Ihren Inhalt an.',
                labelContentLanguage: 'Sprache des Inhalts',
                tabDocument: 'Dokument',
                tabPlainText: 'Klartext',
                dropzoneText: 'Klicken Sie zum Hochladen oder Drag & Drop',
                fileHint: 'PDF, TXT Dateien',
                btnUploadDocument: 'Dokument hochladen',
                placeholderPlainText: 'Geben oder fügen Sie Ihren Klartext hier ein...',
                errorPlainText: 'Bitte geben Sie vor dem Hochladen Text ein.',
                btnUploadText: 'Text hochladen',
                toastUploadingDoc: 'Dokument wird hochgeladen...',
                toastUploadingText: 'Text wird hochgeladen...',
                errorOnlyPdfTxt: 'Nur PDF- und TXT-Dateien sind erlaubt.',
                errorUploadFail: 'Hochladen des Dokuments fehlgeschlagen.',
                errorUploadTextFail: 'Hochladen des Textes fehlgeschlagen.',
                errorServer: 'Serverfehler.',
                libraryTitle: 'Ihre Bibliothek',
                itemCount0: '0 Elemente',
                itemCount1: '1 Element',
                itemCountMany: 'Elemente',
                placeholderSearch: 'Suchen Sie in Ihrer Bibliothek...',
                emptyStateText: 'Noch keine Dokumente hochgeladen. Laden Sie Ihr erstes Dokument hoch, um zu beginnen.',
                thName: 'Name',
                thType: 'Typ',
                thDate: 'Datum',
                thSize: 'Größe',
                thStatus: 'Status',
                statusReady: 'Bereit',
                statusProcessing: 'Wird verarbeitet',
                btnEditName: 'Name bearbeiten',
                btnDelete: 'Löschen',
                modalEditTitle: 'Name des Inhalts bearbeiten',
                placeholderNewName: 'Neuen Namen eingeben...',
                btnCancel: 'Abbrechen',
                btnSave: 'Änderungen speichern',
                modalDeleteTitle: 'Inhalt löschen',
                deleteConfirmText: 'Sind Sie sicher, dass Sie löschen möchten',
                deleteUndoText: 'Dies kann nicht rückgängig gemacht werden.',
                readerBackToLibrary: 'Zurück zur Bibliothek',
                readerSelectedPrompt: 'Wählen Sie ein Wort aus dem Text auf der linken Seite aus, um KI-Tools zu verwenden!',
                readerSelectedLabel: 'Ausgewählt',
                btnTranslate: 'Übersetzen & Erklären',
                btnImage: 'Bild',
                btnPronounce: 'Aussprache',
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
                techBadge: 'Impulsado por Google AI Services',
                uploadTitle: 'Subir contenido',
                labelContentName: 'Nombre del contenido',
                placeholderContentName: 'Introduce un nombre para tu contenido...',
                errorContentName: 'Por favor, proporciona un nombre para tu contenido primero.',
                labelContentLanguage: 'Idioma del contenido',
                tabDocument: 'Documento',
                tabPlainText: 'Texto sin formato',
                dropzoneText: 'Haz clic para subir o arrastra y suelta',
                fileHint: 'Archivos PDF, TXT',
                btnUploadDocument: 'Subir documento',
                placeholderPlainText: 'Escribe o pega tu texto aquí...',
                errorPlainText: 'Por favor, introduce algún texto antes de subirlo.',
                btnUploadText: 'Subir texto',
                toastUploadingDoc: 'Subiendo documento...',
                toastUploadingText: 'Subiendo texto...',
                errorOnlyPdfTxt: 'Solo se permiten archivos PDF y TXT.',
                errorUploadFail: 'Error al subir el documento.',
                errorUploadTextFail: 'Error al subir el texto.',
                errorServer: 'Error del servidor.',
                libraryTitle: 'Tu Biblioteca',
                itemCount0: '0 elementos',
                itemCount1: '1 elemento',
                itemCountMany: 'elementos',
                placeholderSearch: 'Buscar en tu biblioteca...',
                emptyStateText: 'Aún no se han subido documentos. Sube tu primer documento para empezar.',
                thName: 'Nombre',
                thType: 'Tipo',
                thDate: 'Fecha',
                thSize: 'Tamaño',
                thStatus: 'Estado',
                statusReady: 'Listo',
                statusProcessing: 'Procesando',
                btnEditName: 'Editar nombre',
                btnDelete: 'Eliminar',
                modalEditTitle: 'Editar nombre del contenido',
                placeholderNewName: 'Introduce un nuevo nombre...',
                btnCancel: 'Cancelar',
                btnSave: 'Guardar cambios',
                modalDeleteTitle: 'Eliminar contenido',
                deleteConfirmText: '¿Estás seguro de que quieres eliminar',
                deleteUndoText: 'Esta acción no se puede deshacer.',
                readerBackToLibrary: 'Volver a la biblioteca',
                readerSelectedPrompt: '¡Selecciona una palabra del texto de la izquierda para usar las herramientas de IA!',
                readerSelectedLabel: 'Seleccionado',
                btnTranslate: 'Traducir y Explicar',
                btnImage: 'Imagen',
                btnPronounce: 'Pronunciar',
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
                heroTitle: 'Lisez ce que vous aimez.<br>Apprenez une langue naturellement.',
                heroDesc: 'Maîtrisez une nouvelle langue en vous immergeant dans votre <strong>propre contenu</strong>. Importez des fichiers PDF, TXT ou collez du texte brut, et laissez une IA intelligente transformer votre matériel de lecture préféré en une expérience d’apprentissage interactive.',
                btnUpload: 'Commencer l’importation',
                btnLibrary: 'Voir la bibliothèque',
                feature1Title: 'Traduction contextuelle',
                feature1Desc: 'Allez au-delà des simples recherches dans le dictionnaire. Obtenez des traductions alimentées par l’IA et des explications grammaticales approfondies qui vous aident à comprendre les nuances et à maîtriser naturellement le nouveau vocabulaire.',

                feature2Title: 'Mémoire visuelle',
                feature2Desc: 'Vous avez du mal à retenir un mot ? Générez une image à partir du texte sélectionné. Créer des associations visuelles est une méthode éprouvée pour ancrer durablement du nouveau vocabulaire.',

                feature3Title: 'Prononciation parfaite',
                feature3Desc: 'Ne devinez plus jamais comment un mot se prononce. Utilisez la synthèse vocale haute fidélité pour entendre la prononciation correcte, améliorer votre compréhension orale et renforcer votre confiance à l’oral.',

                faqTitle: 'Foire aux questions',

                faq1Q: 'Comment naviguer sur la plateforme ?',
                faq1A: 'La barre de navigation en haut est votre centre de contrôle. Cliquez sur le logo <strong>alovre</strong> à tout moment pour revenir à l’accueil. Utilisez <strong>Importer</strong> pour ajouter du nouveau contenu ou <strong>Bibliothèque</strong> pour consulter vos fichiers enregistrés.',

                faq2Q: 'Comment importer du nouveau contenu ?',
                faq2A: 'Rendez-vous sur la page d’importation. Fournissez un nom obligatoire, sélectionnez la langue source et choisissez votre format :',
                faq2Doc: 'Document :',
                faq2DocDesc: 'Glissez-déposez ou cliquez pour importer des fichiers PDF/TXT.',
                faq2Text: 'Texte brut :',
                faq2TextDesc: 'Collez directement du texte brut dans le champ.',

                faq3Q: 'Où puis-je gérer mes fichiers importés ?',
                faq3A: 'Votre <strong>Bibliothèque</strong> affiche tous vos imports dans un tableau structuré. Vous pouvez rechercher par nom, supprimer du contenu ancien ou renommer vos fichiers. Cliquer sur un élément du tableau ouvre le Mode Lecture.',

                faq4Q: 'Comment fonctionnent les outils d’apprentissage IA ?',
                faq4A: 'Dans le Mode Lecture, il suffit de <strong>cliquer sur n’importe quel mot</strong> du texte pour le sélectionner. Utilisez ensuite les outils situés à droite :',

                faq4Translate: 'Traduire :',
                faq4TranslateDesc: 'Obtenez des traductions contextuelles dans la langue de votre choix ainsi que des explications dans la langue du contenu.',

                faq4Image: 'Image :',
                faq4ImageDesc: 'Générez une association visuelle pour le mot.',

                faq4Pronounce: 'Prononcer :',
                faq4PronounceDesc: 'Écoutez le mot prononcé en cliquant sur le bouton Lecture généré.',

                navUpload: 'Importer',
                navLibrary: 'Bibliothèque',
                techBadge: 'Propulsé par Google AI Services',

                uploadTitle: 'Importer du contenu',
                labelContentName: 'Nom du contenu',
                placeholderContentName: 'Entrez un nom pour votre contenu...',
                errorContentName: 'Veuillez d’abord fournir un nom pour votre contenu.',

                labelContentLanguage: 'Langue du contenu',
                tabDocument: 'Document',
                tabPlainText: 'Texte brut',

                dropzoneText: 'Cliquez pour importer ou glissez-déposez',
                fileHint: 'Fichiers PDF, TXT',
                btnUploadDocument: 'Importer le document',

                placeholderPlainText: 'Tapez ou collez votre texte brut ici...',
                errorPlainText: 'Veuillez entrer du texte avant d’importer.',
                btnUploadText: 'Importer le texte',

                toastUploadingDoc: 'Importation du document...',
                toastUploadingText: 'Importation du texte...',

                errorOnlyPdfTxt: 'Seuls les fichiers PDF et TXT sont autorisés.',
                errorUploadFail: 'Échec de l’importation du document.',
                errorUploadTextFail: 'Échec de l’importation du texte.',
                errorServer: 'Erreur du serveur.',

                libraryTitle: 'Votre bibliothèque',
                itemCount0: '0 élément',
                itemCount1: '1 élément',
                itemCountMany: 'éléments',

                placeholderSearch: 'Recherchez dans votre bibliothèque...',
                emptyStateText: 'Aucun document importé pour le moment. Importez votre premier document pour commencer.',

                thName: 'Nom',
                thType: 'Type',
                thDate: 'Date',
                thSize: 'Taille',
                thStatus: 'Statut',

                statusReady: 'Prêt',
                statusProcessing: 'En traitement',

                btnEditName: 'Modifier le nom',
                btnDelete: 'Supprimer',

                modalEditTitle: 'Modifier le nom du contenu',
                placeholderNewName: 'Entrez un nouveau nom...',
                btnCancel: 'Annuler',
                btnSave: 'Enregistrer les modifications',

                modalDeleteTitle: 'Supprimer le contenu',
                deleteConfirmText: 'Êtes-vous sûr de vouloir supprimer',
                deleteUndoText: 'Cette action est irréversible.',

                readerBackToLibrary: 'Retour à la bibliothèque',
                readerSelectedPrompt: 'Sélectionnez un mot dans le texte à gauche pour utiliser les outils IA !',
                readerSelectedLabel: 'Sélectionné',

                btnTranslate: 'Traduire & Expliquer',
                btnImage: 'Image',
                btnPronounce: 'Prononcer',

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
                heroTitle: 'Leggi ciò che ami.<br>Impara una lingua in modo naturale.',
                heroDesc: 'Padroneggia una nuova lingua immergendoti nei tuoi <strong>contenuti personali</strong>. Carica file PDF, TXT oppure incolla testo semplice, e lascia che un’intelligente IA trasformi il tuo materiale di lettura preferito in un’esperienza di apprendimento interattiva.',
                btnUpload: 'Inizia il caricamento',
                btnLibrary: 'Visualizza la libreria',
                feature1Title: 'Traduzione contestuale',
                feature1Desc: 'Vai oltre le semplici definizioni del dizionario. Ottieni traduzioni basate sull’IA e spiegazioni grammaticali approfondite che ti aiutano a comprendere davvero le sfumature e ad acquisire nuovo vocabolario in modo naturale.',
                feature2Title: 'Memoria visiva',
                feature2Desc: 'Hai difficoltà a ricordare una parola? Genera un’immagine basata sul testo selezionato. Creare associazioni visive è un metodo comprovato per fissare nuovo vocabolario nella memoria a lungo termine.',
                feature3Title: 'Pronuncia perfetta',
                feature3Desc: 'Non indovinare mai più come si pronuncia una parola. Usa la sintesi vocale ad alta fedeltà per ascoltare la pronuncia corretta, migliorando la comprensione orale e la sicurezza nel parlare.',
                faqTitle: 'Domande frequenti',
                faq1Q: 'Come posso navigare nella piattaforma?',
                faq1A: 'La barra di navigazione in alto è il tuo centro di controllo. Fai clic sul logo <strong>alovre</strong> in qualsiasi momento per tornare alla home. Usa <strong>Upload</strong> per aggiungere nuovo materiale oppure <strong>Library</strong> per visualizzare i contenuti salvati.',
                faq2Q: 'Come posso caricare nuovi contenuti?',
                faq2A: 'Vai alla pagina Upload. Inserisci un nome obbligatorio, seleziona la lingua del contenuto e scegli il formato:',
                faq2Doc: 'Documento:',
                faq2DocDesc: 'Trascina e rilascia oppure fai clic per caricare file PDF/TXT.',
                faq2Text: 'Testo semplice:',
                faq2TextDesc: 'Incolla direttamente il testo nel campo dedicato.',
                faq3Q: 'Dove posso gestire i file caricati?',
                faq3A: 'La tua <strong>Library</strong> mostra tutti i caricamenti in una tabella strutturata. Puoi cercare per nome, eliminare contenuti vecchi oppure rinominare i file. Facendo clic su un elemento della tabella si aprirà la modalità Lettura.',
                faq4Q: 'Come funzionano gli strumenti di apprendimento IA?',
                faq4A: 'All’interno della modalità Lettura, basta <strong>fare clic su una parola</strong> nel testo per selezionarla. Poi utilizza gli strumenti sulla destra:',
                faq4Translate: 'Traduci:',
                faq4TranslateDesc: 'Ottieni traduzioni contestuali nella lingua desiderata e spiegazioni nella lingua del contenuto.',
                faq4Image: 'Immagine:',
                faq4ImageDesc: 'Genera un’associazione visiva per la parola.',
                faq4Pronounce: 'Pronuncia:',
                faq4PronounceDesc: 'Ascolta la parola letta ad alta voce facendo clic sul pulsante Play generato.',
                navUpload: 'Carica',
                navLibrary: 'Libreria',
                techBadge: 'Basato sui servizi IA di Google',
                uploadTitle: 'Carica contenuti',
                labelContentName: 'Nome del contenuto',
                placeholderContentName: 'Inserisci un nome per il tuo contenuto...',
                errorContentName: 'Inserisci prima un nome per il tuo contenuto.',
                labelContentLanguage: 'Lingua del contenuto',
                tabDocument: 'Documento',
                tabPlainText: 'Testo semplice',
                dropzoneText: 'Fai clic per caricare o trascina qui i file',
                fileHint: 'File PDF, TXT',
                btnUploadDocument: 'Carica documento',
                placeholderPlainText: 'Scrivi o incolla qui il tuo testo...',
                errorPlainText: 'Inserisci del testo prima del caricamento.',
                btnUploadText: 'Carica testo',
                toastUploadingDoc: 'Caricamento documento...',
                toastUploadingText: 'Caricamento testo...',
                errorOnlyPdfTxt: 'Sono consentiti solo file PDF e TXT.',
                errorUploadFail: 'Caricamento del documento non riuscito.',
                errorUploadTextFail: 'Caricamento del testo non riuscito.',
                errorServer: 'Errore del server.',
                libraryTitle: 'La tua libreria',
                itemCount0: '0 elementi',
                itemCount1: '1 elemento',
                itemCountMany: 'elementi',
                placeholderSearch: 'Cerca nella tua libreria...',
                emptyStateText: 'Nessun documento caricato ancora. Carica il tuo primo documento per iniziare.',
                thName: 'Nome',
                thType: 'Tipo',
                thDate: 'Data',
                thSize: 'Dimensione',
                thStatus: 'Stato',
                statusReady: 'Pronto',
                statusProcessing: 'Elaborazione',
                btnEditName: 'Modifica nome',
                btnDelete: 'Elimina',
                modalEditTitle: 'Modifica nome del contenuto',
                placeholderNewName: 'Inserisci un nuovo nome...',
                btnCancel: 'Annulla',
                btnSave: 'Salva modifiche',
                modalDeleteTitle: 'Elimina contenuto',
                deleteConfirmText: 'Sei sicuro di voler eliminare',
                deleteUndoText: 'Questa azione non può essere annullata.',
                readerBackToLibrary: 'Torna alla libreria',
                readerSelectedPrompt: 'Seleziona una parola dal testo sul lato sinistro per utilizzare gli strumenti IA!',
                readerSelectedLabel: 'Selezionato',
                btnTranslate: 'Traduci e spiega',
                btnImage: 'Immagine',
                btnPronounce: 'Pronuncia',
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
                heroTitle: 'Leia o que você ama.<br>Aprenda um idioma naturalmente.',
                heroDesc: 'Domine um novo idioma mergulhando no seu <strong>próprio conteúdo</strong>. Envie arquivos PDF, TXT ou cole texto simples, e deixe uma IA inteligente transformar seu material de leitura favorito em uma experiência de aprendizado interativa.',
                btnUpload: 'Começar Upload',
                btnLibrary: 'Ver Biblioteca',
                feature1Title: 'Tradução Contextual',
                feature1Desc: 'Vá além das simples consultas de dicionário. Obtenha traduções com IA e explicações gramaticais detalhadas que ajudam você a realmente entender nuances e aprender novo vocabulário de forma natural.',
                feature2Title: 'Memória Visual',
                feature2Desc: 'Tem dificuldade para lembrar uma palavra? Gere uma imagem com base no texto selecionado. Criar associações visuais é uma maneira comprovada de fixar novo vocabulário na memória de longo prazo.',
                feature3Title: 'Pronúncia Perfeita',
                feature3Desc: 'Nunca mais adivinhe como uma palavra soa. Use conversão de texto em fala de alta fidelidade para ouvir a pronúncia correta, melhorando sua compreensão auditiva e confiança ao falar.',
                faqTitle: 'Perguntas Frequentes',
                faq1Q: 'Como navego pela plataforma?',
                faq1A: 'A barra de navegação no topo é seu centro de controle. Clique no logo <strong>alovre</strong> a qualquer momento para voltar à página inicial. Use <strong>Upload</strong> para adicionar novo material ou <strong>Library</strong> para visualizar seu conteúdo salvo.',
                faq2Q: 'Como faço upload de novo conteúdo?',
                faq2A: 'Vá até a página de Upload. Forneça um nome obrigatório, selecione o idioma do conteúdo e escolha o formato:',
                faq2Doc: 'Documento:',
                faq2DocDesc: 'Arraste e solte ou clique para enviar arquivos PDF/TXT.',
                faq2Text: 'Texto Simples:',
                faq2TextDesc: 'Cole texto simples diretamente no campo.',
                faq3Q: 'Onde posso gerenciar meus arquivos enviados?',
                faq3A: 'Sua <strong>Library</strong> exibe todos os uploads em uma tabela organizada. Você pode pesquisar por nome, excluir conteúdo antigo ou renomear seus arquivos. Clicar em qualquer item da tabela abrirá o Modo de Leitura.',
                faq4Q: 'Como funcionam as ferramentas de aprendizado com IA?',
                faq4A: 'Dentro do Modo de Leitura, basta <strong>clicar em qualquer palavra</strong> do texto para selecioná-la. Depois use as ferramentas à direita:',
                faq4Translate: 'Traduzir:',
                faq4TranslateDesc: 'Obtenha traduções contextuais para o idioma desejado e explicações no idioma do conteúdo.',
                faq4Image: 'Imagem:',
                faq4ImageDesc: 'Gere uma associação visual para a palavra.',
                faq4Pronounce: 'Pronunciar:',
                faq4PronounceDesc: 'Ouça a palavra sendo lida em voz alta clicando no botão Play gerado.',
                navUpload: 'Upload',
                navLibrary: 'Biblioteca',
                techBadge: 'Desenvolvido com Google AI Services',
                uploadTitle: 'Enviar Conteúdo',
                labelContentName: 'Nome do Conteúdo',
                placeholderContentName: 'Digite um nome para o seu conteúdo...',
                errorContentName: 'Por favor, forneça primeiro um nome para o seu conteúdo.',
                labelContentLanguage: 'Idioma do Conteúdo',
                tabDocument: 'Documento',
                tabPlainText: 'Texto Simples',
                dropzoneText: 'Clique para enviar ou arraste e solte',
                fileHint: 'Arquivos PDF, TXT',
                btnUploadDocument: 'Enviar Documento',
                placeholderPlainText: 'Digite ou cole seu texto simples aqui...',
                errorPlainText: 'Por favor, insira algum texto antes de enviar.',
                btnUploadText: 'Enviar Texto',
                toastUploadingDoc: 'Enviando documento...',
                toastUploadingText: 'Enviando texto...',
                errorOnlyPdfTxt: 'Apenas arquivos PDF e TXT são permitidos.',
                errorUploadFail: 'Falha ao enviar documento.',
                errorUploadTextFail: 'Falha ao enviar texto.',
                errorServer: 'Erro no servidor.',
                libraryTitle: 'Sua Biblioteca',
                itemCount0: '0 itens',
                itemCount1: '1 item',
                itemCountMany: 'itens',
                placeholderSearch: 'Pesquise na sua biblioteca...',
                emptyStateText: 'Nenhum documento enviado ainda. Envie seu primeiro documento para começar.',
                thName: 'Nome',
                thType: 'Tipo',
                thDate: 'Data',
                thSize: 'Tamanho',
                thStatus: 'Status',
                statusReady: 'Pronto',
                statusProcessing: 'Processando',
                btnEditName: 'Editar Nome',
                btnDelete: 'Excluir',
                modalEditTitle: 'Editar Nome do Conteúdo',
                placeholderNewName: 'Digite um novo nome...',
                btnCancel: 'Cancelar',
                btnSave: 'Salvar Alterações',
                modalDeleteTitle: 'Excluir Conteúdo',
                deleteConfirmText: 'Tem certeza de que deseja excluir',
                deleteUndoText: 'Esta ação não pode ser desfeita.',
                readerBackToLibrary: 'Voltar para a Biblioteca',
                readerSelectedPrompt: 'Selecione uma palavra do texto no lado esquerdo para usar as ferramentas de IA!',
                readerSelectedLabel: 'Selecionado',
                btnTranslate: 'Traduzir e Explicar',
                btnImage: 'Imagem',
                btnPronounce: 'Pronunciar',
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
                heroTitle: 'Sevdiğin şeyi oku.<br>Bir dili doğal şekilde öğren.',
                heroDesc: 'Kendi <strong>içeriklerine</strong> dalarak yeni bir dili ustalıkla öğren. PDF, TXT dosyaları yükle veya düz metin yapıştır; akıllı yapay zekâ en sevdiğin okuma materyallerini etkileşimli bir öğrenme deneyimine dönüştürsün.',
                btnUpload: 'Yüklemeye Başla',
                btnLibrary: 'Kütüphaneyi Görüntüle',
                feature1Title: 'Bağlamsal Çeviri',
                feature1Desc: 'Basit sözlük aramalarının ötesine geç. Yapay zekâ destekli çeviriler ve derin dilbilgisi açıklamalarıyla nüansları gerçekten anlayıp yeni kelimeleri doğal bir şekilde öğren.',
                feature2Title: 'Görsel Hafıza',
                feature2Desc: 'Bir kelimeyi hatırlamakta zorlanıyor musun? Seçilen metne göre bir görsel oluştur. Görsel çağrışımlar kurmak, yeni kelimeleri uzun süreli hafızaya yerleştirmenin kanıtlanmış bir yoludur.',
                feature3Title: 'Mükemmel Telaffuz',
                feature3Desc: 'Bir kelimenin nasıl okunduğunu artık tahmin etme. Doğru telaffuzu duymak için yüksek kaliteli Metinden Konuşmaya teknolojisini kullan; dinleme becerilerini ve konuşma özgüvenini geliştir.',
                faqTitle: 'Sıkça Sorulan Sorular',
                faq1Q: 'Platformda nasıl gezinebilirim?',
                faq1A: 'Üstteki gezinme çubuğu senin kontrol merkezindir. Ana sayfaya dönmek için istediğin zaman <strong>alovre</strong> logosuna tıkla. Yeni materyal eklemek için <strong>Upload</strong>, kayıtlı içeriklerini görüntülemek için <strong>Library</strong> seçeneğini kullan.',
                faq2Q: 'Yeni içerik nasıl yüklerim?',
                faq2A: 'Upload sayfasına git. Zorunlu bir isim gir, içerik dilini seç ve formatını belirle:',
                faq2Doc: 'Belge:',
                faq2DocDesc: 'PDF/TXT dosyalarını sürükleyip bırak veya yüklemek için tıkla.',
                faq2Text: 'Düz Metin:',
                faq2TextDesc: 'Ham metni doğrudan alana yapıştır.',
                faq3Q: 'Yüklediğim dosyaları nereden yönetebilirim?',
                faq3A: '<strong>Library</strong> bölümünde tüm yüklemeler düzenli bir tabloda gösterilir. İsme göre arama yapabilir, eski içerikleri silebilir veya dosyalarını yeniden adlandırabilirsin. Tablodaki herhangi bir öğeye tıklamak Okuma Modunu açacaktır.',
                faq4Q: 'Yapay zekâ öğrenme araçları nasıl çalışır?',
                faq4A: 'Okuma Modu içinde, seçmek için metindeki <strong>herhangi bir kelimeye tıkla</strong>. Ardından sağ taraftaki araçları kullan:',
                faq4Translate: 'Çevir:',
                faq4TranslateDesc: 'İstediğin dile bağlamsal çeviriler ve içerik dilinde açıklamalar al.',
                faq4Image: 'Görsel:',
                faq4ImageDesc: 'Kelime için görsel bir çağrışım oluştur.',
                faq4Pronounce: 'Telaffuz:',
                faq4PronounceDesc: 'Oluşturulan Oynat düğmesine tıklayarak kelimenin yüksek sesle okunmasını dinle.',
                navUpload: 'Yükle',
                navLibrary: 'Kütüphane',
                techBadge: 'Google AI Hizmetleri ile desteklenmektedir',
                uploadTitle: 'İçerik Yükle',
                labelContentName: 'İçerik Adı',
                placeholderContentName: 'İçeriğiniz için bir ad girin...',
                errorContentName: 'Lütfen önce içeriğiniz için bir ad girin.',
                labelContentLanguage: 'İçerik Dili',
                tabDocument: 'Belge',
                tabPlainText: 'Düz Metin',
                dropzoneText: 'Yüklemek için tıkla veya sürükleyip bırak',
                fileHint: 'PDF, TXT dosyaları',
                btnUploadDocument: 'Belge Yükle',
                placeholderPlainText: 'Düz metninizi buraya yazın veya yapıştırın...',
                errorPlainText: 'Lütfen yüklemeden önce biraz metin girin.',
                btnUploadText: 'Metin Yükle',
                toastUploadingDoc: 'Belge yükleniyor...',
                toastUploadingText: 'Metin yükleniyor...',
                errorOnlyPdfTxt: 'Yalnızca PDF ve TXT dosyalarına izin verilir.',
                errorUploadFail: 'Belge yüklenemedi.',
                errorUploadTextFail: 'Metin yüklenemedi.',
                errorServer: 'Sunucu hatası.',
                libraryTitle: 'Kütüphaneniz',
                itemCount0: '0 öğe',
                itemCount1: '1 öğe',
                itemCountMany: 'öğe',
                placeholderSearch: 'Kütüphanenizde ara...',
                emptyStateText: 'Henüz hiçbir belge yüklenmedi. Başlamak için ilk belgenizi yükleyin.',
                thName: 'Ad',
                thType: 'Tür',
                thDate: 'Tarih',
                thSize: 'Boyut',
                thStatus: 'Durum',
                statusReady: 'Hazır',
                statusProcessing: 'İşleniyor',
                btnEditName: 'Adı Düzenle',
                btnDelete: 'Sil',
                modalEditTitle: 'İçerik Adını Düzenle',
                placeholderNewName: 'Yeni ad girin...',
                btnCancel: 'İptal',
                btnSave: 'Değişiklikleri Kaydet',
                modalDeleteTitle: 'İçeriği Sil',
                deleteConfirmText: 'Silmek istediğinizden emin misiniz',
                deleteUndoText: 'Bu işlem geri alınamaz.',
                readerBackToLibrary: 'Kütüphaneye Dön',
                readerSelectedPrompt: 'Yapay zekâ araçlarını kullanmak için soldaki metinden bir kelime seçin!',
                readerSelectedLabel: 'Seçilen',
                btnTranslate: 'Çevir ve Açıkla',
                btnImage: 'Görsel',
                btnPronounce: 'Telaffuz',
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

        // Upload Page
        const uploadTitle = document.querySelector('.card-title.upload-title');
        if (uploadTitle) uploadTitle.textContent = t.uploadTitle;

        const contentNameLabel = document.querySelector('label[for="content-name"]');
        if (contentNameLabel) contentNameLabel.textContent = t.labelContentName;

        const contentNameInput = document.getElementById('content-name');
        if (contentNameInput) contentNameInput.placeholder = t.placeholderContentName;

        const nameError = document.getElementById('name-error');
        if (nameError) nameError.textContent = t.errorContentName;

        const contentLanguageLabel = document.querySelector('label[for="select-language"]');
        if (contentLanguageLabel) contentLanguageLabel.textContent = t.labelContentLanguage;

        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => {
            if (tab.dataset.tab === 'document') {
                tab.innerHTML = `<i data-lucide="file-text"></i> ${t.tabDocument}`;
            } else if (tab.dataset.tab === 'plaintext') {
                tab.innerHTML = `<i data-lucide="align-left"></i> ${t.tabPlainText}`;
            }
        });

        const dropzoneP = document.querySelector('.dropzone p');
        if (dropzoneP) dropzoneP.textContent = t.dropzoneText;

        const fileHint = document.querySelector('.file-hint');
        if (fileHint) fileHint.textContent = t.fileHint;

        const uploadDocBtn = document.getElementById('upload-document-btn');
        if (uploadDocBtn) {
            uploadDocBtn.innerHTML = `<i data-lucide="upload-cloud"></i> ${t.btnUploadDocument}`;
        }

        const textInput = document.getElementById('text-input');
        if (textInput) textInput.placeholder = t.placeholderPlainText;

        const textError = document.getElementById('text-error');
        if (textError) textError.textContent = t.errorPlainText;

        const uploadTextBtn = document.getElementById('upload-text-btn');
        if (uploadTextBtn) {
            uploadTextBtn.innerHTML = `<i data-lucide="upload-cloud"></i> ${t.btnUploadText}`;
        }

        // Library Page
        const libraryTitle = document.querySelector('.card-title.library-title');
        if (libraryTitle) libraryTitle.textContent = t.libraryTitle;

        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.placeholder = t.placeholderSearch;

        const emptyStateText = document.querySelector('.empty-state p');
        if (emptyStateText) emptyStateText.textContent = t.emptyStateText;

        const ths = document.querySelectorAll('#library-table th');
        if (ths.length >= 5) {
            ths[0].textContent = t.thName;
            ths[1].textContent = t.thType;
            ths[2].textContent = t.thDate;
            ths[3].textContent = t.thSize;
            ths[4].textContent = t.thStatus;
        }

        const modalEditTitle = document.querySelector('#edit-modal .modal-title');
        if (modalEditTitle) {
            modalEditTitle.innerHTML = `<i data-lucide="pencil" class="modal-icon"></i> ${t.modalEditTitle}`;
        }

        const editNameInputForLibrary = document.getElementById('edit-name-input');
        if (editNameInputForLibrary) editNameInputForLibrary.placeholder = t.placeholderNewName;

        const cancelEditBtn = document.getElementById('cancel-edit-btn');
        if (cancelEditBtn) cancelEditBtn.textContent = t.btnCancel;

        const saveEditBtn = document.getElementById('save-edit-btn');
        if (saveEditBtn) saveEditBtn.textContent = t.btnSave;

        const modalDeleteTitle = document.querySelector('#delete-modal .modal-title');
        if (modalDeleteTitle) {
            modalDeleteTitle.innerHTML = `<i data-lucide="alert-triangle" class="modal-icon"></i> ${t.modalDeleteTitle}`;
        }

        const deleteModalP = document.querySelector('#delete-modal p');
        if (deleteModalP) {
            deleteModalP.innerHTML = `${t.deleteConfirmText} "<strong id="delete-item-name"></strong>"? ${t.deleteUndoText}`;
        }

        const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
        if (cancelDeleteBtn) cancelDeleteBtn.textContent = t.btnCancel;

        const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
        if (confirmDeleteBtn) confirmDeleteBtn.textContent = t.btnDelete;

        // Reader Page
        const backToLibBtn = document.querySelector('.reader-header .btn-icon');
        if (backToLibBtn) backToLibBtn.title = t.readerBackToLibrary;

        const selectedWordPrompt = document.getElementById('selected-word-text');
        if (selectedWordPrompt && !selectedWordPrompt.querySelector('strong')) {
            selectedWordPrompt.textContent = t.readerSelectedPrompt;
        }

        const translateBtn = document.getElementById('btn-translate');
        if (translateBtn) {
            translateBtn.innerHTML = `<i data-lucide="languages"></i> ${t.btnTranslate}`;
        }

        const imageBtn = document.getElementById('btn-image');
        if (imageBtn) {
            imageBtn.innerHTML = `<i data-lucide="image"></i> ${t.btnImage}`;
        }

        const audioBtn = document.getElementById('btn-audio');
        if (audioBtn) {
            audioBtn.innerHTML = `<i data-lucide="volume-2"></i> ${t.btnPronounce}`;
        }

        // Re-run lucide to restore icons in modified elements
        lucide.createIcons();
    }
});

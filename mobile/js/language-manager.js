/* 
 * Mobile Language Manager
 * Handles multi-lingual support using the data-i18n attributes.
 */

const translations = {
    en: {
        'nav-home': 'Home',
        'nav-about': 'About Me',
        'nav-projects': 'Creative Lab',
        'nav-works': 'Blogs & Researches',
        'nav-skills': 'Skills',
        'nav-contact': 'Connect',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'ASPIRING DEVELOPER & WRITER',
        'hero-resume': 'Download CV',
        'edu-title': 'Academic Foundation',
        'edu-1-deg': 'B.Tech CS (IoT)',
        'edu-1-inst': 'Moradabad Institute of Technology',
        'edu-2-deg': 'Senior Secondary (CBSE)',
        'edu-2-inst': 'Bonny Anne Public School',
        'edu-certs': 'Certificates',
        'bio-text': 'I am a tech-driven individual with a strong interest in problem-solving and critical thinking. I enjoy transforming ideas into practical approaches and consistently seek new perspectives and innovative solutions. <br><br>I learn, design, and develop out of genuine passion for the craft. <br><br>Alongside, I write with a deep appreciation for language, expression, and intellectual depth.',
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Encrypted burn-after-read private chatroom.',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Automated Git repo-upload tool.',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Audio triggered panic task-kill system.',
        'proj-4-name': 'Sentry Mode',
        'proj-4-desc': 'Anti-interference detection system with alarm.',
        'proj-5-name': 'CodeSense AI',
        'proj-5-desc': 'AI-powered code snippet explainer.',
        'proj-more-title': 'More Computing...',
        'proj-more-desc': 'New projects in development. Stay tuned for updates.',
        'archive-title': 'Archive',
        'archive-desc': 'A dedicated repository for my published research papers, articles, write-ups etc.',
        'archive-status': 'Uploading soon...',
        'form-open': 'Write Me a Message',
        'form-message': 'Your Message',
        'form-send': 'Send Message'
    },
    fr: {
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-projects': 'Labo Créatif',
        'nav-works': 'Travaux',
        'nav-skills': 'Compétences',
        'nav-contact': 'Contact',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'DÉVELOPPEUR ET ÉCRIVAIN ASPIRANT',
        'hero-resume': 'Télécharger le CV',
        'edu-title': 'Fondation Académique',
        'edu-1-deg': 'B.Tech CS (IoT)',
        'edu-1-inst': 'Institut de Technologie de Moradabad',
        'edu-2-deg': 'Enseignement Secondaire Supérieur',
        'edu-2-inst': 'Bonny Anne Public School',
        'edu-certs': 'Certificats',
        'bio-text': "Je suis une personne axée sur la technologie avec un fort intérêt pour la résolution de problèmes et la pensée critique. J'aime transformer les idées en approches pratiques et je recherche constamment de nouvelles perspectives et des solutions innovantes. <br><br>J'apprends, je conçois et je développe par véritable passion pour mon métier. <br><br>Parallèlement, j'écris avec une profonde appréciation pour la langue, l'expression et la profondeur intellectuelle.",
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Chat éphémère crypté.',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Outil de téléchargement automatique Git.',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Système de panique audio.',
        'proj-4-name': 'Sentry Mode',
        'proj-4-desc': 'Détection d\'interférence avec alarme.',
        'proj-5-name': 'CodeSense AI',
        'proj-5-desc': 'Assistant IA pour le code.',
        'proj-more-title': 'Calcul en cours...',
        'proj-more-desc': 'De nouveaux projets sont en cours. Restez à l\'écoute.',
        'archive-title': 'Archive',
        'archive-desc': 'Un référentiel dédié à mes documents de recherche, articles techniques, etc.',
        'archive-status': 'Téléchargement imminent...',
        'form-open': 'Écrivez-moi un message',
        'form-message': 'Votre message',
        'form-send': 'Envoyer le message'
    },
    de: {
        'nav-home': 'Startseite',
        'nav-about': 'Über mich',
        'nav-projects': 'Kreativlabor',
        'nav-works': 'Werke',
        'nav-skills': 'Fähigkeiten',
        'nav-contact': 'Kontakt',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'ANGEHENDER ENTWICKLER & AUTOR',
        'hero-resume': 'Lebenslauf herunterladen',
        'edu-title': 'Akademisches Fundament',
        'edu-1-deg': 'B.Tech CS (IoT)',
        'edu-1-inst': 'Moradabad Institute of Technology',
        'edu-2-deg': 'Höhere Sekundarstufe',
        'edu-2-inst': 'Bonny Anne Public School',
        'edu-certs': 'Zertifikate',
        'bio-text': 'Ich bin eine technologieorientierte Person mit einem starken Fokus auf Problemlösung und kritisches Denken. Es macht mir Spaß, Ideen in praktische Lösungen zu verwandeln, und ich suche ständig nach neuen Perspektiven und innovativen Ansätzen. <br><br>Ich lerne, entwerfe und entwickle aus echter Leidenschaft für mein Handwerk. <br><br>Daneben schreibe ich mit tiefer Wertschätzung für Sprache, Ausdruck und intellektuelle Tiefe.',
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Verschlüsselter Burn-after-reading-Chat.',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Automatisiertes Git-Workflow-Tool.',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Audio-gesteuertes Paniksystem.',
        'proj-4-name': 'Sentry Mode',
        'proj-4-desc': 'Anti-Interferenz-Erkennung mit Alarm.',
        'proj-5-name': 'CodeSense AI',
        'proj-5-desc': 'KI-gestützte Code-Intelligenz.',
        'proj-more-title': 'Berechnung läuft...',
        'proj-more-desc': 'Weitere innovative Projekte befinden sich in der Entwicklung.',
        'archive-title': 'Archiv',
        'archive-desc': 'Ein spezielles Repository für meine Forschungsarbeiten, Artikel usw.',
        'archive-status': 'Wird bald hochgeladen...',
        'form-open': 'Schreiben Sie mir eine Nachricht',
        'form-message': 'Ihre Nachricht',
        'form-send': 'Nachricht senden'
    }
};

window.initLanguageManager = () => {
    const langBtn = document.getElementById('m-lang-btn');
    const langDropdown = document.getElementById('m-lang-dropdown');
    const currentLangLabel = document.getElementById('m-current-lang');

    if (!langBtn || !langDropdown) return;

    // Toggle Dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', () => {
        langDropdown.classList.remove('active');
    });

    // Language Change
    langDropdown.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    const setLanguage = (lang) => {
        const translation = translations[lang];
        if (!translation) return;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translation[key]) {
                // Handle different element types
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation[key];
                } else if (el.classList.contains('hero-title')) {
                    // Keep the terminal prompt
                    const prompt = el.querySelector('.terminal-prompt');
                    el.innerHTML = '';
                    if (prompt) el.appendChild(prompt);
                    el.appendChild(document.createTextNode(' ' + translation[key]));
                } else {
                    el.innerHTML = translation[key];
                }
            }
        });

        const fullNames = { 'en': 'English', 'fr': 'Français', 'de': 'Deutsch' };
        currentLangLabel.innerText = fullNames[lang];
        localStorage.setItem('preferred-lang', lang);
    };

    // Initialize from LocalStorage
    const preferredLang = localStorage.getItem('preferred-lang') || 'en';
    setLanguage(preferredLang);
};

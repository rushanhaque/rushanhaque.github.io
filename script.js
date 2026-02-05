window.siteLoaded = false;
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height, stars;

const settings = {
    starCount: 250,
    maxSpeed: 0.4,
    minSize: 0.5,
    maxSize: 1.5,
    glowSize: 10,
    starColor: '#ffffff',
    accentColor: '#00e5ff'
};

class Star {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * settings.maxSpeed;
        this.vy = (Math.random() - 0.5) * settings.maxSpeed;
        this.size = Math.random() * (settings.maxSize - settings.minSize) + settings.minSize;
        this.color = Math.random() > 0.8 ? settings.accentColor : settings.starColor;
        this.opacity = Math.random();
        this.fadeSpeed = Math.random() * 0.02;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        this.opacity += this.fadeSpeed;
        if (this.opacity > 1 || this.opacity < 0.2) {
            this.fadeSpeed = -this.fadeSpeed;
        }
    }

    draw() {
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(
            this.x - this.size * 0.3,
            this.y - this.size * 0.3,
            0,
            this.x,
            this.y,
            this.size
        );
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, this.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.shadowBlur = settings.glowSize * this.opacity;
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.shadowBlur = 0;
    }
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    stars = [];
    for (let i = 0; i < settings.starCount; i++) {
        stars.push(new Star());
    }
}

function animate() {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    stars.forEach(star => {
        star.update();
        star.draw();
    });
    requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
// animate(); removed - will be started after loading


// --- Sukuna Arrow Cursor Logic ---
const sukunaCursor = document.getElementById('sukuna-cursor');
const cursorCoords = document.querySelector('.cursor-coords');
let mouseX = 0, mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (sukunaCursor) {
        sukunaCursor.style.left = mouseX + 'px';
        sukunaCursor.style.top = mouseY + 'px';

        // Reactive Cursor Logic
        const target = e.target;
        const isClickable = target.closest('a, button, .project-card-3d, .resume-card');

        if (isClickable) {
            sukunaCursor.classList.add('cursor-active');
        } else {
            sukunaCursor.classList.remove('cursor-active');
        }
    }

    if (cursorCoords) {
        cursorCoords.innerText = `X: ${Math.round(mouseX)} Y: ${Math.round(mouseY)}`;
    }
});

// --- Spline Interaction (Deferred) ---
function initSpline() {
    const container = document.getElementById('spline-container');
    if (!container) return;

    const splineViewer = document.createElement('spline-viewer');
    splineViewer.id = 'spline-robot';
    splineViewer.setAttribute('url', 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode');
    splineViewer.setAttribute('loading-anim', 'false');
    splineViewer.setAttribute('hint', 'false');
    splineViewer.setAttribute('logo', 'false');
    splineViewer.setAttribute('interaction-hint', 'false');
    splineViewer.setAttribute('events-target', 'global');
    container.appendChild(splineViewer);

    function cleanupSpline() {
        const shadowRoot = splineViewer.shadowRoot;
        if (shadowRoot) {
            // CSS Injection to force hide Built with Spline
            if (!shadowRoot.getElementById('hide-spline-ui')) {
                const style = document.createElement('style');
                style.id = 'hide-spline-ui';
                style.textContent = `
                    #logo, .logo, 
                    #hint, .hint, 
                    #interaction-hint, 
                    a[href*="spline"],
                    a[href*="spline.design"],
                    img, 
                    svg {
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                        width: 0 !important;
                        height: 0 !important;
                    }
                `;
                shadowRoot.appendChild(style);
            }

            // Also Remove Elements
            const siblings = shadowRoot.querySelectorAll(':scope > *:not(#container):not(style)');
            siblings.forEach(el => el.remove());
        }
    }
    // Cleanup periodically as Spline injects elements dynamically
    setInterval(cleanupSpline, 1000);

    splineViewer.addEventListener('load', () => {
        cleanupSpline();
        try {
            // Safe Spline Access
            const spline = splineViewer.getSplineObject();
            if (!spline) return;

            const findObjects = (obj, namePart, results = []) => {
                if (!obj) return results;
                if (obj.name && obj.name.toLowerCase().includes(namePart.toLowerCase())) results.push(obj);
                if (obj.children) obj.children.forEach(c => findObjects(c, namePart, results));
                return results;
            };

            let eyes = findObjects(spline, 'eye');
            let heads = findObjects(spline, 'head');
            let mainGroup = spline.children[0];

            window.addEventListener('scroll', () => {
                const scrolled = window.scrollY;
                if (mainGroup) {
                    mainGroup.position.y = -scrolled * 0.002;
                    mainGroup.rotation.z = scrolled * 0.0005;
                }
            });

            // Mouse tracking disabled for stability
        } catch (e) { console.log(e); }
    });
}

// --- Scroll Reveal ---
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(r => {
        const windowHeight = window.innerHeight;
        const elementTop = r.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            r.classList.add('active');
        }
    });
}
window.addEventListener('scroll', reveal);
reveal();

// --- Scroll Progress ---
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
}
window.addEventListener('scroll', updateScrollProgress);

// --- Resume Card & Cert Interactions ---
function initResumeInteractions() {
    const cards = document.querySelectorAll('.resume-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        });
    });

    // Cert Nav Interaction
    const certBtns = document.querySelectorAll('.cert-nav-btn');
    certBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            certBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Logic to switch certificate content could go here
        });
    });
}
window.addEventListener('load', initResumeInteractions);


// --- Back to Top ---
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Contact Form Logic ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const originalText = btnText.innerHTML;
        const currentLang = localStorage.getItem('preferred-lang') || 'en';

        // Set Loading State
        submitBtn.disabled = true;
        btnText.innerHTML = (currentLang === 'fr' ? 'Envoi...' : (currentLang === 'de' ? 'Senden...' : 'Sending...'));
        submitBtn.style.opacity = '0.7';

        const data = new FormData(contactForm);

        try {
            const response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                // Success
                formStatus.innerHTML = translations[currentLang]['form-success'] || 'Message Sent Successfully!';
                formStatus.className = 'form-status success';
                contactForm.reset();
                btnText.innerHTML = '<i class="ph ph-check-circle"></i>';
                submitBtn.style.background = '#4ade80';
            } else {
                // Server Side Error
                const result = await response.json();
                formStatus.innerHTML = result.errors ? result.errors.map(error => error.message).join(", ") : (translations[currentLang]['form-error'] || 'Oops! Something went wrong.');
                formStatus.className = 'form-status error';
                btnText.innerHTML = originalText;
            }
        } catch (error) {
            // Network Error
            formStatus.innerHTML = translations[currentLang]['form-error'] || 'Oops! Something went wrong.';
            formStatus.className = 'form-status error';
            btnText.innerHTML = originalText;
        } finally {
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';

            // Revert button status after 5 seconds
            setTimeout(() => {
                formStatus.innerHTML = '';
                formStatus.className = 'form-status';
                btnText.innerHTML = originalText;
                submitBtn.style.background = '';
            }, 5000);
        }
    });
}

// --- Contact Modal Logic ---
function initContactModal() {
    const modal = document.getElementById('contact-modal');
    const openBtn = document.getElementById('open-contact-modal');
    const closeBtn = document.getElementById('close-contact-modal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- Skills Modal Logic ---
function initSkillsModal() {
    const modal = document.getElementById('skills-modal');
    const openBtn = document.getElementById('open-skills-modal');
    const closeBtn = document.getElementById('close-skills-modal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// --- Notify Modal Logic ---
function initNotifyModal() {
    const modal = document.getElementById('notify-modal');
    const openBtn = document.getElementById('open-notify-modal');
    const closeBtn = document.getElementById('close-notify-modal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;

    if (!modal || !openBtn || !closeBtn) return;

    const openModal = () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Notify Form Submission
    const notifyForm = document.getElementById('notify-form');
    const notifyStatus = document.getElementById('notify-status');

    if (notifyForm) {
        notifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = notifyForm.querySelector('.submit-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.innerHTML;
            const currentLang = localStorage.getItem('preferred-lang') || 'en';

            submitBtn.disabled = true;
            btnText.innerHTML = (currentLang === 'fr' ? 'Traitement...' : (currentLang === 'de' ? 'Verarbeitung...' : 'Processing...'));

            const data = new FormData(notifyForm);

            try {
                const response = await fetch(notifyForm.action, {
                    method: notifyForm.method,
                    body: data,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    notifyStatus.innerHTML = translations[currentLang]['notify-success'] || "You're on the list! ✨";
                    notifyStatus.className = 'form-status success';
                    notifyForm.reset();
                    btnText.innerHTML = '<i class="ph ph-check-circle"></i>';
                    submitBtn.style.background = '#4ade80';
                    setTimeout(closeModal, 2000);
                } else {
                    notifyStatus.innerHTML = translations[currentLang]['form-error'];
                    notifyStatus.className = 'form-status error';
                    btnText.innerHTML = originalText;
                }
            } catch (error) {
                notifyStatus.innerHTML = translations[currentLang]['form-error'];
                notifyStatus.className = 'form-status error';
                btnText.innerHTML = originalText;
            } finally {
                submitBtn.disabled = false;
                setTimeout(() => {
                    notifyStatus.innerHTML = '';
                    notifyStatus.className = 'form-status';
                    btnText.innerHTML = originalText;
                    submitBtn.style.background = '';
                }, 5000);
            }
        });
    }
}
const clickSound = new Audio('assets/sounds/click.mp3');
const hoverSound = new Audio('assets/sounds/hover.mp3');

clickSound.volume = 0.3;
hoverSound.volume = 0.2;

function playClickSound() {
    const soundClone = clickSound.cloneNode();
    soundClone.volume = 0.3;
    soundClone.play().catch(e => console.log("Click sound playback failed:", e));
}

function playHoverSound() {
    const soundClone = hoverSound.cloneNode();
    soundClone.volume = 0.2;
    soundClone.play().catch(e => console.log("Hover sound playback failed:", e));
}

function initAudioInteractions() {
    const interactiveElements = document.querySelectorAll('a:not(.cert-btn), button:not(.cert-btn), .resume-card, .project-card-3d, .social-icon, .lang-btn, .p-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mousedown', playClickSound);
        el.addEventListener('mouseenter', playHoverSound);
    });
}

// --- Matrix Rain Effect ---
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
    const mCtx = matrixCanvas.getContext('2d');
    let mWidth, mHeight;
    const chars = '01';
    let drops = [];
    const fontSize = 14;

    function resizeMatrix() {
        mWidth = 600; // Fixed size match CSS
        mHeight = 600;
        matrixCanvas.width = mWidth;
        matrixCanvas.height = mHeight;

        const columns = mWidth / fontSize;
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }
    }

    function drawMatrix() {
        mCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        mCtx.fillRect(0, 0, mWidth, mHeight);

        mCtx.fillStyle = window.matrixColor || '#ffffff'; // Dynamic Theme Color
        mCtx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = chars.charAt(Math.floor(Math.random() * chars.length));
            mCtx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > mHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        setTimeout(() => requestAnimationFrame(drawMatrix), 50); // Slower speed
    }

    resizeMatrix();
    // drawMatrix(); removed - will be started after loading
    window.startMatrix = drawMatrix;
}

// --- Dynamic Navbar Theme ---
function updateNavbarTheme() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Define themes for sections
    const themes = {
        'home': {
            color: '#9EAF48',
            rgb: '158, 175, 72',
            glow: 'rgba(158, 175, 72, 0.5)',
            tint: 'rgba(158, 175, 72, 0.08)',
            card: '#0a0b06' // Olive-tinted black
        },
        'about': {
            color: '#2D7A8E',
            rgb: '45, 122, 142',
            glow: 'rgba(45, 122, 142, 0.5)',
            tint: 'rgba(45, 122, 142, 0.08)',
            card: '#09111a' // Teal-tinted black
        },
        'projects': {
            color: '#3867D6',
            rgb: '56, 103, 214',
            glow: 'rgba(56, 103, 214, 0.5)',
            tint: 'rgba(56, 103, 214, 0.08)',
            card: '#060a14' // Sapphire-tinted black
        },
        'blogs': {
            color: '#8854D0',
            rgb: '136, 84, 208',
            glow: 'rgba(136, 84, 208, 0.5)',
            tint: 'rgba(136, 84, 208, 0.08)',
            card: '#0e0614' // Amethyst-tinted black
        },
        'contact': {
            color: '#C5A059',
            rgb: '197, 160, 89',
            glow: 'rgba(197, 160, 89, 0.5)',
            tint: 'rgba(197, 160, 89, 0.08)',
            card: '#141108' // Gold-tinted black
        }
    };

    const scrollY = window.scrollY + window.innerHeight * 0.4; // Slightly further for better transition
    const sections = ['home', 'about', 'projects', 'blogs', 'contact'];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;

            if (scrollY >= top && scrollY < top + height) {
                const theme = themes[id] || themes['home'];
                const root = document.documentElement;
                root.style.setProperty('--accent-color', theme.color);
                root.style.setProperty('--accent-color-rgb', theme.rgb);
                root.style.setProperty('--accent-glow', theme.glow);
                root.style.setProperty('--accent-tint', theme.tint);
                root.style.setProperty('--card-bg', theme.card);
                window.matrixColor = theme.color;
            }
        }
    });
}
window.addEventListener('scroll', updateNavbarTheme);
window.addEventListener('load', () => {
    updateNavbarTheme();
    const loader = document.getElementById('loader');

    // 1. Start Heavy 3D Load very early (0.5s) to hide parsing lag behind the opaque loader
    setTimeout(() => {
        initSpline();
    }, 500);

    // 2. Start Canvas loops early (1.5s) to warm up the GPU while still covered
    setTimeout(() => {
        window.siteLoaded = true;
        if (typeof animate === 'function') animate();
        if (typeof window.startMatrix === 'function') window.startMatrix();
    }, 1500);

    // 3. Final Reveal after everything has stabilized
    setTimeout(() => {
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.classList.remove('loading');
            }, 800);
        } else {
            window.siteLoaded = true;
            if (typeof animate === 'function') animate();
            if (typeof window.startMatrix === 'function') window.startMatrix();
            initSpline();
        }
    }, 3000);
});


// --- Translation System ---
const translations = {
    en: {
        'nav-home': 'Home',
        'nav-about': 'About',
        'nav-projects': 'Projects',
        'nav-works': 'Works',
        'nav-skills': 'Skills',
        'nav-contact': 'Contact',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'Aspiring Developer & Writer',
        'hero-contact': 'Get in Touch',
        'hero-projects': 'View Projects',
        'hero-resume': 'Download CV',
        'bio-title': 'Rushan Ul Haque',
        'bio-text': 'Tech-driven individual with a strong focus towards problem solving and critical thinking, I enjoy transforming ideas into practical solutions and consistently seek out new perspectives and innovative approaches. <br> I learn, design, and develop out of genuine passion for the craft. <br> Alongside, I write with a deep appreciation for language, expression, and intellectual depth',
        'p-travel': 'Travelling',
        'p-football': 'Football',
        'p-photo': 'Photography',
        'p-write': 'Writing',
        'edu-title': 'Academic Foundation',
        'edu-1-deg': 'B.Tech CS (IOT)',
        'edu-1-inst': 'Moradabad Institute of Technology',
        'edu-2-deg': 'Senior Secondary Education',
        'edu-2-inst': 'Bonny Anne Public School',
        'edu-certs': 'Certificates',
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Encrypted burn-after-read private chatroom',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Automated Git repo-upload tool',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Audio triggered panic task-kill system',
        'proj-4-name': 'Sentry Mode',
        'proj-4-desc': 'Anti-interference detection system with alarm and notifications',
        'proj-5-name': 'CodeSense AI',
        'proj-5-desc': 'AI-powered code snippet explainer',
        'proj-more-title': 'More Computing...',
        'proj-more-desc': 'Additional innovative projects are currently in development. Stay tuned for updates.',
        'proj-get-notified': 'GET NOTIFIED',
        'proj-src': 'GITHUB SOURCE',
        'proj-access': 'DIRECT ACCESS',
        'proj-download': 'DOWNLOAD APP',
        'proj-download-link': 'DOWNLOAD LINK',
        'notify-title': 'Get Notified',
        'notify-subtitle': 'Stay updated on new project launches.',
        'notify-btn': 'Subscribe',
        'notify-success': "You're on the list! ✨",
        'works-title': 'BLOGS & RESEARCHES',
        'archive-title': 'Archive',
        'archive-desc': 'A dedicated repository for my published research papers, articles, write-ups etc.',
        'archive-status': 'Uploading soon...',
        'contact-title': 'CONNECT',
        'contact-desc': 'Open for Discussions, Ideas and Opportunities <br> Forever valuing intellectual conversations and diverse perspectives. <br> Always up for interpretations. <br> Feel free to reach out through any of the platforms listed below.',
        'form-open': 'Write Me a Message',
        'form-title': 'Send a Message',
        'form-subtitle': "I'll get back to you as soon as possible.",
        'form-name': 'Full Name',
        'form-email': 'Email Address',
        'form-subject': 'Subject',
        'form-message': 'Message',
        'form-send': 'Send Message',
        'form-success': 'Message Sent Successfully!',
        'form-error': 'Oops! Something went wrong.',
        'skills-title': 'Technical Expertise',
        'skills-subtitle': 'Proficiencies & Technologies'
    },

    fr: {
        'nav-home': 'Accueil',
        'nav-about': 'À propos',
        'nav-projects': 'Projets',
        'nav-works': 'Travaux',
        'nav-skills': 'Compétences',
        'nav-contact': 'Contact',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'Développeur et Écrivain Aspirant',
        'hero-contact': 'Contactez-moi',
        'hero-projects': 'Voir les Projets',
        'hero-resume': 'Télécharger le CV',
        'bio-title': 'Rushan Ul Haque',
        'bio-text': 'Personne axée sur la technologie avec un fort accent sur la résolution de problèmes et la pensée critique. J\'aime transformer les idées en solutions pratiques et je recherche constamment de nouvelles perspectives et des approches innovantes.',
        'p-travel': 'Voyages',
        'p-football': 'Football',
        'p-photo': 'Photographie',
        'p-write': 'Écriture',
        'edu-title': 'Fondation Académique',
        'edu-1-deg': 'B.Tech CS (IOT)',
        'edu-1-inst': 'Institut de Technologie de Moradabad',
        'edu-2-deg': 'Éducation Secondaire Supérieure',
        'edu-2-inst': 'École Publique Bonny Anne',
        'edu-certs': 'Certificats',
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Chat crypté à lecture unique',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Outil de workflow Git automatisé',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Système de panique déclenché par l\'audio',
        'proj-4-name': 'Mode Sentry',
        'proj-4-desc': 'Détection d\'anti-interférence',
        'proj-5-name': 'CodeSense IA',
        'proj-5-desc': 'Intelligence de code propulsée par IA',
        'proj-more-title': 'Plus de calcul...',
        'proj-more-desc': "D'autres projets innovants sont actuellement en développement. Restez à l'écoute.",
        'proj-get-notified': 'ÊTRE NOTIFIÉ',
        'proj-src': 'SOURCE GITHUB',
        'proj-access': 'ACCÈS DIRECT',
        'proj-download': 'TÉLÉCHARGER L\'APP',
        'proj-download-link': 'LIEN DE TÉLÉCHARGEMENT',
        'notify-title': 'Être notifié',
        'notify-subtitle': 'Restez informé des nouveaux lancements.',
        'notify-btn': "S'abonner",
        'notify-success': "Vous êtes sur la liste ! ✨",
        'works-title': 'BLOGS ET RECHERCHES',
        'archive-title': 'Archives',
        'archive-desc': 'Un référentiel dédié à mes documents de recherche publiés, articles techniques, documentations expérimentales, etc.',
        'archive-status': 'Téléchargement imminent...',
        'contact-title': 'CONNECTER',
        'contact-desc': 'Ouvert aux discussions, idées, approches techniques et opportunités valorisant les conversations intellectuelles et les perspectives diverses. Toujours prêt pour des interprétations. N\'hésitez pas à me contacter via l\'une des plateformes listées ci-dessous.',
        'form-open': 'Écrivez-moi un message',
        'form-title': 'Envoyer un message',
        'form-subtitle': 'Je vous répondrai dès que possible.',
        'form-name': 'Nom complet',
        'form-email': 'Adresse e-mail',
        'form-subject': 'Sujet',
        'form-message': 'Message',
        'form-send': 'Envoyer le message',
        'form-success': 'Message envoyé avec succès !',
        'form-error': 'Oups ! Un problème est survenu.',
        'skills-title': 'Expertise Technique',
        'skills-subtitle': 'Compétences et Technologies'
    },
    de: {
        'nav-home': 'Startseite',
        'nav-about': 'Über mich',
        'nav-projects': 'Projekte',
        'nav-works': 'Werke',
        'nav-skills': 'Fähigkeiten',
        'nav-contact': 'Kontakt',
        'hero-name': 'RUSHAN HAQUE',
        'hero-role': 'Angehender Entwickler & Autor',
        'hero-contact': 'Kontaktieren',
        'hero-projects': 'Projekte ansehen',
        'hero-resume': 'Lebenslauf herunterladen',
        'bio-title': 'Rushan Ul Haque',
        'bio-text': 'Technologieorientierte Person mit starkem Fokus auf Problemlösung und kritisches Denken. Es macht mir Spaß, Ideen in praktische Lösungen zu verwandeln, und ich suche ständig nach neuen Perspektiven und innovativen Ansätzen.',
        'p-travel': 'Reisen',
        'p-football': 'Fußball',
        'p-photo': 'Fotografie',
        'p-write': 'Schreiben',
        'edu-title': 'Akademisches Fundament',
        'edu-1-deg': 'B.Tech CS (IOT)',
        'edu-1-inst': 'Moradabad Institute of Technology',
        'edu-2-deg': 'Höhere Sekundarstufe',
        'edu-2-inst': 'Bonny Anne Public School',
        'edu-certs': 'Zertifikate',
        'proj-1-name': 'ShadowChat',
        'proj-1-desc': 'Verschlüsselter Burn-after-reading-Chat',
        'proj-2-name': 'GitHub Auto-Push',
        'proj-2-desc': 'Automatisiertes Git-Workflow-Tool',
        'proj-3-name': 'ShadowKill',
        'proj-3-desc': 'Audio-gesteuertes Paniksystem',
        'proj-4-name': 'Sentry-Modus',
        'proj-4-desc': 'Anti-Interferenz-Erkennung',
        'proj-5-name': 'CodeSense KI',
        'proj-5-desc': 'KI-gestützte Code-Intelligenz',
        'proj-more-title': 'Mehr in Arbeit...',
        'proj-more-desc': 'Weitere innovative Projekte befinden sich derzeit in der Entwicklung. Bleiben Sie gespannt.',
        'proj-get-notified': 'BENACHRICHTIGEN',
        'proj-src': 'GITHUB QUELLE',
        'proj-access': 'DIREKTER ZUGRIFF',
        'proj-download': 'APP HERUNTERLADEN',
        'proj-download-link': 'DOWNLOAD-LINK',
        'notify-title': 'Benachrichtigt werden',
        'notify-subtitle': 'Bleiben Sie über neue Projekte informiert.',
        'notify-btn': 'Abonnieren',
        'notify-success': 'Du stehst auf der Liste! ✨',
        'works-title': 'BLOGS & FORSCHUNG',
        'archive-title': 'Archiv',
        'archive-desc': 'Ein spezielles Repository für meine veröffentlichten Forschungsarbeiten, technischen Artikel, experimentellen Dokumentationen usw.',
        'archive-status': 'Hochladen läuft...',
        'contact-title': 'VERBINDEN',
        'contact-desc': 'Offen für Diskussionen, Ideen, technische Ansätze und Möglichkeiten, die intellektuelle Gespräche und vielfältige Perspektiven schätzen. Immer bereit für Interpretationen. Kontaktieren Sie mich gerne über eine der unten aufgeführten Plattformen.',
        'form-open': 'Schreiben Sie mir eine Nachricht',
        'form-title': 'Nachricht senden',
        'form-subtitle': 'Ich werde mich so schnell wie möglich bei Ihnen melden.',
        'form-name': 'Vollständiger Name',
        'form-email': 'E-Mail-Adresse',
        'form-subject': 'Betreff',
        'form-message': 'Nachricht',
        'form-send': 'Nachricht senden',
        'form-success': 'Nachricht erfolgreich gesendet!',
        'form-error': 'Hoppla! Etwas ist schief gelaufen.',
        'skills-title': 'Technische Expertise',
        'skills-subtitle': 'Fachkenntnisse & Technologien'
    }
};

function setLanguage(lang) {
    const translation = translations[lang];
    if (!translation) return;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translation[key]) {
            if (el.tagName === 'H2' && el.querySelector('.blink-icon')) {
                // For h2 with icon (like Connect heading), only update the text after the icon
                const textNode = Array.from(el.childNodes).find(node => node.nodeType === 3);
                if (textNode) {
                    textNode.textContent = translation[key];
                }
            } else if (el.tagName === 'SPAN' || el.tagName === 'A' || el.tagName === 'P' || el.tagName === 'H3' || el.tagName === 'SMALL' || el.tagName === 'STRONG') {
                const spanInA = el.querySelector('span');
                if (spanInA) {
                    spanInA.innerHTML = translation[key];
                } else {
                    el.innerHTML = translation[key];
                }
            } else {
                el.innerText = translation[key];
            }
        }
    });

    document.getElementById('current-lang').innerText = lang.toUpperCase();
    localStorage.setItem('preferred-lang', lang);
}

function initLanguageSwitcher() {
    const dropdown = document.getElementById('lang-dropdown');
    if (!dropdown) return;

    dropdown.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    const preferredLang = localStorage.getItem('preferred-lang') || 'en';
    setLanguage(preferredLang);
}

// Horizontal Scroll Logic (Projects)
function initProjectScroll() {
    const projectSlider = document.querySelector('.project-grid');
    const projectLeft = document.getElementById('scrollLeft');
    const projectRight = document.getElementById('scrollRight');

    if (projectSlider && projectLeft && projectRight) {
        projectLeft.addEventListener('click', () => {
            projectSlider.scrollBy({ left: -400, behavior: 'smooth' });
        });
        projectRight.addEventListener('click', () => {
            projectSlider.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }
}

window.addEventListener('load', () => {
    initLanguageSwitcher();
    initProjectScroll();
    initAudioInteractions();
    initContactModal();
    initSkillsModal();
    initNotifyModal();
});


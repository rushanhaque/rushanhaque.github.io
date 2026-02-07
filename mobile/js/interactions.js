/* User Interactions & Micro-interactions */

window.initInteractions = () => {
    console.log("Initializing Interactions...");

    // --- Active Link Handling ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });

    // --- Skills Modal Interaction ---
    const skillsBtn = document.getElementById('open-skills-modal');
    const skillsModal = document.getElementById('skills-modal');
    const closeSkillsBtn = document.getElementById('close-skills-modal');

    // Add close function to window for global access if needed
    window.closeSkillsModal = () => {
        if (skillsModal) {
            gsap.to(skillsModal.querySelector('.modal-content'), {
                opacity: 0,
                y: 50,
                scale: 0.9,
                duration: 0.2,
                onComplete: () => {
                    skillsModal.style.display = 'none';
                }
            });
        }
    };

    if (skillsBtn && skillsModal && closeSkillsBtn) {
        skillsBtn.addEventListener('click', () => {
            skillsModal.style.display = 'flex';
            // GSAP animation for opening
            gsap.fromTo(skillsModal.querySelector('.modal-content'),
                { opacity: 0, y: 50, scale: 0.9 },
                { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
            );
        });

        closeSkillsBtn.addEventListener('click', window.closeSkillsModal);

        // Close on outside click
        skillsModal.querySelector('.modal-overlay').addEventListener('click', window.closeSkillsModal);
    }

    // --- Custom Cursor Logic (Desktop Only mostly, but subtle on mobile if connected) ---
    const cursor = document.querySelector('.cursor-follower');
    if (cursor) {
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        gsap.ticker.add(() => {
            const dt = 1.0 - Math.pow(1.0 - 0.2, gsap.ticker.deltaRatio());
            cursorX += (mouseX - cursorX) * dt;
            cursorY += (mouseY - cursorY) * dt;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        });

        // Hover effects
        const interactiveElements = document.querySelectorAll('a, button, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });
    }
    // --- Premium Spotlight Effect ---
    // Tracks mouse over specific elements to move the spotlight gradient
    const spotlightElements = document.querySelectorAll('.project-card, .archive-card, .contact-panel');

    spotlightElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            el.style.setProperty('--mouse-x', `${x}px`);
            el.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // --- Magnetic Buttons ---
    const magneticBtns = document.querySelectorAll('.social-btn, .action-btn, .submit-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });
};

/* Additional styles injection for JS-driven elements */
const style = document.createElement('style');
style.textContent = `
    .tag {
        display: inline-block;
        font-size: 0.8rem;
        color: var(--accent-primary);
        border: 1px solid var(--accent-primary);
        padding: 2px 8px;
        border-radius: 12px;
        margin-right: 5px;
        margin-top: 10px;
    }
    .highlight-text {
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    .cursor-follower {
        position: fixed;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        border: 2px solid var(--accent-secondary);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transform: translate3d(-50%, -50%, 0);
        transition: transform 0.1s linear; /* Handled by GSAP mostly, but CSS fallback */
        margin-top: -10px; /* Offset to center */
        margin-left: -10px;
    }
    .cursor-follower.active {
        background: rgba(139, 92, 246, 0.2);
        transform: scale(1.5);
    }
    
    .languages-section {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .languages-title {
        font-family: var(--font-mono);
        font-size: 0.7rem;
        color: var(--accent-neon);
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 1rem;
        font-weight: 600;
    }
    
    .languages-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.6rem;
    }
    
    .language-tile {
        background: rgba(var(--accent-rgb), 0.03);
        border: 1px solid rgba(var(--accent-rgb), 0.15);
        border-radius: 6px;
        padding: 0.7rem 0.8rem;
        text-align: center;
        transition: all 0.3s ease;
    }
    
    .language-tile:hover {
        background: rgba(var(--accent-rgb), 0.08);
        border-color: rgba(var(--accent-rgb), 0.3);
        transform: translateY(-2px);
    }
    
    .language-tile .language-name {
        font-family: var(--font-body);
        font-size: 0.85rem;
        color: var(--text-primary);
        font-weight: 500;
        margin-bottom: 0.4rem;
        display: block;
    }
    
    .language-tile .language-stars {
        font-size: 0.75rem;
        color: var(--accent-neon);
        letter-spacing: 1px;
    }
    
    .star-empty {
        opacity: 0.2;
    }
    
    .qualifications-section {
        margin-top: 2.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .section-subtitle {
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--accent-neon);
        text-transform: uppercase;
        letter-spacing: 3px;
        margin-bottom: 1.5rem;
        font-weight: 600;
    }
    
    .education-item {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .education-year {
        font-family: var(--font-mono);
        font-size: 0.85rem;
        color: var(--accent-neon);
        min-width: 80px;
        flex-shrink: 0;
    }
    
    .education-details {
        flex: 1;
    }
    
    .education-degree {
        font-family: var(--font-body);
        font-size: 1rem;
        color: var(--text-primary);
        font-weight: 600;
        margin-bottom: 0.3rem;
    }
    
    .education-institution {
        font-family: var(--font-body);
        font-size: 0.9rem;
        color: var(--text-secondary);
        font-weight: 400;
    }
    
    .action-buttons {
        margin-top: 2.5rem;
        display: flex;
        gap: 0.8rem;
        flex-wrap: wrap;
    }
    
    .action-btn {
        flex: 1;
        min-width: 120px;
        background: transparent;
        border: 1px solid var(--accent-neon);
        color: var(--accent-neon);
        padding: 0.7rem 1rem;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 4px;
    }
    
    .action-btn:hover {
        background: var(--accent-neon);
        color: var(--bg-primary);
        box-shadow: 0 0 15px rgba(var(--accent-rgb), 0.3);
    }
    
    .action-btn i {
        margin-right: 0.5rem;
    }
`;
document.head.appendChild(style);

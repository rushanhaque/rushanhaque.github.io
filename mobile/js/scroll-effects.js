/* Scroll Animations (GSAP + ScrollTrigger + Lenis) */

window.initScrollEffects = () => {
    console.log("Initializing Premium Scroll Effects...");

    // --- 1. LENIS Setup (The "Weighty" Smooth Scroll) ---
    const lenis = new Lenis({
        duration: 2.0, // Slower for that heavy, expensive feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: true, // Critical for mobile
        touchMultiplier: 1.5,
    });

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000); // Lenis requires raf
    });

    gsap.ticker.lagSmoothing(0); // Disable lag smoothing for Lenis

    // --- 2. GSAP Animations ---
    gsap.registerPlugin(ScrollTrigger);

    // Initial State for Backgrounds
    if (window.updateStarIntensity) window.updateStarIntensity(0);
    window.neuralGridOpacity = 1.0;

    // Background Transition: Neural Grid (Web) -> Stars (Dots)
    // Happens as we scroll out of Hero into About
    gsap.to({}, {
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "bottom center",
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                // Fade Neural Grid out
                window.neuralGridOpacity = 1 - progress;
                // Fade Stars in
                if (window.updateStarIntensity) window.updateStarIntensity(progress);
            }
        }
    });

    // Hero: Title Parallax (Slower than scroll)
    // Hero: Title Parallax (Slower than scroll)
    // Ensures text stays visible initially but fades out on scroll
    gsap.to('.hero-title', {
        y: 150,
        // opacity: 0, // Disabled to fix "blank page" issue
        ease: "none",
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // Subtitle Parallax (Slightly faster fade)
    gsap.to('.hero-subtitle', {
        y: 100,
        // opacity: 0,
        ease: "none",
        scrollTrigger: {
            trigger: '#hero',
            start: "top top",
            end: "40% top",
            scrub: true
        }
    });

    // Section Reveals (Classic "Rise Up") - Applied to ALL sections
    const sections = document.querySelectorAll('.section:not(#hero)');
    sections.forEach(section => {
        // Content inside section moves up with smooth fade
        const content = section.querySelectorAll('.container');

        gsap.fromTo(content,
            { y: 80, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%", // Triggers slightly earlier for smoother feel
                    end: "top 40%",
                    toggleActions: "play none none reverse",
                    scrub: 0.5 // Gentle scrub for smooth transition
                }
            }
        );
    });

    // Section Titles Animation
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Line Drawing Effect for Labels
    gsap.utils.toArray('.section-label').forEach(label => {
        gsap.fromTo(label,
            { opacity: 0, x: -20 },
            {
                opacity: 1,
                x: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: label,
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // --- 3. Dynamic Color Theory ---
    // Interpolate the main accent color based on scroll position
    // Colors: Green -> Gold -> Cyan -> Violet -> Silver

    // We'll define distinct ScrollTriggers for the transitions between sections

    // Hero (Green) -> About (Gold)
    gsap.to(':root', {
        '--accent-neon': '#ffb300', // Gold
        scrollTrigger: {
            trigger: '#hero',
            start: "bottom top",
            endTrigger: '#about',
            end: "center center",
            scrub: true,
            onUpdate: (self) => {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
                window.dispatchEvent(new CustomEvent('theme-color-change', { detail: color }));
            }
        }
    });

    // About (Gold) -> Projects (Cyan)
    gsap.to(':root', {
        '--accent-neon': '#00d2ff', // Cyan
        scrollTrigger: {
            trigger: '#about',
            start: "bottom center",
            endTrigger: '#projects',
            end: "center center",
            scrub: true,
            onUpdate: (self) => {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
                window.dispatchEvent(new CustomEvent('theme-color-change', { detail: color }));
            }
        }
    });

    // Projects (Cyan) -> Writing (Violet)
    gsap.to(':root', {
        '--accent-neon': '#bd00ff', // Violet
        scrollTrigger: {
            trigger: '#projects',
            start: "bottom center",
            endTrigger: '#writing',
            end: "center center",
            scrub: true,
            onUpdate: (self) => {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
                window.dispatchEvent(new CustomEvent('theme-color-change', { detail: color }));
            }
        }
    });

    // Writing (Violet) -> Contact (Silver)
    gsap.to(':root', {
        '--accent-neon': '#e2e8f0', // Silver
        scrollTrigger: {
            trigger: '#writing',
            start: "bottom center",
            endTrigger: '#contact',
            end: "center center",
            scrub: true,
            onUpdate: (self) => {
                const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
                window.dispatchEvent(new CustomEvent('theme-color-change', { detail: color }));
            }
        }
    });

    // --- Helper: Hex to RGB ---
    const updateAccentRGB = (hex) => {
        let r = 0, g = 0, b = 0;
        // Handle #abc
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        const rgb = `${+r}, ${+g}, ${+b}`;
        document.documentElement.style.setProperty('--accent-rgb', rgb);
    };

    // Listen for color changes and update the RGB variable used for glassmorphism
    window.addEventListener('theme-color-change', (e) => {
        updateAccentRGB(e.detail);
    });

    // Global tick to sync particles with CSS variable (smoother than onUpdate event for color mixing)
    gsap.ticker.add(() => {
        const color = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
        if (window.updateParticlesColor) {
            window.updateParticlesColor(color);
        }
    });

    // Initial update
    const initialColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-neon').trim();
    updateAccentRGB(initialColor);
};

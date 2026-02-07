/* Main JavaScript Entry Point */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Antigravity Mobile Portfolio Initialized.");

    // Initialize Global State
    window.appState = {
        mode: 'developer', // 'developer' or 'writer'
        isLowPower: false, // Detect if user prefers reduced motion
        currentSection: 'hero'
    };

    // Check for Reduced Motion Preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    window.appState.isLowPower = mediaQuery.matches;

    // Force scroll to top on reload to prevent "middle of nowhere" loading
    window.scrollTo(0, 0);
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }

    // Initialize Components
    if (window.initParticles) window.initParticles(); // Ambient Fog and Stars Background
    if (window.initScrollEffects) window.initScrollEffects();
    if (window.initInteractions) window.initInteractions();
    if (window.initThemeEngine) window.initThemeEngine();
    if (window.initLanguageManager) window.initLanguageManager();

    console.log("All systems operational. Ready to impress.");
});

/**
 * Theme Manager for 3D City Simulator
 * Handles theme switching and visual appearance
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
    }
    
    /**
     * Initialize theme manager
     */
    init() {
        this.setupEventListeners();
        
        // Check for user's preferred color scheme
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.setTheme('dark');
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Theme toggle button
        document.getElementById('theme-toggle-btn').addEventListener('click', () => {
            this.toggleTheme();
        });
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }
    
    /**
     * Set the theme
     */
    setTheme(theme) {
        // Update body class
        document.body.classList.remove(`theme-${this.currentTheme}`);
        document.body.classList.add(`theme-${theme}`);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Update scene background color
        if (window.renderer && window.renderer.scene) {
            if (theme === 'dark') {
                window.renderer.scene.background = new THREE.Color(0x1a1a2e);
            } else {
                window.renderer.scene.background = new THREE.Color(0xf0f0f0);
            }
        }
        
        // Dispatch theme change event
        const event = new CustomEvent('themeChanged', { detail: { theme } });
        document.dispatchEvent(event);
    }
    
    /**
     * Get the current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }
}

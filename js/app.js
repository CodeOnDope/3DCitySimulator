/**
 * Main Application Integration Module for 3D City Simulator
 * Integrates all components and initializes the application
 */

class App {
    constructor() {
        // Core components
        this.renderer = null;
        this.perspectiveManager = null;
        this.visualizationManager = null;
        this.shapesManager = null;
        this.navigationManager = null;
        this.lightingManager = null;
        this.documentationManager = null;
        
        // UI state
        this.isDarkTheme = false;
    }
    
    /**
     * Initialize the application
     */
    async init() {
        // Check browser compatibility
        if (!this.checkBrowserCompatibility()) {
            this.showCompatibilityError();
            return;
        }
        
        // Create core components
        this.renderer = new Renderer();
        this.perspectiveManager = new PerspectiveManager(this.renderer);
        this.visualizationManager = new VisualizationManager(this.renderer);
        this.shapesManager = new ShapesManager(this.renderer);
        this.navigationManager = new NavigationManager(this.renderer);
        this.lightingManager = new LightingManager(this.renderer);
        this.documentationManager = new DocumentationManager();
        
        // Initialize components
        this.renderer.init(this.perspectiveManager);
        this.perspectiveManager.init();
        this.visualizationManager.init();
        this.shapesManager.init();
        this.navigationManager.init();
        this.lightingManager.init();
        this.documentationManager.init();
        
        // Setup UI
        this.setupUI();
        
        // Set copyright information
        this.updateCopyright();
        
        console.log('3D City Simulator initialized successfully');
    }
    
    /**
     * Check browser compatibility
     * @returns {boolean} Whether the browser is compatible
     */
    checkBrowserCompatibility() {
        // Check for WebGL support
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Show compatibility error message
     */
    showCompatibilityError() {
        const container = document.getElementById('canvas-container');
        if (container) {
            container.innerHTML = `
                <div class="compatibility-error">
                    <h2>Browser Compatibility Error</h2>
                    <p>Your browser does not support WebGL, which is required to run the 3D City Simulator.</p>
                    <p>Please try using a modern browser such as:</p>
                    <ul>
                        <li>Google Chrome (recommended)</li>
                        <li>Mozilla Firefox</li>
                        <li>Microsoft Edge</li>
                        <li>Safari 14 or newer</li>
                    </ul>
                </div>
            `;
        }
    }
    
    /**
     * Setup UI event listeners and controls
     */
    setupUI() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }
        
        // Help button
        const helpButton = document.getElementById('help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => this.documentationManager.showDocumentation());
        }
        
        // Refresh vanishing points button
        const refreshVPButton = document.getElementById('refresh-vp-btn');
        if (refreshVPButton) {
            refreshVPButton.addEventListener('click', () => this.perspectiveManager.refreshVanishingPoints());
        }
        
        // Collapsible control groups
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const targetId = e.currentTarget.getAttribute('data-target');
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.classList.toggle('collapsed');
                    e.currentTarget.classList.toggle('collapsed');
                }
            });
        });
        
        // Visual options toggles
        document.querySelectorAll('.visual-option-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const option = e.target.getAttribute('data-option');
                const value = e.target.checked;
                
                this.setVisualOption(option, value);
            });
        });
    }
    
    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        this.isDarkTheme = !this.isDarkTheme;
        
        if (this.isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        
        // Update theme icon
        const themeIcon = document.getElementById('theme-icon');
        if (themeIcon) {
            if (this.isDarkTheme) {
                themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM4 11v2H1v-2h3z"/>
                    </svg>
                `;
            } else {
                themeIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                        <path fill="none" d="M0 0h24v24H0z"/>
                        <path d="M10 7a7 7 0 0 0 12 4.9v.1c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2h.1A6.979 6.979 0 0 0 10 7zm-6 5a8 8 0 0 0 15.062 3.762A9 9 0 0 1 8.238 4.938 7.999 7.999 0 0 0 4 12z"/>
                    </svg>
                `;
            }
        }
    }
    
    /**
     * Set visual option
     * @param {string} option - Option name
     * @param {boolean} value - Option value
     */
    setVisualOption(option, value) {
        switch (option) {
            case 'vanishingPoints':
                this.renderer.showVanishingPoints = value;
                break;
                
            case 'grid':
                this.renderer.showGrid = value;
                break;
                
            case 'referenceLines':
                this.renderer.showReferenceLines = value;
                break;
                
            case 'windows':
                this.renderer.showWindows = value;
                break;
        }
        
        // Update scene
        this.renderer.updateScene();
    }
    
    /**
     * Update copyright information
     */
    updateCopyright() {
        const copyrightElement = document.getElementById('copyright');
        if (copyrightElement) {
            copyrightElement.innerHTML = '© 2025. Developed by Dineshkumar Rajendran, Lecturer at Old Dominion University.';
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    
    // Store app instance globally for debugging
    window.citySimulatorApp = app;
});

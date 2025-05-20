/**
 * Main JavaScript file for 3D City Simulator
 * Initializes and connects all modules
 */

// Global variables
let renderer;
let perspectiveManager;
let uiManager;
let themeManager;
let educationManager;

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check browser compatibility
    const compatibilityIssues = checkBrowserCompatibility();
    if (compatibilityIssues.length > 0) {
        // Show compatibility warnings
        compatibilityIssues.forEach(issue => {
            showNotification(issue, 'warning', 5000);
        });
    }
    
    // Initialize modules
    initializeApp();
});

/**
 * Initialize the application and all its modules
 */
function initializeApp() {
    // Create renderer
    renderer = new Renderer();
    window.renderer = renderer; // Make available globally for debugging
    
    // Initialize renderer
    try {
        renderer.init();
    } catch (error) {
        console.error('Failed to initialize renderer:', error);
        showNotification('Failed to initialize 3D renderer. Please check your browser compatibility.', 'error', 5000);
        document.getElementById('loading-overlay').classList.add('hidden');
        return;
    }
    
    // Create and initialize perspective manager
    perspectiveManager = new PerspectiveManager(renderer);
    perspectiveManager.init();
    
    // Create and initialize theme manager
    themeManager = new ThemeManager();
    themeManager.init();
    
    // Create and initialize UI manager
    uiManager = new UIManager(renderer, perspectiveManager);
    uiManager.init(themeManager);
    
    // Create and initialize education manager
    educationManager = new EducationManager(renderer, perspectiveManager);
    educationManager.init();
    
    // Generate initial city
    setTimeout(generateInitialCity, 500); // Delay to ensure all elements are loaded
    
    // Load saved settings if available
    loadSavedSettings();
    
    // Add TWEEN update to animation loop
    const animate = function() {
        requestAnimationFrame(animate);
        TWEEN.update();
    };
    animate();
    
    // Show welcome message
    showWelcomeMessage();
}

/**
 * Generate the initial city
 */
function generateInitialCity() {
    try {
        // Get building count from slider or use default
        let count = 10; // Default value
        const buildingCountElement = document.getElementById('buildingCount');
        if (buildingCountElement) {
            count = parseInt(buildingCountElement.value);
        }
        
        // Get shape from radio buttons or use default
        let shape = 'cube'; // Default value
        const selectedShapeElement = document.querySelector('input[name="buildingShape"]:checked');
        if (selectedShapeElement) {
            shape = selectedShapeElement.value;
        }
        
        // Get grid size from slider or use default
        let gridSize = 500; // Default value
        const gridSizeElement = document.getElementById('gridSize');
        if (gridSizeElement) {
            gridSize = parseInt(gridSizeElement.value);
        }
        
        // Generate city with these parameters
        renderer.generateCity(count, shape, gridSize);
    } catch (error) {
        console.error('Error generating initial city:', error);
    }
}

/**
 * Load saved settings from localStorage
 */
function loadSavedSettings() {
    const settings = loadSettings();
    if (settings) {
        // Apply saved theme
        if (settings.theme) {
            themeManager.setTheme(settings.theme);
        }
        
        // Apply saved perspective type
        if (settings.perspectiveType) {
            document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
                radio.checked = radio.value === settings.perspectiveType;
            });
            perspectiveManager.setPerspectiveType(settings.perspectiveType);
        }
        
        // Apply saved lighting mode
        if (settings.lightingMode) {
            document.querySelectorAll('input[name="lightingMode"]').forEach(radio => {
                radio.checked = radio.value === settings.lightingMode;
            });
            renderer.setupLighting(settings.lightingMode);
        }
    }
}

/**
 * Save current settings to localStorage
 */
function saveCurrentSettings() {
    const settings = {
        theme: themeManager.getCurrentTheme(),
        perspectiveType: perspectiveManager.currentType,
        lightingMode: renderer.currentLightingMode,
        showGrid: renderer.showGrid,
        showVanishingPoints: renderer.showVanishingPoints,
        showReferenceLines: renderer.showReferenceLines,
        showWindows: renderer.showWindows,
        lineColor: CONFIG.visual.lineColor
    };
    
    saveSettings(settings);
}

/**
 * Show welcome message
 */
function showWelcomeMessage() {
    showNotification('Welcome to 3D City Simulator by Dineshkumar Rajendran', 'info', 5000);
}

// Save settings when user leaves the page
window.addEventListener('beforeunload', () => {
    saveCurrentSettings();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only handle shortcuts when not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // Ctrl+H: Toggle help modal
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        if (uiManager.isModalOpen) {
            uiManager.closeModal();
        } else {
            uiManager.openModal();
        }
    }
    
    // Ctrl+G: Generate new city
    if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        uiManager.generateCity();
    }
    
    // Ctrl+R: Randomize settings
    if (e.ctrlKey && e.key === 'r') {
        e.preventDefault();
        renderer.randomizeSettings();
    }
    
    // Ctrl+T: Toggle theme
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        themeManager.toggleTheme();
    }
    
    // Ctrl+S: Take screenshot
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        takeScreenshot(renderer);
        showNotification('Screenshot saved', 'success');
    }
    
    // Number keys 1-3: Switch perspective type
    if (e.key === '1' || e.key === '2' || e.key === '3') {
        const perspectiveType = `${e.key}-point`;
        document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
            if (radio.value === perspectiveType) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        });
    }
    
    // Space: Toggle selection mode
    if (e.key === ' ') {
        e.preventDefault();
        const isSelectionMode = !renderer.isSelectionMode;
        uiManager.setCameraMode(isSelectionMode ? 'select' : 'orbit');
    }
});

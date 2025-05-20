/**
 * UI Module for 3D City Simulator
 * Handles user interface interactions and state management
 */

class UIManager {
    constructor(renderer, perspectiveManager) {
        this.renderer = renderer;
        this.perspectiveManager = perspectiveManager;
        this.themeManager = null;
        this.isModalOpen = false;
        this.activeTab = 'tab-1point';
    }
    
    /**
     * Initialize UI components and event listeners
     */
    init(themeManager) {
        this.themeManager = themeManager;
        this.setupEventListeners();
        this.setupBuildingControls();
        this.setupToggleButtons();
    }
    
    /**
     * Setup event listeners for UI controls
     */
    setupEventListeners() {
        // Generate and randomize buttons
        document.querySelectorAll('#generateBtn').forEach(btn => {
            btn.addEventListener('click', () => this.generateCity());
        });

        document.querySelectorAll('#randomizeBtn').forEach(btn => {
            btn.addEventListener('click', () => this.renderer.randomizeSettings());
        });
        
        // Building count slider
        const buildingCount = document.getElementById('buildingCount');
        const buildingCountValue = document.getElementById('buildingCountValue');
        if (buildingCount && buildingCountValue) {
            buildingCount.addEventListener('input', (e) => {
                buildingCountValue.textContent = e.target.value;
            });
        }
        
        // Grid size slider
        const gridSize = document.getElementById('gridSize');
        const gridSizeValue = document.getElementById('gridSizeValue');
        if (gridSize && gridSizeValue) {
            gridSize.addEventListener('input', (e) => {
                gridSizeValue.textContent = e.target.value;
            });
        }
        
        // Visual options checkboxes
        const showVanishingPoints = document.getElementById('show-vp-toggle');
        if (showVanishingPoints) {
            showVanishingPoints.addEventListener('change', (e) => {
                this.renderer.toggleVanishingPoints(e.target.checked);
            });
        }
        
        const showGrid = document.getElementById('show-grid-toggle');
        if (showGrid) {
            showGrid.addEventListener('change', (e) => {
                this.renderer.toggleGrid(e.target.checked);
            });
        }
        
        const showBuildingLines = document.getElementById('show-lines-toggle');
        if (showBuildingLines) {
            showBuildingLines.addEventListener('change', (e) => {
                this.renderer.toggleReferenceLines(e.target.checked);
            });
        }
        
        const showWindows = document.getElementById('show-windows-toggle');
        if (showWindows) {
            showWindows.addEventListener('change', (e) => {
                this.renderer.toggleWindows(e.target.checked);
            });
        }
        
        // Lighting mode radio buttons
        document.querySelectorAll('input[name="lightingMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.renderer.setupLighting(e.target.value);
                }
            });
        });
        
        // Help button (opens help modal)
        document.querySelectorAll('#helpBtn').forEach(btn => {
            btn.addEventListener('click', () => this.openModal());
        });
        
        // Modal close button
        const closeModal = document.getElementById('close-modal');
        if (closeModal) {
            closeModal.addEventListener('click', () => this.closeModal());
        }
        
        // Perspective type radio buttons
        document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.perspectiveManager.setPerspectiveType(e.target.value);
                }
            });
        });
        
        // Navigation tools
        const tumbleTool = document.getElementById('tumble-tool');
        const panTool = document.getElementById('pan-tool');
        const dollyTool = document.getElementById('dolly-tool');
        
        if (tumbleTool && panTool && dollyTool) {
            tumbleTool.addEventListener('click', () => this.setNavigationMode('tumble'));
            panTool.addEventListener('click', () => this.setNavigationMode('pan'));
            dollyTool.addEventListener('click', () => this.setNavigationMode('dolly'));
        }
        
        // View mode radio buttons
        document.querySelectorAll('input[name="viewMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.renderer.setViewMode(e.target.value);
                }
            });
        });
    }
    
    /**
     * Setup building control event listeners
     */
    setupBuildingControls() {
        // Material preset radio buttons
        document.querySelectorAll('input[name="materialPreset"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.renderer.setMaterialPreset(e.target.value);
                }
            });
        });
        
        // Building shape radio buttons
        document.querySelectorAll('input[name="buildingShape"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Update the current shape selection
                    this.renderer.currentBuildingShape = e.target.value;
                }
            });
        });
    }
    
    /**
     * Setup collapsible section toggle buttons
     */
    setupToggleButtons() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.dataset.target;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    if (targetElement.style.display === 'none') {
                        targetElement.style.display = 'block';
                        btn.classList.remove('collapsed');
                    } else {
                        targetElement.style.display = 'none';
                        btn.classList.add('collapsed');
                    }
                }
            });
        });
    }
    
    /**
     * Generate a new city based on current UI settings
     */
    generateCity() {
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
            this.renderer.generateCity(count, shape, gridSize);
        } catch (error) {
            console.error('Error generating city:', error);
        }
    }
    
    /**
     * Set navigation mode (tumble, pan, dolly)
     */
    setNavigationMode(mode) {
        const tumbleTool = document.getElementById('tumble-tool');
        const panTool = document.getElementById('pan-tool');
        const dollyTool = document.getElementById('dolly-tool');
        
        if (tumbleTool && panTool && dollyTool) {
            // Remove active class from all tools
            tumbleTool.classList.remove('active');
            panTool.classList.remove('active');
            dollyTool.classList.remove('active');
            
            // Add active class to selected tool
            if (mode === 'tumble') {
                tumbleTool.classList.add('active');
                this.renderer.setNavigationMode('tumble');
            } else if (mode === 'pan') {
                panTool.classList.add('active');
                this.renderer.setNavigationMode('pan');
            } else if (mode === 'dolly') {
                dollyTool.classList.add('active');
                this.renderer.setNavigationMode('dolly');
            }
        }
    }
    
    /**
     * Open the help modal
     */
    openModal() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.classList.add('active');
            this.isModalOpen = true;
        }
    }
    
    /**
     * Close the help modal
     */
    closeModal() {
        const modal = document.getElementById('help-modal');
        if (modal) {
            modal.classList.remove('active');
            this.isModalOpen = false;
        }
    }
}

/**
 * Navigation Tools Module for 3D City Simulator
 * Handles camera navigation tools (tumble, pan, dolly)
 */

class NavigationManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentTool = 'tumble'; // Default tool
        this.isActive = false;
        
        // Tool buttons
        this.tumbleButton = null;
        this.panButton = null;
        this.dollyButton = null;
        
        // Mouse state
        this.mouseDown = false;
        this.mouseButton = -1; // 0: left, 1: middle, 2: right
        this.mouseStartX = 0;
        this.mouseStartY = 0;
    }
    
    /**
     * Initialize navigation tools
     */
    init() {
        // Get tool buttons
        this.tumbleButton = document.getElementById('tumble-tool');
        this.panButton = document.getElementById('pan-tool');
        this.dollyButton = document.getElementById('dolly-tool');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Set initial active tool
        this.setActiveTool('tumble');
    }
    
    /**
     * Setup event listeners for navigation tools
     */
    setupEventListeners() {
        // Tool button clicks
        if (this.tumbleButton) {
            this.tumbleButton.addEventListener('click', () => this.setActiveTool('tumble'));
        }
        
        if (this.panButton) {
            this.panButton.addEventListener('click', () => this.setActiveTool('pan'));
        }
        
        if (this.dollyButton) {
            this.dollyButton.addEventListener('click', () => this.setActiveTool('dolly'));
        }
        
        // Mouse events on canvas
        const canvas = this.renderer.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Alt + T for tumble
            if (e.altKey && e.key === 't') {
                this.setActiveTool('tumble');
            }
            
            // Alt + P for pan
            if (e.altKey && e.key === 'p') {
                this.setActiveTool('pan');
            }
            
            // Alt + D for dolly
            if (e.altKey && e.key === 'd') {
                this.setActiveTool('dolly');
            }
        });
    }
    
    /**
     * Set the active navigation tool
     * @param {string} tool - Tool name ('tumble', 'pan', 'dolly')
     */
    setActiveTool(tool) {
        this.currentTool = tool;
        
        // Update button states
        if (this.tumbleButton) {
            this.tumbleButton.classList.toggle('active', tool === 'tumble');
        }
        
        if (this.panButton) {
            this.panButton.classList.toggle('active', tool === 'pan');
        }
        
        if (this.dollyButton) {
            this.dollyButton.classList.toggle('active', tool === 'dolly');
        }
        
        // Update orbit controls based on tool
        this.updateOrbitControlsSettings();
    }
    
    /**
     * Update orbit controls settings based on active tool
     */
    updateOrbitControlsSettings() {
        if (!this.renderer.controls) return;
        
        const controls = this.renderer.controls;
        
        switch (this.currentTool) {
            case 'tumble':
                controls.enableRotate = true;
                controls.enablePan = false;
                controls.enableZoom = false;
                break;
                
            case 'pan':
                controls.enableRotate = false;
                controls.enablePan = true;
                controls.enableZoom = false;
                break;
                
            case 'dolly':
                controls.enableRotate = false;
                controls.enablePan = false;
                controls.enableZoom = true;
                break;
        }
    }
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseDown(event) {
        this.mouseDown = true;
        this.mouseButton = event.button;
        this.mouseStartX = event.clientX;
        this.mouseStartY = event.clientY;
        
        // If user is in selection mode, don't override
        if (this.renderer.isSelectionMode) return;
        
        // Override orbit controls based on mouse button
        const controls = this.renderer.controls;
        
        if (controls) {
            // Left mouse button (0)
            if (event.button === 0) {
                controls.enableRotate = true;
                controls.enablePan = false;
                controls.enableZoom = false;
            }
            
            // Middle mouse button (1)
            else if (event.button === 1) {
                controls.enableRotate = false;
                controls.enablePan = true;
                controls.enableZoom = false;
            }
            
            // Right mouse button (2)
            else if (event.button === 2) {
                controls.enableRotate = false;
                controls.enablePan = false;
                controls.enableZoom = true;
            }
        }
    }
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseMove(event) {
        if (!this.mouseDown) return;
        
        // Calculate delta
        const deltaX = event.clientX - this.mouseStartX;
        const deltaY = event.clientY - this.mouseStartY;
        
        // Update start position
        this.mouseStartX = event.clientX;
        this.mouseStartY = event.clientY;
    }
    
    /**
     * Handle mouse up event
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseUp(event) {
        this.mouseDown = false;
        this.mouseButton = -1;
        
        // Restore orbit controls settings based on active tool
        this.updateOrbitControlsSettings();
    }
    
    /**
     * Handle mouse leave event
     * @param {MouseEvent} event - Mouse event
     */
    handleMouseLeave(event) {
        this.mouseDown = false;
        this.mouseButton = -1;
        
        // Restore orbit controls settings based on active tool
        this.updateOrbitControlsSettings();
    }
}

// Export the NavigationManager class
if (typeof module !== 'undefined') {
    module.exports = { NavigationManager };
}

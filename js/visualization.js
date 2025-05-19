/**
 * Visualization Module for 3D City Simulator
 * Handles different visualization modes for buildings and objects
 */

class VisualizationManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentMode = 'shaded'; // Default visualization mode
        this.availableModes = {
            'shaded': { name: 'Shaded', description: 'Solid shaded objects with materials' },
            'wireframe': { name: 'Wireframe', description: 'Wireframe representation of objects' },
            'wireframe-shaded': { name: 'Wireframe on Shaded', description: 'Solid objects with wireframe overlay' },
            'xray': { name: 'X-Ray', description: 'Transparent objects showing internal structure' },
            'silhouette': { name: 'Silhouette', description: 'Outline representation of objects' }
        };
        
        // Material presets for different visualization modes
        this.materialPresets = {
            'pencil': { name: 'Pencil Sketch', description: 'Hand-drawn pencil sketch appearance' },
            'clay': { name: 'Clay', description: 'Matte clay-like material' },
            'paper': { name: 'Paper', description: 'Paper material with slight texture' },
            'metal': { name: 'Metal', description: 'Reflective metallic material' },
            'glass': { name: 'Glass', description: 'Transparent glass material' },
            'plastic': { name: 'Plastic', description: 'Smooth plastic material' },
            'concrete': { name: 'Concrete', description: 'Rough concrete material' },
            'wood': { name: 'Wood', description: 'Natural wood material' }
        };
        
        this.currentMaterial = 'clay'; // Default material preset
    }
    
    /**
     * Initialize visualization settings and UI
     */
    init() {
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for visualization controls
     */
    setupEventListeners() {
        // Visualization mode selection
        document.querySelectorAll('input[name="visualizationMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setVisualizationMode(e.target.value);
                }
            });
        });
        
        // Material preset selection
        document.querySelectorAll('input[name="materialPreset"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setMaterialPreset(e.target.value);
                }
            });
        });
    }
    
    /**
     * Set visualization mode for all buildings
     * @param {string} mode - Visualization mode to set
     */
    setVisualizationMode(mode) {
        if (!this.availableModes[mode]) return;
        
        this.currentMode = mode;
        
        // Apply visualization mode to all buildings
        this.renderer.buildings.forEach(building => {
            this.applyVisualizationToObject(building.mesh, mode);
        });
    }
    
    /**
     * Set material preset for all buildings
     * @param {string} preset - Material preset to apply
     */
    setMaterialPreset(preset) {
        if (!this.materialPresets[preset]) return;
        
        this.currentMaterial = preset;
        
        // Apply material preset to all buildings
        this.renderer.buildings.forEach(building => {
            this.applyMaterialToObject(building.mesh, preset);
        });
    }
    
    /**
     * Apply visualization mode to a specific object
     * @param {THREE.Object3D} object - Object to apply visualization to
     * @param {string} mode - Visualization mode to apply
     */
    applyVisualizationToObject(object, mode) {
        switch (mode) {
            case 'wireframe':
                if (object.material) {
                    object.material.wireframe = true;
                    object.material.transparent = false;
                    object.material.opacity = 1.0;
                }
                break;
                
            case 'shaded':
                if (object.material) {
                    object.material.wireframe = false;
                    object.material.transparent = false;
                    object.material.opacity = 1.0;
                }
                break;
                
            case 'wireframe-shaded':
                // Create wireframe overlay if it doesn't exist
                if (!object.wireframeHelper) {
                    const wireframeMaterial = new THREE.MeshBasicMaterial({
                        color: 0x000000,
                        wireframe: true,
                        transparent: true,
                        opacity: 0.15
                    });
                    
                    // Clone geometry and create wireframe mesh
                    const wireframeMesh = new THREE.Mesh(object.geometry.clone(), wireframeMaterial);
                    wireframeMesh.position.copy(object.position);
                    wireframeMesh.rotation.copy(object.rotation);
                    wireframeMesh.scale.copy(object.scale);
                    
                    // Store reference to wireframe helper
                    object.wireframeHelper = wireframeMesh;
                    object.parent.add(wireframeMesh);
                }
                
                // Make sure base object is shaded
                if (object.material) {
                    object.material.wireframe = false;
                    object.material.transparent = false;
                    object.material.opacity = 1.0;
                }
                
                // Show wireframe helper
                if (object.wireframeHelper) {
                    object.wireframeHelper.visible = true;
                }
                break;
                
            case 'xray':
                if (object.material) {
                    object.material.wireframe = false;
                    object.material.transparent = true;
                    object.material.opacity = 0.3;
                }
                
                // Hide wireframe helper if it exists
                if (object.wireframeHelper) {
                    object.wireframeHelper.visible = false;
                }
                break;
                
            case 'silhouette':
                // Create or update edge geometry
                if (!object.edgesHelper) {
                    const edges = new THREE.EdgesGeometry(object.geometry);
                    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                    const edgesHelper = new THREE.LineSegments(edges, edgesMaterial);
                    
                    // Store reference to edges helper
                    object.edgesHelper = edgesHelper;
                    object.parent.add(edgesHelper);
                }
                
                // Make base object transparent
                if (object.material) {
                    object.material.transparent = true;
                    object.material.opacity = 0.0;
                }
                
                // Show edges helper
                if (object.edgesHelper) {
                    object.edgesHelper.visible = true;
                    object.edgesHelper.position.copy(object.position);
                    object.edgesHelper.rotation.copy(object.rotation);
                    object.edgesHelper.scale.copy(object.scale);
                }
                
                // Hide wireframe helper if it exists
                if (object.wireframeHelper) {
                    object.wireframeHelper.visible = false;
                }
                break;
        }
    }
    
    /**
     * Apply material preset to a specific object
     * @param {THREE.Object3D} object - Object to apply material to
     * @param {string} preset - Material preset to apply
     */
    applyMaterialToObject(object, preset) {
        if (!object.material) return;
        
        // Store original color
        const originalColor = object.material.color.clone();
        
        // Create new material based on preset
        let newMaterial;
        
        switch (preset) {
            case 'pencil':
                newMaterial = new THREE.MeshToonMaterial({
                    color: originalColor,
                    gradientMap: this.createToonGradientTexture(3),
                    flatShading: true
                });
                break;
                
            case 'clay':
                newMaterial = new THREE.MeshLambertMaterial({
                    color: originalColor,
                    flatShading: true
                });
                break;
                
            case 'paper':
                newMaterial = new THREE.MeshLambertMaterial({
                    color: originalColor,
                    map: this.createPaperTexture()
                });
                break;
                
            case 'metal':
                newMaterial = new THREE.MeshStandardMaterial({
                    color: originalColor,
                    metalness: 0.8,
                    roughness: 0.2,
                    envMapIntensity: 1.0
                });
                break;
                
            case 'glass':
                newMaterial = new THREE.MeshPhysicalMaterial({
                    color: originalColor,
                    transparent: true,
                    opacity: 0.3,
                    roughness: 0.0,
                    transmission: 0.9,
                    ior: 1.5
                });
                break;
                
            case 'plastic':
                newMaterial = new THREE.MeshStandardMaterial({
                    color: originalColor,
                    roughness: 0.3,
                    metalness: 0.0
                });
                break;
                
            case 'concrete':
                newMaterial = new THREE.MeshStandardMaterial({
                    color: originalColor,
                    roughness: 0.9,
                    metalness: 0.0
                });
                break;
                
            case 'wood':
                newMaterial = new THREE.MeshStandardMaterial({
                    color: originalColor,
                    roughness: 0.7,
                    metalness: 0.0,
                    map: this.createWoodTexture()
                });
                break;
                
            default:
                // Default to standard material
                newMaterial = new THREE.MeshStandardMaterial({
                    color: originalColor
                });
                break;
        }
        
        // Preserve wireframe setting
        if (object.material.wireframe) {
            newMaterial.wireframe = true;
        }
        
        // Preserve transparency settings
        if (object.material.transparent) {
            newMaterial.transparent = true;
            newMaterial.opacity = object.material.opacity;
        }
        
        // Apply new material
        object.material = newMaterial;
        
        // Re-apply current visualization mode
        this.applyVisualizationToObject(object, this.currentMode);
    }
    
    /**
     * Create a toon gradient texture for pencil sketch effect
     * @param {number} steps - Number of gradient steps
     * @returns {THREE.Texture} Gradient texture
     */
    createToonGradientTexture(steps) {
        const data = new Uint8Array(steps * 4);
        
        for (let i = 0; i < steps; i++) {
            const stride = i * 4;
            const value = Math.round((i / (steps - 1)) * 255);
            data[stride] = value;
            data[stride + 1] = value;
            data[stride + 2] = value;
            data[stride + 3] = 255;
        }
        
        const texture = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat);
        texture.needsUpdate = true;
        return texture;
    }
    
    /**
     * Create a paper texture
     * @returns {THREE.Texture} Paper texture
     */
    createPaperTexture() {
        // Create a canvas for the paper texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Fill with off-white color
        ctx.fillStyle = '#f8f8f0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add subtle noise
        for (let i = 0; i < 15000; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const radius = Math.random() * 1.5;
            const opacity = Math.random() * 0.05;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.fill();
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4, 4);
        
        return texture;
    }
    
    /**
     * Create a wood texture
     * @returns {THREE.Texture} Wood texture
     */
    createWoodTexture() {
        // Create a canvas for the wood texture
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Create wood grain
        for (let i = 0; i < 20; i++) {
            const y = i * (canvas.height / 20) + Math.random() * 10;
            const lineWidth = 5 + Math.random() * 10;
            const opacity = 0.1 + Math.random() * 0.1;
            
            ctx.beginPath();
            ctx.moveTo(0, y);
            
            // Create wavy line
            for (let x = 0; x < canvas.width; x += 20) {
                const yOffset = y + Math.sin(x * 0.01) * 10;
                ctx.lineTo(x, yOffset);
            }
            
            ctx.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
            ctx.lineWidth = lineWidth;
            ctx.stroke();
        }
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        
        return texture;
    }
}

// Export the VisualizationManager class
if (typeof module !== 'undefined') {
    module.exports = { VisualizationManager };
}

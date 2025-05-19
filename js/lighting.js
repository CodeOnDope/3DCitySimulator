/**
 * Lighting Module for 3D City Simulator
 * Handles lighting setup, controls, and effects
 */

class LightingManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentMode = 'day'; // Default lighting mode
        
        // Available lighting modes
        this.lightingModes = {
            'day': { name: 'Day', description: 'Bright daylight scene' },
            'night': { name: 'Night', description: 'Dark night scene with building lights' },
            'sunset': { name: 'Sunset', description: 'Warm sunset lighting' },
            'studio': { name: 'Studio', description: 'Neutral studio lighting for clear visualization' },
            'dramatic': { name: 'Dramatic', description: 'High contrast dramatic lighting' }
        };
        
        // Light objects
        this.ambientLight = null;
        this.directionalLight = null;
        this.pointLights = [];
        this.spotLights = [];
        
        // Light settings
        this.settings = {
            shadows: true,
            intensity: 1.0,
            diffuse: 0.7,
            specular: 0.3,
            color: 0xffffff
        };
    }
    
    /**
     * Initialize lighting manager
     */
    init() {
        this.setupLights();
        this.setupEventListeners();
    }
    
    /**
     * Setup initial lights in the scene
     */
    setupLights() {
        // Remove any existing lights
        this.removeLights();
        
        // Create ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.renderer.scene.add(this.ambientLight);
        
        // Create directional light (sun)
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        this.directionalLight.position.set(100, 100, 50);
        this.directionalLight.castShadow = this.settings.shadows;
        
        // Configure shadow properties
        if (this.settings.shadows) {
            this.directionalLight.shadow.mapSize.width = 2048;
            this.directionalLight.shadow.mapSize.height = 2048;
            this.directionalLight.shadow.camera.near = 0.5;
            this.directionalLight.shadow.camera.far = 500;
            this.directionalLight.shadow.camera.left = -100;
            this.directionalLight.shadow.camera.right = 100;
            this.directionalLight.shadow.camera.top = 100;
            this.directionalLight.shadow.camera.bottom = -100;
            this.directionalLight.shadow.bias = -0.0001;
        }
        
        this.renderer.scene.add(this.directionalLight);
        
        // Apply current lighting mode
        this.setLightingMode(this.currentMode);
    }
    
    /**
     * Setup event listeners for lighting controls
     */
    setupEventListeners() {
        // Lighting mode selection
        document.querySelectorAll('input[name="lightingMode"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setLightingMode(e.target.value);
                }
            });
        });
        
        // Shadow toggle
        const shadowToggle = document.getElementById('shadows-toggle');
        if (shadowToggle) {
            shadowToggle.addEventListener('change', (e) => {
                this.setShadows(e.target.checked);
            });
        }
        
        // Light intensity slider
        const intensitySlider = document.getElementById('light-intensity');
        if (intensitySlider) {
            intensitySlider.addEventListener('input', (e) => {
                this.setIntensity(parseFloat(e.target.value));
            });
        }
        
        // Diffuse slider
        const diffuseSlider = document.getElementById('light-diffuse');
        if (diffuseSlider) {
            diffuseSlider.addEventListener('input', (e) => {
                this.setDiffuse(parseFloat(e.target.value));
            });
        }
        
        // Light color picker
        const colorPicker = document.getElementById('light-color');
        if (colorPicker) {
            colorPicker.addEventListener('input', (e) => {
                this.setColor(e.target.value);
            });
        }
        
        // Add light button
        const addLightBtn = document.getElementById('add-light-btn');
        if (addLightBtn) {
            addLightBtn.addEventListener('click', () => {
                this.addPointLight();
            });
        }
    }
    
    /**
     * Set the current lighting mode
     * @param {string} mode - Lighting mode to set
     */
    setLightingMode(mode) {
        if (!this.lightingModes[mode]) return;
        
        this.currentMode = mode;
        
        switch (mode) {
            case 'day':
                this.ambientLight.intensity = 0.5;
                this.ambientLight.color.set(0x404040);
                this.directionalLight.intensity = 0.8;
                this.directionalLight.color.set(0xffffff);
                this.directionalLight.position.set(100, 100, 50);
                this.renderer.scene.background = new THREE.Color(0xf0f0f0);
                break;
                
            case 'night':
                this.ambientLight.intensity = 0.1;
                this.ambientLight.color.set(0x001133);
                this.directionalLight.intensity = 0.2;
                this.directionalLight.color.set(0x8888ff);
                this.directionalLight.position.set(-50, 20, -50);
                this.renderer.scene.background = new THREE.Color(0x000011);
                
                // Add building lights if none exist
                if (this.pointLights.length === 0) {
                    this.addBuildingLights();
                }
                break;
                
            case 'sunset':
                this.ambientLight.intensity = 0.3;
                this.ambientLight.color.set(0x553322);
                this.directionalLight.intensity = 1.0;
                this.directionalLight.color.set(0xff7700);
                this.directionalLight.position.set(-80, 30, 50);
                this.renderer.scene.background = new THREE.Color(0x332211);
                break;
                
            case 'studio':
                this.ambientLight.intensity = 0.7;
                this.ambientLight.color.set(0xffffff);
                this.directionalLight.intensity = 0.6;
                this.directionalLight.color.set(0xffffff);
                this.directionalLight.position.set(50, 100, 50);
                this.renderer.scene.background = new THREE.Color(0xffffff);
                break;
                
            case 'dramatic':
                this.ambientLight.intensity = 0.2;
                this.ambientLight.color.set(0x222222);
                this.directionalLight.intensity = 1.0;
                this.directionalLight.color.set(0xffffff);
                this.directionalLight.position.set(-50, 80, -50);
                this.renderer.scene.background = new THREE.Color(0x222222);
                break;
        }
        
        // Update UI controls to reflect current settings
        this.updateUIControls();
    }
    
    /**
     * Set shadows enabled/disabled
     * @param {boolean} enabled - Whether shadows should be enabled
     */
    setShadows(enabled) {
        this.settings.shadows = enabled;
        
        // Update directional light
        if (this.directionalLight) {
            this.directionalLight.castShadow = enabled;
        }
        
        // Update point lights
        this.pointLights.forEach(light => {
            light.castShadow = enabled;
        });
        
        // Update spot lights
        this.spotLights.forEach(light => {
            light.castShadow = enabled;
        });
        
        // Update renderer
        if (this.renderer.renderer) {
            this.renderer.renderer.shadowMap.enabled = enabled;
            this.renderer.renderer.shadowMap.needsUpdate = true;
        }
    }
    
    /**
     * Set light intensity
     * @param {number} intensity - Light intensity value
     */
    setIntensity(intensity) {
        this.settings.intensity = intensity;
        
        // Update directional light
        if (this.directionalLight) {
            this.directionalLight.intensity = intensity;
        }
        
        // Update point lights
        this.pointLights.forEach(light => {
            light.intensity = intensity * 0.5; // Reduce for point lights
        });
        
        // Update spot lights
        this.spotLights.forEach(light => {
            light.intensity = intensity * 0.7; // Reduce for spot lights
        });
    }
    
    /**
     * Set diffuse light component
     * @param {number} diffuse - Diffuse value
     */
    setDiffuse(diffuse) {
        this.settings.diffuse = diffuse;
        
        // Update ambient light to reflect diffuse component
        if (this.ambientLight) {
            this.ambientLight.intensity = diffuse * 0.5;
        }
    }
    
    /**
     * Set light color
     * @param {string} colorHex - Hex color string
     */
    setColor(colorHex) {
        const color = new THREE.Color(colorHex);
        this.settings.color = color.getHex();
        
        // Update directional light
        if (this.directionalLight) {
            this.directionalLight.color.set(color);
        }
    }
    
    /**
     * Add a new point light to the scene
     * @param {THREE.Vector3} position - Position for the new light
     * @param {number} color - Light color
     * @param {number} intensity - Light intensity
     * @param {number} distance - Maximum distance the light reaches
     * @returns {THREE.PointLight} The created point light
     */
    addPointLight(position, color = 0xffffff, intensity = 1.0, distance = 100) {
        // Create default position if not provided
        if (!position) {
            position = new THREE.Vector3(
                (Math.random() - 0.5) * 100,
                20 + Math.random() * 40,
                (Math.random() - 0.5) * 100
            );
        }
        
        // Create point light
        const pointLight = new THREE.PointLight(color, intensity, distance);
        pointLight.position.copy(position);
        pointLight.castShadow = this.settings.shadows;
        
        // Configure shadow properties
        if (this.settings.shadows) {
            pointLight.shadow.mapSize.width = 512;
            pointLight.shadow.mapSize.height = 512;
            pointLight.shadow.camera.near = 0.5;
            pointLight.shadow.camera.far = distance;
            pointLight.shadow.bias = -0.001;
        }
        
        // Add helper sphere to visualize light position
        const sphereGeometry = new THREE.SphereGeometry(2, 8, 8);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: color });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        pointLight.add(sphere);
        
        // Add to scene and track
        this.renderer.scene.add(pointLight);
        this.pointLights.push(pointLight);
        
        return pointLight;
    }
    
    /**
     * Add a new spot light to the scene
     * @param {THREE.Vector3} position - Position for the new light
     * @param {THREE.Vector3} target - Target position for the light to point at
     * @param {number} color - Light color
     * @param {number} intensity - Light intensity
     * @param {number} distance - Maximum distance the light reaches
     * @param {number} angle - Spotlight cone angle in radians
     * @returns {THREE.SpotLight} The created spot light
     */
    addSpotLight(position, target, color = 0xffffff, intensity = 1.0, distance = 100, angle = Math.PI / 6) {
        // Create default position if not provided
        if (!position) {
            position = new THREE.Vector3(
                (Math.random() - 0.5) * 100,
                50 + Math.random() * 20,
                (Math.random() - 0.5) * 100
            );
        }
        
        // Create default target if not provided
        if (!target) {
            target = new THREE.Vector3(
                position.x + (Math.random() - 0.5) * 20,
                0,
                position.z + (Math.random() - 0.5) * 20
            );
        }
        
        // Create spot light
        const spotLight = new THREE.SpotLight(color, intensity, distance, angle, 0.5, 1);
        spotLight.position.copy(position);
        spotLight.target.position.copy(target);
        spotLight.castShadow = this.settings.shadows;
        
        // Configure shadow properties
        if (this.settings.shadows) {
            spotLight.shadow.mapSize.width = 1024;
            spotLight.shadow.mapSize.height = 1024;
            spotLight.shadow.camera.near = 0.5;
            spotLight.shadow.camera.far = distance;
            spotLight.shadow.camera.fov = angle * 180 / Math.PI;
            spotLight.shadow.bias = -0.001;
        }
        
        // Add helper cone to visualize light position and direction
        const coneGeometry = new THREE.ConeGeometry(2, 5, 8);
        coneGeometry.rotateX(Math.PI);
        const coneMaterial = new THREE.MeshBasicMaterial({ color: color });
        const cone = new THREE.Mesh(coneGeometry, coneMaterial);
        cone.position.set(0, -2.5, 0);
        spotLight.add(cone);
        
        // Add to scene and track
        this.renderer.scene.add(spotLight);
        this.renderer.scene.add(spotLight.target);
        this.spotLights.push(spotLight);
        
        return spotLight;
    }
    
    /**
     * Add lights to buildings for night mode
     */
    addBuildingLights() {
        // Clear existing building lights
        this.removePointLights();
        
        // Add lights near each building
        this.renderer.buildings.forEach(building => {
            const position = building.mesh.position.clone();
            position.y += building.height * 0.7;
            
            // Add light with warm color
            this.addPointLight(
                position,
                0xffcc77, // Warm yellow color
                0.7,      // Medium intensity
                building.height * 2 // Distance based on building height
            );
        });
    }
    
    /**
     * Remove all point lights from the scene
     */
    removePointLights() {
        this.pointLights.forEach(light => {
            this.renderer.scene.remove(light);
        });
        
        this.pointLights = [];
    }
    
    /**
     * Remove all spot lights from the scene
     */
    removeSpotLights() {
        this.spotLights.forEach(light => {
            this.renderer.scene.remove(light);
            this.renderer.scene.remove(light.target);
        });
        
        this.spotLights = [];
    }
    
    /**
     * Remove all lights from the scene
     */
    removeLights() {
        if (this.ambientLight) {
            this.renderer.scene.remove(this.ambientLight);
            this.ambientLight = null;
        }
        
        if (this.directionalLight) {
            this.renderer.scene.remove(this.directionalLight);
            this.directionalLight = null;
        }
        
        this.removePointLights();
        this.removeSpotLights();
    }
    
    /**
     * Update UI controls to reflect current settings
     */
    updateUIControls() {
        // Update lighting mode radio buttons
        const modeRadio = document.querySelector(`input[name="lightingMode"][value="${this.currentMode}"]`);
        if (modeRadio) {
            modeRadio.checked = true;
        }
        
        // Update shadow toggle
        const shadowToggle = document.getElementById('shadows-toggle');
        if (shadowToggle) {
            shadowToggle.checked = this.settings.shadows;
        }
        
        // Update intensity slider
        const intensitySlider = document.getElementById('light-intensity');
        if (intensitySlider) {
            intensitySlider.value = this.settings.intensity;
        }
        
        // Update diffuse slider
        const diffuseSlider = document.getElementById('light-diffuse');
        if (diffuseSlider) {
            diffuseSlider.value = this.settings.diffuse;
        }
        
        // Update color picker
        const colorPicker = document.getElementById('light-color');
        if (colorPicker) {
            const hexColor = '#' + this.directionalLight.color.getHexString();
            colorPicker.value = hexColor;
        }
    }
}

// Export the LightingManager class
if (typeof module !== 'undefined') {
    module.exports = { LightingManager };
}

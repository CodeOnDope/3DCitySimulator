/**
 * Renderer Module for 3D City Simulator
 * Handles Three.js scene setup, rendering, and core 3D functionality
 */

class Renderer {
    constructor() {
        // Core Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // Scene elements
        this.grid = null;
        this.buildings = [];
        this.vanishingPoints = [];
        this.referenceLines = [];
        
        // Lighting
        this.ambientLight = null;
        this.directionalLight = null;
        this.pointLights = [];
        
        // State
        this.isInitialized = false;
        this.currentPerspectiveType = CONFIG.perspective.types.ONE_POINT;
        this.currentLightingMode = CONFIG.lighting.modes.DAY;
        this.showGrid = true;
        this.showVanishingPoints = true;
        this.showReferenceLines = true;
        this.showWindows = true;
        this.selectedBuilding = null;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.isSelectionMode = false;
        this.perspectiveManager = null;
        
        // Bind methods
        this.animate = this.animate.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleMouseClick = this.handleMouseClick.bind(this);
    }
    
    /**
     * Initialize the Three.js scene and renderer
     */
    init(perspectiveManager) {
        if (this.isInitialized) return;
        
        this.perspectiveManager = perspectiveManager;
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf0f0f0);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.camera.fov,
            window.innerWidth / window.innerHeight,
            CONFIG.camera.near,
            CONFIG.camera.far
        );
        this.camera.position.set(
            CONFIG.camera.initialPosition.x,
            CONFIG.camera.initialPosition.y,
            CONFIG.camera.initialPosition.z
        );
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: CONFIG.renderer.antialias,
            alpha: true
        });
        this.renderer.setPixelRatio(CONFIG.renderer.pixelRatio);
        this.renderer.setSize(window.innerWidth - 350, window.innerHeight); // Adjust for control panel width
        this.renderer.shadowMap.enabled = CONFIG.renderer.shadowMapEnabled;
        
        // Add renderer to DOM
        const container = document.getElementById('canvas-container');
        container.appendChild(this.renderer.domElement);
        
        // Create orbit controls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 50;
        this.controls.maxDistance = 1000;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        // Add event listeners
        window.addEventListener('resize', this.handleResize);
        this.renderer.domElement.addEventListener('mousemove', this.handleMouseMove);
        this.renderer.domElement.addEventListener('click', this.handleMouseClick);
        
        // Add control change listener to update vanishing points when camera moves
        this.controls.addEventListener('change', () => {
            if (this.perspectiveManager) {
                this.perspectiveManager.syncVanishingPointsWithCamera(
                    this.camera.position,
                    this.controls.target
                );
            }
        });
        
        // Setup initial scene
        this.setupLighting(this.currentLightingMode);
        this.setupGrid();
        
        // Mark as initialized
        this.isInitialized = true;
        
        // Start animation loop
        this.animate();
        
        // Hide loading overlay
        document.getElementById('loading-overlay').classList.add('hidden');
    }
    
    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(this.animate);
        
        // Update TWEEN animations
        if (window.TWEEN) {
            TWEEN.update();
        }
        
        // Update controls
        this.controls.update();
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        const width = window.innerWidth - 350; // Adjust for control panel width
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    /**
     * Handle mouse movement for building selection
     */
    handleMouseMove(event) {
        if (!this.isSelectionMode) return;
        
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all building meshes
        const buildingMeshes = this.buildings.map(building => building.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(buildingMeshes);
        
        // Reset all building materials
        this.buildings.forEach(building => {
            if (building.mesh !== this.selectedBuilding) {
                building.mesh.material.emissive.setHex(0x000000);
            }
        });
        
        // Highlight hovered building
        if (intersects.length > 0) {
            const hoveredMesh = intersects[0].object;
            if (hoveredMesh !== this.selectedBuilding) {
                hoveredMesh.material.emissive.setHex(0x333333);
            }
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    }
    
    /**
     * Handle mouse click for building selection
     */
    handleMouseClick(event) {
        if (!this.isSelectionMode) return;
        
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Update the raycaster
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        // Get all building meshes
        const buildingMeshes = this.buildings.map(building => building.mesh);
        
        // Check for intersections
        const intersects = this.raycaster.intersectObjects(buildingMeshes);
        
        // Reset all building materials
        this.buildings.forEach(building => {
            building.mesh.material.emissive.setHex(0x000000);
        });
        
        // Select clicked building
        if (intersects.length > 0) {
            const clickedMesh = intersects[0].object;
            this.selectedBuilding = clickedMesh;
            clickedMesh.material.emissive.setHex(0x555555);
            
            // Find the building object
            const selectedBuildingObj = this.buildings.find(building => building.mesh === clickedMesh);
            
            // Update UI
            if (selectedBuildingObj) {
                // Update selection info
                const selectionInfo = document.getElementById('selection-info');
                selectionInfo.classList.remove('hidden');
                document.getElementById('selected-building-name').textContent = selectedBuildingObj.name;
                
                // Update building editor controls
                document.getElementById('building-width').value = selectedBuildingObj.width;
                document.getElementById('building-width-value').textContent = selectedBuildingObj.width;
                document.getElementById('building-height').value = selectedBuildingObj.height;
                document.getElementById('building-height-value').textContent = selectedBuildingObj.height;
                document.getElementById('building-depth').value = selectedBuildingObj.depth;
                document.getElementById('building-depth-value').textContent = selectedBuildingObj.depth;
                document.getElementById('building-color').value = '#' + selectedBuildingObj.color.getHexString();
                
                // Update building selector
                document.getElementById('building-select').value = selectedBuildingObj.id;
                
                // Dispatch custom event for UI updates
                const event = new CustomEvent('buildingSelected', { detail: selectedBuildingObj });
                document.dispatchEvent(event);
            }
        } else {
            this.selectedBuilding = null;
            
            // Update UI
            const selectionInfo = document.getElementById('selection-info');
            selectionInfo.classList.add('hidden');
            document.getElementById('selected-building-name').textContent = 'None';
            
            // Dispatch custom event for UI updates
            const event = new CustomEvent('buildingDeselected');
            document.dispatchEvent(event);
        }
    }
    
    /**
     * Setup the ground grid
     */
    setupGrid() {
        // Remove existing grid if any
        if (this.grid) {
            this.scene.remove(this.grid);
        }
        
        // Create new grid
        const size = CONFIG.grid.defaultSize;
        const divisions = CONFIG.grid.divisions;
        this.grid = new THREE.GridHelper(size, divisions, CONFIG.grid.colors.main, CONFIG.grid.colors.secondary);
        this.grid.position.y = 0;
        this.grid.visible = this.showGrid;
        this.scene.add(this.grid);
    }
    
    /**
     * Setup scene lighting based on mode
     */
    setupLighting(mode) {
        // Remove existing lights
        if (this.ambientLight) this.scene.remove(this.ambientLight);
        if (this.directionalLight) this.scene.remove(this.directionalLight);
        this.pointLights.forEach(light => this.scene.remove(light));
        this.pointLights = [];
        
        // Get lighting config for the selected mode
        const lightConfig = CONFIG.lighting[mode];
        
        // Add ambient light
        this.ambientLight = new THREE.AmbientLight(lightConfig.ambientColor, lightConfig.ambientIntensity);
        this.scene.add(this.ambientLight);
        
        // Add directional light
        this.directionalLight = new THREE.DirectionalLight(lightConfig.directionalColor, lightConfig.directionalIntensity);
        this.directionalLight.position.set(
            lightConfig.position.x,
            lightConfig.position.y,
            lightConfig.position.z
        );
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 500;
        this.directionalLight.shadow.camera.left = -200;
        this.directionalLight.shadow.camera.right = 200;
        this.directionalLight.shadow.camera.top = 200;
        this.directionalLight.shadow.camera.bottom = -200;
        this.scene.add(this.directionalLight);
        
        // Add point lights for night mode
        if (mode === CONFIG.lighting.modes.NIGHT && lightConfig.pointLights) {
            lightConfig.pointLights.forEach(pointLightConfig => {
                const pointLight = new THREE.PointLight(
                    pointLightConfig.color,
                    pointLightConfig.intensity,
                    pointLightConfig.distance
                );
                pointLight.position.set(
                    pointLightConfig.position.x,
                    pointLightConfig.position.y,
                    pointLightConfig.position.z
                );
                pointLight.castShadow = true;
                this.scene.add(pointLight);
                this.pointLights.push(pointLight);
            });
        }
        
        // Update current lighting mode
        this.currentLightingMode = mode;
    }
    
    /**
     * Set the perspective type and update vanishing points
     */
    setPerspectiveType(type) {
        this.currentPerspectiveType = type;
        this.updateVanishingPoints();
        this.updateReferenceLines();
        
        // Update perspective indicator
        document.getElementById('perspective-indicator').textContent = type;
    }
    
    /**
     * Update vanishing points based on current perspective type
     */
    updateVanishingPoints() {
        // Remove existing vanishing points
        this.vanishingPoints.forEach(vp => this.scene.remove(vp));
        this.vanishingPoints = [];
        
        // Get vanishing points for the current perspective type
        let vpPositions = [];
        switch (this.currentPerspectiveType) {
            case CONFIG.perspective.types.ONE_POINT:
                vpPositions = CONFIG.perspective.vanishingPoints.onePoint;
                break;
            case CONFIG.perspective.types.TWO_POINT:
                vpPositions = CONFIG.perspective.vanishingPoints.twoPoint;
                break;
            case CONFIG.perspective.types.THREE_POINT:
                vpPositions = CONFIG.perspective.vanishingPoints.threePoint;
                break;
        }
        
        // Create vanishing point markers
        vpPositions.forEach((position, index) => {
            const geometry = new THREE.SphereGeometry(CONFIG.visual.vanishingPointSize, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const vpMesh = new THREE.Mesh(geometry, material);
            vpMesh.position.set(position.x, position.y, position.z);
            vpMesh.visible = this.showVanishingPoints;
            this.scene.add(vpMesh);
            this.vanishingPoints.push(vpMesh);
            
            // Add label
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 64;
            const context = canvas.getContext('2d');
            context.fillStyle = 'rgba(255, 255, 255, 0.8)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.font = '24px Arial';
            context.fillStyle = 'black';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(`VP${index + 1}`, canvas.width / 2, canvas.height / 2);
            
            const texture = new THREE.CanvasTexture(canvas);
            const labelMaterial = new THREE.SpriteMaterial({ map: texture });
            const label = new THREE.Sprite(labelMaterial);
            label.position.set(position.x, position.y + 20, position.z);
            label.scale.set(50, 25, 1);
            label.visible = this.showVanishingPoints;
            this.scene.add(label);
            this.vanishingPoints.push(label);
        });
    }
    
    /**
     * Update reference lines connecting buildings to vanishing points
     */
    updateReferenceLines() {
        // Remove existing reference lines
        this.referenceLines.forEach(line => this.scene.remove(line));
        this.referenceLines = [];
        
        // Skip if no buildings or vanishing points
        if (this.buildings.length === 0 || this.vanishingPoints.length === 0) return;
        
        // Get vanishing point positions (only the actual points, not labels)
        const vpPositions = this.vanishingPoints
            .filter(vp => vp instanceof THREE.Mesh)
            .map(vp => vp.position);
        
        // Create reference lines for each building
        this.buildings.forEach(building => {
            // Get the 8 corners of the building
            const corners = building.getCorners();
            
            // Create lines from each corner to each vanishing point
            corners.forEach(corner => {
                vpPositions.forEach(vpPosition => {
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
                        new THREE.Vector3(corner.x, corner.y, corner.z),
                        new THREE.Vector3(vpPosition.x, vpPosition.y, vpPosition.z)
                    ]);
                    
                    const lineMaterial = new THREE.LineBasicMaterial({
                        color: CONFIG.visual.lineColor,
                        transparent: true,
                        opacity: 0.5
                    });
                    
                    const line = new THREE.Line(lineGeometry, lineMaterial);
                    line.visible = this.showReferenceLines;
                    this.scene.add(line);
                    this.referenceLines.push(line);
                });
            });
        });
    }
    
    /**
     * Toggle vanishing points visibility
     */
    toggleVanishingPoints(visible) {
        this.showVanishingPoints = visible;
        this.vanishingPoints.forEach(vp => {
            vp.visible = visible;
        });
    }
    
    /**
     * Toggle grid visibility
     */
    toggleGrid(visible) {
        this.showGrid = visible;
        if (this.grid) {
            this.grid.visible = visible;
        }
    }
    
    /**
     * Toggle reference lines visibility
     */
    toggleReferenceLines(visible) {
        this.showReferenceLines = visible;
        this.referenceLines.forEach(line => {
            line.visible = visible;
        });
    }
    
    /**
     * Toggle windows visibility
     */
    toggleWindows(visible) {
        this.showWindows = visible;
        this.buildings.forEach(building => {
            if (building.windows) {
                building.windows.forEach(window => {
                    window.visible = visible;
                });
            }
        });
    }
    
    /**
     * Toggle selection mode
     */
    toggleSelectionMode(enabled) {
        this.isSelectionMode = enabled;
        document.body.style.cursor = 'default';
    }
    
    /**
     * Set camera view to a predefined position
     * @param {string} viewName - Name of the predefined view
     */
    setCameraView(viewName) {
        // Get view configuration
        const viewConfig = CONFIG.perspective.cameraViews[viewName];
        if (!viewConfig) return;
        
        // Create a TWEEN to animate the camera position
        new TWEEN.Tween(this.camera.position)
            .to({
                x: viewConfig.position.x,
                y: viewConfig.position.y,
                z: viewConfig.position.z
            }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();
        
        // Create a TWEEN to animate the controls target
        new TWEEN.Tween(this.controls.target)
            .to({
                x: viewConfig.target.x,
                y: viewConfig.target.y,
                z: viewConfig.target.z
            }, 1000)
            .easing(TWEEN.Easing.Cubic.InOut)
            .onComplete(() => {
                // Sync vanishing points with new camera position
                if (this.perspectiveManager) {
                    this.perspectiveManager.syncVanishingPointsWithCamera(
                        this.camera.position,
                        this.controls.target
                    );
                }
            })
            .start();
            
        // Provide visual feedback for the selected view button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Map viewName to button ID
        const buttonMap = {
            'frontView': 'view1',
            'cornerView': 'view2',
            'topView': 'view3',
            'streetLevel': 'view4',
            'birdsEye': 'view5',
            'dramaticView': 'view6'
        };
        
        const buttonId = buttonMap[viewName];
        if (buttonId) {
            document.getElementById(buttonId).classList.add('active');
        }
    }
    
    /**
     * Update reference line color
     */
    updateReferenceLineColor(color) {
        CONFIG.visual.lineColor = color;
        this.referenceLines.forEach(line => {
            line.material.color.set(color);
        });
    }
    
    /**
     * Clear all buildings
     */
    clearBuildings() {
        this.buildings.forEach(building => {
            this.scene.remove(building.mesh);
            if (building.windows) {
                building.windows.forEach(window => this.scene.remove(window));
            }
        });
        this.buildings = [];
        this.selectedBuilding = null;
        
        // Update UI
        const selectionInfo = document.getElementById('selection-info');
        selectionInfo.classList.add('hidden');
        document.getElementById('selected-building-name').textContent = 'None';
        
        // Clear building selector
        const buildingSelect = document.getElementById('building-select');
        while (buildingSelect.options.length > 1) {
            buildingSelect.remove(1);
        }
    }
    
    /**
     * Add a building to the scene
     */
    addBuilding(building) {
        this.scene.add(building.mesh);
        
        // Add windows if enabled
        if (this.showWindows && building.windows) {
            building.windows.forEach(window => this.scene.add(window));
        }
        
        this.buildings.push(building);
        
        // Add to building selector
        const buildingSelect = document.getElementById('building-select');
        const option = document.createElement('option');
        option.value = building.id;
        option.textContent = building.name;
        buildingSelect.appendChild(option);
    }
    
    /**
     * Update a building's properties
     */
    updateBuilding(buildingId, properties) {
        const building = this.buildings.find(b => b.id === buildingId);
        if (!building) return;
        
        // Remove old mesh and windows
        this.scene.remove(building.mesh);
        if (building.windows) {
            building.windows.forEach(window => this.scene.remove(window));
        }
        
        // Update properties
        Object.assign(building, properties);
        
        // Regenerate mesh
        building.generateMesh();
        
        // Add new mesh and windows
        this.scene.add(building.mesh);
        if (this.showWindows && building.windows) {
            building.windows.forEach(window => this.scene.add(window));
        }
        
        // Update reference lines
        this.updateReferenceLines();
        
        // Update selection if this was the selected building
        if (this.selectedBuilding === building.mesh) {
            this.selectedBuilding = building.mesh;
            building.mesh.material.emissive.setHex(0x555555);
        }
    }
    
    /**
     * Generate a new city with the specified parameters
     */
    generateCity(count, shape, gridSize) {
        // Clear existing buildings
        this.clearBuildings();
        
        // Update grid size if needed
        if (gridSize !== CONFIG.grid.defaultSize) {
            CONFIG.grid.defaultSize = gridSize;
            this.setupGrid();
        }
        
        // Generate new buildings
        const buildingFactory = new BuildingFactory();
        
        for (let i = 0; i < count; i++) {
            // Determine building shape
            let buildingShape = shape;
            if (shape === CONFIG.buildings.shapes.MIXED) {
                const shapes = [
                    CONFIG.buildings.shapes.CUBE,
                    CONFIG.buildings.shapes.CYLINDER,
                    CONFIG.buildings.shapes.PYRAMID
                ];
                buildingShape = shapes[Math.floor(Math.random() * shapes.length)];
            }
            
            // Generate random position within grid
            const halfGrid = gridSize / 2;
            const x = Math.random() * gridSize - halfGrid;
            const z = Math.random() * gridSize - halfGrid;
            
            // Generate random dimensions
            const width = Math.random() * (CONFIG.buildings.maxWidth - CONFIG.buildings.minWidth) + CONFIG.buildings.minWidth;
            const height = Math.random() * (CONFIG.buildings.maxHeight - CONFIG.buildings.minHeight) + CONFIG.buildings.minHeight;
            const depth = Math.random() * (CONFIG.buildings.maxDepth - CONFIG.buildings.minDepth) + CONFIG.buildings.minDepth;
            
            // Generate random color
            const colorIndex = Math.floor(Math.random() * CONFIG.buildings.colors.length);
            const color = new THREE.Color(CONFIG.buildings.colors[colorIndex]);
            
            // Create building
            const building = buildingFactory.createBuilding(
                buildingShape,
                width,
                height,
                depth,
                color,
                x,
                0, // y position is always 0 (ground level)
                z
            );
            
            this.addBuilding(building);
        }
        
        // Update reference lines
        this.updateReferenceLines();
    }
    
    /**
     * Randomize all settings
     */
    randomizeSettings() {
        // Randomize perspective type
        const perspectiveTypes = Object.values(CONFIG.perspective.types);
        const randomPerspectiveType = perspectiveTypes[Math.floor(Math.random() * perspectiveTypes.length)];
        this.setPerspectiveType(randomPerspectiveType);
        
        // Update UI radio buttons
        document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
            radio.checked = radio.value === randomPerspectiveType;
        });
        
        // Randomize lighting mode
        const lightingModes = Object.values(CONFIG.lighting.modes);
        const randomLightingMode = lightingModes[Math.floor(Math.random() * lightingModes.length)];
        this.setupLighting(randomLightingMode);
        
        // Update UI radio buttons
        document.querySelectorAll('input[name="lightingMode"]').forEach(radio => {
            radio.checked = radio.value === randomLightingMode;
        });
        
        // Randomize building count
        const randomCount = Math.floor(Math.random() * (CONFIG.buildings.maxCount - CONFIG.buildings.minCount)) + CONFIG.buildings.minCount;
        
        // Randomize building shape
        const buildingShapes = Object.values(CONFIG.buildings.shapes);
        const randomShape = buildingShapes[Math.floor(Math.random() * buildingShapes.length)];
        
        // Update UI radio buttons
        document.querySelectorAll('input[name="buildingShape"]').forEach(radio => {
            radio.checked = radio.value === randomShape;
        });
        
        // Randomize grid size
        const randomGridSize = Math.floor(Math.random() * (CONFIG.grid.maxSize - CONFIG.grid.minSize)) + CONFIG.grid.minSize;
        
        // Update UI sliders
        document.getElementById('buildingCount').value = randomCount;
        document.getElementById('buildingCountValue').textContent = randomCount;
        document.getElementById('gridSize').value = randomGridSize;
        document.getElementById('gridSizeValue').textContent = randomGridSize;
        
        // Generate new city with random settings
        this.generateCity(randomCount, randomShape, randomGridSize);
    }
}

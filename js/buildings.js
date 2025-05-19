/**
 * Building Module for 3D City Simulator
 * Handles creation and management of building objects
 */

class Building {
    constructor(id, shape, width, height, depth, color, x, y, z) {
        this.id = id;
        this.name = `Building ${id}`;
        this.shape = shape;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.color = color;
        this.position = { x, y, z };
        this.mesh = null;
        this.windows = [];
        
        this.generateMesh();
    }
    
    /**
     * Generate the 3D mesh for this building
     */
    generateMesh() {
        // Clear existing windows
        this.windows = [];
        
        // Create geometry based on shape
        let geometry;
        
        switch (this.shape) {
            case CONFIG.buildings.shapes.CUBE:
                geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
                break;
                
            case CONFIG.buildings.shapes.CYLINDER:
                // For cylinders, use the average of width and depth as radius
                const radius = (this.width + this.depth) / 4;
                geometry = new THREE.CylinderGeometry(radius, radius, this.height, 32);
                break;
                
            case CONFIG.buildings.shapes.PYRAMID:
                // For pyramids, use width and depth for the base
                geometry = new THREE.ConeGeometry(this.width / 2, this.height, 4);
                // Rotate to align with ground
                geometry.rotateY(Math.PI / 4);
                break;
                
            default:
                geometry = new THREE.BoxGeometry(this.width, this.height, this.depth);
        }
        
        // Create material
        const material = new THREE.MeshPhongMaterial({
            color: this.color,
            flatShading: false,
            shininess: 30
        });
        
        // Create mesh
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(this.position.x, this.position.y + this.height / 2, this.position.z);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        
        // Store reference to building in mesh
        this.mesh.userData.buildingId = this.id;
        
        // Generate windows
        this.generateWindows();
    }
    
    /**
     * Generate windows for the building
     */
    generateWindows() {
        // Skip for pyramid shape
        if (this.shape === CONFIG.buildings.shapes.PYRAMID) {
            return;
        }
        
        // Number of windows based on building dimensions
        const windowSize = 4;
        const windowSpacing = 8;
        
        // Calculate number of windows per side
        let numWindowsWidth, numWindowsHeight, numWindowsDepth;
        
        if (this.shape === CONFIG.buildings.shapes.CUBE) {
            numWindowsWidth = Math.floor(this.width / windowSpacing);
            numWindowsHeight = Math.floor(this.height / windowSpacing);
            numWindowsDepth = Math.floor(this.depth / windowSpacing);
        } else if (this.shape === CONFIG.buildings.shapes.CYLINDER) {
            // For cylinders, distribute windows around the circumference
            const radius = (this.width + this.depth) / 4;
            const circumference = 2 * Math.PI * radius;
            numWindowsWidth = Math.floor(circumference / windowSpacing);
            numWindowsHeight = Math.floor(this.height / windowSpacing);
            numWindowsDepth = 0; // Not used for cylinders
        }
        
        // Window geometry and material
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        const windowMaterial = new THREE.MeshBasicMaterial({
            color: CONFIG.visual.windowColor,
            transparent: true,
            opacity: CONFIG.visual.windowOpacity,
            side: THREE.DoubleSide
        });
        
        // Create windows based on shape
        if (this.shape === CONFIG.buildings.shapes.CUBE) {
            // Front face windows
            for (let h = 1; h < numWindowsHeight && h < 10; h++) {
                for (let w = 1; w < numWindowsWidth && w < 10; w++) {
                    if (Math.random() > 0.3) { // 70% chance of having a window
                        const window = new THREE.Mesh(windowGeometry, windowMaterial);
                        const x = this.position.x - this.width / 2 + w * (this.width / (numWindowsWidth + 1));
                        const y = this.position.y + h * (this.height / (numWindowsHeight + 1));
                        const z = this.position.z + this.depth / 2 + 0.1;
                        window.position.set(x, y, z);
                        window.rotation.y = Math.PI;
                        this.windows.push(window);
                    }
                }
            }
            
            // Back face windows
            for (let h = 1; h < numWindowsHeight && h < 10; h++) {
                for (let w = 1; w < numWindowsWidth && w < 10; w++) {
                    if (Math.random() > 0.3) {
                        const window = new THREE.Mesh(windowGeometry, windowMaterial);
                        const x = this.position.x - this.width / 2 + w * (this.width / (numWindowsWidth + 1));
                        const y = this.position.y + h * (this.height / (numWindowsHeight + 1));
                        const z = this.position.z - this.depth / 2 - 0.1;
                        window.position.set(x, y, z);
                        this.windows.push(window);
                    }
                }
            }
            
            // Left face windows
            for (let h = 1; h < numWindowsHeight && h < 10; h++) {
                for (let d = 1; d < numWindowsDepth && d < 10; d++) {
                    if (Math.random() > 0.3) {
                        const window = new THREE.Mesh(windowGeometry, windowMaterial);
                        const x = this.position.x - this.width / 2 - 0.1;
                        const y = this.position.y + h * (this.height / (numWindowsHeight + 1));
                        const z = this.position.z - this.depth / 2 + d * (this.depth / (numWindowsDepth + 1));
                        window.position.set(x, y, z);
                        window.rotation.y = Math.PI / 2;
                        this.windows.push(window);
                    }
                }
            }
            
            // Right face windows
            for (let h = 1; h < numWindowsHeight && h < 10; h++) {
                for (let d = 1; d < numWindowsDepth && d < 10; d++) {
                    if (Math.random() > 0.3) {
                        const window = new THREE.Mesh(windowGeometry, windowMaterial);
                        const x = this.position.x + this.width / 2 + 0.1;
                        const y = this.position.y + h * (this.height / (numWindowsHeight + 1));
                        const z = this.position.z - this.depth / 2 + d * (this.depth / (numWindowsDepth + 1));
                        window.position.set(x, y, z);
                        window.rotation.y = -Math.PI / 2;
                        this.windows.push(window);
                    }
                }
            }
        } else if (this.shape === CONFIG.buildings.shapes.CYLINDER) {
            // For cylinders, distribute windows around the circumference
            for (let h = 1; h < numWindowsHeight && h < 10; h++) {
                for (let w = 0; w < numWindowsWidth && w < 16; w++) {
                    if (Math.random() > 0.3) {
                        const window = new THREE.Mesh(windowGeometry, windowMaterial);
                        const radius = (this.width + this.depth) / 4;
                        const angle = (w / numWindowsWidth) * Math.PI * 2;
                        const x = this.position.x + Math.sin(angle) * (radius + 0.1);
                        const y = this.position.y + h * (this.height / (numWindowsHeight + 1));
                        const z = this.position.z + Math.cos(angle) * (radius + 0.1);
                        window.position.set(x, y, z);
                        window.rotation.y = angle + Math.PI / 2;
                        this.windows.push(window);
                    }
                }
            }
        }
    }
    
    /**
     * Get the 8 corners of the building (for reference lines)
     */
    getCorners() {
        const corners = [];
        const halfWidth = this.width / 2;
        const halfDepth = this.depth / 2;
        const y0 = this.position.y;
        const y1 = this.position.y + this.height;
        
        if (this.shape === CONFIG.buildings.shapes.CUBE) {
            // Bottom corners
            corners.push({ x: this.position.x - halfWidth, y: y0, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y0, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y0, z: this.position.z + halfDepth });
            corners.push({ x: this.position.x - halfWidth, y: y0, z: this.position.z + halfDepth });
            
            // Top corners
            corners.push({ x: this.position.x - halfWidth, y: y1, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y1, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y1, z: this.position.z + halfDepth });
            corners.push({ x: this.position.x - halfWidth, y: y1, z: this.position.z + halfDepth });
        } else if (this.shape === CONFIG.buildings.shapes.CYLINDER) {
            // For cylinders, use 8 points around the circumference at top and bottom
            const radius = (this.width + this.depth) / 4;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const x = this.position.x + Math.sin(angle) * radius;
                const z = this.position.z + Math.cos(angle) * radius;
                
                // Bottom point
                corners.push({ x, y: y0, z });
                
                // Top point
                corners.push({ x, y: y1, z });
            }
        } else if (this.shape === CONFIG.buildings.shapes.PYRAMID) {
            // For pyramids, 4 points at the base and 1 at the top
            corners.push({ x: this.position.x - halfWidth, y: y0, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y0, z: this.position.z - halfDepth });
            corners.push({ x: this.position.x + halfWidth, y: y0, z: this.position.z + halfDepth });
            corners.push({ x: this.position.x - halfWidth, y: y0, z: this.position.z + halfDepth });
            
            // Top point (apex)
            corners.push({ x: this.position.x, y: y1, z: this.position.z });
            
            // Add the top point 3 more times to make 8 corners total (for consistency)
            corners.push({ x: this.position.x, y: y1, z: this.position.z });
            corners.push({ x: this.position.x, y: y1, z: this.position.z });
            corners.push({ x: this.position.x, y: y1, z: this.position.z });
        }
        
        return corners;
    }
    
    /**
     * Toggle windows visibility
     */
    toggleWindows(visible) {
        this.windows.forEach(window => {
            window.visible = visible;
        });
    }
}

/**
 * Factory class for creating buildings
 */
class BuildingFactory {
    constructor() {
        this.nextId = 1;
    }
    
    /**
     * Create a new building
     */
    createBuilding(shape, width, height, depth, color, x, y, z) {
        const building = new Building(
            this.nextId++,
            shape,
            width,
            height,
            depth,
            color,
            x,
            y,
            z
        );
        
        return building;
    }
}

/**
 * Shapes Module for 3D City Simulator
 * Handles creation of various 3D geometric shapes for buildings
 */

class ShapesManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentShapeType = 'cube'; // Default shape type
        
        // Available shape types
        this.shapeTypes = {
            'cube': { name: 'Cube', description: 'Standard rectangular building' },
            'cylinder': { name: 'Cylinder', description: 'Cylindrical building' },
            'cone': { name: 'Cone', description: 'Conical building' },
            'pyramid': { name: 'Pyramid', description: 'Pyramid building' },
            'sphere': { name: 'Sphere', description: 'Spherical building' },
            'pentagon': { name: 'Pentagon', description: 'Pentagon-based building' },
            'hexagon': { name: 'Hexagon', description: 'Hexagon-based building' },
            'octagon': { name: 'Octagon', description: 'Octagon-based building' }
        };
    }
    
    /**
     * Initialize shapes manager
     */
    init() {
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for shape controls
     */
    setupEventListeners() {
        // Shape type selection
        document.querySelectorAll('input[name="buildingShape"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setShapeType(e.target.value);
                }
            });
        });
    }
    
    /**
     * Set the current shape type
     * @param {string} shapeType - Shape type to set
     */
    setShapeType(shapeType) {
        if (!this.shapeTypes[shapeType]) return;
        
        this.currentShapeType = shapeType;
        
        // Regenerate buildings if needed
        if (this.renderer.buildings && this.renderer.buildings.length > 0) {
            this.renderer.regenerateBuildings();
        }
    }
    
    /**
     * Create a building geometry based on shape type and dimensions
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {THREE.BufferGeometry} Building geometry
     */
    createBuildingGeometry(width, height, depth) {
        switch (this.currentShapeType) {
            case 'cube':
                return this.createCubeGeometry(width, height, depth);
                
            case 'cylinder':
                return this.createCylinderGeometry(width, height, depth);
                
            case 'cone':
                return this.createConeGeometry(width, height, depth);
                
            case 'pyramid':
                return this.createPyramidGeometry(width, height, depth);
                
            case 'sphere':
                return this.createSphereGeometry(width, height, depth);
                
            case 'pentagon':
                return this.createPolygonGeometry(5, width, height, depth);
                
            case 'hexagon':
                return this.createPolygonGeometry(6, width, height, depth);
                
            case 'octagon':
                return this.createPolygonGeometry(8, width, height, depth);
                
            default:
                // Default to cube if shape type is not recognized
                return this.createCubeGeometry(width, height, depth);
        }
    }
    
    /**
     * Create a cube geometry
     * @param {number} width - Width of the cube
     * @param {number} height - Height of the cube
     * @param {number} depth - Depth of the cube
     * @returns {THREE.BoxGeometry} Cube geometry
     */
    createCubeGeometry(width, height, depth) {
        return new THREE.BoxGeometry(width, height, depth);
    }
    
    /**
     * Create a cylinder geometry
     * @param {number} width - Width (diameter) of the cylinder
     * @param {number} height - Height of the cylinder
     * @param {number} depth - Depth (used for aspect ratio)
     * @returns {THREE.CylinderGeometry} Cylinder geometry
     */
    createCylinderGeometry(width, height, depth) {
        const radius = Math.min(width, depth) / 2;
        const segments = 32; // Higher number for smoother cylinder
        return new THREE.CylinderGeometry(radius, radius, height, segments);
    }
    
    /**
     * Create a cone geometry
     * @param {number} width - Width (base diameter) of the cone
     * @param {number} height - Height of the cone
     * @param {number} depth - Depth (used for base aspect ratio)
     * @returns {THREE.ConeGeometry} Cone geometry
     */
    createConeGeometry(width, height, depth) {
        const radius = Math.min(width, depth) / 2;
        const segments = 32; // Higher number for smoother cone
        return new THREE.ConeGeometry(radius, height, segments);
    }
    
    /**
     * Create a pyramid geometry
     * @param {number} width - Width of the pyramid base
     * @param {number} height - Height of the pyramid
     * @param {number} depth - Depth of the pyramid base
     * @returns {THREE.BufferGeometry} Pyramid geometry
     */
    createPyramidGeometry(width, height, depth) {
        // Create a pyramid using BufferGeometry
        const geometry = new THREE.BufferGeometry();
        
        // Define vertices (5 points: 4 base corners + 1 apex)
        const halfWidth = width / 2;
        const halfDepth = depth / 2;
        
        const vertices = new Float32Array([
            // Base vertices
            -halfWidth, 0, -halfDepth,  // bottom left
            halfWidth, 0, -halfDepth,   // bottom right
            halfWidth, 0, halfDepth,    // top right
            -halfWidth, 0, halfDepth,   // top left
            
            // Apex vertex
            0, height, 0                // top center
        ]);
        
        // Define faces (triangles)
        const indices = [
            // Base (2 triangles)
            0, 1, 2,
            0, 2, 3,
            
            // Sides (4 triangles)
            0, 4, 1,  // front
            1, 4, 2,  // right
            2, 4, 3,  // back
            3, 4, 0   // left
        ];
        
        // Set attributes
        geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        geometry.setIndex(indices);
        
        // Compute vertex normals
        geometry.computeVertexNormals();
        
        return geometry;
    }
    
    /**
     * Create a sphere geometry
     * @param {number} width - Width (diameter) of the sphere
     * @param {number} height - Height (used for aspect ratio)
     * @param {number} depth - Depth (used for aspect ratio)
     * @returns {THREE.SphereGeometry} Sphere geometry
     */
    createSphereGeometry(width, height, depth) {
        const radius = Math.min(width, height, depth) / 2;
        const widthSegments = 32; // Higher number for smoother sphere
        const heightSegments = 32; // Higher number for smoother sphere
        return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    }
    
    /**
     * Create a polygon-based prism geometry
     * @param {number} sides - Number of sides for the polygon base
     * @param {number} width - Width of the prism
     * @param {number} height - Height of the prism
     * @param {number} depth - Depth of the prism
     * @returns {THREE.CylinderGeometry} Polygon-based prism geometry
     */
    createPolygonGeometry(sides, width, height, depth) {
        const radius = Math.min(width, depth) / 2;
        return new THREE.CylinderGeometry(radius, radius, height, sides);
    }
    
    /**
     * Create window geometry for a building
     * @param {string} shapeType - Shape type of the building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createWindowGeometries(shapeType, width, height, depth) {
        const windows = [];
        
        switch (shapeType) {
            case 'cube':
                return this.createCubeWindows(width, height, depth);
                
            case 'cylinder':
                return this.createCylinderWindows(width, height, depth);
                
            case 'cone':
                return this.createConeWindows(width, height, depth);
                
            case 'pyramid':
                return this.createPyramidWindows(width, height, depth);
                
            case 'sphere':
                return this.createSphereWindows(width, height, depth);
                
            case 'pentagon':
                return this.createPolygonWindows(5, width, height, depth);
                
            case 'hexagon':
                return this.createPolygonWindows(6, width, height, depth);
                
            case 'octagon':
                return this.createPolygonWindows(8, width, height, depth);
                
            default:
                return [];
        }
    }
    
    /**
     * Create windows for a cube building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createCubeWindows(width, height, depth) {
        const windows = [];
        const windowSize = Math.min(width, height, depth) * 0.1;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows per side
        const widthCount = Math.max(1, Math.floor(width / (windowSize * 2)));
        const heightCount = Math.max(1, Math.floor(height / (windowSize * 2)));
        const depthCount = Math.max(1, Math.floor(depth / (windowSize * 2)));
        
        // Calculate spacing
        const widthSpacing = width / (widthCount + 1);
        const heightSpacing = height / (heightCount + 1);
        const depthSpacing = depth / (depthCount + 1);
        
        // Create windows for front face
        for (let y = 1; y <= heightCount; y++) {
            for (let x = 1; x <= widthCount; x++) {
                const posX = (x * widthSpacing) - (width / 2);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = depth / 2 + 0.1;
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, 0, 0)
                });
            }
        }
        
        // Create windows for back face
        for (let y = 1; y <= heightCount; y++) {
            for (let x = 1; x <= widthCount; x++) {
                const posX = -((x * widthSpacing) - (width / 2));
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = -(depth / 2 + 0.1);
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, Math.PI, 0)
                });
            }
        }
        
        // Create windows for left face
        for (let y = 1; y <= heightCount; y++) {
            for (let z = 1; z <= depthCount; z++) {
                const posX = -(width / 2 + 0.1);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = (z * depthSpacing) - (depth / 2);
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, -Math.PI / 2, 0)
                });
            }
        }
        
        // Create windows for right face
        for (let y = 1; y <= heightCount; y++) {
            for (let z = 1; z <= depthCount; z++) {
                const posX = width / 2 + 0.1;
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = -((z * depthSpacing) - (depth / 2));
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, Math.PI / 2, 0)
                });
            }
        }
        
        return windows;
    }
    
    /**
     * Create windows for a cylinder building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createCylinderWindows(width, height, depth) {
        const windows = [];
        const radius = Math.min(width, depth) / 2;
        const windowSize = radius * 0.2;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows around circumference and height
        const circumferenceCount = Math.max(8, Math.floor(2 * Math.PI * radius / (windowSize * 1.5)));
        const heightCount = Math.max(1, Math.floor(height / (windowSize * 2)));
        
        // Calculate spacing
        const angleSpacing = (2 * Math.PI) / circumferenceCount;
        const heightSpacing = height / (heightCount + 1);
        
        // Create windows around the cylinder
        for (let y = 1; y <= heightCount; y++) {
            for (let i = 0; i < circumferenceCount; i++) {
                const angle = i * angleSpacing;
                const posX = Math.sin(angle) * (radius + 0.1);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = Math.cos(angle) * (radius + 0.1);
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, angle, 0)
                });
            }
        }
        
        return windows;
    }
    
    /**
     * Create windows for a cone building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createConeWindows(width, height, depth) {
        const windows = [];
        const baseRadius = Math.min(width, depth) / 2;
        const windowSize = baseRadius * 0.15;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows around circumference and height
        const circumferenceCount = Math.max(8, Math.floor(2 * Math.PI * baseRadius / (windowSize * 1.5)));
        const heightCount = Math.max(1, Math.floor(height / (windowSize * 3)));
        
        // Calculate spacing
        const angleSpacing = (2 * Math.PI) / circumferenceCount;
        const heightSpacing = height / (heightCount + 2); // Fewer windows on cone
        
        // Create windows around the cone (fewer as we go up)
        for (let y = 1; y <= heightCount; y++) {
            // Radius decreases as we go up the cone
            const currentRadius = baseRadius * (1 - (y * heightSpacing / height));
            const currentCircumferenceCount = Math.max(4, Math.floor(circumferenceCount * (1 - (y * 0.2))));
            const currentAngleSpacing = (2 * Math.PI) / currentCircumferenceCount;
            
            for (let i = 0; i < currentCircumferenceCount; i++) {
                const angle = i * currentAngleSpacing;
                const posX = Math.sin(angle) * (currentRadius + 0.1);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = Math.cos(angle) * (currentRadius + 0.1);
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, posZ),
                    rotation: new THREE.Euler(0, angle, 0)
                });
            }
        }
        
        return windows;
    }
    
    /**
     * Create windows for a pyramid building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createPyramidWindows(width, height, depth) {
        const windows = [];
        const windowSize = Math.min(width, depth) * 0.1;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows per side
        const baseWidthCount = Math.max(1, Math.floor(width / (windowSize * 2)));
        const baseDepthCount = Math.max(1, Math.floor(depth / (windowSize * 2)));
        const heightCount = Math.max(1, Math.floor(height / (windowSize * 3)));
        
        // Calculate spacing
        const widthSpacing = width / (baseWidthCount + 1);
        const depthSpacing = depth / (baseDepthCount + 1);
        const heightSpacing = height / (heightCount + 2); // Fewer windows on pyramid
        
        // Create windows for each face (fewer as we go up)
        for (let y = 1; y <= heightCount; y++) {
            // Width and depth decrease as we go up the pyramid
            const currentWidth = width * (1 - (y * heightSpacing / height));
            const currentDepth = depth * (1 - (y * heightSpacing / height));
            const currentWidthCount = Math.max(1, Math.floor(baseWidthCount * (1 - (y * 0.3))));
            const currentDepthCount = Math.max(1, Math.floor(baseDepthCount * (1 - (y * 0.3))));
            const currentWidthSpacing = currentWidth / (currentWidthCount + 1);
            const currentDepthSpacing = currentDepth / (currentDepthCount + 1);
            
            // Front face
            for (let x = 1; x <= currentWidthCount; x++) {
                const posX = (x * currentWidthSpacing) - (currentWidth / 2);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = (currentDepth / 2) + 0.1;
                
                // Adjust position to be on the sloped face
                const adjustedPosZ = posZ - (posY + height/2) * (depth/2) / height;
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, adjustedPosZ),
                    rotation: new THREE.Euler(-Math.atan(height / (depth/2)), 0, 0)
                });
            }
            
            // Back face
            for (let x = 1; x <= currentWidthCount; x++) {
                const posX = -((x * currentWidthSpacing) - (currentWidth / 2));
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = -(currentDepth / 2 + 0.1);
                
                // Adjust position to be on the sloped face
                const adjustedPosZ = posZ + (posY + height/2) * (depth/2) / height;
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY, adjustedPosZ),
                    rotation: new THREE.Euler(Math.atan(height / (depth/2)), Math.PI, 0)
                });
            }
            
            // Left face
            for (let z = 1; z <= currentDepthCount; z++) {
                const posX = -(currentWidth / 2 + 0.1);
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = (z * currentDepthSpacing) - (currentDepth / 2);
                
                // Adjust position to be on the sloped face
                const adjustedPosX = posX + (posY + height/2) * (width/2) / height;
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(adjustedPosX, posY, posZ),
                    rotation: new THREE.Euler(0, -Math.PI / 2, Math.atan(height / (width/2)))
                });
            }
            
            // Right face
            for (let z = 1; z <= currentDepthCount; z++) {
                const posX = currentWidth / 2 + 0.1;
                const posY = (y * heightSpacing) - (height / 2);
                const posZ = -((z * currentDepthSpacing) - (currentDepth / 2));
                
                // Adjust position to be on the sloped face
                const adjustedPosX = posX - (posY + height/2) * (width/2) / height;
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(adjustedPosX, posY, posZ),
                    rotation: new THREE.Euler(0, Math.PI / 2, -Math.atan(height / (width/2)))
                });
            }
        }
        
        return windows;
    }
    
    /**
     * Create windows for a sphere building
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createSphereWindows(width, height, depth) {
        const windows = [];
        const radius = Math.min(width, height, depth) / 2;
        const windowSize = radius * 0.15;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows around circumference and height
        const horizontalCount = Math.max(8, Math.floor(2 * Math.PI * radius / (windowSize * 1.5)));
        const verticalCount = Math.max(4, Math.floor(Math.PI * radius / (windowSize * 1.5)));
        
        // Calculate spacing
        const horizontalSpacing = (2 * Math.PI) / horizontalCount;
        const verticalSpacing = Math.PI / (verticalCount + 1);
        
        // Create windows distributed on sphere surface
        for (let v = 1; v <= verticalCount; v++) {
            const phi = v * verticalSpacing;
            const currentHorizontalCount = Math.floor(horizontalCount * Math.sin(phi));
            
            for (let h = 0; h < currentHorizontalCount; h++) {
                const theta = h * (2 * Math.PI / currentHorizontalCount);
                
                // Convert spherical to cartesian coordinates
                const posX = radius * Math.sin(phi) * Math.cos(theta);
                const posY = radius * Math.cos(phi);
                const posZ = radius * Math.sin(phi) * Math.sin(theta);
                
                windows.push({
                    geometry: windowGeometry.clone(),
                    position: new THREE.Vector3(posX, posY - height/4, posZ), // Offset Y to center
                    rotation: new THREE.Euler(phi - Math.PI/2, theta, 0)
                });
            }
        }
        
        return windows;
    }
    
    /**
     * Create windows for a polygon-based prism building
     * @param {number} sides - Number of sides for the polygon base
     * @param {number} width - Width of the building
     * @param {number} height - Height of the building
     * @param {number} depth - Depth of the building
     * @returns {Array} Array of window geometries and positions
     */
    createPolygonWindows(sides, width, height, depth) {
        const windows = [];
        const radius = Math.min(width, depth) / 2;
        const windowSize = radius * 0.2;
        const windowGeometry = new THREE.PlaneGeometry(windowSize, windowSize);
        
        // Calculate number of windows per side and height
        const sideLength = 2 * radius * Math.sin(Math.PI / sides);
        const windowsPerSide = Math.max(1, Math.floor(sideLength / (windowSize * 1.5)));
        const heightCount = Math.max(1, Math.floor(height / (windowSize * 2)));
        
        // Calculate spacing
        const angleSpacing = (2 * Math.PI) / sides;
        const heightSpacing = height / (heightCount + 1);
        
        // Create windows for each side
        for (let side = 0; side < sides; side++) {
            const angle = side * angleSpacing;
            const nextAngle = (side + 1) * angleSpacing;
            
            // Calculate side normal (for window orientation)
            const normalX = Math.sin(angle + angleSpacing/2);
            const normalZ = Math.cos(angle + angleSpacing/2);
            
            // Calculate side start and end points
            const startX = Math.sin(angle) * radius;
            const startZ = Math.cos(angle) * radius;
            const endX = Math.sin(nextAngle) * radius;
            const endZ = Math.cos(nextAngle) * radius;
            
            for (let w = 1; w <= windowsPerSide; w++) {
                // Interpolate position along the side
                const t = w / (windowsPerSide + 1);
                const posX = startX + t * (endX - startX);
                const posZ = startZ + t * (endZ - startZ);
                
                for (let h = 1; h <= heightCount; h++) {
                    const posY = (h * heightSpacing) - (height / 2);
                    
                    // Position slightly outside the face
                    const offsetX = normalX * 0.1;
                    const offsetZ = normalZ * 0.1;
                    
                    windows.push({
                        geometry: windowGeometry.clone(),
                        position: new THREE.Vector3(posX + offsetX, posY, posZ + offsetZ),
                        rotation: new THREE.Euler(0, Math.atan2(normalX, normalZ), 0)
                    });
                }
            }
        }
        
        return windows;
    }
}

// Export the ShapesManager class
if (typeof module !== 'undefined') {
    module.exports = { ShapesManager };
}

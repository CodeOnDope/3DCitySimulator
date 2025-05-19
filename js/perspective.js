/**
 * Perspective Module for 3D City Simulator
 * Handles perspective calculations and vanishing point management
 */

class PerspectiveManager {
    constructor(renderer) {
        this.renderer = renderer;
        this.currentType = CONFIG.perspective.types.ONE_POINT;
        this.vanishingPointPositions = {
            [CONFIG.perspective.types.ONE_POINT]: [...CONFIG.perspective.vanishingPoints.onePoint],
            [CONFIG.perspective.types.TWO_POINT]: [...CONFIG.perspective.vanishingPoints.twoPoint],
            [CONFIG.perspective.types.THREE_POINT]: [...CONFIG.perspective.vanishingPoints.threePoint]
        };
        this.cameraSync = true; // Flag to enable/disable camera synchronization
    }
    
    /**
     * Initialize perspective settings
     */
    init() {
        // Set initial perspective type
        this.setPerspectiveType(this.currentType);
        
        // Setup event listeners for vanishing point controls
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for UI controls
     */
    setupEventListeners() {
        // Perspective type radio buttons
        document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setPerspectiveType(e.target.value);
                    
                    // Sync with camera immediately after changing perspective type
                    if (this.renderer && this.renderer.camera && this.renderer.controls) {
                        this.syncVanishingPointsWithCamera(
                            this.renderer.camera.position,
                            this.renderer.controls.target
                        );
                    }
                }
            });
        });
        
        // Vanishing point position sliders
        document.getElementById('vp1-position').addEventListener('input', (e) => {
            // Temporarily disable camera sync while manually adjusting
            this.cameraSync = false;
            this.updateVanishingPointPosition(0, parseInt(e.target.value));
            document.getElementById('vp1-position-value').textContent = e.target.value;
        });
        
        document.getElementById('vp1-position').addEventListener('change', (e) => {
            // Re-enable camera sync after manual adjustment is complete
            this.cameraSync = true;
        });
        
        document.getElementById('vp2-position').addEventListener('input', (e) => {
            // Temporarily disable camera sync while manually adjusting
            this.cameraSync = false;
            this.updateVanishingPointPosition(1, parseInt(e.target.value));
            document.getElementById('vp2-position-value').textContent = e.target.value;
        });
        
        document.getElementById('vp2-position').addEventListener('change', (e) => {
            // Re-enable camera sync after manual adjustment is complete
            this.cameraSync = true;
        });
        
        document.getElementById('vp3-position').addEventListener('input', (e) => {
            // Temporarily disable camera sync while manually adjusting
            this.cameraSync = false;
            this.updateVanishingPointPosition(2, parseInt(e.target.value));
            document.getElementById('vp3-position-value').textContent = e.target.value;
        });
        
        document.getElementById('vp3-position').addEventListener('change', (e) => {
            // Re-enable camera sync after manual adjustment is complete
            this.cameraSync = true;
        });
    }
    
    /**
     * Set the perspective type
     */
    setPerspectiveType(type) {
        this.currentType = type;
        
        // Update UI
        this.updateVanishingPointControls();
        
        // Update renderer
        this.renderer.setPerspectiveType(type);
        
        // Update perspective indicator
        document.getElementById('perspective-indicator').textContent = type;
    }
    
    /**
     * Update vanishing point controls based on current perspective type
     */
    updateVanishingPointControls() {
        // Show/hide controls based on perspective type
        const vp1Controls = document.getElementById('vp1-controls');
        const vp2Controls = document.getElementById('vp2-controls');
        const vp3Controls = document.getElementById('vp3-controls');
        
        switch (this.currentType) {
            case CONFIG.perspective.types.ONE_POINT:
                vp1Controls.style.display = 'block';
                vp2Controls.style.display = 'none';
                vp3Controls.style.display = 'none';
                break;
                
            case CONFIG.perspective.types.TWO_POINT:
                vp1Controls.style.display = 'block';
                vp2Controls.style.display = 'block';
                vp3Controls.style.display = 'none';
                break;
                
            case CONFIG.perspective.types.THREE_POINT:
                vp1Controls.style.display = 'block';
                vp2Controls.style.display = 'block';
                vp3Controls.style.display = 'block';
                break;
        }
        
        // Reset slider values to match current vanishing point positions
        this.resetSliderValues();
    }
    
    /**
     * Reset slider values to match current vanishing point positions
     */
    resetSliderValues() {
        const vpPositions = this.vanishingPointPositions[this.currentType];
        
        // VP1 (always present)
        const vp1Slider = document.getElementById('vp1-position');
        const vp1Value = document.getElementById('vp1-position-value');
        
        if (this.currentType === CONFIG.perspective.types.ONE_POINT) {
            // For one-point, VP1 is the z position
            vp1Slider.value = vpPositions[0].z;
            vp1Value.textContent = vpPositions[0].z;
        } else {
            // For two/three-point, VP1 is the x position of the left VP
            vp1Slider.value = vpPositions[0].x;
            vp1Value.textContent = vpPositions[0].x;
        }
        
        // VP2 (present in two-point and three-point)
        if (this.currentType !== CONFIG.perspective.types.ONE_POINT) {
            const vp2Slider = document.getElementById('vp2-position');
            const vp2Value = document.getElementById('vp2-position-value');
            vp2Slider.value = vpPositions[1].x;
            vp2Value.textContent = vpPositions[1].x;
        }
        
        // VP3 (present only in three-point)
        if (this.currentType === CONFIG.perspective.types.THREE_POINT) {
            const vp3Slider = document.getElementById('vp3-position');
            const vp3Value = document.getElementById('vp3-position-value');
            vp3Slider.value = vpPositions[2].y;
            vp3Value.textContent = vpPositions[2].y;
        }
    }
    
    /**
     * Update a vanishing point position based on slider value
     */
    updateVanishingPointPosition(vpIndex, value) {
        const vpPositions = this.vanishingPointPositions[this.currentType];
        
        // Clamp value to slider range
        value = Math.max(-1000, Math.min(1000, value));
        
        // Update the appropriate position value based on perspective type and VP index
        if (this.currentType === CONFIG.perspective.types.ONE_POINT) {
            if (vpIndex === 0) {
                // For one-point, adjust the z position
                vpPositions[0].z = value;
            }
        } else if (this.currentType === CONFIG.perspective.types.TWO_POINT) {
            if (vpIndex === 0) {
                // Left VP x position
                vpPositions[0].x = value;
            } else if (vpIndex === 1) {
                // Right VP x position
                vpPositions[1].x = value;
            }
        } else if (this.currentType === CONFIG.perspective.types.THREE_POINT) {
            if (vpIndex === 0) {
                // Left VP x position
                vpPositions[0].x = value;
            } else if (vpIndex === 1) {
                // Right VP x position
                vpPositions[1].x = value;
            } else if (vpIndex === 2) {
                // Top/Bottom VP y position
                vpPositions[2].y = value;
            }
        }
        
        // Update the config
        CONFIG.perspective.vanishingPoints.onePoint = this.vanishingPointPositions[CONFIG.perspective.types.ONE_POINT];
        CONFIG.perspective.vanishingPoints.twoPoint = this.vanishingPointPositions[CONFIG.perspective.types.TWO_POINT];
        CONFIG.perspective.vanishingPoints.threePoint = this.vanishingPointPositions[CONFIG.perspective.types.THREE_POINT];
        
        // Update the renderer
        this.renderer.updateVanishingPoints();
        this.renderer.updateReferenceLines();
    }
    
    /**
     * Update vanishing point based on camera position
     * @param {number} vpIndex - Index of the vanishing point to update
     * @param {number} value - New position value
     */
    updateVanishingPoint(vpIndex, value) {
        const vpPositions = this.vanishingPointPositions[this.currentType];
        
        // Clamp value to slider range
        value = Math.max(-1000, Math.min(1000, value));
        
        // Update the appropriate position value based on perspective type and VP index
        if (this.currentType === CONFIG.perspective.types.ONE_POINT) {
            if (vpIndex === 0) {
                // For one-point, adjust the z position
                vpPositions[0].z = value;
            }
        } else if (this.currentType === CONFIG.perspective.types.TWO_POINT) {
            if (vpIndex === 0) {
                // Left VP x position
                vpPositions[0].x = value;
            } else if (vpIndex === 1) {
                // Right VP x position
                vpPositions[1].x = value;
            }
        } else if (this.currentType === CONFIG.perspective.types.THREE_POINT) {
            if (vpIndex === 0) {
                // Left VP x position
                vpPositions[0].x = value;
            } else if (vpIndex === 1) {
                // Right VP x position
                vpPositions[1].x = value;
            } else if (vpIndex === 2) {
                // Top/Bottom VP y position
                vpPositions[2].y = value;
            }
        }
        
        // Update the config
        CONFIG.perspective.vanishingPoints.onePoint = this.vanishingPointPositions[CONFIG.perspective.types.ONE_POINT];
        CONFIG.perspective.vanishingPoints.twoPoint = this.vanishingPointPositions[CONFIG.perspective.types.TWO_POINT];
        CONFIG.perspective.vanishingPoints.threePoint = this.vanishingPointPositions[CONFIG.perspective.types.THREE_POINT];
        
        // Update the renderer
        this.renderer.updateVanishingPoints();
        this.renderer.updateReferenceLines();
        
        // Update UI sliders
        this.updateSliderValues();
    }
    
    /**
     * Update slider values to match current vanishing point positions
     */
    updateSliderValues() {
        const vpPositions = this.vanishingPointPositions[this.currentType];
        
        // VP1 (always present)
        const vp1Slider = document.getElementById('vp1-position');
        const vp1Value = document.getElementById('vp1-position-value');
        
        if (this.currentType === CONFIG.perspective.types.ONE_POINT) {
            // For one-point, VP1 is the z position
            const clampedValue = Math.max(-1000, Math.min(1000, vpPositions[0].z));
            vp1Slider.value = clampedValue;
            vp1Value.textContent = clampedValue;
        } else {
            // For two/three-point, VP1 is the x position of the left VP
            const clampedValue = Math.max(-1000, Math.min(1000, vpPositions[0].x));
            vp1Slider.value = clampedValue;
            vp1Value.textContent = clampedValue;
        }
        
        // VP2 (present in two-point and three-point)
        if (this.currentType !== CONFIG.perspective.types.ONE_POINT) {
            const vp2Slider = document.getElementById('vp2-position');
            const vp2Value = document.getElementById('vp2-position-value');
            const clampedValue = Math.max(-1000, Math.min(1000, vpPositions[1].x));
            vp2Slider.value = clampedValue;
            vp2Value.textContent = clampedValue;
        }
        
        // VP3 (present only in three-point)
        if (this.currentType === CONFIG.perspective.types.THREE_POINT) {
            const vp3Slider = document.getElementById('vp3-position');
            const vp3Value = document.getElementById('vp3-position-value');
            const clampedValue = Math.max(-1000, Math.min(1000, vpPositions[2].y));
            vp3Slider.value = clampedValue;
            vp3Value.textContent = clampedValue;
        }
    }
    
    /**
     * Synchronize vanishing points with camera position
     * @param {THREE.Vector3} cameraPosition - Current camera position
     * @param {THREE.Vector3} targetPosition - Current camera target position
     */
    syncVanishingPointsWithCamera(cameraPosition, targetPosition) {
        // Skip if camera sync is disabled (during manual slider adjustments)
        if (!this.cameraSync) return;
        
        // Calculate direction vector from camera to target
        const direction = new THREE.Vector3().subVectors(targetPosition, cameraPosition).normalize();
        
        // Calculate vanishing point positions based on camera and perspective type
        if (this.currentType === CONFIG.perspective.types.ONE_POINT) {
            // For one-point, project the direction vector forward to create a distant vanishing point
            const vpDistance = 1000; // Use a value within our slider range
            const vpPosition = new THREE.Vector3()
                .copy(cameraPosition)
                .add(direction.multiplyScalar(vpDistance));
            
            // Update the vanishing point position
            this.vanishingPointPositions[this.currentType][0].x = vpPosition.x;
            this.vanishingPointPositions[this.currentType][0].y = cameraPosition.y; // Keep at camera height
            this.vanishingPointPositions[this.currentType][0].z = vpPosition.z;
            
        } else if (this.currentType === CONFIG.perspective.types.TWO_POINT) {
            // For two-point, create two vanishing points perpendicular to the view direction
            const vpDistance = 1000; // Use a value within our slider range
            const right = new THREE.Vector3(1, 0, 0);
            const up = new THREE.Vector3(0, 1, 0);
            const forward = direction.clone();
            
            // Calculate right vector perpendicular to forward and up
            right.crossVectors(forward, up).normalize();
            
            // Calculate left and right vanishing points
            const leftVP = new THREE.Vector3().copy(cameraPosition).add(right.clone().multiplyScalar(-vpDistance));
            const rightVP = new THREE.Vector3().copy(cameraPosition).add(right.clone().multiplyScalar(vpDistance));
            
            // Update vanishing point positions
            this.vanishingPointPositions[this.currentType][0].x = leftVP.x;
            this.vanishingPointPositions[this.currentType][0].y = cameraPosition.y; // Keep at camera height
            this.vanishingPointPositions[this.currentType][0].z = leftVP.z;
            
            this.vanishingPointPositions[this.currentType][1].x = rightVP.x;
            this.vanishingPointPositions[this.currentType][1].y = cameraPosition.y; // Keep at camera height
            this.vanishingPointPositions[this.currentType][1].z = rightVP.z;
            
        } else if (this.currentType === CONFIG.perspective.types.THREE_POINT) {
            // For three-point, add a third vanishing point above or below
            const vpDistance = 1000; // Use a value within our slider range
            const right = new THREE.Vector3(1, 0, 0);
            const up = new THREE.Vector3(0, 1, 0);
            const forward = direction.clone();
            
            // Calculate right vector perpendicular to forward and up
            right.crossVectors(forward, up).normalize();
            
            // Recalculate up vector to ensure it's perpendicular to forward and right
            up.crossVectors(right, forward).normalize();
            
            // Calculate left, right, and top/bottom vanishing points
            const leftVP = new THREE.Vector3().copy(cameraPosition).add(right.clone().multiplyScalar(-vpDistance));
            const rightVP = new THREE.Vector3().copy(cameraPosition).add(right.clone().multiplyScalar(vpDistance));
            const topVP = new THREE.Vector3().copy(cameraPosition).add(up.clone().multiplyScalar(vpDistance));
            
            // Update vanishing point positions
            this.vanishingPointPositions[this.currentType][0].x = leftVP.x;
            this.vanishingPointPositions[this.currentType][0].y = cameraPosition.y; // Keep at camera height
            this.vanishingPointPositions[this.currentType][0].z = leftVP.z;
            
            this.vanishingPointPositions[this.currentType][1].x = rightVP.x;
            this.vanishingPointPositions[this.currentType][1].y = cameraPosition.y; // Keep at camera height
            this.vanishingPointPositions[this.currentType][1].z = rightVP.z;
            
            this.vanishingPointPositions[this.currentType][2].x = cameraPosition.x;
            this.vanishingPointPositions[this.currentType][2].y = topVP.y;
            this.vanishingPointPositions[this.currentType][2].z = cameraPosition.z;
        }
        
        // Update the config
        CONFIG.perspective.vanishingPoints.onePoint = this.vanishingPointPositions[CONFIG.perspective.types.ONE_POINT];
        CONFIG.perspective.vanishingPoints.twoPoint = this.vanishingPointPositions[CONFIG.perspective.types.TWO_POINT];
        CONFIG.perspective.vanishingPoints.threePoint = this.vanishingPointPositions[CONFIG.perspective.types.THREE_POINT];
        
        // Update the renderer
        this.renderer.updateVanishingPoints();
        this.renderer.updateReferenceLines();
        
        // Update UI sliders
        this.updateSliderValues();
    }
    
    /**
     * Get the current vanishing point positions
     */
    getCurrentVanishingPointPositions() {
        return this.vanishingPointPositions[this.currentType];
    }
}

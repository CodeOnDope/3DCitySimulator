/**
 * Utility functions for 3D City Simulator
 */

// Polyfill for TWEEN if not available
if (typeof TWEEN === 'undefined') {
    window.TWEEN = {
        Easing: {
            Cubic: {
                InOut: function(k) {
                    if ((k *= 2) < 1) return 0.5 * k * k * k;
                    return 0.5 * ((k -= 2) * k * k + 2);
                }
            }
        },
        update: function() {},
        Tween: function(obj) {
            this.to = function(props, duration) {
                return {
                    easing: function(easing) {
                        return {
                            onUpdate: function(callback) {
                                return {
                                    start: function() {
                                        // Simple linear animation
                                        const startValues = {};
                                        const changeValues = {};
                                        const startTime = Date.now();
                                        
                                        // Store start values and calculate change values
                                        for (const prop in props) {
                                            startValues[prop] = obj[prop];
                                            changeValues[prop] = props[prop] - obj[prop];
                                        }
                                        
                                        // Animation function
                                        function animate() {
                                            const elapsed = Date.now() - startTime;
                                            const progress = Math.min(elapsed / duration, 1);
                                            
                                            // Update values
                                            for (const prop in props) {
                                                obj[prop] = startValues[prop] + changeValues[prop] * progress;
                                            }
                                            
                                            // Call update callback
                                            if (callback) callback();
                                            
                                            // Continue animation if not complete
                                            if (progress < 1) {
                                                requestAnimationFrame(animate);
                                            }
                                        }
                                        
                                        // Start animation
                                        animate();
                                    }
                                };
                            }
                        };
                    }
                };
            };
            return this;
        }
    };
}

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random float between min and max
 */
function randomFloat(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Generate a random color from the config colors array
 */
function randomBuildingColor() {
    const colorIndex = Math.floor(Math.random() * CONFIG.buildings.colors.length);
    return new THREE.Color(CONFIG.buildings.colors[colorIndex]);
}

/**
 * Format a number with commas for thousands
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Debounce function to limit how often a function can be called
 */
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Check if a point is inside a polygon
 * Used for complex shape selection
 */
function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x;
        const yi = polygon[i].y;
        const xj = polygon[j].x;
        const yj = polygon[j].y;
        
        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        
        if (intersect) inside = !inside;
    }
    
    return inside;
}

/**
 * Calculate distance between two 3D points
 */
function distance3D(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const dz = point2.z - point1.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Convert degrees to radians
 */
function degToRad(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function radToDeg(radians) {
    return radians * (180 / Math.PI);
}

/**
 * Lerp (linear interpolation) between two values
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Generate a unique ID
 */
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Check if WebGL is available
 */
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && 
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

/**
 * Show a notification message
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.fontWeight = 'bold';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.3s ease-in-out';
        document.body.appendChild(notification);
    }
    
    // Set notification type
    switch (type) {
        case 'success':
            notification.style.backgroundColor = '#48bb78';
            break;
        case 'error':
            notification.style.backgroundColor = '#f56565';
            break;
        case 'warning':
            notification.style.backgroundColor = '#ecc94b';
            break;
        default:
            notification.style.backgroundColor = '#4299e1';
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.style.opacity = '1';
    
    // Hide notification after duration
    setTimeout(() => {
        notification.style.opacity = '0';
    }, duration);
}

/**
 * Check browser compatibility
 */
function checkBrowserCompatibility() {
    const issues = [];
    
    // Check for WebGL support
    if (!isWebGLAvailable()) {
        issues.push('WebGL is not supported by your browser. The 3D rendering will not work properly.');
    }
    
    // Check for modern JavaScript support
    try {
        eval('const test = () => {}');
    } catch (e) {
        issues.push('Your browser does not support modern JavaScript features. Please use a more recent browser.');
    }
    
    // Check for localStorage support
    try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
    } catch (e) {
        issues.push('LocalStorage is not available. Settings will not be saved between sessions.');
    }
    
    return issues;
}

/**
 * Save settings to localStorage
 */
function saveSettings(settings) {
    try {
        localStorage.setItem('3DCitySimulator_settings', JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('Failed to save settings:', e);
        return false;
    }
}

/**
 * Load settings from localStorage
 */
function loadSettings() {
    try {
        const settings = localStorage.getItem('3DCitySimulator_settings');
        return settings ? JSON.parse(settings) : null;
    } catch (e) {
        console.error('Failed to load settings:', e);
        return null;
    }
}

/**
 * Export city as JSON
 */
function exportCityAsJSON(buildings) {
    const cityData = {
        buildings: buildings.map(building => ({
            id: building.id,
            shape: building.shape,
            width: building.width,
            height: building.height,
            depth: building.depth,
            color: '#' + building.color.getHexString(),
            position: building.position
        })),
        metadata: {
            version: '1.0',
            created: new Date().toISOString(),
            author: 'Dineshkumar Rajendran'
        }
    };
    
    return JSON.stringify(cityData, null, 2);
}

/**
 * Import city from JSON
 */
function importCityFromJSON(json, buildingFactory) {
    try {
        const cityData = JSON.parse(json);
        
        if (!cityData.buildings || !Array.isArray(cityData.buildings)) {
            throw new Error('Invalid city data format');
        }
        
        const buildings = cityData.buildings.map(buildingData => {
            return buildingFactory.createBuilding(
                buildingData.shape,
                buildingData.width,
                buildingData.height,
                buildingData.depth,
                new THREE.Color(buildingData.color),
                buildingData.position.x,
                buildingData.position.y,
                buildingData.position.z
            );
        });
        
        return buildings;
    } catch (e) {
        console.error('Failed to import city:', e);
        return null;
    }
}

/**
 * Take a screenshot of the canvas
 */
function takeScreenshot(renderer) {
    try {
        // Render the scene
        renderer.render(renderer.scene, renderer.camera);
        
        // Get the canvas data URL
        const dataURL = renderer.domElement.toDataURL('image/png');
        
        // Create a link element
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = '3DCitySimulator_' + new Date().toISOString().slice(0, 10) + '.png';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    } catch (e) {
        console.error('Failed to take screenshot:', e);
        return false;
    }
}

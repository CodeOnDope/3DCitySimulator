/**
 * Configuration settings for 3D City Simulator
 */

const CONFIG = {
    // Renderer settings
    renderer: {
        antialias: true,
        shadowMapEnabled: true,
        pixelRatio: window.devicePixelRatio || 1
    },
    
    // Camera settings
    camera: {
        fov: 60,
        near: 0.1,
        far: 10000,
        initialPosition: { x: 0, y: 150, z: 400 }
    },
    
    // Perspective settings
    perspective: {
        types: {
            ONE_POINT: '1-point',
            TWO_POINT: '2-point',
            THREE_POINT: '3-point'
        },
        vanishingPoints: {
            onePoint: [
                { x: 0, y: 100, z: -1000 } // Center VP
            ],
            twoPoint: [
                { x: -1000, y: 100, z: 0 }, // Left VP
                { x: 1000, y: 100, z: 0 }   // Right VP
            ],
            threePoint: [
                { x: -1000, y: 100, z: 0 },  // Left VP
                { x: 1000, y: 100, z: 0 },   // Right VP
                { x: 0, y: 1000, z: 0 }      // Top VP
            ]
        },
        cameraViews: {
            frontView: { position: { x: 0, y: 150, z: 400 }, target: { x: 0, y: 50, z: 0 } },
            cornerView: { position: { x: 300, y: 150, z: 300 }, target: { x: 0, y: 50, z: 0 } },
            topView: { position: { x: 0, y: 500, z: 0 }, target: { x: 0, y: 0, z: 0 } },
            streetLevel: { position: { x: 50, y: 20, z: 150 }, target: { x: 0, y: 30, z: 0 } },
            birdsEye: { position: { x: 200, y: 300, z: 200 }, target: { x: 0, y: 0, z: 0 } },
            dramaticView: { position: { x: 100, y: 50, z: 300 }, target: { x: 0, y: 100, z: 0 } }
        }
    },
    
    // Building settings
    buildings: {
        shapes: {
            CUBE: 'cube',
            CYLINDER: 'cylinder',
            PYRAMID: 'pyramid',
            MIXED: 'mixed'
        },
        defaultCount: 10,
        minCount: 3,
        maxCount: 30,
        defaultHeight: 80,
        minHeight: 20,
        maxHeight: 300,
        defaultWidth: 30,
        minWidth: 10,
        maxWidth: 100,
        defaultDepth: 30,
        minDepth: 10,
        maxDepth: 100,
        colors: [
            '#4a90e2', // Blue
            '#50e3c2', // Teal
            '#b8e986', // Green
            '#f8e71c', // Yellow
            '#f5a623', // Orange
            '#d0021b', // Red
            '#9013fe', // Purple
            '#bd10e0'  // Magenta
        ]
    },
    
    // Grid settings
    grid: {
        defaultSize: 500,
        minSize: 200,
        maxSize: 1000,
        divisions: 20,
        colors: {
            main: 0x888888,
            secondary: 0xcccccc
        }
    },
    
    // Lighting settings
    lighting: {
        modes: {
            DAY: 'day',
            NIGHT: 'night',
            SUNSET: 'sunset'
        },
        day: {
            ambientColor: 0xffffff,
            ambientIntensity: 0.5,
            directionalColor: 0xffffff,
            directionalIntensity: 0.8,
            position: { x: 1, y: 1, z: 1 }
        },
        night: {
            ambientColor: 0x0a1a2a,
            ambientIntensity: 0.2,
            directionalColor: 0x0a1a2a,
            directionalIntensity: 0.1,
            position: { x: -1, y: 1, z: -1 },
            pointLights: [
                { color: 0xffaa00, intensity: 1, distance: 200, position: { x: 0, y: 150, z: 0 } },
                { color: 0x0044ff, intensity: 1, distance: 200, position: { x: 100, y: 50, z: 100 } },
                { color: 0xff4400, intensity: 1, distance: 200, position: { x: -100, y: 50, z: -100 } }
            ]
        },
        sunset: {
            ambientColor: 0xff7e47,
            ambientIntensity: 0.3,
            directionalColor: 0xff5500,
            directionalIntensity: 0.7,
            position: { x: -1, y: 0.5, z: -1 }
        }
    },
    
    // Visual settings
    visual: {
        lineColor: '#0000ff',
        vanishingPointSize: 5,
        windowColor: 0xffffcc,
        windowOpacity: 0.7,
        horizonColor: '#0000ff',
        helperLineColor: '#00ff00'
    }
};

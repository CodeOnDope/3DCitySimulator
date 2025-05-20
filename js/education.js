/**
 * Education Module for 3D City Simulator
 * Handles educational features and tutorials
 */

class EducationManager {
    constructor(renderer, perspectiveManager) {
        this.renderer = renderer;
        this.perspectiveManager = perspectiveManager;
        this.isOverlayVisible = false;
        this.currentOverlay = null;
        this.isNode = typeof process !== 'undefined' && process.versions && process.versions.node;
    }
    
    /**
     * Initialize education manager
     */
    init() {
        this.setupEventListeners();
        if (this.isNode) {
            this.preloadImages();
        }
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Help button (already handled in UI manager)
        
        // Perspective type change listener
        document.querySelectorAll('input[name="perspectiveType"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.showPerspectiveInfo(e.target.value);
                }
            });
        });
    }
    
    /**
     * Preload educational images
     */
    preloadImages() {
        if (!this.isNode) return;

        // Create img directory if it doesn't exist
        const imgDir = '/home/ubuntu/3DCitySimulator/img';

        // Create educational diagrams using canvas
        this.createPerspectiveDiagrams(imgDir);
    }
    
    /**
     * Create perspective diagram images
     */
    createPerspectiveDiagrams(imgDir) {
        if (!this.isNode) return;

        // Create directory structure
        const fs = require('fs');
        if (!fs.existsSync(imgDir)) {
            fs.mkdirSync(imgDir, { recursive: true });
        }

        // Create diagrams using Canvas API
        this.create1PointDiagram(`${imgDir}/1point-diagram.png`);
        this.create2PointDiagram(`${imgDir}/2point-diagram.png`);
        this.create3PointDiagram(`${imgDir}/3point-diagram.png`);
    }
    
    /**
     * Create 1-point perspective diagram
     */
    create1PointDiagram(filePath) {
        if (!this.isNode) return;
        const { createCanvas } = require('canvas');
        const fs = require('fs');
        
        // Create canvas
        const canvas = createCanvas(800, 500);
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw horizon line
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 250);
        ctx.lineTo(800, 250);
        ctx.stroke();
        
        // Draw vanishing point
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(400, 250, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Label vanishing point
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Vanishing Point', 400, 230);
        
        // Draw horizon label
        ctx.textAlign = 'left';
        ctx.fillText('Horizon Line', 20, 245);
        
        // Draw a cube in 1-point perspective
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Front face
        ctx.beginPath();
        ctx.rect(300, 200, 200, 200);
        ctx.stroke();
        
        // Lines to vanishing point
        ctx.beginPath();
        ctx.moveTo(300, 200);
        ctx.lineTo(400, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(300, 400);
        ctx.lineTo(400, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(500, 400);
        ctx.lineTo(400, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(500, 200);
        ctx.lineTo(400, 250);
        ctx.stroke();
        
        // Draw back face (lighter)
        ctx.strokeStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(350, 225);
        ctx.lineTo(450, 225);
        ctx.lineTo(450, 350);
        ctx.lineTo(350, 350);
        ctx.closePath();
        ctx.stroke();
        
        // Connect front to back
        ctx.beginPath();
        ctx.moveTo(300, 200);
        ctx.lineTo(350, 225);
        ctx.moveTo(500, 200);
        ctx.lineTo(450, 225);
        ctx.moveTo(500, 400);
        ctx.lineTo(450, 350);
        ctx.moveTo(300, 400);
        ctx.lineTo(350, 350);
        ctx.stroke();
        
        // Add title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('1-Point Perspective', 400, 50);
        
        // Add explanation
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('All receding lines converge to a single vanishing point on the horizon line', 400, 80);
        
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
    }
    
    /**
     * Create 2-point perspective diagram
     */
    create2PointDiagram(filePath) {
        if (!this.isNode) return;
        const { createCanvas } = require('canvas');
        const fs = require('fs');
        
        // Create canvas
        const canvas = createCanvas(800, 500);
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw horizon line
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 250);
        ctx.lineTo(800, 250);
        ctx.stroke();
        
        // Draw vanishing points
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(100, 250, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(700, 250, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Label vanishing points
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('VP1', 100, 230);
        ctx.fillText('VP2', 700, 230);
        
        // Draw horizon label
        ctx.textAlign = 'left';
        ctx.fillText('Horizon Line', 350, 245);
        
        // Draw a cube in 2-point perspective
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Vertical edge
        ctx.beginPath();
        ctx.moveTo(400, 150);
        ctx.lineTo(400, 350);
        ctx.stroke();
        
        // Top edges to vanishing points
        ctx.beginPath();
        ctx.moveTo(400, 150);
        ctx.lineTo(100, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(400, 150);
        ctx.lineTo(700, 250);
        ctx.stroke();
        
        // Bottom edges to vanishing points
        ctx.beginPath();
        ctx.moveTo(400, 350);
        ctx.lineTo(100, 250);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(400, 350);
        ctx.lineTo(700, 250);
        ctx.stroke();
        
        // Back vertical edges
        ctx.strokeStyle = '#888';
        ctx.beginPath();
        ctx.moveTo(300, 180);
        ctx.lineTo(300, 320);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(500, 180);
        ctx.lineTo(500, 320);
        ctx.stroke();
        
        // Connect back edges
        ctx.beginPath();
        ctx.moveTo(300, 180);
        ctx.lineTo(500, 180);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(300, 320);
        ctx.lineTo(500, 320);
        ctx.stroke();
        
        // Add title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('2-Point Perspective', 400, 50);
        
        // Add explanation
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Horizontal lines recede to two vanishing points on the horizon line', 400, 80);
        ctx.fillText('Vertical lines remain vertical', 400, 105);
        
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
    }
    
    /**
     * Create 3-point perspective diagram
     */
    create3PointDiagram(filePath) {
        if (!this.isNode) return;
        const { createCanvas } = require('canvas');
        const fs = require('fs');
        
        // Create canvas
        const canvas = createCanvas(800, 500);
        const ctx = canvas.getContext('2d');
        
        // Fill background
        ctx.fillStyle = '#f8f9fa';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw horizon line
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 350);
        ctx.lineTo(800, 350);
        ctx.stroke();
        
        // Draw vanishing points
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.arc(150, 350, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(650, 350, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(400, 50, 5, 0, Math.PI * 2);
        ctx.fill();
        
        // Label vanishing points
        ctx.fillStyle = '#000';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('VP1', 150, 380);
        ctx.fillText('VP2', 650, 380);
        ctx.fillText('VP3', 400, 30);
        
        // Draw horizon label
        ctx.textAlign = 'left';
        ctx.fillText('Horizon Line', 350, 345);
        
        // Draw a building in 3-point perspective
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        
        // Main vertical edges
        ctx.beginPath();
        ctx.moveTo(350, 200);
        ctx.lineTo(380, 400);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(450, 200);
        ctx.lineTo(420, 400);
        ctx.stroke();
        
        // Top edges to vanishing points
        ctx.beginPath();
        ctx.moveTo(350, 200);
        ctx.lineTo(150, 350);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(450, 200);
        ctx.lineTo(650, 350);
        ctx.stroke();
        
        // Bottom edges to vanishing points
        ctx.beginPath();
        ctx.moveTo(380, 400);
        ctx.lineTo(150, 350);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(420, 400);
        ctx.lineTo(650, 350);
        ctx.stroke();
        
        // Top edge to third vanishing point
        ctx.beginPath();
        ctx.moveTo(350, 200);
        ctx.lineTo(400, 50);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(450, 200);
        ctx.lineTo(400, 50);
        ctx.stroke();
        
        // Add title
        ctx.fillStyle = '#000';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('3-Point Perspective', 400, 470);
        
        // Add explanation
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Horizontal lines recede to two vanishing points on the horizon line', 400, 120);
        ctx.fillText('Vertical lines converge to a third vanishing point above or below', 400, 145);
        
        // Save to file
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);
    }
    
    /**
     * Show perspective information based on type
     */
    showPerspectiveInfo(perspectiveType) {
        // Open modal and switch to appropriate tab
        const modal = document.getElementById('educational-modal');
        modal.classList.add('active');
        
        // Switch to appropriate tab
        let tabId;
        switch (perspectiveType) {
            case CONFIG.perspective.types.ONE_POINT:
                tabId = 'tab-1point';
                break;
            case CONFIG.perspective.types.TWO_POINT:
                tabId = 'tab-2point';
                break;
            case CONFIG.perspective.types.THREE_POINT:
                tabId = 'tab-3point';
                break;
            default:
                tabId = 'tab-1point';
        }
        
        // Activate tab
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.getElementById(tabId).classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
    }
}

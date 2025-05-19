/**
 * Documentation Module for 3D City Simulator
 * Provides comprehensive documentation and help for the application
 */

class DocumentationManager {
    constructor() {
        this.sections = {
            'introduction': {
                title: 'Introduction',
                content: `
                    <h2>Welcome to the 3D City Simulator</h2>
                    <p>The 3D City Simulator is an educational tool designed to help art students understand architectural perspective drawing through interactive 3D visualization. This application allows you to explore different perspective types, manipulate vanishing points, and visualize how buildings appear from various viewpoints.</p>
                    
                    <p>With this tool, you can:</p>
                    <ul>
                        <li>Switch between 1-point, 2-point, and 3-point perspectives</li>
                        <li>Adjust vanishing points with visual feedback</li>
                        <li>Create and customize buildings with different shapes and properties</li>
                        <li>Navigate the 3D scene with intuitive camera controls</li>
                        <li>Visualize buildings in different rendering modes</li>
                        <li>Apply various material properties to buildings</li>
                        <li>Control lighting to enhance visual understanding</li>
                    </ul>
                    
                    <p>This documentation provides detailed information on how to use all features of the 3D City Simulator.</p>
                `
            },
            'perspective': {
                title: 'Perspective Types',
                content: `
                    <h2>Understanding Perspective Types</h2>
                    <p>The 3D City Simulator supports three types of perspective, each with unique characteristics:</p>
                    
                    <h3>1-Point Perspective</h3>
                    <p>In 1-point perspective, there is a single vanishing point on the horizon line. This type of perspective is typically used when viewing objects face-on, such as looking down a street or hallway.</p>
                    <p>Key characteristics:</p>
                    <ul>
                        <li>One vanishing point (VP1)</li>
                        <li>Horizontal and vertical lines remain parallel</li>
                        <li>Only lines receding into the distance converge at the vanishing point</li>
                    </ul>
                    
                    <h3>2-Point Perspective</h3>
                    <p>In 2-point perspective, there are two vanishing points on the horizon line. This type is commonly used when viewing objects at an angle, showing two sides of buildings or objects.</p>
                    <p>Key characteristics:</p>
                    <ul>
                        <li>Two vanishing points (VP1 and VP2)</li>
                        <li>Vertical lines remain parallel</li>
                        <li>Horizontal lines converge to either vanishing point</li>
                    </ul>
                    
                    <h3>3-Point Perspective</h3>
                    <p>In 3-point perspective, there are three vanishing points: two on the horizon line and one either above or below. This type creates a more dramatic view, often used when looking up at tall buildings or down from a height.</p>
                    <p>Key characteristics:</p>
                    <ul>
                        <li>Three vanishing points (VP1, VP2, and VP3)</li>
                        <li>No lines remain parallel</li>
                        <li>Creates a more dynamic and realistic view</li>
                    </ul>
                    
                    <h3>Using the Refresh Vanishing Points Button</h3>
                    <p>The "Refresh Vanishing Points" button automatically aligns the vanishing points with your current camera view and selected building. This helps you understand how perspective changes as you move around the scene.</p>
                    <p>When you click this button:</p>
                    <ul>
                        <li>The system analyzes your current camera position and orientation</li>
                        <li>It calculates optimal vanishing point positions based on the perspective type</li>
                        <li>The vanishing points are updated, and perspective lines are redrawn</li>
                        <li>The UI sliders update to reflect the new vanishing point positions</li>
                    </ul>
                    <p>This feature is particularly useful for educational purposes, helping students understand the relationship between viewer position and perspective.</p>
                `
            },
            'navigation': {
                title: 'Navigation Tools',
                content: `
                    <h2>Navigation Tools</h2>
                    <p>The 3D City Simulator provides several ways to navigate the 3D scene:</p>
                    
                    <h3>Navigation Tool Buttons</h3>
                    <p>The navigation toolbar contains three main tools:</p>
                    <ul>
                        <li><strong>Tumble</strong>: Rotates the camera around the scene center</li>
                        <li><strong>Pan/Track</strong>: Moves the camera parallel to the view plane</li>
                        <li><strong>Dolly</strong>: Moves the camera closer to or further from the scene</li>
                    </ul>
                    
                    <h3>Mouse Controls</h3>
                    <p>You can also navigate using mouse buttons:</p>
                    <ul>
                        <li><strong>Left-click + drag</strong>: Tumble (rotate the camera)</li>
                        <li><strong>Middle-click + drag</strong>: Pan/Track (move the camera)</li>
                        <li><strong>Right-click + drag</strong>: Dolly (zoom in/out)</li>
                    </ul>
                    
                    <h3>Keyboard Shortcuts</h3>
                    <p>For efficient navigation, you can use these keyboard shortcuts:</p>
                    <ul>
                        <li><strong>Alt + T</strong>: Switch to Tumble tool</li>
                        <li><strong>Alt + P</strong>: Switch to Pan/Track tool</li>
                        <li><strong>Alt + D</strong>: Switch to Dolly tool</li>
                    </ul>
                    
                    <h3>Camera Presets</h3>
                    <p>The application includes preset camera views to quickly switch between common perspectives:</p>
                    <ul>
                        <li><strong>Front View</strong>: Shows the scene from the front</li>
                        <li><strong>Corner View</strong>: Shows the scene from a 45° angle</li>
                        <li><strong>Top View</strong>: Shows the scene from above</li>
                        <li><strong>Street Level</strong>: Shows the scene from human height</li>
                        <li><strong>Bird's Eye</strong>: Shows the scene from a high angle</li>
                        <li><strong>Dramatic View</strong>: Shows the scene from a dynamic angle</li>
                    </ul>
                `
            },
            'visualization': {
                title: 'Visualization Modes',
                content: `
                    <h2>Visualization Modes</h2>
                    <p>The 3D City Simulator offers several visualization modes to help you understand building structure and form:</p>
                    
                    <h3>Shaded</h3>
                    <p>The default mode showing solid objects with materials applied. This provides the most realistic representation of buildings.</p>
                    
                    <h3>Wireframe</h3>
                    <p>Shows only the edges of objects, revealing their underlying structure. This mode is useful for understanding the geometric construction of buildings.</p>
                    
                    <h3>Wireframe on Shaded</h3>
                    <p>Combines solid objects with wireframe overlay, showing both surface appearance and underlying structure simultaneously.</p>
                    
                    <h3>X-Ray</h3>
                    <p>Makes objects semi-transparent, allowing you to see through them. This helps visualize spatial relationships between different parts of the scene.</p>
                    
                    <h3>Silhouette</h3>
                    <p>Shows only the outlines of objects, emphasizing their overall shape and form. This mode is useful for studying composition and proportions.</p>
                    
                    <h3>Material Properties</h3>
                    <p>In addition to visualization modes, you can apply different material properties to buildings:</p>
                    <ul>
                        <li><strong>Clay</strong>: Matte clay-like material (default)</li>
                        <li><strong>Pencil Sketch</strong>: Hand-drawn pencil sketch appearance</li>
                        <li><strong>Paper</strong>: Paper material with slight texture</li>
                        <li><strong>Metal</strong>: Reflective metallic material</li>
                        <li><strong>Glass</strong>: Transparent glass material</li>
                        <li><strong>Plastic</strong>: Smooth plastic material</li>
                        <li><strong>Concrete</strong>: Rough concrete material</li>
                        <li><strong>Wood</strong>: Natural wood material</li>
                    </ul>
                    <p>These material properties can be combined with any visualization mode to create different visual effects.</p>
                `
            },
            'buildings': {
                title: 'Building Controls',
                content: `
                    <h2>Building Controls</h2>
                    <p>The 3D City Simulator allows you to create and customize buildings with various shapes and properties:</p>
                    
                    <h3>Building Shapes</h3>
                    <p>You can choose from several building shapes:</p>
                    <ul>
                        <li><strong>Cube</strong>: Standard rectangular building</li>
                        <li><strong>Cylinder</strong>: Cylindrical building</li>
                        <li><strong>Cone</strong>: Conical building</li>
                        <li><strong>Pyramid</strong>: Pyramid building</li>
                        <li><strong>Sphere</strong>: Spherical building</li>
                        <li><strong>Pentagon</strong>: Pentagon-based building</li>
                        <li><strong>Hexagon</strong>: Hexagon-based building</li>
                        <li><strong>Octagon</strong>: Octagon-based building</li>
                    </ul>
                    
                    <h3>Building Properties</h3>
                    <p>For each building, you can adjust these properties:</p>
                    <ul>
                        <li><strong>Width</strong>: The width of the building</li>
                        <li><strong>Height</strong>: The height of the building</li>
                        <li><strong>Depth</strong>: The depth of the building</li>
                        <li><strong>Color</strong>: The color of the building</li>
                    </ul>
                    
                    <h3>Building Selection</h3>
                    <p>You can select buildings in two ways:</p>
                    <ol>
                        <li>Click directly on a building in the 3D scene</li>
                        <li>Choose a building from the dropdown menu</li>
                    </ol>
                    <p>When a building is selected, its properties are displayed in the control panel, and you can adjust them using the sliders and color picker.</p>
                    
                    <h3>City Settings</h3>
                    <p>You can also adjust overall city settings:</p>
                    <ul>
                        <li><strong>Number of Buildings</strong>: Controls how many buildings appear in the scene</li>
                        <li><strong>City Grid Size</strong>: Controls the size of the city grid</li>
                        <li><strong>Building Shapes</strong>: Sets the shape type for all buildings</li>
                        <li><strong>Reference Line Color</strong>: Changes the color of perspective reference lines</li>
                    </ul>
                `
            },
            'lighting': {
                title: 'Lighting Controls',
                content: `
                    <h2>Lighting Controls</h2>
                    <p>The 3D City Simulator provides comprehensive lighting controls to enhance visual understanding:</p>
                    
                    <h3>Lighting Modes</h3>
                    <p>Choose from several preset lighting modes:</p>
                    <ul>
                        <li><strong>Day</strong>: Bright daylight scene (default)</li>
                        <li><strong>Night</strong>: Dark night scene with building lights</li>
                        <li><strong>Sunset</strong>: Warm sunset lighting</li>
                        <li><strong>Studio</strong>: Neutral studio lighting for clear visualization</li>
                        <li><strong>Dramatic</strong>: High contrast dramatic lighting</li>
                    </ul>
                    
                    <h3>Light Properties</h3>
                    <p>Fine-tune lighting with these controls:</p>
                    <ul>
                        <li><strong>Shadows</strong>: Toggle shadows on/off</li>
                        <li><strong>Intensity</strong>: Adjust the brightness of lights</li>
                        <li><strong>Diffuse</strong>: Control how much light scatters in the scene</li>
                        <li><strong>Color</strong>: Change the color of the main light</li>
                    </ul>
                    
                    <h3>Adding Lights</h3>
                    <p>You can add additional lights to the scene:</p>
                    <ol>
                        <li>Click the "Add Light" button</li>
                        <li>A new point light will be added at a random position</li>
                        <li>The light is visualized as a small sphere</li>
                    </ol>
                    <p>This feature is particularly useful for creating custom lighting setups or highlighting specific buildings.</p>
                `
            },
            'visual-options': {
                title: 'Visual Options',
                content: `
                    <h2>Visual Options</h2>
                    <p>The 3D City Simulator includes several visual options to customize your view:</p>
                    
                    <h3>Show/Hide Elements</h3>
                    <p>Toggle the visibility of scene elements:</p>
                    <ul>
                        <li><strong>Show Vanishing Points</strong>: Display vanishing point markers</li>
                        <li><strong>Show Ground Grid</strong>: Display the ground grid</li>
                        <li><strong>Show Building Perspective Lines</strong>: Display lines connecting building corners to vanishing points</li>
                        <li><strong>Show Windows</strong>: Display windows on buildings</li>
                    </ul>
                    
                    <h3>Theme Settings</h3>
                    <p>The application supports both light and dark themes:</p>
                    <ul>
                        <li><strong>Light Theme</strong>: Bright interface with dark text</li>
                        <li><strong>Dark Theme</strong>: Dark interface with light text</li>
                    </ul>
                    <p>The theme button in the top-right corner toggles between these themes.</p>
                    
                    <h3>Interface Layout</h3>
                    <p>The interface is divided into several sections:</p>
                    <ul>
                        <li><strong>Canvas</strong>: The main 3D view on the left</li>
                        <li><strong>Control Panel</strong>: Settings and controls on the right</li>
                        <li><strong>Status Bar</strong>: Information about the selected building at the bottom</li>
                        <li><strong>Navigation Tools</strong>: Camera control buttons at the top</li>
                    </ul>
                    <p>Each section of the control panel can be collapsed or expanded by clicking the arrow button.</p>
                `
            },
            'tips': {
                title: 'Tips & Tricks',
                content: `
                    <h2>Tips & Tricks</h2>
                    <p>Here are some helpful tips to get the most out of the 3D City Simulator:</p>
                    
                    <h3>Understanding Perspective</h3>
                    <ul>
                        <li>Use the "Refresh Vanishing Points" button after moving the camera to see how perspective changes with viewpoint</li>
                        <li>Try switching between perspective types while keeping the camera in the same position</li>
                        <li>Notice how vanishing points move further apart as you zoom in, and closer together as you zoom out</li>
                    </ul>
                    
                    <h3>Efficient Navigation</h3>
                    <ul>
                        <li>Use keyboard shortcuts (Alt+T, Alt+P, Alt+D) to quickly switch between navigation tools</li>
                        <li>Double-click on a building to center the view on it</li>
                        <li>Use preset camera views as starting points, then fine-tune with navigation tools</li>
                    </ul>
                    
                    <h3>Visualization Techniques</h3>
                    <ul>
                        <li>Combine wireframe mode with different material properties to highlight structure</li>
                        <li>Use X-Ray mode to understand spatial relationships between buildings</li>
                        <li>Try dramatic lighting with silhouette mode for striking compositions</li>
                    </ul>
                    
                    <h3>Building Customization</h3>
                    <ul>
                        <li>Create a focal point by making one building significantly taller than others</li>
                        <li>Use contrasting colors to emphasize certain buildings</li>
                        <li>Mix different building shapes to create a more interesting skyline</li>
                    </ul>
                    
                    <h3>Performance Tips</h3>
                    <ul>
                        <li>If the application runs slowly, try reducing the number of buildings</li>
                        <li>Turning off shadows can improve performance on older computers</li>
                        <li>Close other applications when running the 3D City Simulator</li>
                    </ul>
                `
            },
            'about': {
                title: 'About',
                content: `
                    <h2>About 3D City Simulator</h2>
                    <p>The 3D City Simulator is an educational tool designed to help art students understand architectural perspective drawing through interactive 3D visualization.</p>
                    
                    <h3>Version Information</h3>
                    <p>Version: 2.0</p>
                    <p>Release Date: May 2025</p>
                    
                    <h3>Credits</h3>
                    <p>© 2025. Developed by Dineshkumar Rajendran, Lecturer at Old Dominion University.</p>
                    
                    <h3>Technologies Used</h3>
                    <ul>
                        <li>Three.js - 3D graphics library</li>
                        <li>TWEEN.js - Animation library</li>
                        <li>HTML5, CSS3, and JavaScript</li>
                    </ul>
                    
                    <h3>Acknowledgments</h3>
                    <p>Special thanks to:</p>
                    <ul>
                        <li>The Three.js community for their excellent documentation and examples</li>
                        <li>Old Dominion University for supporting educational tool development</li>
                        <li>Art students who provided valuable feedback during development</li>
                    </ul>
                    
                    <h3>Contact Information</h3>
                    <p>For questions, feedback, or support, please contact:</p>
                    <p>Dineshkumar Rajendran<br>
                    Lecturer, Old Dominion University<br>
                    Email: drajendran@odu.edu</p>
                `
            }
        };
    }
    
    /**
     * Initialize documentation manager
     */
    init() {
        this.setupEventListeners();
    }
    
    /**
     * Setup event listeners for documentation
     */
    setupEventListeners() {
        // Help button click
        const helpButton = document.getElementById('help-button');
        if (helpButton) {
            helpButton.addEventListener('click', () => this.showDocumentation());
        }
        
        // Close button click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-docs-btn')) {
                this.hideDocumentation();
            }
        });
        
        // Section navigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('docs-nav-link')) {
                const section = e.target.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                    
                    // Update active state
                    document.querySelectorAll('.docs-nav-link').forEach(link => {
                        link.classList.remove('active');
                    });
                    e.target.classList.add('active');
                }
            }
        });
    }
    
    /**
     * Show documentation overlay
     */
    showDocumentation() {
        // Create documentation container if it doesn't exist
        let docsContainer = document.getElementById('documentation-container');
        
        if (!docsContainer) {
            docsContainer = document.createElement('div');
            docsContainer.id = 'documentation-container';
            document.body.appendChild(docsContainer);
            
            // Create documentation content
            this.createDocumentationContent(docsContainer);
        }
        
        // Show documentation
        docsContainer.classList.add('visible');
        
        // Show first section by default
        this.showSection('introduction');
        
        // Set first nav item as active
        const firstNavLink = document.querySelector('.docs-nav-link');
        if (firstNavLink) {
            firstNavLink.classList.add('active');
        }
    }
    
    /**
     * Hide documentation overlay
     */
    hideDocumentation() {
        const docsContainer = document.getElementById('documentation-container');
        if (docsContainer) {
            docsContainer.classList.remove('visible');
        }
    }
    
    /**
     * Create documentation content
     * @param {HTMLElement} container - Container element
     */
    createDocumentationContent(container) {
        // Create documentation structure
        const html = `
            <div class="docs-overlay">
                <div class="docs-content">
                    <div class="docs-header">
                        <h1>3D City Simulator Documentation</h1>
                        <button class="close-docs-btn">×</button>
                    </div>
                    <div class="docs-body">
                        <div class="docs-nav">
                            ${this.createNavigation()}
                        </div>
                        <div class="docs-main">
                            ${this.createSections()}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add CSS
        this.addDocumentationStyles();
    }
    
    /**
     * Create navigation menu
     * @returns {string} Navigation HTML
     */
    createNavigation() {
        let navHtml = '<ul>';
        
        for (const [id, section] of Object.entries(this.sections)) {
            navHtml += `<li><a href="#" class="docs-nav-link" data-section="${id}">${section.title}</a></li>`;
        }
        
        navHtml += '</ul>';
        return navHtml;
    }
    
    /**
     * Create content sections
     * @returns {string} Sections HTML
     */
    createSections() {
        let sectionsHtml = '';
        
        for (const [id, section] of Object.entries(this.sections)) {
            sectionsHtml += `<div id="docs-section-${id}" class="docs-section">${section.content}</div>`;
        }
        
        return sectionsHtml;
    }
    
    /**
     * Show a specific documentation section
     * @param {string} sectionId - Section ID to show
     */
    showSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.docs-section').forEach(section => {
            section.style.display = 'none';
        });
        
        // Show requested section
        const section = document.getElementById(`docs-section-${sectionId}`);
        if (section) {
            section.style.display = 'block';
        }
    }
    
    /**
     * Add documentation styles
     */
    addDocumentationStyles() {
        // Check if styles already exist
        if (document.getElementById('docs-styles')) return;
        
        const styleEl = document.createElement('style');
        styleEl.id = 'docs-styles';
        
        styleEl.textContent = `
            #documentation-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: none;
            }
            
            #documentation-container.visible {
                display: block;
            }
            
            .docs-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
            }
            
            .docs-content {
                width: 90%;
                height: 90%;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }
            
            .docs-header {
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .docs-header h1 {
                margin: 0;
                font-size: 24px;
                color: #333;
            }
            
            .close-docs-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
            }
            
            .docs-body {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .docs-nav {
                width: 250px;
                border-right: 1px solid #eee;
                overflow-y: auto;
                padding: 20px 0;
            }
            
            .docs-nav ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .docs-nav li {
                margin-bottom: 5px;
            }
            
            .docs-nav-link {
                display: block;
                padding: 10px 20px;
                color: #333;
                text-decoration: none;
                border-left: 3px solid transparent;
                transition: all 0.2s;
            }
            
            .docs-nav-link:hover {
                background-color: #f5f5f5;
            }
            
            .docs-nav-link.active {
                border-left-color: #4285f4;
                background-color: #e8f0fe;
                color: #4285f4;
            }
            
            .docs-main {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
            }
            
            .docs-section {
                display: none;
            }
            
            .docs-section h2 {
                margin-top: 0;
                color: #333;
                border-bottom: 1px solid #eee;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            
            .docs-section h3 {
                margin-top: 30px;
                color: #444;
            }
            
            .docs-section p {
                line-height: 1.6;
                color: #555;
            }
            
            .docs-section ul, .docs-section ol {
                padding-left: 20px;
                line-height: 1.6;
                color: #555;
            }
            
            /* Dark theme support */
            .dark-theme #documentation-container .docs-content {
                background-color: #222;
                color: #eee;
            }
            
            .dark-theme #documentation-container .docs-header {
                border-bottom-color: #444;
            }
            
            .dark-theme #documentation-container .docs-header h1 {
                color: #eee;
            }
            
            .dark-theme #documentation-container .close-docs-btn {
                color: #aaa;
            }
            
            .dark-theme #documentation-container .docs-nav {
                border-right-color: #444;
            }
            
            .dark-theme #documentation-container .docs-nav-link {
                color: #ddd;
            }
            
            .dark-theme #documentation-container .docs-nav-link:hover {
                background-color: #333;
            }
            
            .dark-theme #documentation-container .docs-nav-link.active {
                background-color: #1a3c6e;
                color: #8ab4f8;
            }
            
            .dark-theme #documentation-container .docs-section h2 {
                color: #eee;
                border-bottom-color: #444;
            }
            
            .dark-theme #documentation-container .docs-section h3 {
                color: #ddd;
            }
            
            .dark-theme #documentation-container .docs-section p,
            .dark-theme #documentation-container .docs-section ul,
            .dark-theme #documentation-container .docs-section ol {
                color: #bbb;
            }
        `;
        
        document.head.appendChild(styleEl);
    }
}

// Export the DocumentationManager class
if (typeof module !== 'undefined') {
    module.exports = { DocumentationManager };
}

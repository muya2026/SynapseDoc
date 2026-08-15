/**
 * SynapseDoc - 3D Graph Engine Module
 * Handles Three.js scene, force-directed layout, and interactive visualizations
 */

const Graph3D = {
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    nodes: [],
    edges: [],
    nodeObjects: new Map(),
    edgeObjects: [],
    raycaster: null,
    mouse: null,
    hoveredNode: null,
    selectedNode: null,
    animationId: null,
    particles: null,
    
    // Force-directed layout parameters
    physics: {
        repulsion: 50,
        attraction: 0.01,
        damping: 0.9,
        gravity: 0.1,
        iterations: 100
    },
    
    /**
     * Initialize the 3D scene
     * @param {HTMLElement} container - DOM element to render into
     */
    init(container) {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050811);
        this.scene.fog = new THREE.FogExp2(0x050811, 0.02);
        
        // Camera setup
        const aspect = container.clientWidth / container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 30);
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(this.renderer.domElement);
        
        // OrbitControls
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 5;
        this.controls.maxDistance = 100;
        
        // Raycaster for hover detection
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0x00f3ff, 1, 100);
        pointLight1.position.set(20, 20, 20);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xff0055, 0.8, 100);
        pointLight2.position.set(-20, -20, 20);
        this.scene.add(pointLight2);
        
        // Background stars
        this.createStarfield();
        
        // Event listeners
        window.addEventListener('resize', () => this.onResize());
        container.addEventListener('mousemove', (e) => this.onMouseMove(e));
        container.addEventListener('click', (e) => this.onClick(e));
        
        // Start animation loop
        this.animate();
    },
    
    /**
     * Create starfield background
     */
    createStarfield() {
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        
        for (let i = 0; i < 2000; i++) {
            vertices.push(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        
        const material = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    },
    
    /**
     * Build graph from parsed data
     * @param {Array} nodes - Array of node objects
     * @param {Array} edges - Array of edge objects
     */
    buildGraph(nodes, edges) {
        // Clear existing graph
        this.clearGraph();
        
        this.nodes = nodes;
        this.edges = edges;
        
        // Apply force-directed layout
        this.applyForceDirectedLayout();
        
        // Create 3D objects
        this.createNodes();
        this.createEdges();
    },
    
    /**
     * Apply force-directed layout algorithm
     */
    applyForceDirectedLayout() {
        const width = 60;
        const height = 40;
        const depth = 20;
        
        // Initialize positions randomly within bounds
        this.nodes.forEach(node => {
            node.x = (Math.random() - 0.5) * width;
            node.y = (Math.random() - 0.5) * height;
            node.z = (Math.random() - 0.5) * depth;
            node.vx = 0;
            node.vy = 0;
            node.vz = 0;
        });
        
        // Run simulation iterations
        for (let iter = 0; iter < this.physics.iterations; iter++) {
            // Reset forces
            this.nodes.forEach(node => {
                node.fx = 0;
                node.fy = 0;
                node.fz = 0;
            });
            
            // Repulsion between all nodes
            for (let i = 0; i < this.nodes.length; i++) {
                for (let j = i + 1; j < this.nodes.length; j++) {
                    const nodeA = this.nodes[i];
                    const nodeB = this.nodes[j];
                    
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const dz = nodeB.z - nodeA.z;
                    
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
                    const force = this.physics.repulsion / (dist * dist);
                    
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    const fz = (dz / dist) * force;
                    
                    nodeA.fx -= fx;
                    nodeA.fy -= fy;
                    nodeA.fz -= fz;
                    
                    nodeB.fx += fx;
                    nodeB.fy += fy;
                    nodeB.fz += fz;
                }
            }
            
            // Attraction along edges
            this.edges.forEach(edge => {
                const source = this.nodes.find(n => n.id === edge.source);
                const target = this.nodes.find(n => n.id === edge.target);
                
                if (source && target) {
                    const dx = target.x - source.x;
                    const dy = target.y - source.y;
                    const dz = target.z - source.z;
                    
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.1;
                    const force = dist * this.physics.attraction;
                    
                    const fx = (dx / dist) * force;
                    const fy = (dy / dist) * force;
                    const fz = (dz / dist) * force;
                    
                    source.fx += fx;
                    source.fy += fy;
                    source.fz += fz;
                    
                    target.fx -= fx;
                    target.fy -= fy;
                    target.fz -= fz;
                }
            });
            
            // Apply forces and update positions
            this.nodes.forEach(node => {
                // Apply gravity toward center
                node.fx -= node.x * this.physics.gravity;
                node.fy -= node.y * this.physics.gravity;
                node.fz -= node.z * this.physics.gravity;
                
                // Update velocity
                node.vx = (node.vx + node.fx) * this.physics.damping;
                node.vy = (node.vy + node.fy) * this.physics.damping;
                node.vz = (node.vz + node.fz) * this.physics.damping;
                
                // Update position
                node.x += node.vx;
                node.y += node.vy;
                node.z += node.vz;
            });
        }
    },
    
    /**
     * Create 3D node objects
     */
    createNodes() {
        this.nodes.forEach(nodeData => {
            const style = Parser.getNodeStyle(nodeData.type);
            
            const geometry = new THREE.SphereGeometry(style.size, 32, 32);
            const material = new THREE.MeshStandardMaterial({
                color: style.color,
                emissive: style.emissive,
                emissiveIntensity: style.emissiveIntensity,
                metalness: 0.8,
                roughness: 0.2
            });
            
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(nodeData.x, nodeData.y, nodeData.z);
            sphere.userData = { nodeId: nodeData.id, nodeData: nodeData };
            
            // Add glow effect using a larger transparent sphere
            const glowGeometry = new THREE.SphereGeometry(style.size * 1.5, 16, 16);
            const glowMaterial = new THREE.MeshBasicMaterial({
                color: style.color,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide
            });
            const glow = new THREE.Mesh(glowGeometry, glowMaterial);
            sphere.add(glow);
            
            this.scene.add(sphere);
            this.nodeObjects.set(nodeData.id, sphere);
        });
    },
    
    /**
     * Create 3D edge objects (synapses)
     */
    createEdges() {
        this.edges.forEach(edge => {
            const sourceNode = this.nodes.find(n => n.id === edge.source);
            const targetNode = this.nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return;
            
            const sourcePos = new THREE.Vector3(sourceNode.x, sourceNode.y, sourceNode.z);
            const targetPos = new THREE.Vector3(targetNode.x, targetNode.y, targetNode.z);
            
            // Create cylinder for the synapse
            const direction = new THREE.Vector3().subVectors(targetPos, sourcePos);
            const length = direction.length();
            const orientation = new THREE.Matrix4();
            
            const geometry = new THREE.CylinderGeometry(0.05, 0.05, length, 8);
            const material = new THREE.MeshBasicMaterial({
                color: 0x00f3ff,
                transparent: true,
                opacity: 0.4
            });
            
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.copy(sourcePos).add(direction.multiplyScalar(0.5));
            cylinder.lookAt(targetPos);
            cylinder.rotateX(Math.PI / 2);
            cylinder.userData = { source: edge.source, target: edge.target };
            
            this.scene.add(cylinder);
            this.edgeObjects.push(cylinder);
            
            // Store reference for animation
            edge.mesh = cylinder;
            edge.sourcePos = sourcePos;
            edge.targetPos = targetPos;
        });
    },
    
    /**
     * Clear existing graph objects
     */
    clearGraph() {
        // Remove nodes
        this.nodeObjects.forEach((mesh, id) => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.nodeObjects.clear();
        
        // Remove edges
        this.edgeObjects.forEach(mesh => {
            this.scene.remove(mesh);
            mesh.geometry.dispose();
            mesh.material.dispose();
        });
        this.edgeObjects = [];
        
        this.nodes = [];
        this.edges = [];
    },
    
    /**
     * Handle mouse move for raycasting
     */
    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    },
    
    /**
     * Handle click events
     */
    onClick(event) {
        if (this.hoveredNode) {
            this.selectedNode = this.hoveredNode;
            this.triggerParticleBurst(this.hoveredNode);
        }
    },
    
    /**
     * Trigger particle burst effect on node
     */
    triggerParticleBurst(nodeMesh) {
        const position = nodeMesh.position.clone();
        const particleCount = 20;
        
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions.push(position.x, position.y, position.z);
            velocities.push(
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5,
                (Math.random() - 0.5) * 0.5
            );
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.userData = { velocities: velocities, age: 0 };
        
        const material = new THREE.PointsMaterial({
            color: 0x00f3ff,
            size: 0.3,
            transparent: true,
            opacity: 1
        });
        
        const particles = new THREE.Points(geometry, material);
        this.scene.add(particles);
        
        // Animate particles
        const animateParticles = () => {
            const positions = particles.geometry.attributes.position.array;
            const vels = particles.geometry.userData.velocities;
            particles.geometry.userData.age++;
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3] += vels[i * 3];
                positions[i * 3 + 1] += vels[i * 3 + 1];
                positions[i * 3 + 2] += vels[i * 3 + 2];
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            material.opacity = 1 - particles.geometry.userData.age / 50;
            
            if (particles.geometry.userData.age < 50) {
                requestAnimationFrame(animateParticles);
            } else {
                this.scene.remove(particles);
                geometry.dispose();
                material.dispose();
            }
        };
        
        animateParticles();
    },
    
    /**
     * Trigger action potential wave along synapse
     */
    triggerActionPotential(targetNodeId) {
        const targetNode = this.nodes.find(n => n.id === targetNodeId);
        if (!targetNode || !targetNode.parentId) return;
        
        const edge = this.edges.find(e => e.source === targetNode.parentId && e.target === targetNodeId);
        if (!edge || !edge.mesh) return;
        
        // Create pulse particle
        const pulseGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const pulseMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 1
        });
        
        const pulse = new THREE.Mesh(pulseGeometry, pulseMaterial);
        this.scene.add(pulse);
        
        const startPos = edge.sourcePos.clone();
        const endPos = edge.targetPos.clone();
        const duration = 30;
        let progress = 0;
        
        const animatePulse = () => {
            progress++;
            const t = progress / duration;
            
            pulse.position.lerpVectors(startPos, endPos, t);
            pulseMaterial.opacity = 1 - t;
            pulse.scale.setScalar(1 + t * 2);
            
            if (progress < duration) {
                requestAnimationFrame(animatePulse);
            } else {
                this.scene.remove(pulse);
                pulseGeometry.dispose();
                pulseMaterial.dispose();
            }
        };
        
        animatePulse();
    },
    
    /**
     * Animation loop
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Update controls
        this.controls.update();
        
        // Raycast for hover detection
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects([...this.nodeObjects.values()]);
        
        if (intersects.length > 0) {
            const firstHit = intersects[0].object;
            if (firstHit !== this.hoveredNode) {
                // Reset previous hover
                if (this.hoveredNode) {
                    this.hoveredNode.scale.setScalar(1);
                }
                
                this.hoveredNode = firstHit;
                this.hoveredNode.scale.setScalar(1.3);
                
                // Trigger effects
                const nodeId = firstHit.userData.nodeId;
                this.triggerActionPotential(nodeId);
                
                // Dispatch custom event for UI update
                window.dispatchEvent(new CustomEvent('nodeHover', {
                    detail: { nodeId, nodeData: firstHit.userData.nodeData }
                }));
            }
        } else {
            if (this.hoveredNode) {
                this.hoveredNode.scale.setScalar(1);
                this.hoveredNode = null;
                
                window.dispatchEvent(new CustomEvent('nodeUnhover'));
            }
        }
        
        // Rotate starfield slowly
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
        }
        
        // Render
        this.renderer.render(this.scene, this.camera);
    },
    
    /**
     * Handle window resize
     */
    onResize() {
        const container = this.renderer.domElement.parentElement;
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    },
    
    /**
     * Get screenshot as data URL
     */
    getScreenshot() {
        return this.renderer.domElement.toDataURL('image/png');
    },
    
    /**
     * Cleanup resources
     */
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.clearGraph();
        
        if (this.particles) {
            this.scene.remove(this.particles);
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
        
        this.renderer.dispose();
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Graph3D;
}

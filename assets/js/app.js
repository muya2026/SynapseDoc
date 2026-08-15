/**
 * SynapseDoc - Main Application Module
 * Handles UI interactions, presets, and export functionality
 */

const App = {
    currentMarkdown: '',
    
    // Preset templates
    presets: {
        api: `# API Specification

## Authentication Endpoints

### POST /api/auth/login
- Authenticates user credentials
- Returns JWT token
- Rate limited to 5 requests per minute

\`\`\`json
{
  "username": "string",
  "password": "string"
}
\`\`\`

### POST /api/auth/logout
- Invalidates current session
- Clears authentication cookies

## User Management

### GET /api/users
- Retrieves list of all users
- Supports pagination
- Requires admin role

### GET /api/users/:id
- Fetches single user by ID
- Returns 404 if not found

### POST /api/users
- Creates new user account
- Sends verification email

## Data Endpoints

### GET /api/data/export
- Exports user data in JSON format
- GDPR compliant

### DELETE /api/data/clear
- Permanently deletes user data
- Irreversible action`,
        
        roadmap: `# Project Roadmap

## Q1 2024 - Foundation

### Core Infrastructure
- Set up development environment
- Implement CI/CD pipeline
- Database schema design

### MVP Features
- User authentication system
- Basic dashboard interface
- Data import functionality

## Q2 2024 - Expansion

### Feature Development
- Advanced analytics module
- Real-time collaboration
- Mobile responsive design

### Performance Optimization
- Database query optimization
- Caching layer implementation
- CDN integration

## Q3 2024 - Scale

### Enterprise Features
- SSO integration
- Role-based access control
- Audit logging

### Internationalization
- Multi-language support
- Regional data centers
- Localized content

## Q4 2024 - Innovation

### AI Integration
- Machine learning insights
- Predictive analytics
- Automated recommendations

### Ecosystem
- Public API launch
- Developer documentation
- Partner integrations`,
        
        architecture: `# System Architecture

## Frontend Layer

### Client Application
- React-based SPA
- TypeScript for type safety
- Tailwind CSS styling

### State Management
- Redux for global state
- React Query for server state
- Local storage caching

## Backend Services

### API Gateway
- Request routing
- Rate limiting
- Authentication middleware

### Microservices
- User Service
- Content Service
- Analytics Service
- Notification Service

## Data Layer

### Primary Database
- PostgreSQL for relational data
- Read replicas for scaling
- Connection pooling

### Cache Layer
- Redis for session storage
- Memcached for query results
- CDN for static assets

## Infrastructure

### Cloud Platform
- AWS EC2 for compute
- S3 for object storage
- CloudFront for distribution

### Monitoring
- Prometheus metrics
- Grafana dashboards
- ELK stack logging

### Security
- WAF protection
- DDoS mitigation
- SSL/TLS encryption`
    },
    
    /**
     * Initialize the application
     */
    init() {
        // Initialize 3D graph
        const container = document.getElementById('canvas-container');
        Graph3D.init(container);
        
        // Load default preset
        this.loadPreset('api');
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Setup BCI HUD listeners
        this.setupBCIListeners();
    },
    
    /**
     * Setup DOM event listeners
     */
    setupEventListeners() {
        // Parse button
        document.getElementById('parse-btn').addEventListener('click', () => {
            this.parseAndRender();
        });
        
        // Export button
        document.getElementById('export-btn').addEventListener('click', () => {
            this.showExportModal('standalone');
        });
        
        // Embed button
        document.getElementById('embed-btn').addEventListener('click', () => {
            this.showExportModal('embed');
        });
        
        // Preset selector
        document.getElementById('preset-selector').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadPreset(e.target.value);
            }
        });
        
        // Toggle drawer
        document.getElementById('toggle-drawer').addEventListener('click', () => {
            const content = document.getElementById('drawer-content');
            content.classList.toggle('hidden');
        });
        
        // Modal close
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('export-modal').classList.add('hidden');
            document.getElementById('export-modal').classList.remove('flex');
        });
        
        // Copy export
        document.getElementById('copy-export').addEventListener('click', () => {
            const textarea = document.getElementById('export-output');
            textarea.select();
            document.execCommand('copy');
            
            const btn = document.getElementById('copy-export');
            const originalText = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        });
        
        // Close modal on backdrop click
        document.getElementById('export-modal').addEventListener('click', (e) => {
            if (e.target.id === 'export-modal') {
                document.getElementById('export-modal').classList.add('hidden');
                document.getElementById('export-modal').classList.remove('flex');
            }
        });
    },
    
    /**
     * Setup BCI HUD event listeners
     */
    setupBCIListeners() {
        window.addEventListener('nodeHover', (e) => {
            const { nodeData } = e.detail;
            this.showBCIHud(nodeData);
        });
        
        window.addEventListener('nodeUnhover', () => {
            this.hideBCIHud();
        });
    },
    
    /**
     * Load a preset template
     * @param {string} presetKey - Preset identifier
     */
    loadPreset(presetKey) {
        const preset = this.presets[presetKey];
        if (preset) {
            document.getElementById('markdown-input').value = preset;
            this.currentMarkdown = preset;
            this.parseAndRender();
        }
    },
    
    /**
     * Parse markdown and render graph
     */
    parseAndRender() {
        const markdown = document.getElementById('markdown-input').value;
        this.currentMarkdown = markdown;
        
        const graphData = Parser.parse(markdown);
        Graph3D.buildGraph(graphData.nodes, graphData.edges);
    },
    
    /**
     * Show BCI HUD with node data
     * @param {Object} nodeData - Node information
     */
    showBCIHud(nodeData) {
        const hud = document.getElementById('bci-hud');
        const content = document.getElementById('bci-content');
        
        let displayContent = nodeData.content;
        
        // Format code blocks
        if (nodeData.type === 'code') {
            displayContent = `<pre class="text-xs bg-[#0a0f1e] p-2 rounded mt-2">${nodeData.content}</pre>`;
        }
        
        content.innerHTML = `
            <div class="text-[#00f3ff] font-bold mb-1">${this.escapeHtml(nodeData.label)}</div>
            <div class="text-gray-300">${displayContent}</div>
            <div class="mt-2 text-xs text-gray-500">Type: ${nodeData.type}</div>
        `;
        
        hud.style.opacity = '1';
        hud.style.pointerEvents = 'auto';
    },
    
    /**
     * Hide BCI HUD
     */
    hideBCIHud() {
        const hud = document.getElementById('bci-hud');
        hud.style.opacity = '0';
        hud.style.pointerEvents = 'none';
    },
    
    /**
     * Show export modal
     * @param {string} type - Export type ('standalone' or 'embed')
     */
    showExportModal(type) {
        const modal = document.getElementById('export-modal');
        const title = document.getElementById('modal-title');
        const output = document.getElementById('export-output');
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        if (type === 'standalone') {
            title.textContent = 'Export Standalone HTML';
            output.value = this.generateStandaloneHTML();
        } else {
            title.textContent = 'Generate Embed Code';
            output.value = this.generateEmbedCode();
        }
    },
    
    /**
     * Generate standalone HTML file
     * @returns {string} Complete HTML document
     */
    generateStandaloneHTML() {
        const currentMD = this.currentMarkdown.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SynapseDoc - Neural Map</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"><\/script>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"><\/script>
    <style>
        :root { --neon-cyan: #00f3ff; --neon-magenta: #ff0055; --deep-space: #050811; --dark-panel: #0a0f1e; }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: var(--deep-space); color: white; overflow: hidden; }
        .glass-panel { background: rgba(10, 15, 30, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(0, 243, 255, 0.2); border-radius: 8px; }
        .cyberpunk-text { text-shadow: 0 0 5px rgba(0, 243, 255, 0.5), 0 0 10px rgba(0, 243, 255, 0.3); }
        .btn-neon { background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: all 0.3s; }
        .btn-neon:hover { background: var(--neon-cyan); color: var(--deep-space); box-shadow: 0 0 10px var(--neon-cyan); }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--dark-panel); }
        ::-webkit-scrollbar-thumb { background: var(--neon-cyan); border-radius: 4px; }
    </style>
</head>
<body class="bg-[#050811] text-white overflow-hidden">
    <header class="fixed top-0 left-0 right-0 z-50 p-4 text-center pointer-events-none">
        <h1 class="text-2xl font-bold cyberpunk-text">SynapseDoc <span class="text-[#00f3ff]">//</span> Neural Map</h1>
    </header>
    <div id="bci-hud" class="fixed top-16 right-4 z-50 w-72 opacity-0 transition-opacity duration-300 pointer-events-none">
        <div class="glass-panel p-3 border-l-4 border-[#00f3ff]">
            <div id="bci-content" class="text-sm text-gray-200"></div>
        </div>
    </div>
    <div id="canvas-container" class="w-full h-screen"></div>
    <script>
        const Parser = {
            parse(md) {
                const lines = md.split('\\n'), nodes = [], edges = [];
                let id = 0, headers = [], lastItem = null;
                for (let line of lines) {
                    const t = line.trim();
                    if (t.startsWith('# ')) {
                        const nid = 'n' + id++;
                        headers = [{id: nid, l: 1}];
                        nodes.push({id: nid, type: 'header1', label: t.slice(2), content: t.slice(2), level: 1, parentId: null});
                        lastItem = nid;
                    } else if (t.startsWith('## ')) {
                        const nid = 'n' + id++;
                        while (headers.length && headers[headers.length-1].l >= 2) headers.pop();
                        const pid = headers.length ? headers[headers.length-1].id : null;
                        headers.push({id: nid, l: 2});
                        nodes.push({id: nid, type: 'header2', label: t.slice(3), content: t.slice(3), level: 2, parentId: pid});
                        if (pid) edges.push({source: pid, target: nid});
                        lastItem = nid;
                    } else if (t.startsWith('### ')) {
                        const nid = 'n' + id++;
                        while (headers.length && headers[headers.length-1].l >= 3) headers.pop();
                        const pid = headers.length ? headers[headers.length-1].id : null;
                        headers.push({id: nid, l: 3});
                        nodes.push({id: nid, type: 'header3', label: t.slice(4), content: t.slice(4), level: 3, parentId: pid});
                        if (pid) edges.push({source: pid, target: nid});
                        lastItem = nid;
                    } else if (t.match(/^[-*+]\\s+/)) {
                        const nid = 'n' + id++;
                        const content = t.replace(/^[-*+]\\s+/, '');
                        const pid = lastItem || (headers.length ? headers[headers.length-1].id : null);
                        nodes.push({id: nid, type: 'listitem', label: content, content: content, level: 5, parentId: pid});
                        if (pid) edges.push({source: pid, target: nid});
                        lastItem = nid;
                    } else if (t.length > 0 && !t.startsWith('#')) {
                        const nid = 'n' + id++;
                        const pid = headers.length ? headers[headers.length-1].id : null;
                        nodes.push({id: nid, type: 'paragraph', label: t.substring(0, 40), content: t, level: 6, parentId: pid});
                        if (pid) edges.push({source: pid, target: nid});
                        lastItem = nid;
                    }
                }
                return {nodes, edges};
            },
            getNodeStyle(type) {
                const s = {
                    header1: {color: 0xff0055, size: 2.5, emissive: 0xff0055, emissiveIntensity: 0.8},
                    header2: {color: 0xff0055, size: 2.0, emissive: 0xff0055, emissiveIntensity: 0.6},
                    header3: {color: 0x00f3ff, size: 1.5, emissive: 0x00f3ff, emissiveIntensity: 0.5},
                    listitem: {color: 0x00f3ff, size: 0.8, emissive: 0x00f3ff, emissiveIntensity: 0.3},
                    paragraph: {color: 0x88ccff, size: 0.6, emissive: 0x88ccff, emissiveIntensity: 0.2}
                };
                return s[type] || s.paragraph;
            }
        };
        
        const Graph3D = {
            scene: null, camera: null, renderer: null, controls: null,
            nodes: [], edges: [], nodeObjects: new Map(), edgeObjects: [],
            raycaster: null, mouse: null, hoveredNode: null, particles: null,
            physics: {repulsion: 50, attraction: 0.01, damping: 0.9, gravity: 0.1, iterations: 100},
            
            init(container) {
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color(0x050811);
                this.scene.fog = new THREE.FogExp2(0x050811, 0.02);
                const aspect = container.clientWidth / container.clientHeight;
                this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
                this.camera.position.set(0, 0, 30);
                this.renderer = new THREE.WebGLRenderer({antialias: true});
                this.renderer.setSize(container.clientWidth, container.clientHeight);
                container.appendChild(this.renderer.domElement);
                this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
                this.controls.enableDamping = true;
                this.raycaster = new THREE.Raycaster();
                this.mouse = new THREE.Vector2();
                const al = new THREE.AmbientLight(0x404040, 0.5);
                this.scene.add(al);
                const pl1 = new THREE.PointLight(0x00f3ff, 1, 100);
                pl1.position.set(20, 20, 20);
                this.scene.add(pl1);
                this.createStarfield();
                window.addEventListener('resize', () => this.onResize());
                container.addEventListener('mousemove', (e) => this.onMouseMove(e));
                container.addEventListener('click', (e) => this.onClick(e));
                this.animate();
            },
            
            createStarfield() {
                const geo = new THREE.BufferGeometry(), verts = [];
                for (let i = 0; i < 2000; i++) verts.push((Math.random()-0.5)*200, (Math.random()-0.5)*200, (Math.random()-0.5)*200);
                geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
                const mat = new THREE.PointsMaterial({color: 0xffffff, size: 0.1, transparent: true, opacity: 0.8});
                this.particles = new THREE.Points(geo, mat);
                this.scene.add(this.particles);
            },
            
            buildGraph(nodes, edges) {
                this.clearGraph();
                this.nodes = nodes;
                this.edges = edges;
                this.applyForceDirectedLayout();
                this.createNodes();
                this.createEdges();
            },
            
            applyForceDirectedLayout() {
                const w=60, h=40, d=20;
                this.nodes.forEach(n => { n.x=(Math.random()-0.5)*w; n.y=(Math.random()-0.5)*h; n.z=(Math.random()-0.5)*d; n.vx=n.vy=n.vz=0; });
                for (let iter=0; iter<this.physics.iterations; iter++) {
                    this.nodes.forEach(n => { n.fx=n.fy=n.fz=0; });
                    for (let i=0; i<this.nodes.length; i++) {
                        for (let j=i+1; j<this.nodes.length; j++) {
                            const a=this.nodes[i], b=this.nodes[j];
                            const dx=b.x-a.x, dy=b.y-a.y, dz=b.z-a.z;
                            const dist=Math.sqrt(dx*dx+dy*dy+dz*dz)||0.1;
                            const f=this.physics.repulsion/(dist*dist);
                            const fx=(dx/dist)*f, fy=(dy/dist)*f, fz=(dz/dist)*f;
                            a.fx-=fx; a.fy-=fy; a.fz-=fz; b.fx+=fx; b.fy+=fy; b.fz+=fz;
                        }
                    }
                    this.edges.forEach(e => {
                        const s=this.nodes.find(n=>n.id===e.source), t=this.nodes.find(n=>n.id===e.target);
                        if(s&&t){const dx=t.x-s.x,dy=t.y-s.y,dz=t.z-s.z,dist=Math.sqrt(dx*dx+dy*dy+dz*dz)||0.1,f=dist*this.physics.attraction;const fx=(dx/dist)*f,fy=(dy/dist)*f,fz=(dz/dist)*f;s.fx+=fx;s.fy+=fy;s.fz+=fz;t.fx-=fx;t.fy-=fy;t.fz-=fz;}
                    });
                    this.nodes.forEach(n => { n.fx-=n.x*this.physics.gravity; n.fy-=n.y*this.physics.gravity; n.fz-=n.z*this.physics.gravity; n.vx=(n.vx+n.fx)*this.physics.damping; n.vy=(n.vy+n.fy)*this.physics.damping; n.vz=(n.vz+n.fz)*this.physics.damping; n.x+=n.vx; n.y+=n.vy; n.z+=n.vz; });
                }
            },
            
            createNodes() {
                this.nodes.forEach(nd => {
                    const st=Parser.getNodeStyle(nd.type);
                    const geo=new THREE.SphereGeometry(st.size,32,32);
                    const mat=new THREE.MeshStandardMaterial({color:st.color,emissive:st.emissive,emissiveIntensity:st.emissiveIntensity,metalness:0.8,roughness:0.2});
                    const mesh=new THREE.Mesh(geo,mat);
                    mesh.position.set(nd.x,nd.y,nd.z);
                    mesh.userData={nodeId:nd.id,nodeData:nd};
                    const gGeo=new THREE.SphereGeometry(st.size*1.5,16,16);
                    const gMat=new THREE.MeshBasicMaterial({color:st.color,transparent:true,opacity:0.15});
                    const glow=new THREE.Mesh(gGeo,gMat);
                    mesh.add(glow);
                    this.scene.add(mesh);
                    this.nodeObjects.set(nd.id,mesh);
                });
            },
            
            createEdges() {
                this.edges.forEach(e => {
                    const s=this.nodes.find(n=>n.id===e.source), t=this.nodes.find(n=>n.id===e.target);
                    if(!s||!t)return;
                    const sp=new THREE.Vector3(s.x,s.y,s.z), tp=new THREE.Vector3(t.x,t.y,t.z);
                    const dir=new THREE.Vector3().subVectors(tp,sp), len=dir.length();
                    const geo=new THREE.CylinderGeometry(0.05,0.05,len,8);
                    const mat=new THREE.MeshBasicMaterial({color:0x00f3ff,transparent:true,opacity:0.4});
                    const cyl=new THREE.Mesh(geo,mat);
                    cyl.position.copy(sp).add(dir.multiplyScalar(0.5));
                    cyl.lookAt(tp);
                    cyl.rotateX(Math.PI/2);
                    this.scene.add(cyl);
                    this.edgeObjects.push(cyl);
                    e.mesh=cyl; e.sourcePos=sp; e.targetPos=tp;
                });
            },
            
            clearGraph() {
                this.nodeObjects.forEach(m=>{this.scene.remove(m);m.geometry.dispose();m.material.dispose();});
                this.nodeObjects.clear();
                this.edgeObjects.forEach(m=>{this.scene.remove(m);m.geometry.dispose();m.material.dispose();});
                this.edgeObjects=[];
                this.nodes=[]; this.edges=[];
            },
            
            onMouseMove(e) {
                const r=this.renderer.domElement.getBoundingClientRect();
                this.mouse.x=((e.clientX-r.left)/r.width)*2-1;
                this.mouse.y=-((e.clientY-r.top)/r.height)*2+1;
            },
            
            onClick(e) {
                if(this.hoveredNode)this.triggerParticleBurst(this.hoveredNode);
            },
            
            triggerParticleBurst(mesh) {
                const pos=mesh.position.clone(), count=20;
                const geo=new THREE.BufferGeometry(), positions=[], velocities=[];
                for(let i=0;i<count;i++){positions.push(pos.x,pos.y,pos.z);velocities.push((Math.random()-0.5)*0.5,(Math.random()-0.5)*0.5,(Math.random()-0.5)*0.5);}
                geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));
                geo.userData={velocities:velocities,age:0};
                const mat=new THREE.PointsMaterial({color:0x00f3ff,size:0.3,transparent:true,opacity:1});
                const pts=new THREE.Points(geo,mat);
                this.scene.add(pts);
                const animate=()=>{const p=pts.geometry.attributes.position.array,v=pts.geometry.userData.velocities;pts.geometry.userData.age++;for(let i=0;i<count;i++){p[i*3]+=v[i*3];p[i*3+1]+=v[i*3+1];p[i*3+2]+=v[i*3+2];}pts.geometry.attributes.position.needsUpdate=true;mat.opacity=1-pts.geometry.userData.age/50;if(pts.geometry.userData.age<50)requestAnimationFrame(animate);else{this.scene.remove(pts);geo.dispose();mat.dispose();}};
                animate();
            },
            
            triggerActionPotential(nid) {
                const n=this.nodes.find(x=>x.id===nid);
                if(!n||!n.parentId)return;
                const e=this.edges.find(x=>x.source===n.parentId&&x.target===nid);
                if(!e||!e.mesh)return;
                const pGeo=new THREE.SphereGeometry(0.3,16,16), pMat=new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:1});
                const pulse=new THREE.Mesh(pGeo,pMat);
                this.scene.add(pulse);
                const sp=e.sourcePos.clone(), ep=e.targetPos.clone();
                let prog=0;
                const anim=()=>{prog++;const t=prog/30;pulse.position.lerpVectors(sp,ep,t);pMat.opacity=1-t;pulse.scale.setScalar(1+t*2);if(prog<30)requestAnimationFrame(anim);else{this.scene.remove(pulse);pGeo.dispose();pMat.dispose();}};
                anim();
            },
            
            animate() {
                requestAnimationFrame(()=>this.animate());
                this.controls.update();
                this.raycaster.setFromCamera(this.mouse,this.camera);
                const ints=this.raycaster.intersectObjects([...this.nodeObjects.values()]);
                if(ints.length>0){const h=ints[0].object;if(h!==this.hoveredNode){if(this.hoveredNode)this.hoveredNode.scale.setScalar(1);this.hoveredNode=h;this.hoveredNode.scale.setScalar(1.3);this.triggerActionPotential(h.userData.nodeId);window.dispatchEvent(new CustomEvent('nodeHover',{detail:{nodeId:h.userData.nodeId,nodeData:h.userData.nodeData}}));}}else{if(this.hoveredNode){this.hoveredNode.scale.setScalar(1);this.hoveredNode=null;window.dispatchEvent(new CustomEvent('nodeUnhover'));}}
                if(this.particles)this.particles.rotation.y+=0.0005;
                this.renderer.render(this.scene,this.camera);
            },
            
            onResize() {
                const c=this.renderer.domElement.parentElement;
                this.camera.aspect=c.clientWidth/c.clientHeight;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(c.clientWidth,c.clientHeight);
            }
        };
        
        window.addEventListener('nodeHover', e => {
            const {nodeData}=e.detail;
            const hud=document.getElementById('bci-hud'), content=document.getElementById('bci-content');
            content.innerHTML='<div class="text-[#00f3ff] font-bold mb-1">'+nodeData.label+'</div><div class="text-gray-300 text-xs">'+nodeData.content.substring(0,100)+'</div>';
            hud.style.opacity='1';
        });
        
        window.addEventListener('nodeUnhover', () => {
            const hud=document.getElementById('bci-hud');
            hud.style.opacity='0';
        });
        
        // Auto-load demo data
        const demoMarkdown = \`${currentMD}\`;
        const graphData = Parser.parse(demoMarkdown);
        
        window.addEventListener('load', () => {
            Graph3D.init(document.getElementById('canvas-container'));
            setTimeout(() => Graph3D.buildGraph(graphData.nodes, graphData.edges), 100);
        });
    <\/script>
</body>
</html>`;
    },
    
    /**
     * Generate embed code
     * @returns {string} iframe embed code
     */
    generateEmbedCode() {
        const repoUrl = window.location.origin + window.location.pathname;
        const baseUrl = repoUrl.endsWith('/') ? repoUrl.slice(0, -1) : repoUrl;
        
        return `<!-- SynapseDoc Neural Map Embed -->
<iframe 
    src="${baseUrl}/index.html" 
    width="100%" 
    height="600" 
    style="border: 1px solid #00f3ff; border-radius: 8px;"
    title="SynapseDoc Neural Map"
></iframe>

<!-- README Badge -->
[![View Neural Map](https://img.shields.io/badge/View-Neural%20Map-00f3ff?style=for-the-badge&logo=three.js)](${baseUrl}/)

<!-- SVG Preview Fallback -->
<a href="${baseUrl}/" target="_blank">
    <img src="https://via.placeholder.com/800x400/050811/00f3ff?text=Neural+Map+Preview" alt="Neural Map Preview" style="border-radius: 8px;">
</a>`;
    },
    
    /**
     * Escape HTML special characters
     * @param {string} str - String to escape
     * @returns {string} Escaped string
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

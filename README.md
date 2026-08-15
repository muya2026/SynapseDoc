# 🧠 SynapseDoc: Markdown-to-Synapse Node Map

> Convert dense, dry project documentation into interactive, bioluminescent 3D neural network maps for your GitHub READMEs.

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-00f3ff?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Built with Three.js](https://img.shields.io/badge/Built%20With-Three.js-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-ff0055.svg?style=for-the-badge)](LICENSE)

---

## ⚡ Live Demo

🔗 **Experience the Neural Map:** https://muya2026.github.io/SynapseDoc

---

## 🚀 Features

* **Instant Markdown Conversion:** Parses `# Headers`, `- Bullet points`, and `` `code` `` into structural 3D neural topologies.
* **Brain-Computer Interface (BCI) Hover Hook:** Hover over any node to trigger action potential waves (electrical pulses) flowing through synapses.
* **Force-Directed 3D Physics:** Automatically balances hubs, pathways, and leaf nodes without structural overlapping.
* **Zero-Build GitHub Pages Deployment:** Built entirely with static HTML5, WebGL, and JavaScript. No build step or node server required.
* **Embed Ready:** Export interactive iframe code blocks or SVG previews directly into your project's `README.md`.

---

## 🛠️ Visual Architecture

| Element | Markdown Source | Neural Mapping Representation |
| :--- | :--- | :--- |
| **Brain Centers** | `# Header 1` / `## Header 2` | Major glowing hub nodes (Magenta) |
| **Synapses** | List items & sub-lists | Glowing directional connection pathways (Cyan) |
| **Data Nodes** | Text content / Code blocks | Bio-luminescent leaf nodes (White/Blue) |
| **Action Potential** | Hover / Selection | Animated electric current traveling up the pathway |

---

## 📦 Deployment Instructions (GitHub Pages)

1. **Fork or Clone this repository:**
   ```bash
   git clone https://github.com/muya2026/SynapseDoc.git
   cd SynapseDoc
   ```

2. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial SynapseDoc setup"
   git push origin main
   ```

3. **Enable GitHub Pages:**
   - Go to Repository Settings → Pages
   - Select source: `main` branch → `/ (root)`
   - Save and wait for deployment

4. **Access Your Neural Map:**
   - 🔗 **Live Demo:** https://muya2026.github.io/SynapseDoc

---

## 📊 Understanding the Neural Map (Infographics)

### Visual Legend

```
┌─────────────────────────────────────────────────────────────────┐
│                    SYNAPSE DOC VISUAL GUIDE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🟣 MAGENTA SPHERE (Large)     →  Main Topic / Chapter (H1/H2) │
│       │                              "Brain Center"             │
│       │                                                        │
│       ├─── 🔵 CYAN LINE ─────→  Connection / Relationship      │
│       │        │                  "Synapse Pathway"            │
│       │        │                                               │
│       │        └─── 🔵 CYAN SPHERE (Medium) → Sub-topic (H3/H4)│
│       │                                "Neural Node"           │
│       │                                                        │
│       └─── ⚪ WHITE DOT (Small)   →  Detail / Code / Note      │
│                                 "Data Point"                   │
│                                                                 │
│  ✨ PULSING GLOW               →  Active / Hovered Node        │
│  ⚡ FLOWING PARTICLES          →  Data Flow Animation          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### How to Read the Map

1. **Start from the Center**: The largest magenta spheres represent your main document sections (H1/H2 headers)
2. **Follow the Connections**: Cyan lines show relationships between topics
3. **Explore the Details**: Smaller nodes contain specific information, code snippets, or notes
4. **Hover to Interact**: Click or hover on any node to see its full content in the BCI display

### Example Structure

```markdown
# API Documentation        →  🟣 Large Magenta Hub (Center)
│
├── Authentication         →  🔵 Medium Cyan Node (Connected)
│   ├── OAuth 2.0         →  ⚪ Small White Dot (Leaf)
│   └── API Keys          →  ⚪ Small White Dot (Leaf)
│
└── Endpoints             →  🔵 Medium Cyan Node (Connected)
    ├── GET /users        →  ⚪ Small White Dot (Leaf)
    └── POST /data        →  ⚪ Small White Dot (Leaf)
```

Becomes:
```
        🟣 API Documentation
        │
    ┌───┴───┐
    │       │
   🔵       🔵
Authentication  Endpoints
    │           │
  ┌─┴─┐       ┌─┴─┐
  ⚪ ⚪       ⚪ ⚪
```

### Node Hierarchy Diagram

```
Level 1 (H1/H2)          Level 2 (H3/H4)         Level 3 (Details)
     🟣                       🔵                      ⚪
   Large Sphere           Medium Sphere           Small Dot
   (Brain Center)         (Neural Node)          (Data Point)
       │                      │                      
       ├──────────────────────┤                      
       │                      │                      
    ┌──┴──┐                ┌──┴──┐                   
    │     │                │     │                   
   🔵    🔵              ⚪     ⚪                  
```

---

## 🎮 Controls

| Action | Control | Purpose |
| :--- | :--- | :--- |
| **Rotate View** | Left Mouse Button + Drag | Explore the 3D space around the neural map |
| **Zoom** | Scroll Wheel | Get closer to see details or farther for overview |
| **Pan** | Right Mouse Button + Drag | Move the camera position without rotating |
| **Select Node** | Hover over node | Highlight node and show content in BCI HUD |
| **Activate Node** | Click on node | Trigger particle burst and action potential wave |
| **Reset Camera** | Double Click | Return to default view position |

---

## 📁 Project Structure

```
.
├── index.html              # Main application entry point
├── assets/
│   ├── css/
│   │   └── style.css       # Cyberpunk theme styles
│   └── js/
│       ├── app.js          # Application logic & UI handlers
│       ├── parser.js       # Markdown-to-graph parser
│       └── graph3d.js      # Three.js 3D engine
├── presets/
│   └── sample.md           # Sample markdown documentation
├── README.md               # This file
└── LICENSE                 # MIT License
```

---

## 🔌 Integration Examples

### Embed in Your README

```markdown
<!-- Add this to your project README.md -->
[![View Neural Map](https://img.shields.io/badge/View-Neural%20Map-00f3ff?style=for-the-badge&logo=three.js)](https://muya2026.github.io/SynapseDoc/)
```

### Use as Documentation Viewer

1. Paste your Markdown documentation into the left panel
2. Click "Parse to Neural Map"
3. Explore your documentation as an interactive 3D network
4. Use "Export Standalone HTML" for a shareable version

### Quick Start Example

```markdown
# My Project Documentation

## Installation
- Clone the repository
- Run npm install
- Start the server

## API Reference
### GET /users
Returns a list of all users.

### POST /data
Creates a new data entry.
```

Paste this markdown into SynapseDoc and watch it transform into:
- 🟣 **My Project Documentation** (Central magenta hub)
- 🔵 **Installation** & **API Reference** (Connected cyan nodes)
- ⚪ Individual steps and endpoints (Small white data points)

---

## 🎨 Theme Customization

Edit `assets/css/style.css` to customize:

```css
:root {
    --neon-cyan: #00f3ff;      /* Node color */
    --neon-magenta: #ff0055;   /* Header hub color */
    --deep-space: #050811;     /* Background color */
    --dark-panel: #0a0f1e;     /* Panel background */
}
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Credits & Acknowledgments

### Created by
- **Developer**: [muya2026](https://github.com/muya2026)
- **Project**: SynapseDoc - Markdown Neural Mapper
- **Live Demo**: https://muya2026.github.io/SynapseDoc
- **Repository**: https://github.com/muya2026/SynapseDoc

### Technologies Used
- **[Three.js](https://threejs.org/)** - 3D Graphics Engine (r128)
- **[Marked.js](https://marked.js.org/)** - Markdown Parser
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS Framework
- **[OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)** - Camera Controls

### Inspiration
- Brain-Computer Interface (BCI) visualization concepts
- Cyberpunk and biotech aesthetic design
- Force-directed graph layout algorithms
- Developer documentation visualization needs

### License
MIT License - See [LICENSE](LICENSE) file for details

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📬 Contact

- **GitHub**: [@muya2026](https://github.com/muya2026)
- **Project Link**: https://github.com/muya2026/SynapseDoc
- **Live Demo**: https://muya2026.github.io/SynapseDoc

---

<div align="center">

**Made with ❤️ by muya2026**

*SynapseDoc v1.0 - Transforming documentation into neural experiences*

![Stars](https://img.shields.io/github/stars/muya2026/SynapseDoc?style=for-the-badge&color=00f3ff)
![License](https://img.shields.io/github/license/muya2026/SynapseDoc?style=for-the-badge&color=ff0055)

</div>

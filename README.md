# 🧠 SynapseDoc: Markdown-to-Synapse Node Map

> Convert dense, dry project documentation into interactive, bioluminescent 3D neural network maps for your GitHub READMEs.

[![Deploy to GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-00f3ff?style=for-the-badge&logo=github)](https://pages.github.com/)
[![Built with Three.js](https://img.shields.io/badge/Built%20With-Three.js-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-ff0055.svg?style=for-the-badge)](LICENSE)

---

## ⚡ Live Demo

🔗 **Experience the Neural Map:** `https://<your-username>.github.io/<repository-name>/`

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
   git clone https://github.com/<your-username>/<repository-name>.git
   cd <repository-name>
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
   - Visit: `https://<your-username>.github.io/<repository-name>/`

---

## 🎮 Controls

| Action | Control |
| :--- | :--- |
| Rotate View | Left Mouse Button + Drag |
| Zoom | Scroll Wheel |
| Pan | Right Mouse Button + Drag |
| Select Node | Hover over node |
| Activate Node | Click on node |

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
[![View Neural Map](https://img.shields.io/badge/View-Neural%20Map-00f3ff?style=for-the-badge&logo=three.js)](https://<your-username>.github.io/<repository-name>/)
```

### Use as Documentation Viewer

1. Paste your Markdown documentation into the left panel
2. Click "Parse to Neural Map"
3. Explore your documentation as an interactive 3D network
4. Use "Export Standalone HTML" for a shareable version

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

## 🙏 Acknowledgments

* [Three.js](https://threejs.org/) - 3D graphics library
* [Marked.js](https://marked.js.org/) - Markdown parser
* [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

<div align="center">

**Built with ❤️ for the developer community**

*SynapseDoc v1.0*

</div>

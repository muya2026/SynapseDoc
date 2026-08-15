# SynapseDoc Sample Documentation

## Getting Started

### Installation
- Clone the repository
- Install dependencies with npm install
- Run the development server

### Configuration
- Copy .env.example to .env
- Update database credentials
- Set API keys for external services

```javascript
const config = {
  database: 'postgresql://localhost:5432/synapsedoc',
  port: 3000,
  debug: true
};
```

## Core Features

### Neural Visualization
- Real-time 3D rendering
- Interactive node selection
- Dynamic force-directed layout

### Markdown Parsing
- Header hierarchy detection
- List item processing
- Code block extraction

### Export Options
- Standalone HTML generation
- Embed code creation
- Screenshot capture

## Advanced Usage

### Custom Styling
- Modify CSS variables
- Adjust node colors
- Configure animation speeds

### Performance Tuning
- Limit node count for large docs
- Adjust physics iterations
- Optimize render quality

## API Reference

### Parser Methods
- parse(markdown) - Convert MD to graph
- getNodeStyle(type) - Get visual config

### Graph3D Methods
- init(container) - Setup scene
- buildGraph(nodes, edges) - Render data
- clearGraph() - Reset visualization

## Troubleshooting

### Common Issues
- Nodes overlapping excessively
- Performance degradation with large graphs
- Browser compatibility concerns

### Solutions
- Increase repulsion force in physics config
- Reduce iteration count for faster layout
- Use WebGL-compatible browsers

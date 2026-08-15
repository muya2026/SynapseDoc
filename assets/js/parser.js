/**
 * SynapseDoc - Markdown Parser Module
 * Converts Markdown text into a structured graph representation
 */

const Parser = {
    /**
     * Parse raw Markdown into a graph structure
     * @param {string} markdown - Raw Markdown text
     * @returns {Object} Graph data with nodes and edges
     */
    parse(markdown) {
        const lines = markdown.split('\n');
        const nodes = [];
        const edges = [];
        const nodeMap = new Map();
        
        let currentNodeId = 0;
        let headerStack = []; // Track header hierarchy
        let lastListItem = null;
        let inCodeBlock = false;
        let codeBlockContent = [];
        let codeBlockParent = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmedLine = line.trim();
            
            // Handle code blocks
            if (trimmedLine.startsWith('```')) {
                if (inCodeBlock) {
                    // End of code block
                    const codeText = codeBlockContent.join('\n');
                    const codeNodeId = `node_${currentNodeId++}`;
                    
                    nodes.push({
                        id: codeNodeId,
                        type: 'code',
                        label: 'Code Block',
                        content: codeText,
                        level: headerStack.length > 0 ? headerStack[headerStack.length - 1].level : 0,
                        parentId: headerStack.length > 0 ? headerStack[headerStack.length - 1].id : null
                    });
                    
                    if (headerStack.length > 0) {
                        edges.push({
                            source: headerStack[headerStack.length - 1].id,
                            target: codeNodeId
                        });
                    }
                    
                    codeBlockContent = [];
                    codeBlockParent = null;
                    inCodeBlock = false;
                } else {
                    inCodeBlock = true;
                }
                continue;
            }
            
            if (inCodeBlock) {
                codeBlockContent.push(line);
                continue;
            }
            
            // Handle Headers H1
            if (trimmedLine.startsWith('# ')) {
                const title = trimmedLine.slice(2).trim();
                const nodeId = `node_${currentNodeId++}`;
                
                headerStack = [{ id: nodeId, level: 1 }];
                
                nodes.push({
                    id: nodeId,
                    type: 'header1',
                    label: title,
                    content: title,
                    level: 1,
                    parentId: null
                });
                
                lastListItem = nodeId;
                continue;
            }
            
            // Handle Headers H2
            if (trimmedLine.startsWith('## ')) {
                const title = trimmedLine.slice(3).trim();
                const nodeId = `node_${currentNodeId++}`;
                
                // Pop headers until we find H1 or empty
                while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= 2) {
                    headerStack.pop();
                }
                
                const parentId = headerStack.length > 0 ? headerStack[headerStack.length - 1].id : null;
                headerStack.push({ id: nodeId, level: 2 });
                
                nodes.push({
                    id: nodeId,
                    type: 'header2',
                    label: title,
                    content: title,
                    level: 2,
                    parentId: parentId
                });
                
                if (parentId) {
                    edges.push({ source: parentId, target: nodeId });
                }
                
                lastListItem = nodeId;
                continue;
            }
            
            // Handle Headers H3
            if (trimmedLine.startsWith('### ')) {
                const title = trimmedLine.slice(4).trim();
                const nodeId = `node_${currentNodeId++}`;
                
                // Pop headers until we find H2 or lower
                while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= 3) {
                    headerStack.pop();
                }
                
                const parentId = headerStack.length > 0 ? headerStack[headerStack.length - 1].id : null;
                headerStack.push({ id: nodeId, level: 3 });
                
                nodes.push({
                    id: nodeId,
                    type: 'header3',
                    label: title,
                    content: title,
                    level: 3,
                    parentId: parentId
                });
                
                if (parentId) {
                    edges.push({ source: parentId, target: nodeId });
                }
                
                lastListItem = nodeId;
                continue;
            }
            
            // Handle Headers H4
            if (trimmedLine.startsWith('#### ')) {
                const title = trimmedLine.slice(5).trim();
                const nodeId = `node_${currentNodeId++}`;
                
                // Pop headers until we find H3 or lower
                while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= 4) {
                    headerStack.pop();
                }
                
                const parentId = headerStack.length > 0 ? headerStack[headerStack.length - 1].id : null;
                headerStack.push({ id: nodeId, level: 4 });
                
                nodes.push({
                    id: nodeId,
                    type: 'header4',
                    label: title,
                    content: title,
                    level: 4,
                    parentId: parentId
                });
                
                if (parentId) {
                    edges.push({ source: parentId, target: nodeId });
                }
                
                lastListItem = nodeId;
                continue;
            }
            
            // Handle List Items
            const listMatch = trimmedLine.match(/^(\s*)[-*+]\s+(.+)/);
            if (listMatch) {
                const indent = listMatch[1].length;
                const content = listMatch[2].trim();
                const listLevel = Math.floor(indent / 2);
                
                const nodeId = `node_${currentNodeId++}`;
                
                // Find parent based on indentation
                let parentId = lastListItem;
                
                // If we're at root level list, connect to current header
                if (listLevel === 0 && headerStack.length > 0) {
                    parentId = headerStack[headerStack.length - 1].id;
                }
                
                nodes.push({
                    id: nodeId,
                    type: 'listitem',
                    label: content,
                    content: content,
                    level: 5 + listLevel,
                    parentId: parentId
                });
                
                if (parentId) {
                    edges.push({ source: parentId, target: nodeId });
                }
                
                lastListItem = nodeId;
                continue;
            }
            
            // Handle Paragraphs (non-empty lines that aren't headers or lists)
            if (trimmedLine.length > 0 && !trimmedLine.startsWith('#') && !trimmedLine.startsWith('-') && !trimmedLine.startsWith('*') && !trimmedLine.startsWith('+')) {
                const nodeId = `node_${currentNodeId++}`;
                const parentId = headerStack.length > 0 ? headerStack[headerStack.length - 1].id : null;
                
                nodes.push({
                    id: nodeId,
                    type: 'paragraph',
                    label: trimmedLine.substring(0, 50) + (trimmedLine.length > 50 ? '...' : ''),
                    content: trimmedLine,
                    level: 6,
                    parentId: parentId
                });
                
                if (parentId) {
                    edges.push({ source: parentId, target: nodeId });
                }
                
                lastListItem = nodeId;
            }
        }
        
        return { nodes, edges };
    },
    
    /**
     * Get node type styling info
     * @param {string} type - Node type
     * @returns {Object} Styling configuration
     */
    getNodeStyle(type) {
        const styles = {
            header1: {
                color: 0xff0055,
                size: 2.5,
                emissive: 0xff0055,
                emissiveIntensity: 0.8
            },
            header2: {
                color: 0xff0055,
                size: 2.0,
                emissive: 0xff0055,
                emissiveIntensity: 0.6
            },
            header3: {
                color: 0x00f3ff,
                size: 1.5,
                emissive: 0x00f3ff,
                emissiveIntensity: 0.5
            },
            header4: {
                color: 0x00f3ff,
                size: 1.2,
                emissive: 0x00f3ff,
                emissiveIntensity: 0.4
            },
            listitem: {
                color: 0x00f3ff,
                size: 0.8,
                emissive: 0x00f3ff,
                emissiveIntensity: 0.3
            },
            paragraph: {
                color: 0x88ccff,
                size: 0.6,
                emissive: 0x88ccff,
                emissiveIntensity: 0.2
            },
            code: {
                color: 0x00ff88,
                size: 0.7,
                emissive: 0x00ff88,
                emissiveIntensity: 0.4
            }
        };
        
        return styles[type] || styles.paragraph;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Parser;
}

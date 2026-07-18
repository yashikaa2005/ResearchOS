import { useState, useEffect, useRef } from "react";
import { Loader, RefreshCw } from "lucide-react";
import { getKnowledgeGraph } from "../../services/insight.service";

const KnowledgeGraph = ({ projectId }) => {
  const [nodes, setNodes] = useState([]);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [draggedNode, setDraggedNode] = useState(null);
  const svgRef = useRef(null);

  const width = 800;
  const height = 450;

  const fetchGraphData = async () => {
    setLoading(true);
    try {
      const res = await getKnowledgeGraph(projectId);
      const graph = res.data || { nodes: [], links: [] };

      // Initialize positions in a circle/random layout
      const initializedNodes = graph.nodes.map((node, i) => {
        const angle = (i / graph.nodes.length) * 2 * Math.PI;
        const radius = node.type === "paper" ? 80 : 160;
        return {
          ...node,
          x: width / 2 + radius * Math.cos(angle) + (Math.random() - 0.5) * 20,
          y: height / 2 + radius * Math.sin(angle) + (Math.random() - 0.5) * 20,
        };
      });

      // Run a simple force layout simulation for 150 iterations
      // to spread nodes out naturally
      let tempNodes = [...initializedNodes];
      const linkMap = graph.links.map(l => ({
        source: tempNodes.find(n => n.id === l.source),
        target: tempNodes.find(n => n.id === l.target)
      })).filter(l => l.source && l.target);

      for (let step = 0; step < 260; step++) {
        // 1. Repulsion force between all nodes
        for (let i = 0; i < tempNodes.length; i++) {
          const n1 = tempNodes[i];
          n1.fx = 0;
          n1.fy = 0;

          // Gravity pull to center (reduced strength to let them spread)
          const dxCenter = width / 2 - n1.x;
          const dyCenter = height / 2 - n1.y;
          n1.fx += dxCenter * 0.004;
          n1.fy += dyCenter * 0.004;

          for (let j = 0; j < tempNodes.length; j++) {
            if (i === j) continue;
            const n2 = tempNodes[j];
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const distSq = Math.max(30, dx * dx + dy * dy);
            const dist = Math.sqrt(distSq);
            // Repulsion check with larger radius and much stronger force
            if (dist < 220) {
              const force = 18000 / distSq;
              n1.fx += (dx / dist) * force;
              n1.fy += (dy / dist) * force;
            }
          }
        }

        // 2. Attraction force along links
        for (let k = 0; k < linkMap.length; k++) {
          const link = linkMap[k];
          const dx = link.target.x - link.source.x;
          const dy = link.target.y - link.source.y;
          const dist = Math.max(5, Math.sqrt(dx * dx + dy * dy));
          const desiredDist = 130; // Increased spacing
          const kForce = 0.04; // spring constant
          const force = (dist - desiredDist) * kForce;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          link.source.fx += fx;
          link.source.fy += fy;
          link.target.fx -= fx;
          link.target.fy -= fy;
        }

        // 3. Update positions with damping
        for (let i = 0; i < tempNodes.length; i++) {
          const node = tempNodes[i];
          node.x += node.fx;
          node.y += node.fy;

          // Constrain within bounds (increased padding to prevent labels getting cut off)
          node.x = Math.max(50, Math.min(width - 50, node.x));
          node.y = Math.max(40, Math.min(height - 50, node.y));
        }
      }

      setNodes(tempNodes);
      setLinks(graph.links);
    } catch (err) {
      console.error("Failed to fetch knowledge graph data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchGraphData();
    }
  }, [projectId]);

  // Drag handlers
  const handleMouseDown = (node, e) => {
    e.preventDefault();
    setDraggedNode(node.id);
  };

  const handleMouseMove = (e) => {
    if (!draggedNode || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    setNodes((prev) =>
      prev.map((n) => (n.id === draggedNode ? { ...n, x, y } : n))
    );
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  // Determine if a link or node is highlighted
  const isConnected = (nodeId) => {
    if (!hoveredNode) return true;
    if (nodeId === hoveredNode) return true;
    return links.some(
      (l) =>
        (l.source === hoveredNode && l.target === nodeId) ||
        (l.target === hoveredNode && l.source === nodeId)
    );
  };

  const isLinkHighlighted = (link) => {
    if (!hoveredNode) return false;
    return link.source === hoveredNode || link.target === hoveredNode;
  };

  if (loading) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
        <Loader className="w-6 h-6 text-accent animate-spin mb-2" />
        <span className="text-xs text-muted-foreground">Constructing Graph Representation...</span>
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-card">
        <span className="text-sm text-muted-foreground">No concepts extracted yet. Upload papers to build the graph.</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
      {/* Legend & Refresh */}
      <div className="absolute top-4 left-4 bg-secondary/80 backdrop-blur-sm border border-border p-3 rounded-lg flex flex-col gap-1.5 z-10 text-[10px] text-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          <span>Papers (Blue)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
          <span>Extracted Concepts (Purple)</span>
        </div>
        <span className="text-muted-foreground mt-1">Drag nodes to rearrange</span>
      </div>

      <button
        onClick={fetchGraphData}
        className="absolute top-4 right-4 bg-secondary/80 hover:bg-secondary border border-border p-2 rounded-lg z-10 text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
        title="Recalculate Graph Layout"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full bg-card/45 select-none"
      >
        {/* Draw Links */}
        <g>
          {links.map((link, i) => {
            const sourceNode = nodes.find((n) => n.id === link.source);
            const targetNode = nodes.find((n) => n.id === link.target);
            if (!sourceNode || !targetNode) return null;

            const highlighted = isLinkHighlighted(link);
            const fade = hoveredNode && !highlighted;

            return (
              <line
                key={i}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={highlighted ? "var(--accent)" : "var(--border)"}
                strokeWidth={highlighted ? 2 : 1}
                strokeOpacity={fade ? 0.15 : highlighted ? 0.95 : 0.45}
                transition="stroke 0.2s"
              />
            );
          })}
        </g>

        {/* Draw Nodes */}
        <g>
          {nodes.map((node) => {
            const active = isConnected(node.id);
            const isHovered = hoveredNode === node.id;
            const size = node.type === "paper" ? 14 : 10;
            const nodeColor = node.type === "paper" ? "#3b82f6" : "#a855f7";

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onMouseDown={(e) => handleMouseDown(node, e)}
                className="cursor-grab active:cursor-grabbing transition-opacity"
                opacity={active ? 1 : 0.25}
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={size + (isHovered ? 2 : 0)}
                  fill={nodeColor}
                  stroke="var(--card)"
                  strokeWidth={2}
                  className="transition-all duration-150 shadow"
                />
                <text
                  x={node.x}
                  y={node.y + size + 14}
                  textAnchor="middle"
                  fill="var(--foreground)"
                  fontSize={isHovered ? 10 : 8}
                  fontWeight={isHovered ? "bold" : "normal"}
                  className="pointer-events-none transition-all duration-150"
                >
                  {node.label.length > 20 ? `${node.label.substring(0, 18)}...` : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};

export default KnowledgeGraph;

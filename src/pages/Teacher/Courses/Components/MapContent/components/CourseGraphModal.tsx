import React, { useEffect } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import dagre from "dagre";
import { X, BookOpen } from "lucide-react";
import "../style/CourseGraphModal.css";

interface GraphLesson {
  id: string;
  title: string;
  section_id?: string;
}

interface GraphRelation {
  parent_id: string;
  child_id: string;
  type: "PREREQUISITE" | "RELATED" | "REMEDIAL";
}

interface CourseGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessons: GraphLesson[];
  relations: GraphRelation[];
  courseTitle?: string;
}

const nodeWidth = 250;
const nodeHeight = 60;

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({ rankdir: "TB", ranksep: 80, nodesep: 50 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

const getEdgeStyle = (type: string) => {
  switch (type) {
    case "PREREQUISITE":
      return { color: "#2563eb", label: "", strokeDash: "0" }; // Blue
    case "REMEDIAL":
      return { color: "#ea580c", label: "Bổ trợ", strokeDash: "0" }; // Orange
    case "RELATED":
    default:
      return { color: "#9333ea", label: "Liên quan", strokeDash: "5,5" }; // Purple
  }
};

const CourseGraphModal: React.FC<CourseGraphModalProps> = ({
  isOpen,
  onClose,
  lessons,
  relations,
  courseTitle = "Lộ trình khóa học",
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  useEffect(() => {
    if (isOpen) {
      const initialNodes: Node[] = lessons.map((lesson) => ({
        id: lesson.id,
        data: { label: lesson.title },
        position: { x: 0, y: 0 },
        type: "default",
        className: "cgm-node",
      }));

      const initialEdges: Edge[] = relations.map((rel, index) => {
        const styleConfig = getEdgeStyle(rel.type);

        return {
          id: `e-${index}`,
          source: rel.parent_id,
          target: rel.child_id,
          type: "smoothstep",
          animated: rel.type === "PREREQUISITE",

          style: {
            stroke: styleConfig.color,
            strokeWidth: 2,
            strokeDasharray: styleConfig.strokeDash,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: styleConfig.color,
          },
          label: styleConfig.label,
          labelStyle: {
            fill: styleConfig.color,
            fontWeight: 600,
            fontSize: 11,
          },
          labelBgStyle: { fill: "#ffffff", fillOpacity: 0.8 },
        };
      });

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodes, initialEdges);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
    }
  }, [isOpen, lessons, relations, setNodes, setEdges]);

  if (!isOpen) return null;

  return (
    <div className="cgm-overlay">
      <div className="cgm-container">
        <div className="cgm-header">
          <div className="flex items-center gap-3">
            <div className="cgm-icon-box">
              <BookOpen size={20} />
            </div>
            <div>
              <h3 className="cgm-title">{courseTitle}</h3>
              <p className="cgm-subtitle">Sơ đồ quan hệ các bài học</p>
            </div>
          </div>
          <button onClick={onClose} className="cgm-close-btn">
            <X size={24} />
          </button>
        </div>

        <div className="cgm-body">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <MiniMap
              nodeColor="#e2e8f0"
              maskColor="rgba(240, 240, 240, 0.6)"
              style={{ border: "1px solid #e2e8f0" }}
            />
            <Controls showInteractive={false} />
            <Background gap={16} size={1} color="#e5e7eb" />

            <div className="cgm-legend">
              <div className="cgm-legend-item">
                <span className="cgm-line blue"></span> Điều kiện tiên quyết
              </div>
              <div className="cgm-legend-item">
                <span className="cgm-line orange"></span> Bài học bổ trợ
              </div>
              <div className="cgm-legend-item">
                <span className="cgm-line purple dashed"></span> Bài học liên
                quan
              </div>
            </div>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
};

export default CourseGraphModal;

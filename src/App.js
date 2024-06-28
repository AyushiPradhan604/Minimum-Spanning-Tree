import React, { useState } from 'react';
import './App.css';
import { primMST } from './utils/helper'; // Ensure you have your MST function here
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

const App = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newEdge, setNewEdge] = useState({ from: '', to: '', weight: '' });

  const handleAddNode = () => {
    const newNodeId = nodes.length;
    const newNode = { id: newNodeId, value: newNodeId, x: 50, y: 50 };
    setNodes([...nodes, newNode]);
  };

  const handleMouseDown = (index, event) => {
    event.stopPropagation();
    const startX = event.clientX;
    const startY = event.clientY;

    const handleMouseMove = (moveEvent) => {
      const newX = nodes[index].x + (moveEvent.clientX - startX);
      const newY = nodes[index].y + (moveEvent.clientY - startY);
      const updatedNodes = nodes.map((node, i) =>
        i === index ? { ...node, x: newX, y: newY } : node
      );
      setNodes(updatedNodes);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEdge({ ...newEdge, [name]: value });
  };

  const handleAddEdge = (e) => {
    e.preventDefault();
    const { from, to, weight } = newEdge;
    if (from !== '' && to !== '' && weight !== '') {
      const edge = {
        from: parseInt(from, 10),
        to: parseInt(to, 10),
        weight: parseInt(weight, 10),
      };
      setEdges([...edges, edge]);
      setNewEdge({ from: '', to: '', weight: '' });

      // Update nodes if new ones are introduced
      const nodeIds = new Set(nodes.map((node) => node.id));
      const newNodes = [];
      if (!nodeIds.has(edge.from)) {
        newNodes.push({ id: edge.from, value: edge.from, x: 50, y: 50 });
      }
      if (!nodeIds.has(edge.to)) {
        newNodes.push({ id: edge.to, value: edge.to, x: 100, y: 100 });
      }
      setNodes([...nodes, ...newNodes]);
    }
  };

  const handleMST = () => {
    let edgesList = edges.map((obj) => [obj.from, obj.to, obj.weight]);
    let mstEdges = primMST(nodes.length, edgesList);

    // Map the MST edges to match the representation in the code
    let filteredEdges = mstEdges.map((edge) => ({
      from: edge[0],
      to: edge[1],
      weight: edge[2],
    }));

    setEdges(filteredEdges);
  };

  return (
    <div>
      <button
        className="btn btn-primary m-2"
        onClick={handleAddNode}
      >
        Add Node
      </button>
      <form onSubmit={handleAddEdge}>
        <div className="custom-form">
          <input
            className="form-control m-2"
            type="number"
            name="from"
            placeholder="From Node ID"
            value={newEdge.from}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-control m-2"
            type="number"
            name="to"
            placeholder="To Node ID"
            value={newEdge.to}
            onChange={handleInputChange}
            required
          />
          <input
            className="form-control m-2"
            type="number"
            name="weight"
            placeholder="Edge Weight"
            value={newEdge.weight}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          className="btn btn-primary m-2"
          type="submit"
        >
          Add Edge
        </button>
      </form>
      <div
        className="container"
        onMouseDown={(e) => e.preventDefault()}
      >
        {edges.map((edge, index) => {
          const fromNode = nodes.find((node) => node.id === edge.from);
          const toNode = nodes.find((node) => node.id === edge.to);

          if (!fromNode || !toNode) return null;

          return (
            <svg
              key={index}
              className="line"
            >
              <line
                x1={fromNode.x + 25}
                y1={fromNode.y + 25}
                x2={toNode.x + 25}
                y2={toNode.y + 25}
                stroke="red"
                strokeWidth="2"
              />
              <text
                x={(fromNode.x + toNode.x) / 2 + 25}
                y={(fromNode.y + toNode.y) / 2 + 25}
                textAnchor="middle"
                alignmentBaseline="middle"
                fill="black"
              >
                {edge.weight}
              </text>
            </svg>
          );
        })}
        {nodes.map((node, index) => (
          <div
            key={index}
            onMouseDown={(e) => handleMouseDown(index, e)}
            className="node"
            style={{
              left: node.x,
              top: node.y,
            }}
          >
            {node.value}
          </div>
        ))}
      </div>
      <button
        className="btn btn-primary m-2"
        onClick={handleMST}
      >
        Find Minimum Spanning Tree
      </button>
    </div>
  );
};

export default App;

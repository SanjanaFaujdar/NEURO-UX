import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import { useNeuro } from "../context/NeuroProvider";
import { motion } from 'framer-motion';

const initialNodes = [
  { id: 'Home', position: { x: 250, y: 0 }, data: { label: '🏠 Home' }, style: { backgroundColor: '#dcfce3', border: '2px solid #22c55e' } },
  { id: 'Products', position: { x: 100, y: 120 }, data: { label: '📦 Products' }, style: { backgroundColor: '#fff' } },
  { id: 'Profile', position: { x: 400, y: 120 }, data: { label: '👤 Profile' }, style: { backgroundColor: '#fff' } },
  { id: 'HoneyPot', position: { x: 250, y: -100 }, data: { label: '⚠️ /api/admin/debug' }, style: { backgroundColor: '#fee2e2', border: '2px solid #ef4444' } },
];

const initialEdges = [
  { id: 'e1', source: 'Home', target: 'Products', animated: true },
  { id: 'e2', source: 'Home', target: 'Profile', animated: true },
  { id: 'e3', source: 'Home', target: 'HoneyPot', animated: true, style: { stroke: '#ef4444' } },
];

export function AdminPanel() {
  const { suspicionScore } = useNeuro();
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [eventStream, setEventStream] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newEvent = {
        id: Date.now(),
        type: suspicionScore > 0.7 ? 'ANOMALY' : 'INFO',
        severity: suspicionScore > 0.7 ? 'warning' : 'success',
        message: suspicionScore > 0.7 ? 'Suspicious behavior detected' : 'Normal activity',
        timestamp: new Date().toLocaleTimeString(),
      };
      setEventStream((prev) => [newEvent, ...prev].slice(0, 10));
    }, 2000);
    return () => clearInterval(interval);
  }, [suspicionScore]);

  return (
    <div className="h-screen w-full flex bg-gray-50">
      <div className="w-2/3 h-full p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">God-View: Realtime DAG</h2>
        <div className="bg-white border rounded-xl shadow-lg h-[500px]">
          <ReactFlow nodes={nodes} edges={edges} fitView>
            <Background color="#ccc" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <div className="w-1/3 h-full flex flex-col bg-gray-900 text-green-400 font-mono shadow-2xl overflow-hidden">
        <motion.div className="p-4 border-b border-gray-700" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl font-bold">🧠 Threat Cortex</h2>
        </motion.div>
        <motion.div className="p-4 border-b border-gray-700" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-sm text-gray-400 mb-2">Suspicion Score</div>
          <div className={`text-5xl font-bold ${suspicionScore > 0.8 ? 'text-red-500' : suspicionScore > 0.5 ? 'text-yellow-500' : 'text-green-500'}`}>
            {(suspicionScore * 100).toFixed(1)}%
          </div>
        </motion.div>
        <motion.div className="p-4 border-b border-gray-700 grid grid-cols-2 gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="bg-gray-800 p-3 rounded">
            <div className="text-xs text-gray-400">Status</div>
            <div className={`font-bold ${suspicionScore > 0.8 ? 'text-red-400' : 'text-green-400'}`}>
              {suspicionScore > 0.8 ? '🚨 ALERT' : '✅ SAFE'}
            </div>
          </div>
        </motion.div>
        <div className="flex-1 flex flex-col bg-gray-800 overflow-hidden border-b border-gray-700">
          <div className="p-2 bg-gray-900 border-b border-gray-700">
            <h3 className="text-xs font-bold text-cyan-400">📡 EVENT STREAM</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {eventStream.length === 0 ? (
              <div className="text-gray-500 text-xs">Waiting for events...</div>
            ) : (
              eventStream.map((event) => (
                <motion.div key={event.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`text-xs p-2 rounded border-l-2 ${event.severity === 'warning' ? 'border-yellow-500 text-yellow-300 bg-yellow-900 bg-opacity-20' : 'border-green-500 text-green-300 bg-green-900 bg-opacity-20'}`}>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">[{event.type}]</span>
                    <span className="text-gray-500">{event.timestamp}</span>
                  </div>
                  <div className="text-xs">{event.message}</div>
                </motion.div>
              ))
            )}
          </div>
        </div>
        <div className="p-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-500">
          <div>Events: {eventStream.length}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuro } from "../context/NeuroProvider";
import { Bell, AlertCircle, Zap, Eye } from 'lucide-react';

/**
 * AdminAnalytics.jsx - Phase 3 God-Mode Visuals
 * 
 * Features:
 * - Live heatmap visualization (click, hover, scroll)
 * - Ghost cursor tracking (user mouse movements)
 * - Alert center (suspicion spikes)
 * - Stress metrics dashboard
 */

export function AdminAnalytics() {
  const { suspicionScore } = useNeuro();
  const canvasRef = useRef(null);
  const [heatmapData, setHeatmapData] = useState(null);
  const [ghostCursor, setGhostCursor] = useState({ x: 0, y: 0 });
  const [alerts, setAlerts] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapType, setHeatmapType] = useState('click'); // 'click', 'hover', 'scroll'
  const [debugMode, setDebugMode] = useState(false);
  const prevSuspicionRef = useRef(suspicionScore);

  // ========================================================================
  // 1. HEATMAP RENDERING (Canvas-based)
  // ========================================================================

  useEffect(() => {
    if (!canvasRef.current || !heatmapData) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
    ctx.fillRect(0, 0, width, height);

    // Get heatmap grid for current type
    const grid = heatmapData[`${heatmapType}_heatmap`] || [];
    if (grid.length === 0) return;

    const cellWidth = width / grid[0].length;
    const cellHeight = height / grid.length;

    // Render heatmap cells with color gradient
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const intensity = grid[row][col] / 100; // Normalized 0-1

        // Color gradient: blue (cold) → yellow (warm) → red (hot)
        let color;
        if (intensity < 0.33) {
          // Blue to cyan
          color = `rgba(59, 130, 246, ${intensity * 1.5})`;
        } else if (intensity < 0.66) {
          // Cyan to yellow
          color = `rgba(234, 179, 8, ${intensity})`;
        } else {
          // Yellow to red
          color = `rgba(239, 68, 68, ${intensity})`;
        }

        ctx.fillStyle = color;
        ctx.fillRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);

        // Optional: Draw grid
        ctx.strokeStyle = 'rgba(100, 100, 100, 0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(col * cellWidth, row * cellHeight, cellWidth, cellHeight);
      }
    }

    // Draw legend
    drawHeatmapLegend(ctx, width, height);
  }, [heatmapData, heatmapType]);

  // ========================================================================
  // 2. GHOST CURSOR ANIMATION
  // ========================================================================

  useEffect(() => {
    // Simulate ghost cursor following user movements
    const interval = setInterval(() => {
      // Get random position from heatmap hot zones
      if (heatmapData) {
        const grid = heatmapData[`${heatmapType}_heatmap`];
        if (grid && grid.length > 0) {
          // Find hottest cells
          let hotCells = [];
          for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
              if (grid[r][c] > 50) {
                hotCells.push({ r, c, intensity: grid[r][c] });
              }
            }
          }

          if (hotCells.length > 0) {
            // Pick a random hot cell
            const cell = hotCells[Math.floor(Math.random() * hotCells.length)];
            const x = (cell.c + 0.5) * (canvasRef.current?.width / grid[0].length || 100);
            const y = (cell.r + 0.5) * (canvasRef.current?.height / grid.length || 100);

            setGhostCursor({ x, y });
          }
        }
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [heatmapData, heatmapType]);

  // ========================================================================
  // 3. ALERT CENTER (Suspicion Spikes)
  // ========================================================================

  useEffect(() => {
    // Trigger alert if suspicion score jumps >0.15
    if (suspicionScore - prevSuspicionRef.current > 0.15) {
      const newAlert = {
        id: Date.now(),
        level: suspicionScore > 0.8 ? 'danger' : 'warning',
        title: suspicionScore > 0.8 ? '🚨 THREAT DETECTED' : '⚠️ Suspicion Spike',
        message: `Score jumped from ${prevSuspicionRef.current.toFixed(2)} to ${suspicionScore.toFixed(2)}`,
        timestamp: new Date().toLocaleTimeString(),
      };

      setAlerts((prev) => [newAlert, ...prev].slice(0, 5)); // Keep last 5 alerts

      // Auto-dismiss after 5 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
      }, 5000);
    }

    prevSuspicionRef.current = suspicionScore;
  }, [suspicionScore]);

  // ========================================================================
  // 4. FETCH METRICS & HEATMAP DATA
  // ========================================================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In real app, fetch from WebSocket or API
        // socket.emit('request_admin_data', {}, (data) => {
        //   setHeatmapData(data.heatmap);
        //   setMetrics(data.metrics);
        // });

        // Mock data for demo
        setHeatmapData({
          click_heatmap: Array(20)
            .fill(0)
            .map(() =>
              Array(40)
                .fill(0)
                .map(() => Math.random() * 100)
            ),
          hover_heatmap: Array(20)
            .fill(0)
            .map(() =>
              Array(40)
                .fill(0)
                .map(() => Math.random() * 80)
            ),
          scroll_heatmap: Array(20)
            .fill(0)
            .map(() =>
              Array(40)
                .fill(0)
                .map(() => Math.random() * 60)
            ),
          total_events: Math.floor(Math.random() * 5000) + 1000,
        });

        setMetrics({
          active_sessions: Math.floor(Math.random() * 100) + 10,
          events_per_second: (Math.random() * 100).toFixed(1),
          avg_prediction_time_ms: (Math.random() * 30 + 10).toFixed(2),
          bot_detection_rate: (Math.random() * 15 + 5).toFixed(1),
          blacklisted_sessions: Math.floor(Math.random() * 10),
        });
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    const interval = setInterval(fetchData, 2000);
    fetchData();

    return () => clearInterval(interval);
  }, []);

  // ========================================================================
  // HELPER: Draw heatmap legend
  // ========================================================================

  const drawHeatmapLegend = (ctx, width, height) => {
    const legendX = width - 150;
    const legendY = 20;
    const legendWidth = 130;
    const legendHeight = 100;

    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);

    // Gradient bar
    const gradient = ctx.createLinearGradient(legendX + 10, legendY + 20, legendX + 10, legendY + 70);
    gradient.addColorStop(0, 'rgb(59, 130, 246)'); // Blue
    gradient.addColorStop(0.5, 'rgb(234, 179, 8)'); // Yellow
    gradient.addColorStop(1, 'rgb(239, 68, 68)'); // Red

    ctx.fillStyle = gradient;
    ctx.fillRect(legendX + 10, legendY + 20, 20, 50);

    // Labels
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.font = '10px monospace';
    ctx.fillText('Cold', legendX + 35, legendY + 30);
    ctx.fillText('Hot', legendX + 35, legendY + 70);
    ctx.fillText(`Events: ${heatmapData?.total_events || 0}`, legendX + 10, legendY + 90);
  };

  // ========================================================================
  // RENDER
  // ========================================================================

  return (
    <div className="h-screen w-full flex flex-col bg-slate-900 text-white font-mono">
      {/* Header */}
      <motion.div
        className="border-b border-slate-700 p-4 flex justify-between items-center bg-slate-800"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <Zap className="text-yellow-400" size={24} />
          <h1 className="text-2xl font-bold">God-Mode Analytics</h1>
          <span className="text-xs text-slate-400">Phase 3 Real-Time Monitoring</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setDebugMode(!debugMode)}
            className={`px-3 py-1 rounded text-sm font-mono transition ${
              debugMode ? 'bg-amber-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {debugMode ? '🔍 Debug ON' : '🔍 Debug OFF'}
          </button>

          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1 rounded text-sm font-mono transition ${
              showHeatmap ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            {showHeatmap ? '🔥 Heatmap ON' : '🔥 Heatmap OFF'}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left: Heatmap Canvas */}
        {showHeatmap && (
          <motion.div
            className="flex-1 flex flex-col bg-slate-800 rounded-lg border border-slate-700 overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="border-b border-slate-700 p-3 flex gap-2">
              <button
                onClick={() => setHeatmapType('click')}
                className={`px-3 py-1 text-xs rounded ${
                  heatmapType === 'click'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Clicks
              </button>
              <button
                onClick={() => setHeatmapType('hover')}
                className={`px-3 py-1 text-xs rounded ${
                  heatmapType === 'hover'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Hovers
              </button>
              <button
                onClick={() => setHeatmapType('scroll')}
                className={`px-3 py-1 text-xs rounded ${
                  heatmapType === 'scroll'
                    ? 'bg-red-600 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                Scrolls
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="w-full h-full"
              />

              {/* Ghost Cursor */}
              <motion.div
                className="absolute w-6 h-6 pointer-events-none"
                animate={{ x: ghostCursor.x - 12, y: ghostCursor.y - 12 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-full h-full border-2 border-cyan-400 rounded-full animate-pulse" />
                <div className="absolute w-1 h-1 bg-cyan-400 top-1/2 left-1/2 rounded-full" />
              </motion.div>
            </div>

            <div className="border-t border-slate-700 p-2 text-xs text-slate-400">
              <span>👻 Ghost Cursor tracking user movements</span>
              <span className="ml-4">📊 Total Events: {heatmapData?.total_events || 0}</span>
            </div>
          </motion.div>
        )}

        {/* Right: Alerts & Metrics */}
        <motion.div
          className="w-80 flex flex-col gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {/* Alert Center */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-700">
              <Bell size={18} className="text-yellow-400" />
              <h2 className="font-bold text-sm">Alert Center</h2>
              <span className="ml-auto text-xs bg-red-900 text-red-200 px-2 py-1 rounded">
                {alerts.length} active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <div className="text-xs text-slate-500 text-center py-4">
                    💚 No alerts - System healthy
                  </div>
                ) : (
                  alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-2 rounded text-xs border-l-4 ${
                        alert.level === 'danger'
                          ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-200'
                          : 'bg-yellow-900 bg-opacity-30 border-yellow-500 text-yellow-200'
                      }`}
                    >
                      <div className="font-bold">{alert.title}</div>
                      <div className="text-xs opacity-80">{alert.message}</div>
                      <div className="text-xs opacity-60">{alert.timestamp}</div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Metrics Dashboard */}
          {metrics && (
            <motion.div
              className="bg-slate-800 rounded-lg border border-slate-700 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h2 className="font-bold text-sm mb-3 pb-3 border-b border-slate-700 flex items-center gap-2">
                <Eye size={16} className="text-cyan-400" />
                System Metrics
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Sessions:</span>
                  <span className="text-green-400 font-mono">
                    {metrics.active_sessions}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Events/Second:</span>
                  <span className="text-blue-400 font-mono">
                    {metrics.events_per_second}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Avg Pred Time:</span>
                  <span className="text-cyan-400 font-mono">
                    {metrics.avg_prediction_time_ms}ms
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Bot Detection:</span>
                  <span className="text-red-400 font-mono">
                    {metrics.bot_detection_rate}%
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Blacklisted:</span>
                  <span className="text-red-500 font-mono">
                    {metrics.blacklisted_sessions}
                  </span>
                </div>

                {debugMode && (
                  <div className="mt-3 pt-3 border-t border-slate-600 text-xs text-amber-400 space-y-1">
                    <div>Debug: Suspicion = {suspicionScore.toFixed(3)}</div>
                    <div>Debug: Session Cache Hit Rate = 98.5%</div>
                    <div>Debug: ML Accuracy = 92%</div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default AdminAnalytics;

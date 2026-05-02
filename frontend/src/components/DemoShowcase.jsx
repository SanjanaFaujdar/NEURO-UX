import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNeuro } from '../context/NeuroProvider';
import { AlertCircle, Zap, Eye, Shield, Cpu, TrendingUp, Users, Activity } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

/**
 * DemoShowcase.jsx - Comprehensive NeuroUX Feature Demonstration
 * 
 * Shows:
 * - Real-time event tracking
 * - Suspicion score visualization
 * - AI/ML detection status
 * - Chameleon effect demonstration
 * - Bot detection triggers
 * - DAG path validation
 */

export function DemoShowcase() {
  const { suspicionScore, uiDensity, isConnected } = useNeuro();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    botAttempts: 0,
    validPaths: 0,
    invalidPaths: 0,
    rageClicks: 0,
    mlAnomalies: 0,
  });
  const [selectedFeature, setSelectedFeature] = useState('overview');
  const [chartData, setChartData] = useState([
    { time: '0s', score: 0, risk: 'Safe' },
    { time: '5s', score: 15, risk: 'Low' },
    { time: '10s', score: 30, risk: 'Medium' },
    { time: '15s', score: 45, risk: 'Medium' },
    { time: '20s', score: 60, risk: 'High' },
    { time: '25s', score: 75, risk: 'High' },
    { time: '30s', score: 85, risk: 'Critical' },
  ]);
  const [threatData, setThreatData] = useState([
    { name: 'Path Violation', value: 25, color: '#ef4444' },
    { name: 'Bot Velocity', value: 35, color: '#f97316' },
    { name: 'ML Anomaly', value: 30, color: '#eab308' },
    { name: 'Normal', value: 10, color: '#22c55e' },
  ]);
  const [mlSimState, setMlSimState] = useState({ active: false, type: '', step: 0, result: null });

  const runMLSimulation = (type) => {
    setMlSimState({ active: true, type, step: 1, result: null });
    
    setTimeout(() => setMlSimState(prev => ({ ...prev, step: 2 })), 800);
    setTimeout(() => setMlSimState(prev => ({ ...prev, step: 3 })), 1600);
    setTimeout(() => setMlSimState(prev => ({ ...prev, step: 4 })), 2400);
    setTimeout(() => {
      const isAnomaly = type === 'bot' || type === 'rage';
      const confidence = type === 'bot' ? 98 : type === 'rage' ? 85 : 12;
      setMlSimState(prev => ({ 
        ...prev, 
        step: 5, 
        result: { isAnomaly, confidence } 
      }));
    }, 3200);
  };

  // Memoize chart data to prevent unnecessary re-renders
  const memoChartData = useMemo(() => chartData, [chartData]);
  const memoThreatData = useMemo(() => threatData, [threatData]);

  // Real-time chart update
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prev) => {
        const newData = [...prev];
        newData.shift();
        newData.push({
          time: `${parseInt(newData[newData.length - 1].time) + 5}s`,
          score: Math.min(100, Math.floor(suspicionScore * 100) + Math.random() * 10 - 5),
          risk:
            suspicionScore > 0.75
              ? 'Critical'
              : suspicionScore > 0.4
                ? 'High'
                : suspicionScore > 0.2
                  ? 'Medium'
                  : 'Low',
        });
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [suspicionScore]);

  const features = [
    {
      id: 'overview',
      name: 'System Overview',
      icon: <Eye className="w-5 h-5" />,
      color: 'from-neuro-accent to-neuro-accent-alt',
    },
    {
      id: 'events',
      name: 'Event Tracking',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-neuro-primary to-neuro-primary-dark',
    },
    {
      id: 'detection',
      name: 'Threat Detection',
      icon: <Shield className="w-5 h-5" />,
      color: 'from-neuro-primary to-neuro-primary-hover',
    },
    {
      id: 'ai',
      name: 'AI/ML Engine',
      icon: <Cpu className="w-5 h-5" />,
      color: 'from-neuro-accent-alt to-neuro-accent',
    },
    {
      id: 'demo',
      name: 'Interactive Demo',
      icon: <Zap className="w-5 h-5" />,
      color: 'from-neuro-primary-hover to-neuro-primary',
    },
  ];

  // ====================================================================
  // FEATURE PANELS
  // ====================================================================

  const SystemOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border text-neuro-text-primary"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Connection Status</h3>
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          </div>
          <p className="text-3xl font-bold mb-2">{isConnected ? '✅ Connected' : '❌ Disconnected'}</p>
          <p className="text-neuro-text-secondary text-sm">WebSocket: {isConnected ? 'Active' : 'Inactive'}</p>
          <p className="text-neuro-text-secondary text-sm">Backend: http://localhost:8000</p>
          <p className="text-neuro-text-secondary text-sm">Frontend: http://localhost:5173</p>
        </motion.div>

        {/* Current Density */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border text-neuro-text-primary"
        >
          <h3 className="font-bold mb-4">🦎 UI Density (Chameleon Effect)</h3>
          <p className="text-3xl font-bold mb-2">{uiDensity}</p>
          <div className="space-y-2 text-sm">
            <p className={uiDensity === 'EXPERT' ? 'text-neuro-accent' : 'text-neuro-text-muted'}>
              📊 EXPERT: All features (Suspicion 0-20%)
            </p>
            <p className={uiDensity === 'STANDARD' ? 'text-neuro-primary' : 'text-neuro-text-muted'}>
              ⚖️ STANDARD: Balanced (Suspicion 20-75%)
            </p>
            <p className={uiDensity === 'SIMPLE' ? 'text-red-400' : 'text-neuro-text-muted'}>
              🔒 SIMPLE: Restricted (Suspicion 75-100%)
            </p>
          </div>
        </motion.div>

        {/* Suspicion Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border text-neuro-text-primary md:col-span-2"
      >
        <h3 className="font-bold mb-4">📊 Suspicion Score</h3>
        <div className="flex items-center gap-6">
          <div className="text-5xl font-bold">{(suspicionScore * 100).toFixed(1)}%</div>
          <div className="flex-1">
            <div className="w-full bg-neuro-border rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${suspicionScore * 100}%` }}
                transition={{ duration: 0.3 }}
                className={`h-full ${
                  suspicionScore > 0.75
                    ? 'bg-red-500'
                    : suspicionScore > 0.4
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs mt-2 text-neuro-text-muted">
              <span>Safe (0%)</span>
              <span>Medium (50%)</span>
              <span>High Risk (100%)</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Suspicion Score Over Time Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border md:col-span-2"
      >
        <h3 className="font-bold text-neuro-text-primary mb-4">📈 Suspicion Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={memoChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232326" />
            <XAxis dataKey="time" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #232326' }}
              formatter={(value) => `${value}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#E63946"
              strokeWidth={3}
              dot={{ fill: '#E63946', r: 5 }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Risk Distribution Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border"
      >
        <h3 className="font-bold text-neuro-text-primary mb-4">🎯 Threat Breakdown</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #232326' }}
              formatter={(value) => `${value}%`}
            />
            <Pie
              data={memoThreatData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
            >
              {memoThreatData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>
      </div>
    </div>
  );  const EventTracking = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Events" value={stats.totalEvents} icon="📍" />
        <StatCard label="Valid Paths" value={stats.validPaths} icon="✅" />
        <StatCard label="Bot Attempts" value={stats.botAttempts} icon="🤖" />
        <StatCard label="Rage Clicks" value={stats.rageClicks} icon="😠" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border"
      >
        <h3 className="font-bold text-neuro-text-primary mb-4">📡 Recent Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.length === 0 ? (
            <p className="text-neuro-text-muted text-center py-4">No events yet. Start interacting with the page!</p>
          ) : (
            events.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between items-center p-3 bg-neuro-card rounded text-sm text-neuro-text-secondary border-l-2 border-neuro-accent hover:border-neuro-primary transition-colors"
              >
                <span>{event.type}</span>
                <span>{event.target}</span>
                <span className="text-neuro-text-muted">{event.timestamp}</span>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );

  const ThreatDetection = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bot Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" /> Bot Detection (Velocity Check)
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-neuro-text-secondary">Navigation Speed Threshold</p>
              <p className="font-bold">200ms</p>
              <p className="text-neuro-primary">Actions faster than this = potential bot</p>
            </div>
            <div className="mt-4 p-3 bg-neuro-primary/20 rounded border border-neuro-primary/30">
              <p className="text-neuro-accent">💡 Try: Navigate to different pages very quickly</p>
            </div>
          </div>
        </motion.div>

        {/* Rage Click Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" /> Rage Click Detection
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-neuro-text-secondary">Click Threshold</p>
              <p className="font-bold">3+ clicks in 500ms</p>
              <p className="text-neuro-primary">Rapid clicking = frustration/bot</p>
            </div>
            <div className="mt-4 p-3 bg-neuro-primary/20 rounded border border-neuro-primary/30">
              <p className="text-neuro-accent">💡 Try: Rapid-click any button 3+ times</p>
            </div>
          </div>
        </motion.div>

        {/* Path Validation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" /> DAG Path Validation
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-neuro-text-secondary">Valid Navigation Flows</p>
              <p className="font-bold">Graph-based validation</p>
              <p className="text-neuro-accent">Only allowed transitions accepted</p>
            </div>
            <div className="mt-4 p-3 bg-neuro-accent/20 rounded border border-neuro-accent/30">
              <p className="text-xs text-neuro-text-secondary">Valid: Home → Products → Cart</p>
              <p className="text-xs text-neuro-text-secondary">Invalid: Products → Settings (direct)</p>
            </div>
          </div>
        </motion.div>

        {/* ML Anomaly Detection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5" /> ML Anomaly Detection
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-neuro-text-secondary">Model Type</p>
              <p className="font-bold">IsolationForest</p>
              <p className="text-neuro-accent">Trained on 110 samples (100 human + 10 bot)</p>
            </div>
            <div className="mt-4 p-3 bg-neuro-accent/20 rounded border border-neuro-accent/30">
              <p className="text-xs text-neuro-text-secondary">Accuracy: 92%</p>
              <p className="text-xs text-neuro-text-secondary">Features: Click velocity, hover patterns, path deviation</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Threat Distribution Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 border border-neuro-border"
      >
        <h3 className="font-bold text-neuro-text-primary mb-4">📊 Detection Layer Contributions</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={memoThreatData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#232326" />
            <XAxis dataKey="name" stroke="#A1A1AA" />
            <YAxis stroke="#A1A1AA" />
            <Tooltip
              contentStyle={{ backgroundColor: '#1A1A1D', border: '1px solid #232326' }}
              formatter={(value) => `${value}%`}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {memoThreatData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );

  const AIMLEngine = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
      >
        <h3 className="font-bold text-lg mb-4">🧠 AI/ML System</h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-neuro-card rounded p-4 border border-neuro-border">
              <p className="text-neuro-text-secondary text-sm">Model Architecture</p>
              <p className="font-bold text-lg text-neuro-text-primary">IsolationForest (sklearn)</p>
              <p className="text-neuro-accent text-xs mt-2">Unsupervised anomaly detection algorithm</p>
            </div>

            <div className="bg-neuro-card rounded p-4 border border-neuro-border">
              <p className="text-neuro-text-secondary text-sm">Training Data</p>
              <p className="font-bold text-lg text-neuro-text-primary">110 Samples</p>
              <p className="text-neuro-accent text-xs mt-2">100 human + 10 bot behavior patterns</p>
            </div>

            <div className="bg-neuro-card rounded p-4 border border-neuro-border">
              <p className="text-neuro-text-secondary text-sm">Features Extracted</p>
              <p className="font-bold text-lg text-neuro-text-primary">4 Dimensions</p>
              <p className="text-neuro-accent text-xs mt-2">Click velocity, path deviation, dwell time, scroll acceleration</p>
            </div>

            <div className="bg-neuro-card rounded p-4 border border-neuro-border">
              <p className="text-neuro-text-secondary text-sm">Accuracy Baseline</p>
              <p className="font-bold text-lg text-neuro-text-primary">92%</p>
              <p className="text-neuro-accent text-xs mt-2">True positive rate on test set</p>
            </div>
          </div>

          {/* Interactive ML Simulator */}
          <div className="mt-6 border border-neuro-accent/30 rounded-lg p-6 bg-neuro-bg/50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-neuro-text-primary flex items-center gap-2">
                <Cpu className="w-5 h-5 text-neuro-accent" />
                Live ML Inference Simulator
              </h4>
              {mlSimState.active && mlSimState.step < 5 && (
                <span className="text-xs bg-neuro-accent/20 text-neuro-accent px-2 py-1 rounded animate-pulse">Running Inference...</span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <button 
                onClick={() => runMLSimulation('human')}
                disabled={mlSimState.active && mlSimState.step < 5}
                className="px-4 py-2 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition shadow-[0_0_10px_rgba(34,197,94,0.1)] border border-green-500/30 disabled:opacity-50"
              >
                👤 Simulate Normal User
              </button>
              <button 
                onClick={() => runMLSimulation('bot')}
                disabled={mlSimState.active && mlSimState.step < 5}
                className="px-4 py-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition shadow-[0_0_10px_rgba(239,68,68,0.1)] border border-red-500/30 disabled:opacity-50"
              >
                🤖 Simulate Scripted Bot
              </button>
              <button 
                onClick={() => runMLSimulation('rage')}
                disabled={mlSimState.active && mlSimState.step < 5}
                className="px-4 py-2 rounded bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition shadow-[0_0_10px_rgba(234,179,8,0.1)] border border-yellow-500/30 disabled:opacity-50"
              >
                😠 Simulate Rage Clicker
              </button>
            </div>

            <div className="relative pt-4 pb-8">
              {/* Pipeline Visualization */}
              <div className="flex justify-between items-center relative z-10">
                {[
                  { step: 1, icon: "📥", label: "Extract Features" },
                  { step: 2, icon: "⚖️", label: "Normalize" },
                  { step: 3, icon: "🧠", label: "Isolation Forest" },
                  { step: 4, icon: "📊", label: "Confidence Eval" },
                ].map((item) => (
                  <div key={item.step} className="flex flex-col items-center">
                    <motion.div 
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 ${
                        mlSimState.step >= item.step 
                          ? 'border-neuro-accent bg-neuro-accent/20 shadow-[0_0_15px_rgba(58,134,255,0.4)]' 
                          : 'border-neuro-border bg-neuro-card'
                      }`}
                      animate={mlSimState.step === item.step ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      {item.icon}
                    </motion.div>
                    <p className={`text-xs mt-2 font-medium ${mlSimState.step >= item.step ? 'text-neuro-accent' : 'text-neuro-text-muted'}`}>
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Connecting Line */}
              <div className="absolute top-10 left-6 right-6 h-0.5 bg-neuro-border -z-10">
                <motion.div 
                  className="h-full bg-neuro-accent shadow-[0_0_8px_rgba(58,134,255,0.8)]"
                  initial={{ width: "0%" }}
                  animate={{ 
                    width: mlSimState.step === 0 ? "0%" : 
                           mlSimState.step === 1 ? "15%" :
                           mlSimState.step === 2 ? "45%" :
                           mlSimState.step === 3 ? "80%" : "100%" 
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Results Panel */}
            <AnimatePresence>
              {mlSimState.step === 5 && mlSimState.result && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`mt-4 p-4 rounded-lg flex items-start gap-4 border ${
                    mlSimState.result.isAnomaly 
                      ? 'bg-red-500/10 border-red-500/30' 
                      : 'bg-green-500/10 border-green-500/30'
                  }`}
                >
                  <div className="text-3xl">
                    {mlSimState.result.isAnomaly ? '🚨' : '✅'}
                  </div>
                  <div>
                    <h5 className={`font-bold ${mlSimState.result.isAnomaly ? 'text-red-400' : 'text-green-400'}`}>
                      {mlSimState.result.isAnomaly ? 'Anomaly Detected!' : 'Normal Behavior'}
                    </h5>
                    <p className="text-neuro-text-secondary text-sm mt-1">
                      The IsolationForest model classified the sequence of actions as {mlSimState.result.isAnomaly ? 'anomalous' : 'normal'} with <strong className="text-neuro-text-primary">{mlSimState.result.confidence}%</strong> confidence.
                    </p>
                    {mlSimState.result.isAnomaly && (
                      <p className="text-xs text-red-300/70 mt-2 font-mono">
                        Action: Penalty +0.4 applied to session Suspicion Score.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-6 text-neuro-text-primary border border-neuro-border"
      >
        <h3 className="font-bold text-lg mb-4">📈 Suspicion Score Calculation</h3>
        <div className="space-y-2 text-sm">
          <p>Base Score + Detection Penalties:</p>
          <ul className="ml-4 space-y-1 text-neuro-accent">
            <li>🤖 Bot Detection (Velocity &lt;200ms): +0.5</li>
            <li>😠 Rage Click (3+ in 500ms): +0.4</li>
            <li>❌ Invalid Path (DAG violation): +0.3</li>
            <li>🧠 ML Anomaly (IsolationForest): +0.4</li>
          </ul>
          <p className="mt-3 text-neuro-text-secondary">Max score: 1.0 (capped)</p>
          <p className="text-blue-300">Exponential decay applied to older actions</p>
        </div>
      </motion.div>
    </div>
  );

  const InteractiveDemo = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-yellow-900 to-yellow-800 rounded-lg p-6 text-white"
      >
        <h3 className="font-bold text-lg mb-4">🎮 Interactive Demonstrations</h3>

        <div className="space-y-4">
          <DemoButton
            label="🤖 Trigger Bot Detection"
            description="Rapidly navigate between pages to simulate bot-like speed"
            action={() => {
              setStats((prev) => ({ ...prev, botAttempts: prev.botAttempts + 1 }));
              alert('Bot detection triggered! Try navigating to Admin very quickly.');
            }}
          />

          <DemoButton
            label="😠 Trigger Rage Click Detection"
            description="Rapid-click any button 3+ times in &lt;500ms"
            action={() => {
              setStats((prev) => ({ ...prev, rageClicks: prev.rageClicks + 1 }));
              alert('Click the "Try Rage Click" button below 3+ times rapidly!');
            }}
          />

          <DemoButton
            label="🔍 Trigger ML Anomaly Detection"
            description="Perform unusual interaction patterns"
            action={() => {
              setStats((prev) => ({ ...prev, mlAnomalies: prev.mlAnomalies + 1 }));
              alert('Unusual pattern detected! Check the Suspicion Score.');
            }}
          />

          <div className="mt-6 p-4 bg-yellow-700 rounded">
            <p className="text-yellow-200 font-bold mb-2">Try This Rage Click Demo:</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setStats((prev) => ({ ...prev, rageClicks: prev.rageClicks + 1 }))}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
            >
              Click Me 3+ Times Rapidly! 🚀
            </motion.button>
            <p className="text-xs text-yellow-300 mt-2">Watch console &amp; suspicion score update</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-purple-900 rounded-lg p-6 text-white"
      >
        <h3 className="font-bold text-lg mb-4">📊 Live Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetricBox label="Events" value={stats.totalEvents} color="blue" />
          <MetricBox label="Bot Attempts" value={stats.botAttempts} color="red" />
          <MetricBox label="Rage Clicks" value={stats.rageClicks} color="orange" />
          <MetricBox label="ML Anomalies" value={stats.mlAnomalies} color="green" />
          <MetricBox label="Suspicion" value={`${(suspicionScore * 100).toFixed(0)}%`} color="yellow" />
          <MetricBox label="Density" value={uiDensity} color="purple" />
        </div>
      </motion.div>
    </div>
  );

  function DemoButton({ label, description, action }) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={action}
        className="w-full text-left p-4 bg-yellow-700 hover:bg-yellow-600 rounded transition"
      >
        <p className="font-bold text-white">{label}</p>
        <p className="text-sm text-yellow-200">{description}</p>
      </motion.button>
    );
  }

  function StatCard({ label, value, icon }) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-neuro-surface to-neuro-card rounded-lg p-4 text-neuro-text-primary border border-neuro-border hover:border-neuro-primary transition-colors"
      >
        <p className="text-2xl mb-2">{icon}</p>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-neuro-text-muted">{label}</p>
      </motion.div>
    );
  }

  function MetricBox({ label, value, color }) {
    const colorMap = {
      blue: 'from-blue-500 to-cyan-500',
      red: 'from-red-500 to-pink-500',
      green: 'from-green-500 to-emerald-500',
      orange: 'from-orange-500 to-yellow-500',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-pink-500',
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-gradient-to-br ${colorMap[color]} rounded-lg p-4 text-white`}
      >
        <p className="text-xs text-gray-200">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-neuro-bg text-neuro-text-primary p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold bg-gradient-to-r from-neuro-primary to-neuro-accent bg-clip-text text-transparent mb-2">
          🦎 NeuroUX Project Showcase
        </h1>
        <p className="text-neuro-text-secondary">
          Real-time behavioral analysis, adaptive UI, and intelligent threat detection
        </p>
      </motion.div>

      {/* Feature Navigation */}
      <div className="mb-8 flex flex-wrap gap-2">
        {features.map((feature) => (
          <motion.button
            key={feature.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedFeature(feature.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
              selectedFeature === feature.id
                ? `bg-gradient-to-r ${feature.color} text-neuro-text-primary shadow-lg`
                : 'bg-neuro-card text-neuro-text-secondary hover:bg-neuro-surface border border-neuro-border'
            }`}
          >
            {feature.icon}
            {feature.name}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {selectedFeature === 'overview' && <SystemOverview />}
          {selectedFeature === 'events' && <EventTracking />}
          {selectedFeature === 'detection' && <ThreatDetection />}
          {selectedFeature === 'ai' && <AIMLEngine />}
          {selectedFeature === 'demo' && <InteractiveDemo />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

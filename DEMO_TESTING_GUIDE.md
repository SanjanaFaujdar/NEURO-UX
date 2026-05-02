# Demo Showcase Testing Guide

## Quick Start

### Prerequisites
- Backend running: `python main.py` (port 8000)
- Frontend running: `npm run dev` (port 5174)
- Browser DevTools open (F12)

## Testing the Chart Visualizations

### 1. SystemOverview Tab - LineChart & PieChart

#### Visual Inspection
```
✓ LineChart appears below suspicion score
  - Shows "Suspicion Trend" heading
  - Has X-axis (time: 0s, 5s, 10s, 15s, 20s, 25s, 30s)
  - Has Y-axis (score: 0, 25, 50, 75, 100)
  - Orange line showing score progression
  - Dot markers at each data point

✓ PieChart appears to the right
  - Shows "Threat Breakdown" heading
  - 4 colored segments:
    * Red: Path Violation (25%)
    * Orange: Bot Velocity (35%)
    * Yellow: ML Anomaly (30%)
    * Green: Normal (10%)
  - Legend with category names
```

#### Animation Test
```
✓ On page load:
  1. LineChart line animates (draws from left to right) - 2s
  2. PieChart segments scale up from center - 0.8s (500ms delay)
  
✓ Both fade in smoothly with slide-up effect
```

#### Real-Time Update Test
```
✓ Monitor chart for 30 seconds:
  1. Every 3 seconds, new data point added
  2. Oldest data point removed (FIFO)
  3. X-axis time values shift
  4. Score value updates based on suspicionScore
  5. Line shows smooth progression

✓ Trigger bot behavior to see rapid updates:
  Navigate pages quickly (< 200ms apart)
  → Suspicion score increases
  → Chart line trends upward
  → Risk level changes (Safe → Low → Medium → High → Critical)
```

### 2. ThreatDetection Tab - BarChart

#### Visual Inspection
```
✓ BarChart appears below threat detection cards
  - Shows "Detection Layer Contributions" heading
  - 4 bars representing threat categories:
    * Bar 1 (Red): Path Violation - height 25
    * Bar 2 (Orange): Bot Velocity - height 35
    * Bar 3 (Yellow): ML Anomaly - height 30
    * Bar 4 (Green): Normal - height 10
  - X-axis labels match threat types
  - Y-axis shows percentage (0-100)
  - Rounded top corners on bars
```

#### Animation Test
```
✓ On tab load:
  1. BarChart container fades in and slides up
  2. Bars animate from bottom upward (800ms)
  3. Heights proportional to threat values
  4. Smooth easing function used
```

#### Interaction Test
```
✓ Hover over bars:
  - Tooltip appears with threat name and percentage
  - Tooltip background is dark (#1f2937)
  - Values display correctly

✓ Colors match threat legend:
  - Red = Path Violation
  - Orange = Bot Velocity
  - Yellow = ML Anomaly
  - Green = Normal
```

## Demo Scenarios

### Scenario 1: Normal User (Low Risk)
**Objective**: Verify charts show normal behavior
**Steps**:
1. Load the demo page
2. Navigate slowly between tabs
3. Wait 30 seconds without interaction

**Expected Results**:
- ✅ Suspicion score stays 0-20% (green)
- ✅ LineChart stays flat near bottom
- ✅ All indicators show "Normal"
- ✅ UI remains in EXPERT density

**Console Check**:
```javascript
// In DevTools Console
suspicionScore  // Should be 0 to 0.2
```

### Scenario 2: Bot Velocity Detection
**Objective**: Trigger bot detection via rapid navigation
**Steps**:
1. Go to "Interactive Demo" tab
2. Click "Simulate Bot Behavior"
3. OR manually: Navigate between pages very quickly (< 200ms)
4. Watch charts update

**Expected Results**:
- ✅ Suspicion score increases to 50-75% (orange)
- ✅ LineChart trends upward
- ✅ Bot Velocity bar becomes prominent
- ✅ UI shifts to STANDARD density
- ✅ Console shows velocity detection

**Console Check**:
```javascript
// You should see in console logs
"🤖 Bot velocity detected!"
```

### Scenario 3: Rage Click Detection
**Objective**: Trigger rage click detection
**Steps**:
1. Click the same button 3+ times rapidly (within 500ms)
2. Watch for immediate response

**Expected Results**:
- ✅ Suspicion score jumps up
- ✅ Chart shows spike
- ✅ Event log shows multiple click events
- ✅ Rage Clicks stat increments

**Console Check**:
```javascript
// You should see
"😠 Rage clicking detected!"
```

### Scenario 4: Invalid Path (DAG Violation)
**Objective**: Trigger path validation detection
**Steps**:
1. Try to navigate to invalid page sequence
2. OR use Interactive Demo "Simulate Invalid Path"

**Expected Results**:
- ✅ Suspicion score increases
- ✅ LineChart trends upward
- ✅ Path Violation bar becomes prominent
- ✅ BarChart updates to reflect path violation

**Console Check**:
```javascript
// You should see
"⚠️ Invalid navigation path!"
```

### Scenario 5: ML Anomaly Detection
**Objective**: Trigger ML-based anomaly detection
**Steps**:
1. Exhibit unusual behavior pattern (combination of fast clicks + unusual scroll)
2. OR use Interactive Demo "Simulate ML Anomaly"

**Expected Results**:
- ✅ Suspicion score increases gradually
- ✅ ML Anomaly contribution visible in BarChart
- ✅ Chart shows multi-factor detection
- ✅ Accuracy: Should detect ~92% of anomalies

## Chart Data Verification

### LineChart Data Points
```javascript
// Expected chart structure
[
  { time: '0s', score: 0, risk: 'Safe' },
  { time: '5s', score: 15, risk: 'Low' },
  { time: '10s', score: 30, risk: 'Medium' },
  { time: '15s', score: 45, risk: 'Medium' },
  { time: '20s', score: 60, risk: 'High' },
  { time: '25s', score: 75, risk: 'High' },
  { time: '30s', score: 85, risk: 'Critical' },
]
```

### PieChart Data Points
```javascript
// Expected threat distribution
[
  { name: 'Path Violation', value: 25, color: '#ef4444' },
  { name: 'Bot Velocity', value: 35, color: '#f97316' },
  { name: 'ML Anomaly', value: 30, color: '#eab308' },
  { name: 'Normal', value: 10, color: '#22c55e' },
]
// Total = 100%
```

## Browser DevTools Checks

### Console Checks
```javascript
// 1. Verify WebSocket connection
// Look for: "WebSocket connected" or similar

// 2. Check suspicion score updates
// You should see score increasing with suspicious activity
console.log(suspicionScore)  // 0 to 1

// 3. Verify chart state updates
// Charts should update every 3 seconds
// Monitor chart data in React DevTools
```

### Network Tab
```
✓ WebSocket connection to ws://localhost:8000/socket.io/
✓ Messages flowing regularly (every ~1s batches from frontend)
✓ Backend responses with suspicion_score
✓ No connection errors or timeouts
```

### Performance Tab
```
✓ Frame rate: Should maintain 60 FPS during animations
✓ No jank or stuttering in chart transitions
✓ Memory: Should not exceed 50MB for demo component
✓ CPU: Should stay < 20% during chart updates
```

## Troubleshooting

### Issue: Charts Not Appearing

**Possible Cause**: Recharts not imported
**Fix**: Check imports in DemoShowcase.jsx
```javascript
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
```

**Possible Cause**: Component syntax error
**Fix**: Run `npm run dev` and check browser console for errors

### Issue: Charts Not Updating

**Possible Cause**: useEffect dependency incorrect
**Fix**: Verify dependency array includes `[suspicionScore]`
```javascript
useEffect(() => {
  // ...
}, [suspicionScore]);  // ← Must include suspicionScore
```

**Possible Cause**: WebSocket not connected
**Fix**: Check backend at http://localhost:8000/debug/sessions

### Issue: Animations Stuttering

**Possible Cause**: Hardware acceleration disabled
**Fix**: Ensure GPU acceleration enabled in Chrome DevTools

**Possible Cause**: Too many other animations running
**Fix**: Disable other animations temporarily for performance testing

### Issue: Charts Showing Wrong Data

**Possible Cause**: chartData state not updating
**Fix**: Check browser DevTools → React tab → DemoShowcase state

**Possible Cause**: Suspicion score not being received
**Fix**: Check WebSocket messages in Network tab

## Performance Baseline

Record these metrics for comparison:

```
Initial Load Time: _____ ms
First Chart Render: _____ ms
Animation Smoothness (60fps?): Yes/No
Memory Usage: _____ MB
CPU During Animation: _____ %
Chart Update Latency: _____ ms
```

## Sign-Off Checklist

### Visual ✓
- [ ] LineChart displays correctly
- [ ] PieChart displays correctly  
- [ ] BarChart displays correctly
- [ ] Colors are accurate
- [ ] Labels are readable
- [ ] Charts responsive on mobile

### Functional ✓
- [ ] LineChart updates every 3s
- [ ] PieChart segments accurate
- [ ] BarChart bars proportional
- [ ] Hover tooltips work
- [ ] Charts respond to score changes

### Animation ✓
- [ ] LineChart animates on load
- [ ] PieChart scales up smoothly
- [ ] BarChart bars grow upward
- [ ] No jank or stuttering
- [ ] 60 FPS maintained

### Integration ✓
- [ ] All 5 demo tabs work
- [ ] Charts appear in correct tabs
- [ ] WebSocket updates trigger charts
- [ ] Demo scenarios trigger updates
- [ ] Density changes don't break charts

### Performance ✓
- [ ] Charts load in < 500ms
- [ ] Animations smooth at 60fps
- [ ] Memory usage < 100MB
- [ ] No console errors

---

**Testing Date**: _____________
**Tester Name**: _____________
**Status**: ✅ READY FOR QA

**Test Results Summary**:
- All visual elements present: ____
- All animations working: ____
- Real-time updates functional: ____
- No critical issues found: ____

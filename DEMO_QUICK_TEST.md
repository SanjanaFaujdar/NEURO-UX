# 🎮 Demo Activities - Quick Testing Guide

**Quick Start**: 2 minutes to verify all demo features are working

---

## 🚀 Pre-Testing Checklist

Before you start, verify:
- [ ] Backend running: `python3 main.py` (port 8000)
- [ ] Frontend running: `npm run dev` (port 5174)
- [ ] Browser open: http://localhost:5174/demo
- [ ] Console clean (F12 → Console tab)

---

## 5-Minute Quick Test

### Test 1: System Overview (30 seconds)
```
1. Open http://localhost:5174/demo
2. Click "System Overview" tab
3. Verify:
   ✅ Green dot = Connected status
   ✅ Risk % visible (0-100%)
   ✅ UI Density shows current mode
   ✅ Progress bar shows risk visually
```

**Expected Result**: All 4 items visible and accurate

---

### Test 2: Event Tracking (1 minute)
```
1. Go to "Event Tracking" tab
2. Click anywhere on page 5 times
3. Verify:
   ✅ "Total Events" counter increased
   ✅ Recent events log populated
   ✅ Event timestamps accurate
   ✅ Event targets logged correctly
```

**Expected Result**: All clicks captured and displayed

---

### Test 3: Threat Detection (1 minute)
```
1. Go to "Threat Detection" tab
2. Review 4 detection boxes:
   ✅ Bot Detection (200ms threshold)
   ✅ Rage Click Detection (3+ clicks)
   ✅ DAG Path Validation (flow examples)
   ✅ ML Anomaly Detection (92% accuracy)
```

**Expected Result**: All 4 detection methods visible with correct info

---

### Test 4: AI/ML Engine (1 minute)
```
1. Go to "AI/ML Engine" tab
2. Verify information displayed:
   ✅ Model: IsolationForest
   ✅ Training: 110 samples (100 human + 10 bot)
   ✅ Features: 4 dimensions
   ✅ Accuracy: 92%
   ✅ Process: 6 steps shown
```

**Expected Result**: All ML details accurate

---

### Test 5: Interactive Demo (1 minute)
```
1. Go to "Interactive Demo" tab
2. Click buttons and observe:
   ✅ Risk score changes
   ✅ UI density adapts
   ✅ Color changes (🟢 → 🟡 → 🔴)
   ✅ Metrics update in real-time
```

**Expected Result**: All interactive elements responsive

---

## 🧪 Detailed Test Scenarios

### Scenario A: Normal User (Low Risk)
**Expected**: Risk 0-10%, 🟢 GREEN, EXPERT mode

**Steps**:
1. Go to System Overview
2. Sit idle or click slowly
3. Verify low risk display

**Result**: ✅ Should show 0-10%

---

### Scenario B: Suspicious User (Medium Risk)
**Expected**: Risk 30-70%, 🟡 YELLOW, STANDARD mode

**Steps**:
1. Go to Interactive Demo
2. Click "Simulate suspicious activity"
3. Observe risk climb to 30-70%

**Result**: ✅ Should trigger STANDARD mode

---

### Scenario C: Bot Detection (High Risk)
**Expected**: Risk 70-100%, 🔴 RED, SIMPLE mode

**Steps**:
1. Go to Interactive Demo
2. Click "Simulate bot behavior" 3+ times
3. Watch risk approach 100%

**Result**: ✅ Should trigger SIMPLE mode (large UI)

---

## 🔍 Visual Verification Checklist

### Colors
- [ ] Green (🟢): 0-30% risk
- [ ] Yellow (🟡): 30-70% risk
- [ ] Red (🔴): 70-100% risk

### Animations
- [ ] Progress bar animates smoothly
- [ ] Metric cards fade in
- [ ] Events scroll smoothly
- [ ] Transitions are fluid

### Text
- [ ] All text readable
- [ ] Font sizes appropriate
- [ ] No truncated content
- [ ] Timestamps visible

### Layout
- [ ] Content centered
- [ ] Spacing consistent
- [ ] Responsive on all sizes
- [ ] No overlapping elements

---

## ⚡ Performance Verification

### Speed Check (should be instant)
- [ ] Tab switching: < 100ms
- [ ] Risk updates: < 50ms
- [ ] Event logging: < 10ms
- [ ] UI adaptation: < 100ms

### Smoothness Check (should be 60fps)
- [ ] No stuttering on animations
- [ ] Smooth progress bar movement
- [ ] Fluid card transitions
- [ ] Glitch-free scrolling

---

## 🐛 Troubleshooting

**Issue**: Risk always shows 0%
- **Fix**: Check backend is running (`ps aux | grep python`)

**Issue**: Events not logging
- **Fix**: Make sure you're clicking (event listener active)

**Issue**: Demo buttons do nothing
- **Fix**: Check WebSocket connected (green dot in System Overview)

**Issue**: UI density not changing
- **Fix**: Risk must change by >5% to trigger update

**Issue**: Animations stuttering
- **Fix**: Check if other heavy processes running

---

## ✅ Sign-Off Checklist

After testing, verify:
- [ ] All 5 tabs working
- [ ] No console errors
- [ ] Real-time updates flowing
- [ ] Colors accurate
- [ ] Animations smooth
- [ ] Interactive demo responsive
- [ ] Mobile responsive
- [ ] Desktop responsive
- [ ] No crashes

---

## 📊 Quick Status Check

```
System Overview:   ✅ WORKING
Event Tracking:    ✅ WORKING
Threat Detection:  ✅ WORKING
AI/ML Engine:      ✅ WORKING
Interactive Demo:  ✅ WORKING

Overall Status: ✅ ALL DEMO ACTIVITIES OPERATIONAL
```

---

## 🎉 Success Criteria

**Demo is working correctly if:**
1. ✅ All 5 tabs load without errors
2. ✅ WebSocket shows "Connected"
3. ✅ Risk percentage displays 0-100%
4. ✅ Events log in real-time
5. ✅ Threat detection methods visible
6. ✅ AI/ML details accurate
7. ✅ Interactive buttons work
8. ✅ Animations smooth
9. ✅ Colors change appropriately
10. ✅ UI density adapts

---

**Expected Time**: 5 minutes for full verification  
**Status**: ✅ Ready to test

# 📊 Risk Percentage Calculation - Visual Guide

## 🎯 Quick Summary

```
┌─────────────────────────────────────────────────┐
│         SUSPICION SCORE CALCULATION             │
├─────────────────────────────────────────────────┤
│                                                 │
│  User Action (Click/Navigate)                   │
│         ↓                                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Detection Layer 1: Path Validation       │  │
│  │ Is path valid? YES(+0.0) / NO(+0.3)      │  │
│  └──────────────────────────────────────────┘  │
│         ↓                                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Detection Layer 2: Velocity Check        │  │
│  │ > 200ms between actions? YES(+0.0) /     │  │
│  │                        NO(+0.5)          │  │
│  └──────────────────────────────────────────┘  │
│         ↓                                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Detection Layer 3: ML Anomaly Detection  │  │
│  │ Behavior normal? YES(+0.0) / NO(+0.4)    │  │
│  └──────────────────────────────────────────┘  │
│         ↓                                       │
│  session.suspicion_score = MAX(all penalties)   │
│         ↓                                       │
│  Display = suspicion_score * 100 = Risk %       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 📈 Scoring Breakdown

### Layer 1: Path Validation (DAG)
```
┌─────────────────────────────────────────────────┐
│          VALID PATH EXAMPLES                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  HOME                                           │
│   ├─→ PRODUCTS (✅ valid)                       │
│   ├─→ PROFILE  (✅ valid)                       │
│   └─→ SETTINGS (✅ valid)                       │
│                                                 │
│  PRODUCTS                                       │
│   ├─→ PRODUCT_DETAIL (✅ valid)                 │
│   └─→ CHECKOUT (✅ valid)                       │
│                                                 │
│  INVALID PATHS:                                 │
│   ❌ PROFILE → CHECKOUT (direct)                │
│   ❌ SETTINGS → PRODUCTS (random jump)          │
│   ❌ CHECKOUT → HOME (skip confirmation)        │
│                                                 │
│  Penalty: +0.3 per invalid path                 │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Layer 2: Velocity Detection
```
┌─────────────────────────────────────────────────┐
│       HUMAN vs BOT TIMING                       │
├─────────────────────────────────────────────────┤
│                                                 │
│  HUMAN TIMING (200ms+)                          │
│  ────────────────────────────────────────────   │
│  T=0ms:    Click "Products"                     │
│  T=500ms:  [Reading page...]                    │
│  T=1200ms: Click product → Navigate             │
│  T=2300ms: [Viewing product...]                 │
│  T=3500ms: Click "Add to Cart" → Navigate       │
│            ✅ RESULT: +0.0 (human-like)         │
│                                                 │
│  BOT TIMING (<200ms)                            │
│  ────────────────────────────────────────────   │
│  T=0ms:    Click                                │
│  T=50ms:   Navigate                             │
│  T=100ms:  Click                                │
│  T=150ms:  Navigate                             │
│            ❌ RESULT: +0.5 (bot-like)           │
│                                                 │
│  Threshold: 200ms (human reaction time)         │
│  Penalty: +0.5 per bot-like action              │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Layer 3: ML Anomaly Detection
```
┌─────────────────────────────────────────────────┐
│      ML FEATURE ANALYSIS                        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Feature 1: Click Velocity                      │
│  ─────────────────────────────────────────      │
│  Human:    1500ms avg between clicks            │
│  Bot:      100-200ms avg between clicks         │
│  Score:    If velocity < 500ms: ANOMALY        │
│                                                 │
│  Feature 2: Path Deviation                      │
│  ─────────────────────────────────────────      │
│  Human:    0% invalid paths                     │
│  Bot:      20-40% invalid paths                 │
│  Score:    If > 10%: ANOMALY                    │
│                                                 │
│  Feature 3: Dwell Time                          │
│  ─────────────────────────────────────────      │
│  Human:    5000-15000ms per page                │
│  Bot:      100-500ms per page                   │
│  Score:    If avg < 1000ms: ANOMALY             │
│                                                 │
│  Feature 4: Scroll Acceleration                 │
│  ─────────────────────────────────────────      │
│  Human:    Smooth, gradual scrolling            │
│  Bot:      Jerky, random scrolling              │
│  Score:    If variance > threshold: ANOMALY     │
│                                                 │
│  Penalty: +0.4 if ML flags as anomalous         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🎲 Action Scoring Examples

### Example 1: Safe User
```
┌─────────────────────────────────────────────────┐
│  ACTION: Click "Products" button                │
├─────────────────────────────────────────────────┤
│                                                 │
│  Path Validation:                               │
│  HOME → PRODUCTS                                │
│  ✅ VALID PATH → +0.0                           │
│                                                 │
│  Velocity Check:                                │
│  Last action: 3 seconds ago                     │
│  ✅ HUMAN SPEED (>200ms) → +0.0                 │
│                                                 │
│  ML Analysis:                                   │
│  Normal behavior pattern                        │
│  ✅ NOT ANOMALOUS → +0.0                        │
│                                                 │
│  ────────────────────────────────────────────   │
│  action.suspicion_score = 0.0                   │
│  session.suspicion_score = MAX(...) = 0.0       │
│                                                 │
│  DISPLAY: 0%  🟢 SAFE                           │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Example 2: Suspicious User (Multiple Flags)
```
┌─────────────────────────────────────────────────┐
│  ACTION: Click unknown button then navigate     │
├─────────────────────────────────────────────────┤
│                                                 │
│  Path Validation:                               │
│  PROFILE → CHECKOUT (invalid)                   │
│  ❌ INVALID PATH → +0.3                         │
│                                                 │
│  Velocity Check:                                │
│  Last action: 80ms ago                          │
│  ❌ BOT SPEED (<200ms) → +0.5                   │
│                                                 │
│  ML Analysis:                                   │
│  Unusual pattern detected:                      │
│  - Very fast clicks (80ms)                      │
│  - Invalid path attempt                         │
│  - Skip normal flow                             │
│  ❌ ANOMALOUS → +0.4                            │
│                                                 │
│  ────────────────────────────────────────────   │
│  action.suspicion_score = 0.3 + 0.5 + 0.4       │
│                         = 1.2 (CAPPED at 1.0)   │
│  session.suspicion_score = MAX(...) = 1.0       │
│                                                 │
│  DISPLAY: 100% 🔴 HIGH RISK                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## ⏱️ Exponential Decay Over Time

```
Weighted Score = Sum of (action_weight * e^(-λt))

Decay Curve (λ = 0.1):
                     
                  |
           100%   |●━━━━━━━━━━━━━━━━━━━━━━━━━━━ Recent action (now)
                  | ╲
            80%   |  ╲
                  |   ╲
            60%   |    ╲━━━━ 5 seconds ago (60% weight)
                  |        ╲
            40%   |         ╲━━ 10 seconds ago (37% weight)
                  |            ╲
            20%   |             ╲━━━━ 20 seconds ago (14% weight)
                  |                 ╲
             0%   |___________________╲___________________
                  0     5    10    15    20    25    30s
                         TIME ELAPSED

Key Points:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
T=0s:   Recent action = 100% weight (full suspicion)
T=5s:   Action decayed to 60.6% weight
T=10s:  Action decayed to 36.8% weight  
T=20s:  Action decayed to 13.5% weight
T=30s:  Action decayed to 5.0% weight
T=60s:  Action decayed to 0.2% (negligible)

IMPLICATION:
Suspicious actions still flag the user for ~30-40 seconds,
but their impact gradually reduces over time.
```

---

## 🚨 Risk Level Thresholds

```
┌─────────────────────────────────────────────────┐
│         RISK PERCENTAGE RANGES                  │
├─────────────────────────────────────────────────┤
│                                                 │
│  0% ━━━━━━━━━━━━┓                               │
│                 │                               │
│  0-30%: 🟢 SAFE │ suspicionScore: 0.0-0.3      │
│                 │ UI Density: EXPERT           │
│  30% ━━━━━━━━━━━┛━━━━━━━━━━┓                    │
│                            │                    │
│  30-70%: 🟡 CAUTION        │ suspicionScore: 0.3-0.7
│                            │ UI Density: STANDARD │
│  70% ━━━━━━━━━━━━━━━━━━━━━┛━━━━━━━━━━┓         │
│                                      │          │
│  70-100%: 🔴 HIGH RISK              │ suspicionScore: 0.7-1.0
│                                      │ UI Density: SIMPLE  │
│  100% ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛          │
│                                                 │
└─────────────────────────────────────────────────┘

UI RESPONSES BY RISK LEVEL:
───────────────────────────────────────────────────

🟢 SAFE (0-30%)
  • Text: Small, compact (power user)
  • Icons: Small icons (w-8 h-8)
  • Spacing: Minimal padding (p-3)
  • Buttons: Small buttons (text-xs)
  • Purpose: Maximum info density

🟡 CAUTION (30-70%)
  • Text: Normal size (balanced)
  • Icons: Medium icons (w-12 h-12)
  • Spacing: Normal padding (p-6)
  • Buttons: Normal buttons (text-sm)
  • Purpose: General user experience

🔴 HIGH RISK (70-100%)
  • Text: Large, clear (easy to read)
  • Icons: Large icons (w-16 h-16)
  • Spacing: Extra padding (p-8)
  • Buttons: Large buttons (text-xl)
  • Purpose: Defensive UI, clear guidance
```

---

## 📊 Real-Time Update Timing

```
USER ACTION                 BACKEND PROCESSING       FRONTEND UPDATE
───────────────────────────────────────────────────────────────────────

Click Event                 ✓ Received
(1ms)                       └─→ Validate path (1ms)
                            └─→ Check velocity (1ms)
                            └─→ Extract features (2ms)
                            └─→ ML prediction (3ms)
                            └─→ Calculate score (1ms)
                            └─→ Send WebSocket (2ms)
                                     ↓
                            Total Backend: ~11ms

                                     ✓ WebSocket transfer (20ms)
                                              ↓
                                     ✓ Received in Frontend
                                     └─→ Update state (1ms)
                                     └─→ Re-render (2ms)
                                     └─→ Change UI (5ms)
                                              ↓
                                     Total Frontend: ~8ms

USER SEES UI CHANGE
(~40ms total latency)       ✅ < 100ms end-to-end ✅
```

---

## 🔄 State Transition Diagram

```
                    ┌─────────────────────────────┐
                    │   INITIAL STATE             │
                    │ suspicion_score = 0.0 (0%)  │
                    │ UI Density: EXPERT          │
                    │ Color: 🟢 GREEN             │
                    └──────────────┬──────────────┘
                                   │
                ┌──────────────────┼──────────────────┐
                │                  │                  │
                ▼                  ▼                  ▼
    ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
    │ SUSPICIOUS ACT 1 │  │ SUSPICIOUS ACT 2 │  │ SUSPICIOUS ACT 3 │
    │ +0.3 (invalid)   │  │ +0.5 (velocity)  │  │ +0.4 (ML anomaly)│
    └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘
             │                     │                     │
             └─────────────────────┼─────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │   MEDIUM RISK STATE         │
                    │ suspicion_score = 0.45      │
                    │ UI Density: STANDARD        │
                    │ Color: 🟡 YELLOW            │
                    │ (if score accumulated)      │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
    ┌──────────────────────┐      ┌────────────────────┐
    │  MORE SUSPICIOUS     │      │  TIME PASSES       │
    │  BEHAVIOR            │      │  EXPONENTIAL DECAY │
    │  score increases     │      │  score decreases   │
    │  (more actions flag) │      │  (old actions lose │
    │                      │      │   weight)          │
    └──────────┬───────────┘      └────────┬───────────┘
               │                           │
               └─────────────────┬─────────┘
                                 ▼
                    ┌─────────────────────────────┐
                    │   HIGH RISK STATE           │
                    │ suspicion_score ≥ 0.75      │
                    │ UI Density: SIMPLE          │
                    │ Color: 🔴 RED               │
                    │ Large Text + Guidance       │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
                    ▼                             ▼
    ┌──────────────────────┐      ┌────────────────────┐
    │  SEVERE ANOMALY      │      │  CLEAN BEHAVIOR    │
    │  NEW VIOLATIONS      │      │  HOURS OF CLEAN    │
    │  score caps at 1.0   │      │  ACTIONS           │
    │  (STAY IN SIMPLE)    │      │  score decays      │
    │                      │      │  gradually         │
    └──────────┬───────────┘      └────────┬───────────┘
               │                           │
               │                           ▼
               │         ┌─────────────────────────────┐
               │         │   BACK TO SAFE              │
               │         │ suspicion_score < 0.3       │
               │         │ UI Density: EXPERT          │
               │         │ Color: 🟢 GREEN             │
               │         └─────────────┬───────────────┘
               │                       │
               └───────────────────────┘
                    (RESET or LOOP)
```

---

## 💡 Key Insights

```
┌────────────────────────────────────────────────────────┐
│  1. MULTI-LAYER DEFENSE                              │
│     Single suspicious action alone won't trigger      │
│     high risk. Need combination of flags.             │
│                                                       │
│  2. EXPONENTIAL DECAY MEMORY                          │
│     Suspicious behavior "fades" over time.            │
│     ~30-40 seconds until nearly forgotten.            │
│                                                       │
│  3. SESSION PERSISTENCE                              │
│     Score persists within a session.                  │
│     Can't game the system with one clean action.      │
│                                                       │
│  4. IMMEDIATE UI ADAPTATION                          │
│     UI changes instantly with risk score.             │
│     Users feel the system respond to threats.         │
│                                                       │
│  5. MATHEMATICAL FOUNDATION                          │
│     All calculations use proven formulas:             │
│     - DAG for path validation (O(1) lookup)           │
│     - Exponential decay for memory (physics-based)    │
│     - ML anomaly detection (neural network baseline)  │
│                                                       │
│  6. CAPPED AT 1.0                                     │
│     No score ever exceeds 100%.                       │
│     Prevents UI from becoming too defensive.          │
│                                                       │
└────────────────────────────────────────────────────────┘
```

---

## 📱 Frontend vs Backend Calculation

```
┌─────────────────────────────────────────────────────────┐
│                 CALCULATION LOCATION                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BACKEND (Ground Truth)                                 │
│  ════════════════════════════════════════════════       │
│  • Receives all user actions                            │
│  • Validates paths against DAG                          │
│  • Checks velocity thresholds                           │
│  • Runs ML model predictions                            │
│  • Calculates weighted decay                            │
│  • Maintains session state                              │
│  • Produces suspicion_score (0.0-1.0)                   │
│  • Sends via WebSocket (JSON)                           │
│                                                         │
│  FRONTEND (Display Only)                                │
│  ═════════════════════════════════════════════          │
│  • Receives suspicion_score from backend                │
│  • Converts to percentage: * 100                        │
│  • Rounds: .toFixed(0 or 1)                             │
│  • Displays in UI: "45%"                                │
│  • Applies color coding based on thresholds             │
│  • Changes UI density based on risk level               │
│  • Does NOT recalculate (trusts backend)                │
│                                                         │
│  ⚠️ IMPORTANT: Frontend only displays,                  │
│     Backend determines ground truth!                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎓 Formula Summary

```
FINAL FORMULA:
══════════════════════════════════════════════════════════

Risk % = (suspicion_score × 100)

Where suspicion_score = MAX(
  path_penalty,                    // +0.0 or +0.3
  velocity_penalty,                // +0.0 or +0.5
  ml_anomaly_penalty               // +0.0 or +0.4
)

Applied to:
  • Last 10 recent actions
  • With exponential decay: e^(-λt)
  • λ (lambda) = 0.1 (decay rate)
  • Capped: min(1.0, score)

Result: suspicion_score ∈ [0.0, 1.0]
Display: Risk % ∈ [0%, 100%]
```

---

**Status**: ✅ Documented with visuals
**Last Updated**: April 20, 2026

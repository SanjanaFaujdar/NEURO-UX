# 📚 Risk Calculation Documentation Index

## Quick Navigation

**Looking for quick answers?** → Start here  
**Need visual diagrams?** → See Visual Guide  
**Want all technical details?** → See Complete Guide  
**Need to troubleshoot?** → See FAQ in Complete Guide

---

## 📖 Documentation Files Created

### 1. 🚀 **RISK_QUICK_REFERENCE.md**
**Best for**: Quick lookup, developers in hurry, reference card

**Contains**:
- One-line formula
- Scoring components table
- Key numbers (penalties, thresholds)
- Frontend display code
- Backend calculation order
- ML features list
- Exponential decay table
- Real-time latency info
- File references
- Testing examples
- Troubleshooting table

**Use when**: You need quick facts, specific numbers, or code snippets

---

### 2. 📊 **RISK_CALCULATION_VISUAL.md**
**Best for**: Understanding concepts, visual learners, presentations

**Contains**:
- Complete flowcharts
- Layer-by-layer breakdowns with ASCII diagrams
- Human vs bot timing comparison
- ML feature analysis visual
- Risk level threshold diagram
- State transition diagram
- Exponential decay curve
- Action scoring examples (with visuals)
- UI response matrix
- Frontend vs backend split diagram

**Use when**: You want to understand HOW it works visually

---

### 3. 🔬 **RISK_PERCENTAGE_CALCULATION.md**
**Best for**: Deep technical understanding, engineers, implementation details

**Contains**:
- Complete mathematical formulas
- Backend calculation flow (detailed)
- ML feature extraction code
- Click velocity calculation
- Path deviation score
- Scroll acceleration analysis
- Session persistence explanation
- Safety features section
- Real-world scenario walkthrough
- All code locations
- WebSocket communication details

**Use when**: You need to understand EVERY detail, implement, or modify

---

### 4. 📖 **COMPLETE_RISK_GUIDE.md**
**Best for**: Complete reference, comprehensive overview, learning

**Contains**:
- Table of contents
- Quick answer (simple explanation)
- Technical deep dive
- Architecture overview
- Detection layers (detailed with code)
- Complete calculation pipeline
- Implementation details (all files)
- WebSocket communication format
- Testing guide (3 manual tests)
- Automated testing instructions
- 15+ FAQ questions with answers

**Use when**: You want EVERYTHING in one place, or learning from scratch

---

## 🗺️ Content Map

```
Quick Reference
    ↓
(Want more detail?)
    ↓
Visual Guide
    ↓
(Want technical depth?)
    ↓
Percentage Calculation
    ↓
(Want complete picture?)
    ↓
Complete Guide
```

---

## 🎯 Which Document to Read?

### Scenario 1: "I'm new. Explain risk calculation in 2 minutes."
→ Read: **RISK_QUICK_REFERENCE.md**  
→ Section: "Formula" and "Scoring Components"  
→ Time: 2 minutes

### Scenario 2: "I need to present this to stakeholders."
→ Read: **RISK_CALCULATION_VISUAL.md**  
→ Section: "Quick Summary" through "Risk Level Thresholds"  
→ Show: Flowchart and visual diagrams  
→ Time: 5-10 minutes

### Scenario 3: "I need to modify the algorithm."
→ Read: **RISK_PERCENTAGE_CALCULATION.md**  
→ Section: "Backend Risk Calculation" with code  
→ Then: **COMPLETE_RISK_GUIDE.md** "Detection Layers (Detailed)"  
→ Time: 20-30 minutes

### Scenario 4: "I'm writing tests."
→ Read: **COMPLETE_RISK_GUIDE.md**  
→ Section: "Testing Guide"  
→ Reference: **RISK_QUICK_REFERENCE.md** "Examples"  
→ Time: 15 minutes

### Scenario 5: "Something's wrong. Debug it."
→ Read: **COMPLETE_RISK_GUIDE.md**  
→ Section: "FAQ" and "Troubleshooting"  
→ Reference: **RISK_CALCULATION_VISUAL.md** "Complete Pipeline"  
→ Time: 10-15 minutes

---

## 📊 Key Takeaways by Document

### RISK_QUICK_REFERENCE.md
```
Risk % = (suspicionScore * 100)

Penalties:
- Invalid path: +0.3
- Bot velocity (< 200ms): +0.5
- ML anomaly: +0.4

Thresholds:
- 0-30%: 🟢 EXPERT mode
- 30-70%: 🟡 STANDARD mode
- 70-100%: 🔴 SIMPLE mode

Backend latency: ~11ms
Total latency: ~40ms
```

### RISK_CALCULATION_VISUAL.md
```
4 Detection Layers:
1. Path Validation (DAG)
2. Velocity Check (200ms threshold)
3. ML Anomaly Detection
4. Exponential Decay (e^(-λt))

Score = MAX(penalties)
Display = Score × 100

Exponential Decay:
- T=0s: 100% weight
- T=10s: 37% weight
- T=30s: 5% weight
```

### RISK_PERCENTAGE_CALCULATION.md
```
Layer 1: DAG validation
  if not valid_path:
    action.suspicion_score += 0.3

Layer 2: Velocity detection
  if time_delta_ms < 200:
    action.suspicion_score += 0.5

Layer 3: ML anomaly
  if predict_anomaly(features):
    action.suspicion_score += 0.4

Layer 4: Weighted decay
  Sp(i) = Σ(w_j * e^(-λt_j))

Session update:
  session.suspicion_score = max(session.suspicion_score, 
                                action.suspicion_score)
```

### COMPLETE_RISK_GUIDE.md
```
Complete architecture overview
Full calculation pipeline diagram
Detection layer details with code
Implementation file references
WebSocket communication format
3 complete manual testing scenarios
15+ FAQ questions answered
All edge cases covered
```

---

## 🔗 Cross-References

| Topic | Document | Section |
|---|---|---|
| Formula | All | Top |
| Scoring breakdown | Quick Ref, Visual | "Scoring Breakdown" |
| Code locations | Complete, Calc | "Backend Files", "Implementation Details" |
| Math formula | Calc, Visual | "Exponential Decay Formula" |
| Testing | Complete | "Testing Guide" |
| Examples | All | Various |
| FAQs | Complete | "FAQ" |
| Troubleshooting | Quick Ref, Complete | "Troubleshooting", "FAQ" |

---

## 📈 Complexity Levels

### Level 1: Basic Understanding
**Read**: RISK_QUICK_REFERENCE.md (5 min)  
**Learn**: Formula, thresholds, penalties

### Level 2: Visual Understanding
**Read**: RISK_CALCULATION_VISUAL.md (10 min)  
**Learn**: Flowcharts, diagrams, state transitions

### Level 3: Technical Understanding
**Read**: RISK_PERCENTAGE_CALCULATION.md (20 min)  
**Learn**: Math, algorithms, ML features, code

### Level 4: Complete Mastery
**Read**: COMPLETE_RISK_GUIDE.md (30 min)  
**Learn**: Everything + testing + FAQs + edge cases

---

## 🎓 Learning Path

**For Developers:**
1. Quick Reference (5 min) - understand formula
2. Visual Guide (10 min) - see architecture
3. Percentage Calculation (20 min) - understand code
4. Complete Guide (15 min) - fill gaps

**For QA/Testers:**
1. Quick Reference (5 min) - understand formula
2. Visual Guide (10 min) - understand flows
3. Complete Guide → Testing Section (15 min) - run tests
4. Reference files as needed

**For Product Managers:**
1. Quick Reference - Formula and Thresholds
2. Visual Guide - Diagrams and examples
3. Complete Guide → Summary section

**For Researchers/ML Engineers:**
1. Complete Guide - ML section
2. Percentage Calculation - Feature extraction
3. Quick Reference - Training data (100 humans + 10 bots)

---

## 📱 Quick Access by Role

### Frontend Developer
- **Start**: RISK_QUICK_REFERENCE.md → Frontend Display Code
- **Deep**: COMPLETE_RISK_GUIDE.md → Frontend Files
- **Code**: `/frontend/src/App.jsx` line 109

### Backend Developer
- **Start**: RISK_QUICK_REFERENCE.md → Backend Calculation Order
- **Deep**: RISK_PERCENTAGE_CALCULATION.md → Backend Risk Calculation
- **Code**: `/backend/main.py` lines 260-330
- **ML**: `/backend/intelligence_engine.py` lines 235-319

### DevOps/Infrastructure
- **Start**: RISK_QUICK_REFERENCE.md → Real-time Latency
- **Deep**: COMPLETE_RISK_GUIDE.md → WebSocket Communication
- **Monitor**: Latency < 100ms total

### Data Scientist
- **Start**: RISK_PERCENTAGE_CALCULATION.md → ML Features
- **Deep**: COMPLETE_RISK_GUIDE.md → Detection Layers
- **Training**: 100 human sessions + 10 bot sessions

### QA Engineer
- **Start**: RISK_QUICK_REFERENCE.md → Examples
- **Test**: COMPLETE_RISK_GUIDE.md → Testing Guide
- **Scenarios**: 3 manual tests + 1 automated test

---

## ✅ Checklist: Understanding Risk Calculation

- [ ] I can explain the formula in 1 sentence
- [ ] I know what the 3 penalties are and their values
- [ ] I understand what 200ms threshold means
- [ ] I can explain exponential decay with an example
- [ ] I know the 3 risk thresholds (0-30%, 30-70%, 70-100%)
- [ ] I can find the code in `/backend/main.py`
- [ ] I understand DAG path validation
- [ ] I know what ML features are extracted
- [ ] I can run at least one test scenario
- [ ] I can explain why MAX is used instead of SUM

**If yes to all**: You've mastered risk calculation! 🎉

---

## 🐛 Common Questions

**Q: Which file should I read?**  
A: Start with RISK_QUICK_REFERENCE.md, then choose based on your needs.

**Q: Are all files necessary to read?**  
A: No! RISK_QUICK_REFERENCE.md is sufficient for 80% of questions. Others are optional deep dives.

**Q: Can I skip the visual guide?**  
A: Yes if you're fine with text. Visual guide helps with understanding architecture.

**Q: Which is most important?**  
A: COMPLETE_RISK_GUIDE.md has everything, but RISK_QUICK_REFERENCE.md has essentials.

**Q: Are the formulas the same in all files?**  
A: Yes! Different presentation, same content. Quick Ref = simple. Complete = detailed.

---

## 📊 File Statistics

| File | Lines | Focus | Read Time |
|---|---|---|---|
| RISK_QUICK_REFERENCE.md | ~200 | Summary | 5 min |
| RISK_CALCULATION_VISUAL.md | ~350 | Diagrams | 10 min |
| RISK_PERCENTAGE_CALCULATION.md | ~400 | Technical | 20 min |
| COMPLETE_RISK_GUIDE.md | ~600 | Comprehensive | 30 min |

**Total**: ~1,550 lines of documentation  
**Total reading time**: ~65 minutes for all (optional!)  
**Minimum understanding**: 5 minutes (Quick Ref only)

---

## 🔄 Document Relationships

```
RISK_QUICK_REFERENCE.md (Summary)
        ↑
        ├─→ RISK_CALCULATION_VISUAL.md (Visuals)
        │
        ├─→ RISK_PERCENTAGE_CALCULATION.md (Technical)
        │
        └─→ COMPLETE_RISK_GUIDE.md (Everything)
                ↑
                ├─ Includes examples from Quick Ref
                ├─ Explains visuals from Visual Guide
                ├─ Explains code from Calculation
                └─ Adds FAQs and edge cases
```

---

## 📝 Last Updated

- **Quick Reference**: April 20, 2026
- **Visual Guide**: April 20, 2026
- **Percentage Calculation**: April 20, 2026
- **Complete Guide**: April 20, 2026

All documents synchronized and consistent! ✅

---

## 🚀 Next Steps

1. **Choose your document** based on role/needs (see above)
2. **Read for 5-30 minutes** depending on selection
3. **Run a test scenario** from COMPLETE_RISK_GUIDE.md
4. **Refer back** as needed during development

---

**Happy learning!** 🎓

If you have questions not covered in these guides, they're detailed enough that the answer is likely in one of them. Use Ctrl+F to search!

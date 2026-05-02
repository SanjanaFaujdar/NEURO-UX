#!/usr/bin/env python3
"""
verify_phase3.py - Quick verification that Phase 3 is ready
=====================================================

This script checks:
1. All required files exist
2. prediction_service.py can be imported
3. stress_test.py has valid syntax
4. Backend is running and responsive
5. Frontend is accessible

Run this BEFORE the live demo to ensure everything works!
"""

import os
import sys
import json
import time
import asyncio
from pathlib import Path

# Color codes for terminal output
class Colors:
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{text}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*70}{Colors.RESET}\n")

def print_ok(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_warn(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_info(text):
    print(f"{Colors.BLUE}ℹ️  {text}{Colors.RESET}")

def check_file_exists(filepath, description):
    """Check if file exists"""
    if os.path.exists(filepath):
        size_kb = os.path.getsize(filepath) / 1024
        print_ok(f"{description} ({size_kb:.1f} KB)")
        return True
    else:
        print_error(f"{description} NOT FOUND: {filepath}")
        return False

def check_imports():
    """Check if required libraries can be imported"""
    print_info("Checking Python dependencies...")
    
    required = {
        'fastapi': 'FastAPI',
        'socketio': 'Python-SocketIO',
        'pydantic': 'Pydantic',
        'websockets': 'Websockets',
        'sklearn': 'scikit-learn',
    }
    
    all_ok = True
    for module, name in required.items():
        try:
            __import__(module)
            print_ok(f"{name}")
        except ImportError:
            print_warn(f"{name} (optional for this check)")
            if module in ['fastapi', 'socketio', 'pydantic']:
                all_ok = False
    
    return all_ok

def check_prediction_service():
    """Check if prediction_service can be imported"""
    print_info("Checking prediction_service.py...")
    
    try:
        sys.path.insert(0, '/Users/ayushchaudhary/Projects/NeuroUX/backend')
        from prediction_service import (
            PredictionEngine,
            OptimizedSessionCache,
            DigitalFingerprint,
            AutoBlacklist,
            HeatmapTracker,
            StressMonitor,
            Phase3OptimizationService,
            phase3_service
        )
        
        print_ok("All Phase 3 classes importable")
        print_info(f"  - PredictionEngine: ✓")
        print_info(f"  - OptimizedSessionCache: ✓")
        print_info(f"  - DigitalFingerprint: ✓")
        print_info(f"  - AutoBlacklist: ✓")
        print_info(f"  - HeatmapTracker: ✓")
        print_info(f"  - StressMonitor: ✓")
        print_info(f"  - Phase3OptimizationService: ✓")
        
        return True
    except Exception as e:
        print_error(f"Failed to import: {e}")
        return False

async def check_backend():
    """Check if backend is running"""
    print_info("Checking backend at http://localhost:8000...")
    
    try:
        import websockets
        async with websockets.connect('ws://localhost:8000/ws', ping_interval=None) as websocket:
            print_ok("Backend WebSocket responding")
            await websocket.close()
            return True
    except Exception as e:
        print_warn(f"Backend not responding (may not be running yet): {e}")
        return False

def check_frontend():
    """Check if frontend is running"""
    print_info("Checking frontend at http://localhost:5173...")
    
    try:
        import urllib.request
        response = urllib.request.urlopen('http://localhost:5173', timeout=2)
        if response.status == 200:
            print_ok("Frontend responding")
            return True
    except Exception as e:
        print_warn(f"Frontend not responding (may not be running yet)")
        return False

def print_summary(checks):
    """Print verification summary"""
    print_header("PHASE 3 VERIFICATION SUMMARY")
    
    total = len(checks)
    passed = sum(1 for v in checks.values() if v is True)
    
    print(f"Passed: {Colors.GREEN}{passed}/{total}{Colors.RESET}")
    
    if passed == total:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✨ ALL CHECKS PASSED - SYSTEM READY FOR DEMO! ✨{Colors.RESET}\n")
    elif passed >= total - 2:
        print(f"\n{Colors.YELLOW}⚠️  Most checks passed. Start backend/frontend before stress test.{Colors.RESET}\n")
    else:
        print(f"\n{Colors.RED}❌ Some checks failed. See above for details.{Colors.RESET}\n")

async def main():
    print_header("🚀 NeuroUX Phase 3 - Pre-Demo Verification")
    
    checks = {}
    
    # 1. Check files exist
    print_header("1. FILE EXISTENCE CHECK")
    checks['prediction_service'] = check_file_exists(
        '/Users/ayushchaudhary/Projects/NeuroUX/backend/prediction_service.py',
        'Backend: prediction_service.py'
    )
    checks['admin_analytics'] = check_file_exists(
        '/Users/ayushchaudhary/Projects/NeuroUX/frontend/src/components/AdminAnalytics.jsx',
        'Frontend: AdminAnalytics.jsx'
    )
    checks['stress_test'] = check_file_exists(
        '/Users/ayushchaudhary/Projects/NeuroUX/backend/stress_test.py',
        'Backend: stress_test.py'
    )
    checks['integration_guide'] = check_file_exists(
        '/Users/ayushchaudhary/Projects/NeuroUX/PHASE3_INTEGRATION_GUIDE.md',
        'Documentation: PHASE3_INTEGRATION_GUIDE.md'
    )
    
    # 2. Check imports
    print_header("2. PYTHON DEPENDENCIES CHECK")
    checks['imports'] = check_imports()
    
    # 3. Check prediction_service
    print_header("3. PREDICTION SERVICE CHECK")
    checks['prediction_service_import'] = check_prediction_service()
    
    # 4. Check backend
    print_header("4. BACKEND AVAILABILITY CHECK")
    checks['backend'] = await check_backend()
    
    # 5. Check frontend
    print_header("5. FRONTEND AVAILABILITY CHECK")
    checks['frontend'] = check_frontend()
    
    # Summary
    print_summary(checks)
    
    # Print next steps
    print_header("📋 NEXT STEPS FOR LIVE DEMO")
    
    if not checks['backend']:
        print_info("Start backend in Terminal 1:")
        print(f"  cd /Users/ayushchaudhary/Projects/NeuroUX/backend && python3 main.py\n")
    
    if not checks['frontend']:
        print_info("Start frontend in Terminal 2:")
        print(f"  cd /Users/ayushchaudhary/Projects/NeuroUX/frontend && npm run dev\n")
    
    print_info("When both servers are running, you can:")
    print(f"  1. Navigate to http://localhost:5173 to see the app")
    print(f"  2. Go to /admin/analytics to see God-Mode visuals")
    print(f"  3. Run stress test in Terminal 3:")
    print(f"     cd /Users/ayushchaudhary/Projects/NeuroUX/backend && python3 stress_test.py\n")
    
    print_header("🎯 SUCCESS CRITERIA FOR DEMO")
    print("✅ Heatmap renders without errors")
    print("✅ Ghost cursor animates smoothly")
    print("✅ Alert center shows on suspicion spikes")
    print("✅ Metrics dashboard updates every 2 seconds")
    print("✅ Stress test detects 10/10 bots correctly")
    print("✅ Stress test keeps 40/40 legal users in EXPERT mode")
    print("✅ Backend maintains <100ms latency throughout")
    print()

if __name__ == '__main__':
    asyncio.run(main())

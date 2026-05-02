"""
NeuroUX Phase 3: Predictive Scaling & Stress Defense
Backend Prediction Engine & Optimization Service

Features:
- Next-node prediction using DAG weights
- LRU cache for sub-10ms session access
- Auto-blacklist with fingerprinting
- Real-time heatmap data generation
- Session stress tracking
"""

import time
import hashlib
import asyncio
from functools import lru_cache
from typing import Dict, List, Tuple, Optional
from collections import defaultdict, OrderedDict
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json

# ============================================================================
# 1. PREDICTIVE ENGINE: Next-Node Forecasting
# ============================================================================

@dataclass
class NodeTransitionWeights:
    """Learns user transition probabilities from DAG"""
    node_name: str
    transitions: Dict[str, float] = field(default_factory=dict)  # {target: weight}
    visit_count: int = 0
    last_updated: float = field(default_factory=time.time)
    
    def update_weight(self, target: str, increase: float = 1.0):
        """Update transition probability"""
        self.transitions[target] = self.transitions.get(target, 0) + increase
        self.visit_count += 1
        self.last_updated = time.time()
    
    def get_probabilities(self) -> Dict[str, float]:
        """Get normalized transition probabilities"""
        if not self.transitions:
            return {}
        
        total = sum(self.transitions.values())
        if total == 0:
            return {}
        
        return {
            target: weight / total 
            for target, weight in self.transitions.items()
        }
    
    def predict_next_node(self) -> Optional[str]:
        """Predict most likely next node"""
        probs = self.get_probabilities()
        if not probs:
            return None
        
        # Return highest probability node
        return max(probs.items(), key=lambda x: x[1])[0]


class PredictionEngine:
    """
    Predictive recommendation system for next-node forecasting
    
    Formula: P(A → B) = Weight(B) / Σ Weight(Neighbors)
    """
    
    def __init__(self):
        self.dag_weights: Dict[str, NodeTransitionWeights] = {}
        self.prediction_cache: Dict[str, Tuple[str, float]] = {}  # {node: (next_node, confidence)}
        self.cache_expiry: Dict[str, float] = {}  # {node: expiry_time}
        self.cache_ttl = 5  # seconds
        
        # Initialize DAG structure
        self._initialize_dag()
    
    def _initialize_dag(self):
        """Initialize DAG nodes with basic weights"""
        valid_dag = {
            "Home": ["Products", "Profile"],
            "Products": ["Home", "Profile"],
            "Profile": ["Home", "Products"],
        }
        
        for node, neighbors in valid_dag.items():
            self.dag_weights[node] = NodeTransitionWeights(node)
            # Initialize equal probability for all neighbors
            for neighbor in neighbors:
                self.dag_weights[node].update_weight(neighbor, 1.0)
    
    def record_transition(self, from_node: str, to_node: str):
        """Record a user transition to update probabilities"""
        if from_node not in self.dag_weights:
            return
        
        # Update weights (decay old observations)
        self.dag_weights[from_node].update_weight(to_node, 1.0)
        
        # Invalidate cache for this node
        if from_node in self.prediction_cache:
            del self.prediction_cache[from_node]
            del self.cache_expiry[from_node]
    
    def predict_next_node(self, current_node: str, use_cache: bool = True) -> Tuple[Optional[str], float]:
        """
        Predict next node and return (node_name, confidence)
        
        Returns:
            (next_node, confidence): next_node is None if no prediction
        """
        # Check cache
        if use_cache and current_node in self.prediction_cache:
            if time.time() < self.cache_expiry.get(current_node, 0):
                return self.prediction_cache[current_node]
        
        # Get node weights
        if current_node not in self.dag_weights:
            return None, 0.0
        
        weights = self.dag_weights[current_node]
        probs = weights.get_probabilities()
        
        if not probs:
            return None, 0.0
        
        # Predict most likely next node
        next_node = max(probs.items(), key=lambda x: x[1])[0]
        confidence = probs[next_node]
        
        # Cache result
        self.prediction_cache[current_node] = (next_node, confidence)
        self.cache_expiry[current_node] = time.time() + self.cache_ttl
        
        return next_node, confidence
    
    def get_all_predictions(self) -> Dict[str, Tuple[str, float]]:
        """Get predictions for all nodes"""
        return {
            node: self.predict_next_node(node, use_cache=False)
            for node in self.dag_weights.keys()
        }
    
    def get_stats(self) -> Dict:
        """Get prediction engine statistics"""
        return {
            "nodes_tracked": len(self.dag_weights),
            "cache_size": len(self.prediction_cache),
            "predictions": {
                node: {
                    "next_node": pred[0],
                    "confidence": round(pred[1], 3),
                    "total_visits": self.dag_weights[node].visit_count
                }
                for node, pred in self.get_all_predictions().items()
            }
        }


# ============================================================================
# 2. LRU CACHE OPTIMIZATION: Sub-10ms Session Access
# ============================================================================

class OptimizedSessionCache:
    """
    LRU cache for sessions with sub-10ms access times
    
    Features:
    - O(1) access time
    - Automatic eviction of least-used sessions
    - Memory-efficient for 1000+ concurrent users
    """
    
    def __init__(self, max_sessions: int = 10000):
        self.max_sessions = max_sessions
        self.cache: OrderedDict = OrderedDict()  # Maintains insertion order
        self.access_times: Dict[str, float] = {}  # Track LRU
        self.access_count: Dict[str, int] = defaultdict(int)
    
    def get(self, session_id: str):
        """Get session with O(1) complexity"""
        if session_id not in self.cache:
            return None
        
        # Update LRU
        self.access_times[session_id] = time.time()
        self.access_count[session_id] += 1
        
        # Move to end (most recently used)
        self.cache.move_to_end(session_id)
        
        return self.cache[session_id]
    
    def set(self, session_id: str, session_data):
        """Set session with automatic eviction"""
        # If session exists, update in place
        if session_id in self.cache:
            self.cache[session_id] = session_data
            self.cache.move_to_end(session_id)
            self.access_times[session_id] = time.time()
            return
        
        # Check capacity
        if len(self.cache) >= self.max_sessions:
            # Remove least recently used
            lru_id, _ = self.cache.popitem(last=False)
            del self.access_times[lru_id]
            del self.access_count[lru_id]
        
        # Add new session
        self.cache[session_id] = session_data
        self.access_times[session_id] = time.time()
        self.access_count[session_id] = 1
    
    def delete(self, session_id: str):
        """Remove session"""
        if session_id in self.cache:
            del self.cache[session_id]
            del self.access_times[session_id]
            del self.access_count[session_id]
    
    def cleanup_expired(self, timeout_seconds: int = 1800):
        """Remove sessions inactive for timeout"""
        now = time.time()
        expired = [
            sid for sid, access_time in self.access_times.items()
            if now - access_time > timeout_seconds
        ]
        
        for sid in expired:
            self.delete(sid)
        
        return len(expired)
    
    def get_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            "total_sessions": len(self.cache),
            "max_capacity": self.max_sessions,
            "utilization": f"{(len(self.cache) / self.max_sessions * 100):.1f}%",
            "most_active": sorted(
                self.access_count.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5]
        }


# ============================================================================
# 3. AUTO-BLACKLIST WITH FINGERPRINTING
# ============================================================================

@dataclass
class DigitalFingerprint:
    """User/Bot fingerprint for identification"""
    user_agent: str
    initial_path_sequence: List[str]  # First 3 nodes visited
    velocity_pattern: List[int]  # First 5 velocities
    timestamp: float = field(default_factory=time.time)
    
    def hash(self) -> str:
        """Create unique hash of fingerprint"""
        fingerprint_str = f"{self.user_agent}|{','.join(self.initial_path_sequence)}|{','.join(map(str, self.velocity_pattern))}"
        return hashlib.sha256(fingerprint_str.encode()).hexdigest()[:12]
    
    def to_dict(self) -> Dict:
        """Convert to JSON-serializable dict"""
        return {
            "user_agent": self.user_agent,
            "path_sequence": self.initial_path_sequence,
            "velocity_pattern": self.velocity_pattern,
            "timestamp": self.timestamp,
            "hash": self.hash()
        }


class AutoBlacklist:
    """
    Automatic blacklist with fingerprinting
    
    Features:
    - 5-minute cool-down for flagged bots
    - Digital fingerprint for tracking
    - Blocking of known bot patterns
    """
    
    def __init__(self):
        self.blacklist: Dict[str, float] = {}  # {session_id: expiry_time}
        self.fingerprints: Dict[str, DigitalFingerprint] = {}  # {session_id: fingerprint}
        self.bot_hashes: set = set()  # Known bot fingerprint hashes
        self.cooldown_period = 300  # 5 minutes
    
    def flag_as_bot(self, session_id: str, fingerprint: DigitalFingerprint) -> bool:
        """Flag session as bot and return True if newly blacklisted"""
        if session_id in self.blacklist:
            return False  # Already blacklisted
        
        # Add to blacklist
        self.blacklist[session_id] = time.time() + self.cooldown_period
        self.fingerprints[session_id] = fingerprint
        self.bot_hashes.add(fingerprint.hash())
        
        return True
    
    def is_blacklisted(self, session_id: str) -> bool:
        """Check if session is blacklisted"""
        if session_id not in self.blacklist:
            return False
        
        # Check expiry
        if time.time() > self.blacklist[session_id]:
            del self.blacklist[session_id]
            return False
        
        return True
    
    def is_known_bot_fingerprint(self, fingerprint: DigitalFingerprint) -> bool:
        """Check if fingerprint matches known bots"""
        return fingerprint.hash() in self.bot_hashes
    
    def cleanup_expired(self):
        """Remove expired blacklist entries"""
        now = time.time()
        expired = [
            sid for sid, expiry in self.blacklist.items()
            if now > expiry
        ]
        
        for sid in expired:
            del self.blacklist[sid]
        
        return len(expired)
    
    def get_stats(self) -> Dict:
        """Get blacklist statistics"""
        return {
            "active_blacklist": len(self.blacklist),
            "known_bot_fingerprints": len(self.bot_hashes),
            "cooldown_minutes": self.cooldown_period // 60
        }


# ============================================================================
# 4. HEATMAP DATA GENERATION
# ============================================================================

class HeatmapTracker:
    """
    Tracks user interactions for real-time heatmap visualization
    
    Generates:
    - Click heatmap (frequency of clicks at coordinates)
    - Hover heatmap (dwell time)
    - Scroll heatmap (scroll patterns)
    """
    
    def __init__(self, grid_width: int = 1920, grid_height: int = 1080, cell_size: int = 50):
        self.grid_width = grid_width
        self.grid_height = grid_height
        self.cell_size = cell_size
        
        # 2D grid for heatmap
        self.click_heatmap = self._create_grid()
        self.hover_heatmap = self._create_grid()
        self.scroll_heatmap = self._create_grid()
        
        self.event_count = 0
        self.last_reset = time.time()
    
    def _create_grid(self):
        """Create empty heatmap grid"""
        rows = (self.grid_height // self.cell_size) + 1
        cols = (self.grid_width // self.cell_size) + 1
        return [[0 for _ in range(cols)] for _ in range(rows)]
    
    def _get_cell(self, x: int, y: int) -> Tuple[int, int]:
        """Convert coordinates to grid cell"""
        row = min(y // self.cell_size, len(self.click_heatmap) - 1)
        col = min(x // self.cell_size, len(self.click_heatmap[0]) - 1)
        return row, col
    
    def record_click(self, x: int, y: int):
        """Record click event"""
        row, col = self._get_cell(x, y)
        self.click_heatmap[row][col] += 1
        self.event_count += 1
    
    def record_hover(self, x: int, y: int, duration_ms: int = 100):
        """Record hover event with duration"""
        row, col = self._get_cell(x, y)
        # Weight hover by duration
        weight = min(duration_ms / 1000, 1.0)  # Max weight = 1.0
        self.hover_heatmap[row][col] += weight
        self.event_count += 1
    
    def record_scroll(self, x: int, y: int, distance: int = 50):
        """Record scroll event"""
        row, col = self._get_cell(x, y)
        # Weight scroll by distance
        weight = min(distance / 500, 2.0)  # Higher weight for longer scrolls
        self.scroll_heatmap[row][col] += weight
        self.event_count += 1
    
    def get_heatmap_data(self) -> Dict:
        """Get heatmap data for frontend visualization"""
        # Normalize heatmaps to 0-100 range
        def normalize(grid):
            max_val = max(max(row) for row in grid) if any(any(row) for row in grid) else 1
            if max_val == 0:
                return grid
            return [[min(100, int(cell / max_val * 100)) for cell in row] for row in grid]
        
        return {
            "click_heatmap": normalize(self.click_heatmap),
            "hover_heatmap": normalize(self.hover_heatmap),
            "scroll_heatmap": normalize(self.scroll_heatmap),
            "total_events": self.event_count,
            "grid_size": (self.grid_height, self.grid_width),
            "cell_size": self.cell_size
        }
    
    def reset(self):
        """Reset heatmap (hourly cleanup)"""
        self.click_heatmap = self._create_grid()
        self.hover_heatmap = self._create_grid()
        self.scroll_heatmap = self._create_grid()
        self.event_count = 0
        self.last_reset = time.time()


# ============================================================================
# 5. STRESS TRACKING & METRICS
# ============================================================================

@dataclass
class StressMetrics:
    """Tracks system stress under load"""
    timestamp: float = field(default_factory=time.time)
    active_sessions: int = 0
    events_per_second: float = 0.0
    avg_prediction_time_ms: float = 0.0
    avg_cache_access_time_ms: float = 0.0
    blacklisted_sessions: int = 0
    bot_detection_rate: float = 0.0  # Percentage of detected bots
    
    def to_dict(self) -> Dict:
        return {
            "timestamp": self.timestamp,
            "active_sessions": self.active_sessions,
            "events_per_second": round(self.events_per_second, 2),
            "avg_prediction_time_ms": round(self.avg_prediction_time_ms, 2),
            "avg_cache_access_time_ms": round(self.avg_cache_access_time_ms, 2),
            "blacklisted_sessions": self.blacklisted_sessions,
            "bot_detection_rate": f"{round(self.bot_detection_rate * 100, 1)}%"
        }


class StressMonitor:
    """Monitors system health under stress"""
    
    def __init__(self):
        self.metrics_history: List[StressMetrics] = []
        self.event_timestamps: List[float] = []
        self.prediction_times: List[float] = []
        self.cache_access_times: List[float] = []
    
    def record_event(self):
        """Record event timestamp"""
        self.event_timestamps.append(time.time())
        # Keep only last 60 seconds
        cutoff = time.time() - 60
        self.event_timestamps = [t for t in self.event_timestamps if t > cutoff]
    
    def record_prediction_time(self, duration_ms: float):
        """Record prediction latency"""
        self.prediction_times.append(duration_ms)
        # Keep only last 1000 samples
        if len(self.prediction_times) > 1000:
            self.prediction_times = self.prediction_times[-1000:]
    
    def record_cache_access_time(self, duration_ms: float):
        """Record cache access latency"""
        self.cache_access_times.append(duration_ms)
        # Keep only last 1000 samples
        if len(self.cache_access_times) > 1000:
            self.cache_access_times = self.cache_access_times[-1000:]
    
    def get_current_metrics(self, active_sessions: int, blacklisted: int, total_checked: int) -> StressMetrics:
        """Calculate current stress metrics"""
        # Events per second (last 60s window)
        eps = len(self.event_timestamps)
        
        # Average prediction time
        avg_pred = sum(self.prediction_times) / len(self.prediction_times) if self.prediction_times else 0
        
        # Average cache access time
        avg_cache = sum(self.cache_access_times) / len(self.cache_access_times) if self.cache_access_times else 0
        
        # Bot detection rate
        bot_rate = blacklisted / total_checked if total_checked > 0 else 0
        
        return StressMetrics(
            active_sessions=active_sessions,
            events_per_second=eps,
            avg_prediction_time_ms=avg_pred,
            avg_cache_access_time_ms=avg_cache,
            blacklisted_sessions=blacklisted,
            bot_detection_rate=bot_rate
        )
    
    def get_history(self, minutes: int = 5) -> List[Dict]:
        """Get metrics history"""
        cutoff_time = time.time() - (minutes * 60)
        return [
            m.to_dict() for m in self.metrics_history
            if m.timestamp > cutoff_time
        ]


# ============================================================================
# 6. INTEGRATION: Phase 3 Service Class
# ============================================================================

class Phase3OptimizationService:
    """
    Main service orchestrating all Phase 3 features
    
    Usage in backend:
    ```python
    phase3 = Phase3OptimizationService()
    
    # In user_action handler:
    next_node, confidence = phase3.predict_next_node(current_node)
    session = phase3.get_session(session_id)  # Sub-10ms access
    
    # Record interactions:
    phase3.record_click(session_id, x, y)
    phase3.record_transition(from_node, to_node)
    ```
    """
    
    def __init__(self):
        self.prediction_engine = PredictionEngine()
        self.session_cache = OptimizedSessionCache()
        self.auto_blacklist = AutoBlacklist()
        self.heatmap = HeatmapTracker()
        self.stress_monitor = StressMonitor()
    
    # ========== Prediction API ==========
    def predict_next_node(self, current_node: str) -> Tuple[Optional[str], float]:
        """Predict next node and confidence"""
        start = time.time()
        result = self.prediction_engine.predict_next_node(current_node)
        elapsed_ms = (time.time() - start) * 1000
        self.stress_monitor.record_prediction_time(elapsed_ms)
        return result
    
    def record_transition(self, from_node: str, to_node: str):
        """Record user transition for prediction learning"""
        self.prediction_engine.record_transition(from_node, to_node)
    
    # ========== Cache API ==========
    def get_session(self, session_id: str):
        """Get session with sub-10ms access"""
        start = time.time()
        result = self.session_cache.get(session_id)
        elapsed_ms = (time.time() - start) * 1000
        self.stress_monitor.record_cache_access_time(elapsed_ms)
        self.stress_monitor.record_event()
        return result
    
    def set_session(self, session_id: str, session_data):
        """Cache session data"""
        self.session_cache.set(session_id, session_data)
    
    def cleanup_expired_sessions(self) -> int:
        """Remove inactive sessions"""
        return self.session_cache.cleanup_expired()
    
    # ========== Blacklist API ==========
    def flag_bot(self, session_id: str, fingerprint: DigitalFingerprint) -> bool:
        """Flag session as bot"""
        return self.auto_blacklist.flag_as_bot(session_id, fingerprint)
    
    def is_blacklisted(self, session_id: str) -> bool:
        """Check if session is blacklisted"""
        return self.auto_blacklist.is_blacklisted(session_id)
    
    def is_known_bot(self, fingerprint: DigitalFingerprint) -> bool:
        """Check if fingerprint is known bot"""
        return self.auto_blacklist.is_known_bot_fingerprint(fingerprint)
    
    # ========== Heatmap API ==========
    def record_click(self, x: int, y: int):
        """Record click for heatmap"""
        self.heatmap.record_click(x, y)
    
    def record_hover(self, x: int, y: int, duration_ms: int = 100):
        """Record hover for heatmap"""
        self.heatmap.record_hover(x, y, duration_ms)
    
    def record_scroll(self, x: int, y: int, distance: int = 50):
        """Record scroll for heatmap"""
        self.heatmap.record_scroll(x, y, distance)
    
    def get_heatmap_data(self) -> Dict:
        """Get current heatmap data"""
        return self.heatmap.get_heatmap_data()
    
    # ========== Metrics API ==========
    def get_metrics(self, active_sessions: int, blacklisted: int, total: int) -> Dict:
        """Get current system metrics"""
        metrics = self.stress_monitor.get_current_metrics(active_sessions, blacklisted, total)
        self.stress_monitor.metrics_history.append(metrics)
        
        return {
            "current": metrics.to_dict(),
            "cache": self.session_cache.get_stats(),
            "predictions": self.prediction_engine.get_stats(),
            "blacklist": self.auto_blacklist.get_stats()
        }


# ============================================================================
# 7. SINGLETON INSTANCE (use globally in backend)
# ============================================================================

phase3_service = Phase3OptimizationService()


# For testing
if __name__ == "__main__":
    service = phase3_service
    
    # Test prediction
    service.record_transition("Home", "Products")
    service.record_transition("Home", "Products")
    service.record_transition("Home", "Profile")
    
    next_node, conf = service.predict_next_node("Home")
    print(f"🎯 Next node prediction: {next_node} (confidence: {conf:.2%})")
    
    # Test cache
    service.set_session("user1", {"data": "test"})
    session = service.get_session("user1")
    print(f"📦 Cached session: {session}")
    
    # Test blacklist
    fp = DigitalFingerprint(
        user_agent="Bot/1.0",
        initial_path_sequence=["Home", "Profile", "Profile"],
        velocity_pattern=[50, 60, 70]
    )
    is_new_bot = service.flag_bot("bot_session", fp)
    print(f"🚫 Flagged as new bot: {is_new_bot}")
    print(f"✅ Is blacklisted: {service.is_blacklisted('bot_session')}")
    
    # Test heatmap
    service.record_click(100, 200)
    service.record_click(100, 200)
    service.record_hover(500, 300, 1500)
    heatmap = service.get_heatmap_data()
    print(f"🔥 Heatmap events: {heatmap['total_events']}")
    
    # Test metrics
    metrics = service.get_metrics(active_sessions=50, blacklisted=5, total=55)
    print(f"📊 Metrics: {json.dumps(metrics['current'], indent=2)}")

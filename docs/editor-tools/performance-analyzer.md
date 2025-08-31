---
title: SOAP Performance Analyzer
sidebar_position: 5
---

# SOAP Performance Analyzer

The **SOAP Performance Analyzer** is SoapKit's professional performance monitoring and optimization tool. It provides real-time analysis of event frequency, listener counts, variable change rates, and automatic detection of performance bottlenecks in your SOAP architecture.

## Overview

The Performance Analyzer monitors your SOAP assets during Play Mode, collecting detailed metrics and providing actionable optimization recommendations. It's designed to help you maintain high-performance SOAP architectures even in complex, large-scale projects.

**Access:** `Window > SoapKit > Performance Analyzer`

<!-- Add screenshot of Performance Analyzer main interface -->

### Key Features

- ⚡ **Real-Time Monitoring** - Live performance tracking during Play Mode
- 🔥 **Hotspot Detection** - Automatic identification of performance bottlenecks  
- 📊 **Comprehensive Metrics** - Event frequency, listener counts, memory usage
- 🎯 **Smart Recommendations** - AI-powered optimization suggestions
- 📈 **Historical Analysis** - Track performance trends over time
- 🚨 **Alert System** - Configurable thresholds and warnings
- 💡 **Optimization Guide** - Step-by-step improvement instructions
- 🔍 **Detailed Profiling** - Per-asset performance breakdown

---

## Core Analysis Features

### Real-Time Performance Monitoring

The analyzer continuously tracks your SOAP assets during Play Mode:

**Monitored Metrics:**
```csharp
🎯 Event Performance:
├── Raises per second (frequency analysis)
├── Listener count impact  
├── Average raise duration
└── Memory allocation patterns

📊 Variable Performance:
├── Change events per second
├── Value change frequency
├── Listener notification overhead  
└── Memory usage patterns

⚡ System Performance:
├── Total system overhead
├── Update distribution
├── Memory footprint
└── GC impact analysis
```

**Live Dashboard:**
- **System Status** - Overall health indicator with color-coded status
- **Active Monitoring** - Real-time counters and metrics
- **Performance Graphs** - Visual trends and spike detection
- **Resource Usage** - Memory and CPU impact tracking

<!-- Add screenshot of real-time monitoring dashboard -->

### Performance Tabs Overview

#### 1. Overview Tab

System-wide performance summary and key metrics:

**System Statistics:**
```csharp
📈 Current Performance Status:
Total Events: 23 | Total Variables: 31
Active Listeners: 156 | Event Rate: 12.4/sec
System Health: 🟢 Good (87/100)
Memory Usage: 2.1 MB | GC Impact: Low

🔥 Active Hotspots:
• PlayerInputHandler: 47 events/sec (🔴 Critical)
• UIUpdateManager: 23 variables/sec (🟡 Warning)  
• GameStateController: 15 listeners (⚪ Info)

⚡ Performance Trends:
• Event frequency increased 15% in last 5 minutes
• Memory usage stable at 2.1MB
• 3 new performance warnings detected
```

**Health Score Calculation:**
- **Green (80-100)** - Excellent performance, no issues
- **Yellow (60-79)** - Good performance, minor optimizations possible
- **Orange (40-59)** - Moderate issues, optimization recommended
- **Red (0-39)** - Critical issues, immediate attention required

<!-- Add screenshot of Overview tab with health metrics -->

#### 2. Events Tab

Detailed analysis of all GameEvent performance:

**Event Performance Metrics:**
```csharp
📡 Event: "OnPlayerHealthChanged" (IntGameEvent)
├── Total Raises: 847 (during session)
├── Current Rate: 12.3 raises/sec
├── Listeners: 8 active listeners
├── Performance: 🔴 HOTSPOT (high frequency)
├── Memory: 0.3 MB allocated
├── Recent Activity: [12.1s, 12.0s, 11.9s, 11.8s...]
└── Recommendation: Consider batching health updates

📡 Event: "OnGamePaused" (BoolGameEvent)  
├── Total Raises: 12 (during session)
├── Current Rate: 0.02 raises/sec
├── Listeners: 3 active listeners
├── Performance: 🟢 Optimal
└── Memory: 0.1 MB allocated
```

**Event Analysis Features:**
- **Frequency Tracking** - Detailed raise timing and patterns
- **Listener Impact** - Performance cost per listener
- **Memory Profiling** - Allocation tracking and leak detection
- **Optimization Suggestions** - Specific recommendations per event

<!-- Add screenshot of Events tab with detailed metrics -->

#### 3. Variables Tab

Comprehensive variable performance monitoring:

**Variable Performance Analysis:**
```csharp
📋 Variable: "PlayerHealth" (IntVariable)
├── Change Events: 234 (during session)
├── Change Rate: 3.2 changes/sec
├── Current Value: 85/100
├── C# Event Listeners: 5
├── GameEvent Listeners: 3 (via OnValueChangedEvent)
├── Performance: 🟡 Monitor (moderate frequency)
├── Memory: 0.2 MB
└── Value History: [85, 84, 83, 85, 86, 85...]

📋 Variable: "GameScore" (IntVariable)
├── Change Events: 45 (during session)  
├── Change Rate: 0.6 changes/sec
├── Current Value: 12,450
├── C# Event Listeners: 2
├── GameEvent Listeners: 1
├── Performance: 🟢 Optimal
└── Memory: 0.1 MB
```

**Variable-Specific Metrics:**
- **Change Frequency** - How often values are modified
- **Listener Distribution** - C# events vs GameEvent listeners
- **Value Tracking** - Historical value changes and patterns
- **Constraint Validation** - Performance impact of validation

<!-- Add screenshot of Variables tab showing variable metrics -->

#### 4. Issues Tab

Automatic detection and categorization of performance issues:

**Issue Categories:**
```csharp
🚨 Critical Issues (Immediate Action Required):
• High Frequency Event: "InputHandler" - 156 raises/sec
  → Recommendation: Implement input batching or throttling
  → Impact: 15% of total system performance cost

• Memory Leak Detected: "TempDataVariable" - Growing allocation
  → Recommendation: Check for listener cleanup in OnDestroy
  → Impact: 0.5MB/minute memory growth

⚠️ Warnings (Optimization Recommended):
• High Listener Count: "GameState" - 23 listeners  
  → Recommendation: Consider event mediator pattern
  → Impact: Potential O(n) performance scaling

• Unused Asset: "DebugCounter" - No activity detected
  → Recommendation: Remove if not needed for debugging
  → Impact: Memory waste (0.1MB)

ℹ️ Information (Best Practice Suggestions):
• Consider Variable Pooling: 12 variables with similar patterns
• Event Consolidation: 5 similar events could be merged
• Memory Optimization: 3 assets could benefit from lazy initialization
```

**Issue Severity Levels:**
- **🚨 Critical** - Performance impact > 10ms/frame or memory leaks
- **⚠️ Warning** - Optimization opportunities, scaling concerns
- **ℹ️ Info** - Best practice suggestions, minor improvements

<!-- Add screenshot of Issues tab with categorized problems -->

#### 5. Recommendations Tab

AI-powered optimization suggestions and best practices:

**General Optimization Tips:**
```csharp
🚀 Performance Best Practices:

Event Management:
• Use events sparingly - prefer direct variable access when possible
• Unsubscribe from events in OnDestroy/OnDisable to prevent memory leaks  
• Consider using UnityEvents for UI-only communications
• Batch multiple variable changes when possible
• Use SetValueSilent for initialization to avoid unnecessary events

Memory Management:
• Implement object pooling for frequently created/destroyed listeners
• Use weak references for temporary event subscriptions
• Clear event listeners during scene transitions
• Monitor memory usage in Profiler alongside SOAP Analyzer

Architecture Patterns:
• Use mediator pattern for events with 10+ listeners
• Consider command pattern for complex event chains
• Implement event aggregation for related notifications
• Use async/await patterns for heavy event processing
```

**Project-Specific Recommendations:**
Based on your current project analysis, the system provides tailored suggestions:

```csharp
🎯 Your Project Recommendations:

High Priority:
1. Optimize "PlayerInputHandler" - Currently consuming 23% of event budget
   → Implement input buffering with 60fps throttling
   → Expected improvement: 15ms/frame reduction

2. Consolidate UI Events - 8 similar UI events detected  
   → Merge into single parameterized event
   → Expected improvement: 40% listener reduction

3. Memory Cleanup - 3 potential memory leaks identified
   → Add proper OnDestroy cleanup in PlayerController.cs:45
   → Expected improvement: Prevent 2MB/hour memory growth

Medium Priority:
4. Variable Batching - 12 variables updated in same frame
5. Event Mediator - GameState has 18 listeners, consider mediator
6. Asset Cleanup - 5 unused assets consuming 1.2MB
```

<!-- Add screenshot of Recommendations tab with optimization guide -->

---

## Advanced Performance Features

### Hotspot Detection

Sophisticated algorithm for identifying performance bottlenecks:

**Detection Criteria:**
```csharp
🔥 Automatic Hotspot Detection:

Critical Thresholds:
├── Event Frequency > 30 raises/second
├── Variable Changes > 20 changes/second  
├── Listener Count > 20 per asset
├── Memory Growth > 1MB/minute
└── Update Time > 5ms per asset

Warning Thresholds:
├── Event Frequency > 10 raises/second
├── Variable Changes > 8 changes/second
├── Listener Count > 10 per asset  
├── Memory Usage > 5MB total
└── Update Time > 2ms per asset

Smart Analysis:
├── Trend Detection (performance degradation over time)
├── Spike Identification (sudden performance changes)
├── Pattern Recognition (cyclic performance issues)
└── Correlation Analysis (related performance problems)
```

**Hotspot Visualization:**
- **Heat Map Display** - Visual representation of performance intensity
- **Performance Graphs** - Time-series data showing trends
- **Spike Indicators** - Highlighting sudden performance changes
- **Correlation Lines** - Showing relationships between hotspots

<!-- Add screenshot of hotspot detection in action -->

### Historical Performance Tracking

Track performance trends over time for long-term optimization:

**Performance History Features:**
```csharp
📊 Performance Timeline:

Session History:
├── Performance snapshots every 30 seconds
├── Event frequency trends over time
├── Memory usage patterns
├── Optimization impact tracking
└── Performance regression detection

Long-term Tracking:
├── Daily performance summaries
├── Performance baselines for comparison
├── Optimization effectiveness metrics
├── Team performance reports
└── Release performance comparison
```

**Trend Analysis:**
- **Performance Regression Detection** - Alerts when performance degrades
- **Optimization Impact** - Measure effectiveness of optimizations
- **Seasonal Patterns** - Identify performance patterns over time
- **Baseline Comparison** - Compare current vs optimal performance

### Configurable Monitoring

Customize monitoring to match your project needs:

**Monitoring Settings:**
```csharp
⚙️ Performance Monitoring Configuration:

Update Frequency:
├── Real-time (0.1s) - Maximum precision, high overhead
├── Responsive (0.5s) - Good balance (recommended)  
├── Efficient (1.0s) - Lower overhead for large projects
└── Background (2.0s) - Minimal impact monitoring

Analysis Depth:
├── Basic - Core metrics only
├── Standard - Full analysis (recommended)
├── Detailed - Deep profiling with call stacks
└── Debug - Maximum detail for debugging

Alert Thresholds:
├── Conservative - Fewer alerts, higher thresholds
├── Balanced - Recommended settings
├── Aggressive - Early detection, more alerts  
└── Custom - Define your own thresholds
```

---

## Performance Optimization Workflows

### Real-Time Optimization Process

Step-by-step process for addressing performance issues:

**1. Detection Phase:**
```csharp
🎯 Performance Issue Detection:
1. Monitor Overview tab during typical gameplay
2. Watch for hotspot indicators (🔥 icons)  
3. Check Issues tab for automatically detected problems
4. Review system health score trends
```

**2. Analysis Phase:**
```csharp
🔍 Deep Performance Analysis:
1. Switch to specific tab (Events/Variables) for hotspot
2. Review detailed metrics and timing data  
3. Check listener counts and memory usage
4. Analyze frequency patterns and spikes
5. Identify root cause from usage patterns
```

**3. Optimization Phase:**
```csharp
🚀 Apply Performance Optimizations:
1. Follow specific recommendations from Issues tab
2. Implement suggested architectural changes
3. Monitor real-time impact of changes
4. Verify improvements in Overview tab
5. Document optimization decisions
```

**4. Validation Phase:**
```csharp
✅ Validate Optimization Success:  
1. Run extended Play Mode testing
2. Compare before/after performance metrics
3. Ensure no new issues introduced
4. Update performance baselines
5. Share results with team
```

### Production Performance Monitoring

Best practices for maintaining performance in shipped games:

**Pre-Release Checklist:**
```csharp
📋 Performance Release Checklist:

Architecture Review:
☐ No Critical performance issues
☐ All hotspots optimized or documented  
☐ Memory usage within budget (< 10MB SOAP overhead)
☐ Event frequency under control (< 100 total/sec)
☐ Unused assets removed

Performance Validation:
☐ Extended gameplay session without degradation
☐ Memory stable over 30+ minute sessions
☐ Performance consistent across target devices
☐ No memory leaks detected
☐ GC impact minimized

Documentation:
☐ Performance characteristics documented
☐ Known performance limitations noted
☐ Optimization opportunities identified
☐ Monitoring strategy defined
☐ Team training completed
```

**Post-Release Monitoring:**
- **Performance Telemetry** - Collect performance data from live games
- **Regression Detection** - Monitor for performance degradation in updates
- **Optimization Planning** - Plan future optimizations based on real usage data

---

## Integration with Unity Profiler

Seamless integration with Unity's built-in profiling tools:

### Profiler Integration

**Automatic Profiler Markers:**
```csharp
// SOAP Performance Analyzer automatically adds profiler markers:
Profiler.BeginSample("SOAP.Event.Raise: " + eventName);
Profiler.BeginSample("SOAP.Variable.Set: " + variableName);
Profiler.BeginSample("SOAP.Listener.Notify: " + listenerCount);

// View in Unity Profiler:
└── SOAP Performance
    ├── Event System (2.1ms)
    │   ├── PlayerHealth.Raise (0.8ms)
    │   ├── GameState.Raise (0.6ms)  
    │   └── InputHandler.Raise (0.7ms)
    └── Variable System (1.3ms)
        ├── PlayerPosition.Set (0.4ms)
        ├── UICounter.Set (0.5ms)
        └── GameScore.Set (0.4ms)
```

**Cross-Tool Workflow:**
1. **SOAP Analyzer** - Identify performance hotspots
2. **Unity Profiler** - Deep dive into specific frame analysis
3. **SOAP Analyzer** - Validate optimization effectiveness
4. **Unity Profiler** - Confirm system-wide improvement

<!-- Add screenshot of Profiler integration showing SOAP markers -->

---

## Team Collaboration Features

### Performance Reports

Generate detailed performance reports for team sharing:

**Automated Reports:**
```csharp
📄 SOAP Performance Report - [Project Name]
Generated: [Date/Time] | Session: 45 minutes | Build: v1.2.3

Executive Summary:
├── Overall Health: 🟢 Good (84/100)
├── Critical Issues: 0
├── Warnings: 3  
├── Memory Usage: 2.1MB (within budget)
└── Optimization Opportunities: 5 identified

Performance Highlights:
├── Top Performer: UIManager - 0.1ms average
├── Biggest Improvement: InputSystem - 60% faster after optimization
├── Memory Champion: GameStateController - 0.05MB usage
└── Most Active: PlayerHealthSystem - 1,247 events processed

Action Items:
1. [HIGH] Optimize PlayerInputHandler frequency (assigned to: @developer)
2. [MED] Implement event batching in UISystem (assigned to: @ui-team)  
3. [LOW] Clean up 5 unused debug assets (assigned to: @intern)

Trends:
├── Event frequency stable over session
├── Memory usage grew 0.2MB (acceptable)
├── No performance regressions detected
└── 3 optimizations successfully implemented
```

### Team Dashboard

Share performance insights across your development team:

**Dashboard Features:**
- **Team Performance Goals** - Shared performance targets and budgets
- **Optimization Tracking** - Track who implemented what optimizations
- **Performance History** - Team-wide performance trend tracking
- **Knowledge Sharing** - Best practices and successful optimization patterns

---

## Troubleshooting

### Common Performance Issues

**Q: "High event frequency but can't find the cause"**
A: Use detailed event tracking:
1. Switch to **Events tab** and sort by frequency
2. Enable **"Show Recent Activity"** to see exact timing
3. Use **Unity Profiler integration** for call stack analysis
4. Check for event loops (events triggering other events)

**Q: "Memory usage keeps growing"**
A: Identify memory leaks:
1. Monitor **Variables tab** for growing memory usage
2. Check **Issues tab** for leak detection alerts
3. Review listener cleanup in component OnDestroy methods
4. Use **"Clear Data"** button to reset tracking and isolate leaks

**Q: "Performance good in editor but poor in build"**
A: Validate build performance:
1. Enable **Development Build** with profiler support
2. Connect **Performance Analyzer** to running build
3. Compare editor vs build metrics in **Overview tab**
4. Check for build-specific optimization differences

### Debug Configuration

Advanced debugging options for complex issues:

```csharp
🔧 Advanced Debug Settings:

Deep Analysis Mode:
├── Call Stack Tracking: Yes/No
├── Memory Allocation Tracking: Yes/No  
├── Cross-Thread Event Detection: Yes/No
├── Reflection Performance Impact: Yes/No
└── Full GC Impact Analysis: Yes/No

Logging Configuration:
├── Log Level: Error/Warning/Info/Debug/Verbose
├── Performance Logs: Yes/No
├── Memory Logs: Yes/No
├── Event Trace Logs: Yes/No
└── Optimization Logs: Yes/No

Export Options:
├── Export Performance Data: CSV/JSON/XML
├── Export Optimization Report: PDF/MD/HTML
├── Export Debug Logs: TXT/LOG  
└── Export Profiler Data: Unity Profiler Format
```

---

The **SOAP Performance Analyzer** is your comprehensive solution for maintaining high-performance SOAP architectures. It transforms performance optimization from guesswork into data-driven decisions, ensuring your game runs smoothly across all platforms! ⚡📊

---

## Next Steps

- **[Dependency Visualizer](./dependency-visualizer)** - Understand your SOAP architecture relationships
- **[Debug Window](./debug-window)** - Debug performance issues in real-time
- **[Best Practices](../advanced/best-practices)** - Performance optimization guidelines
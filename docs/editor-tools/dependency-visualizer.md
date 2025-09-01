---
title: SOAP Dependency Visualizer
sidebar_position: 4
---

# SOAP Dependency Visualizer

The **SOAP Dependency Visualizer** is SoapKit's advanced dependency mapping and analysis tool. It provides real-time visualization of relationships between SOAP assets, GameObjects, and components throughout your project, helping you understand data flow and optimize your architecture.

## Overview

The Dependency Visualizer offers multiple view modes to analyze your SOAP architecture from different perspectives, providing insights into usage patterns, potential bottlenecks, and optimization opportunities.

**Access:** `Window > SoapKit > Dependency Visualizer`

<!-- Add screenshot of main dependency visualizer window -->

### Key Features

- 🗺️ **Interactive Dependency Maps** - Visual relationship graphs with real-time updates
- 🎯 **Multiple View Modes** - GameObject and Asset
- 🔍 **Advanced Filtering** - Filter by asset type, usage patterns, or specific components  
- 📊 **Usage Analytics** - Detailed metrics on asset usage and dependency depth
- 🚨 **Hotspot Detection** - Automatic identification of performance bottlenecks
- 🧭 **Smart Navigation** - Click to navigate between assets and scenes
- 📈 **Real-time Monitoring** - Live updates during Play Mode
- 🎨 **Visual Indicators** - Color-coded nodes showing health and activity

---

## Core Features

### Dependency Mapping Engine

The visualizer uses an advanced analysis engine that scans your entire project to build comprehensive dependency maps:

```csharp
// Automatic detection of dependencies:
SOAPAsset → GameObjects (using the asset)
GameObjects → Components (with SOAP references)  
Components → Other SOAPAssets (cross-references)
Scene → All SOAP usage (scene-wide analysis)
```

**Analysis Capabilities:**
- **Deep Scanning** - Analyzes all scenes, prefabs, and scriptable objects
- **Cross-Scene Dependencies** - Tracks assets used across multiple scenes
- **Component Relationships** - Maps which components use which SOAP assets
- **Usage Frequency** - Tracks how often assets are referenced
- **Performance Impact** - Identifies high-usage patterns

<!-- Add screenshot of dependency mapping in action -->

### Visual View Modes

#### 1. GameObject-Centric View

Shows dependencies from the perspective of GameObjects in your scene:

**Features:**
- **Hierarchical Display** - Shows parent-child relationships
- **Component Breakdown** - Lists all SOAP-using components per GameObject
- **Asset Usage Indicators** - Visual markers for SOAP asset usage
- **Scene Context** - Organized by scene hierarchy

```csharp
// Example view structure:
Scene: "GameplayScene"
├── Player (3 SOAP assets)
│   ├── HealthSystem → IntVariable, BoolGameEvent
│   └── MovementController → Vector3Variable
├── UI Canvas (5 SOAP assets)  
│   ├── HealthBar → IntVariable
│   └── ScoreDisplay → IntVariable, StringVariable
└── GameManager (2 SOAP assets)
    └── GameStateController → BoolVariable, UnitGameEvent
```

<!-- Add screenshot of GameObject-centric view -->

#### 2. Asset-Centric View

Focuses on SOAP assets and shows what uses them:

**Features:**
- **Usage Tree** - Hierarchical view of asset dependencies
- **Reverse Lookup** - Find all consumers of a specific asset
- **Orphan Detection** - Identify unused assets
- **Cross-Reference Analysis** - See assets that reference other assets

```csharp
// Example asset view:
IntVariable: "PlayerHealth"
├── Used by 4 GameObjects:
│   ├── HealthBar (UI/Canvas/HealthBar) 
│   ├── Player (Characters/Player)
│   ├── EnemyAI (Enemies/BasicEnemy)
│   └── GameManager (Management/GameManager)
├── Referenced by Events:
│   └── BoolGameEvent: "OnPlayerDied"
└── Performance: 47 updates/sec, 0.2ms avg
```

<!-- Add screenshot of Asset-centric view -->

#### 3. Graph View

Interactive node-graph visualization showing system-wide relationships:

**Features:**
- **Interactive Nodes** - Drag, zoom, and explore dependency networks
- **Color Coding** - Visual indicators for different asset types and health status
- **Connection Lines** - Show direct and indirect relationships
- **Cluster Analysis** - Groups related assets visually
- **Performance Overlays** - Heat map showing performance hotspots

**Color Scheme:**
- 🟢 **Green Nodes** - Healthy, well-performing assets
- 🟡 **Yellow Nodes** - Warning conditions (high usage, many listeners)
- 🔴 **Red Nodes** - Performance hotspots requiring attention
- ⚪ **White Nodes** - Unused or low-activity assets
- 🔵 **Blue Nodes** - Critical system assets (high importance)

<!-- Add screenshot of Graph view with color-coded nodes -->

---

## Advanced Analysis Features

### Hotspot Detection

Automatic identification of performance and design issues:

**Performance Hotspots:**
```csharp
🔥 Critical Issues:
• "PlayerHealth" - 47 updates/sec, 12 listeners
• "GameState" - Used by 23 GameObjects across 4 scenes
• "InputEvents" - 156 raises/sec, potential performance impact

⚠️ Design Issues:  
• "DebugVariable" - Only used in editor, consider conditional compilation
• "TempData" - High update frequency but only 1 listener
• Circular dependencies detected in UI system
```

**Optimization Recommendations:**
- Suggests asset consolidation opportunities
- Identifies unused assets for cleanup
- Recommends performance optimizations
- Highlights architectural improvements

<!-- Add screenshot of hotspot detection results -->

### Usage Analytics

Detailed metrics and statistics about your SOAP architecture:

**Project-Wide Statistics:**
```csharp
📊 Project Overview:
Total SOAP Assets: 47
├── Variables: 28 (12 Int, 8 Float, 5 Bool, 3 String)
├── Events: 19 (7 Unit, 6 Bool, 4 Int, 2 Custom)
└── Custom Types: 0

Scene Distribution:
├── MainMenu: 12 assets (3 variables, 9 events)
├── Gameplay: 31 assets (22 variables, 9 events) 
├── Settings: 8 assets (6 variables, 2 events)
└── Loading: 4 assets (1 variable, 3 events)

Usage Patterns:
• Most Referenced: PlayerHealth (12 references)
• Highest Activity: InputHandler (234 events/min)
• Least Used: 6 assets with 0 references
```

**Per-Asset Analytics:**
- Reference count and usage frequency
- Performance metrics and update rates
- Memory footprint analysis
- Lifecycle tracking (creation, modification, last access)

<!-- Add screenshot of usage analytics dashboard -->

### Filtering and Search

Powerful filtering system to focus on specific aspects:

**Filter Categories:**
```csharp
🎯 Asset Type Filters:
├── Variables (Bool, Int, Float, String, Vector, Color, etc.)
├── Events (Unit, Typed, Custom)
├── Custom ScriptableObjects
└── Cross-references only

🔍 Usage Filters:
├── High Usage (10+ references)
├── Unused Assets (0 references)
├── Performance Hotspots
├── Recently Modified
└── Scene-Specific

⚡ Performance Filters:
├── High Update Frequency (10+ updates/sec)
├── Memory Usage (High/Medium/Low)
├── Listener Count (5+, 10+, 20+)
└── Error Prone Assets
```

**Search Features:**
- **Smart Search** - Find assets by name, type, or usage pattern
- **Regular Expressions** - Advanced pattern matching
- **Multi-Criteria** - Combine multiple filters for precise results
- **Saved Searches** - Store frequently used filter combinations

---

## Professional Workflows

### Architecture Review

Use the visualizer for comprehensive architecture analysis:

**Step 1: Overall Assessment**
1. Switch to **Graph View** for system-wide overview
2. Enable **Performance Overlay** to see hotspots
3. Check for **Circular Dependencies** (shown as red connections)
4. Review **Cluster Density** (tightly coupled areas)

**Step 2: Asset Optimization**
1. Switch to **Asset-Centric View**
2. Filter by **"Unused Assets"** to identify cleanup opportunities
3. Check **"High Usage"** assets for optimization potential
4. Review **Cross-References** for architecture coherence

**Step 3: Performance Analysis**
1. Enable **Real-Time Monitoring** during Play Mode
2. Watch for **Dynamic Hotspots** that appear during gameplay
3. Analyze **Update Frequencies** for expensive operations
4. Check **Memory Usage** patterns over time

<!-- Add screenshot of architecture review workflow -->

### Refactoring Planning

Plan large-scale refactoring with dependency insights:

**Safe Refactoring Process:**
```csharp
1. Identify Target Asset:
   → Select asset in any view
   → Review all dependencies and references

2. Impact Analysis:
   → Check "Used By" list for affected GameObjects
   → Review cross-references to other assets
   → Analyze performance impact of changes

3. Plan Migration:
   → Identify assets that can be merged
   → Plan new asset structure
   → Check for breaking dependencies

4. Execute with Confidence:
   → Use dependency map to validate changes
   → Monitor real-time updates during refactoring
   → Verify no broken references remain
```

### Team Collaboration

Share architecture insights across your development team:

**Documentation Features:**
- **Export Dependency Maps** - Save visualizations as images
- **Generate Reports** - Automated architecture analysis reports  
- **Share Configurations** - Export filter settings for team consistency
- **Performance Baselines** - Track architecture health over time

---

## Configuration and Customization

### Display Settings

Customize the visualizer for your workflow:

```csharp
// Visual Preferences:
Node Size: Small/Medium/Large
Connection Style: Curved/Straight/Organic
Color Scheme: Default/High Contrast/Colorblind Friendly
Animation Speed: Slow/Medium/Fast/Disabled

// Information Density:
Show Asset Types: Yes/No
Show Reference Counts: Yes/No
Show Performance Metrics: Yes/No
Show Scene Information: Yes/No
```

### Performance Settings

Configure analysis depth and update frequency:

```csharp
// Analysis Settings:
Deep Scan Enabled: Yes/No (includes inactive GameObjects)
Cross-Scene Analysis: Yes/No (performance impact)
Real-Time Updates: Yes/No (Play Mode only)
Update Frequency: 0.5s/1s/2s/5s

// Memory Settings:
Cache Dependency Data: Yes/No
Max Cached Scenes: 5/10/20/Unlimited
Auto-Cleanup Unused: Yes/No
```

---

## Integration with Other Tools

### Debug Window Integration

Seamless integration with the main SOAP Debug Window:

```csharp
// Cross-tool navigation:
Dependency Visualizer → Debug Window:
├── Right-click asset → "Debug in Console"
├── Double-click node → "Focus in Debug Window"
└── Performance hotspot → "Analyze Performance"

Debug Window → Dependency Visualizer:
├── Asset context menu → "Show Dependencies"
├── Performance alert → "View in Graph"
└── Usage report → "Visualize Usage"
```

### Performance Analyzer Connection

Direct integration with performance monitoring:

- **Live Performance Data** - Real-time metrics overlay on dependency graph
- **Hotspot Correlation** - Performance issues highlighted in dependency view
- **Optimization Tracking** - Monitor improvements after architecture changes

<!-- Add screenshot of integrated tools working together -->

---

## Best Practices

### Regular Architecture Reviews

**Monthly Architecture Health Check:**
1. Run full project scan in **Graph View**
2. Check for new **Performance Hotspots**
3. Identify and clean up **Unused Assets**
4. Review **Dependency Depth** for complexity management
5. Document architectural decisions and changes

### Performance Monitoring

**Continuous Performance Awareness:**
```csharp
// Set up monitoring alerts:
Configure hotspot detection thresholds:
├── Update Frequency > 30/sec → Warning
├── Listener Count > 15 → Review Required  
├── Memory Usage > 50MB → Investigation Needed
└── Circular Dependencies → Immediate Fix

// Regular checkpoints:
└── Before major releases
└── After significant feature additions
└── During performance optimization phases
└── When team reports architectural confusion
```

### Team Onboarding

**New Developer Workflow:**
1. **Architecture Overview** - Show Graph View of main systems
2. **Key Assets Tour** - Highlight critical variables and events
3. **Hotspot Awareness** - Point out performance-sensitive areas
4. **Navigation Training** - Teach efficient tool usage
5. **Best Practices** - Share team conventions and standards

---

## Troubleshooting

### Common Issues

**Q: "Dependencies not showing correctly"**
A: Refresh the analysis:
1. Click **"🔄 Refresh Analysis"** in toolbar
2. Check if assets are properly saved
3. Verify SOAP assets are in correct folders
4. Use **"Deep Scan"** for thorough analysis

**Q: "Performance is slow with large projects"**
A: Optimize analysis settings:
1. Disable **"Real-Time Updates"** when not needed
2. Use **Scene-Specific Filtering** to reduce scope
3. Increase **Update Frequency** to 2-5 seconds
4. Enable **Auto-Cleanup Unused** to reduce memory usage

**Q: "Graph view is cluttered and hard to read"**
A: Improve visualization:
1. Use **Smart Filtering** to show only relevant assets
2. Adjust **Node Size** to Medium or Small
3. Enable **Cluster Analysis** to group related assets
4. Use **Performance Overlay** to focus on important nodes

### Debug Information

Access detailed debug information for troubleshooting:

```csharp
// Debug Panel Information:
Analysis Statistics:
├── Total Assets Scanned: 47
├── Dependencies Found: 156  
├── Scenes Analyzed: 4
├── Analysis Time: 0.3s
└── Memory Usage: 12.4 MB

Cache Information:
├── Cached Dependencies: 156
├── Cache Hit Rate: 94.2%
├── Last Full Scan: 2 minutes ago
└── Next Scheduled Scan: In 28 minutes

Error Log:
└── No errors detected ✓
```

---

The **SOAP Dependency Visualizer** transforms complex architecture understanding into intuitive visual insights. Master this tool to maintain clean, performant, and well-structured SOAP architectures that scale with your project's growth! 🗺️✨

---

## Next Steps

- **[Performance Analyzer](./performance-analyzer)** - Monitor and optimize SOAP performance
- **[Debug Window](./debug-window)** - Debug your dependencies in real-time
- **[Best Practices](../advanced/best-practices)** - Architecture guidelines and patterns
# Editor Tools API Reference

Complete API reference for SoapKit's editor tools and development utilities.

## Core Editor Windows

### SoapKitDebugWindow

Main debugging interface for monitoring variables and events in real-time.

```csharp
public class SoapKitDebugWindow : EditorWindow
```

#### Static Methods

| Method | Description |
|--------|-------------|
| `ShowWindow()` | Opens the debug window |
| `ShowWindow(ScriptableObject target)` | Opens window focused on specific asset |

#### Menu Access
- **Path**: `Tools > SoapKit > Debug Window`
- **Shortcut**: `Ctrl+Shift+D` (Windows) / `Cmd+Shift+D` (Mac)

#### Features

**Variable Monitoring**
- Live value display with type-specific formatting
- Change frequency tracking
- Constraint validation status
- Real-time value editing

**Event Monitoring**  
- Listener count display
- Event frequency analysis
- History tracking with timestamps
- Manual event triggering

**Performance Metrics**
- Memory usage per asset
- Update frequency statistics
- Performance hotspot detection
- System health indicators

#### Usage Example

```csharp
// Open debug window programmatically
[MenuItem("Custom/Open SOAP Debug")]
static void OpenDebugWindow()
{
    SoapKitDebugWindow.ShowWindow();
}

// Focus on specific variable
[MenuItem("CONTEXT/IntVariable/Debug This Variable")]
static void DebugVariable(MenuCommand command)
{
    var variable = command.context as IntVariable;
    SoapKitDebugWindow.ShowWindow(variable);
}
```

---

### SOAPDependencyVisualizer

Interactive dependency graph showing relationships between SOAP assets and GameObjects.

```csharp
public class SOAPDependencyVisualizer : EditorWindow
```

#### View Modes

| Mode | Description |
|------|-------------|
| `GameObjectCentric` | Shows dependencies from GameObject perspective |
| `AssetCentric` | Shows dependencies from ScriptableObject perspective |
| `Graph` | Interactive node-based graph view |

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `AnalyzeDependencies()` | - | Scans project for SOAP dependencies |
| `ExportDependencyReport()` | `string filePath` | Exports analysis to file |
| `RefreshVisualization()` | - | Updates dependency data |
| `FocusOnAsset(ScriptableObject asset)` | `ScriptableObject asset` | Centers view on specific asset |
| `FilterByType(Type type)` | `Type type` | Filters display by asset type |

#### Menu Access
- **Path**: `Tools > SoapKit > Dependency Visualizer`
- **Context**: Right-click any SOAP asset > `Analyze Dependencies`

#### Features

**Interactive Graph**
- Draggable nodes with smooth layout
- Color-coded by asset type
- Connection strength indicators
- Zoom and pan navigation

**Analysis Tools**
- Unused asset detection
- Circular dependency identification
- Usage frequency analysis
- Orphaned reference detection

**Export Options**
- PNG/SVG graph export
- CSV dependency report
- JSON data export
- Integration with external tools

#### Usage Example

```csharp
// Programmatic dependency analysis
[MenuItem("Tools/Analyze SOAP Dependencies")]
static void AnalyzeDependencies()
{
    var window = EditorWindow.GetWindow<SOAPDependencyVisualizer>();
    window.AnalyzeDependencies();
    window.Show();
}
```

---

### SOAPPerformanceAnalyzer

Real-time performance monitoring and optimization recommendations.

```csharp
public class SOAPPerformanceAnalyzer : EditorWindow
```

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `StartProfiling()` | - | Begins performance data collection |
| `StopProfiling()` | - | Stops profiling and analyzes results |
| `GeneratePerformanceReport()` | - | Creates detailed performance report |
| `DetectHotspots()` | - | Identifies performance bottlenecks |
| `ShowOptimizationRecommendations()` | - | Displays optimization suggestions |
| `ExportProfileData(string filePath)` | `string filePath` | Exports profiling data |

#### Performance Metrics

| Metric | Description |
|--------|-------------|
| `EventsPerSecond` | Event raising frequency |
| `ListenerCount` | Total active listeners |
| `VariableUpdatesPerFrame` | Variable changes per frame |
| `MemoryUsage` | SOAP system memory consumption |
| `GCAllocations` | Garbage collection allocations |

#### Menu Access
- **Path**: `Tools > SoapKit > Performance Analyzer`
- **Context**: Available in SoapKit Debug Window

#### Features

**Real-Time Monitoring**
- Live performance graphs
- Hotspot highlighting
- Memory leak detection
- Frame rate impact analysis

**Optimization Recommendations**
- Event frequency reduction suggestions
- Memory optimization tips
- Architecture improvement advice
- Performance best practices

**Reporting**
- Automated performance reports
- Historical trend analysis
- Comparison with benchmarks
- Integration with CI/CD pipelines

#### Usage Example

```csharp
// Automated performance testing
public class SOAPPerformanceTester
{
    [MenuItem("Tools/Run SOAP Performance Test")]
    static void RunPerformanceTest()
    {
        var analyzer = EditorWindow.GetWindow<SOAPPerformanceAnalyzer>();
        analyzer.StartProfiling();
        
        // Run test scenarios
        EditorApplication.delayCall += () =>
        {
            analyzer.StopProfiling();
            analyzer.GeneratePerformanceReport();
        };
    }
}
```

---

## Asset Management Tools

### SOAPAssetCleanerWindow

Professional unused asset cleaner with advanced selection interface and safe deletion.

```csharp
public class SOAPAssetCleanerWindow : EditorWindow
```

#### Static Methods

| Method | Description |
|--------|-------------|
| `ShowWindow()` | Opens the Asset Cleaner window with automatic scan |

#### Menu Access
- **Path**: `Tools > SoapKit > Quick Actions > Clean Unused Assets`
- **Window**: `Window > SoapKit > Asset Cleaner`

#### Features

**Smart Detection**
- Scans all ScriptableObjects in project for SOAP assets
- Analyzes scene usage to identify truly unused assets
- Progress bar for large projects with hundreds of assets
- Handles missing/corrupted assets gracefully

**Advanced Selection Interface**
- Individual checkboxes for each unused asset
- Tri-state "Select All" with mixed state support
- "Apply to filtered only" vs "Apply to all" scope options
- "Invert Selection" for complex selection patterns

**Powerful Filtering & Sorting**
- Real-time search by asset name, type, or path
- Sort by Name, Type, or Path (ascending/descending)
- Clear filter button for quick reset
- Live filtering updates as you type

**Visual Asset Information**
- Asset icons from Unity's asset database
- Full asset path display for precise identification
- Type name display (IntVariable, BoolGameEvent, etc.)
- Click asset name to select and ping in Project window

**Safe Deletion Workflow**
- Double confirmation dialog with asset preview
- Shows up to 7 assets in confirmation, with "and X more" summary
- Batch deletion with progress tracking
- Detailed success/failure reporting
- Automatic rescan after deletion

**Additional Tools**
- 📍 Ping button to locate asset in Project window
- 🔎 Reveal button to show asset in Finder/Explorer
- Asset count and selection summary in header
- Warning about version control for recovery

#### Usage Example

```csharp
// Open Asset Cleaner programmatically
[MenuItem("Custom/Clean My Assets")]
static void OpenAssetCleaner()
{
    SOAPAssetCleanerWindow.ShowWindow();
}

// Get unused assets programmatically
public static List<ScriptableObject> GetUnusedSOAPAssets()
{
    var unused = new List<ScriptableObject>();
    string[] guids = AssetDatabase.FindAssets("t:ScriptableObject");
    
    foreach (string guid in guids)
    {
        string path = AssetDatabase.GUIDToAssetPath(guid);
        var asset = AssetDatabase.LoadAssetAtPath<ScriptableObject>(path);
        
        if (asset != null && SOAPKitMenu.IsSOAPAsset(asset))
        {
            if (!SOAPKitMenu.IsAssetUsedInScene(asset))
            {
                unused.Add(asset);
            }
        }
    }
    
    return unused;
}
```

---

### SOAPAssetCreator

Advanced asset creation tool with templates and batch operations.

```csharp
public class SOAPAssetCreator : EditorWindow
```

#### Creation Modes

| Mode | Description |
|------|-------------|
| `Single` | Create individual assets |
| `Batch` | Create multiple assets at once |
| `Template` | Create from predefined templates |

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `CreateVariable<T>(string name, T initialValue)` | `string name, T initialValue` | Creates typed variable |
| `CreateEvent<T>(string name)` | `string name` | Creates typed event |
| `CreateFromTemplate(string templateName)` | `string templateName` | Creates from template |
| `BatchCreateAssets(AssetCreationData[] data)` | `AssetCreationData[] data` | Batch asset creation |
| `SaveAsTemplate(string templateName)` | `string templateName` | Saves current config as template |

#### Menu Access
- **Path**: `Tools > SoapKit > Asset Creator`
- **Context**: Project window > `Create > SoapKit > ...`
- **Shortcut**: `Ctrl+Alt+N` (Windows) / `Cmd+Alt+N` (Mac)

#### Features

**Template System**
- Predefined asset templates
- Custom template creation
- Template sharing and import
- Project-specific templates

**Batch Operations**
- Multi-asset creation
- Naming pattern support
- Folder organization
- Automatic reference setup

**Validation**
- Name conflict detection
- Type compatibility checking
- Folder structure validation
- Asset dependency verification

#### Usage Example

```csharp
// Custom asset creation
[MenuItem("Game/Create Player Stats")]
static void CreatePlayerStats()
{
    var creator = EditorWindow.GetWindow<SOAPAssetCreator>();
    
    creator.CreateVariable<int>("PlayerHealth", 100);
    creator.CreateVariable<int>("PlayerMana", 50);
    creator.CreateVariable<float>("PlayerSpeed", 5.0f);
    
    creator.CreateEvent<int>("OnHealthChanged");
    creator.CreateEvent<int>("OnManaChanged");
}
```

---

## Property Drawers and Inspectors

### BaseVariableEditor

Enhanced custom inspector for all variable types.

```csharp
[CustomEditor(typeof(BaseVariable<>), true)]
public class BaseVariableEditor : Editor
```

#### Features

**Real-Time Monitoring**
- Live value display during play mode
- Change frequency indicators
- Last modified timestamp
- Historical value graph

**Quick Actions**
- One-click value reset
- Random value generation
- Constraint application
- Test value assignment

**Debug Integration**
- Direct integration with Debug Window
- Event history access
- Performance metrics display
- Listener count monitoring

### GameEventEditor

Enhanced custom inspector for all event types.

```csharp
[CustomEditor(typeof(GameEvent<>), true)]
public class GameEventEditor : Editor
```

#### Features

**Listener Management**
- Visual listener count display
- Listener type breakdown
- Add/remove listener tools
- Listener validation

**Testing Tools**
- Manual event triggering
- Parameter value editor
- Frequency testing
- Batch event operations

**History Analysis**
- Event timeline view
- Parameter history
- Frequency analysis graphs
- Export history data

### SOAPPropertyDrawer

Enhanced property drawer for SOAP references in inspectors.

```csharp
[CustomPropertyDrawer(typeof(BaseVariable<>), true)]
[CustomPropertyDrawer(typeof(GameEvent<>), true)]
public class SOAPPropertyDrawer : PropertyDrawer
```

#### Features

**Visual Indicators**
- Connection status indicators
- Value preview in inspector
- Type-specific icons
- Health status badges

**Quick Actions**
- Asset selection shortcuts
- Value monitoring toggle
- Direct asset creation
- Reference validation

**Debug Integration**
- Context menu debug options
- Direct window opening
- Asset highlighting
- Dependency visualization

---

## Visualization Tools

### SOAPHierarchyOverlay

Hierarchy window integration showing SOAP connections and status.

```csharp
public static class SOAPHierarchyOverlay
```

#### Static Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `EnableOverlay()` | - | Activates hierarchy overlay |
| `DisableOverlay()` | - | Deactivates hierarchy overlay |
| `RefreshOverlay()` | - | Updates overlay data |
| `SetOverlayMode(OverlayMode mode)` | `OverlayMode mode` | Changes display mode |

#### Overlay Modes

| Mode | Description |
|------|-------------|
| `Connections` | Shows SOAP asset connections |
| `Status` | Displays system health status |
| `Performance` | Shows performance indicators |
| `All` | Combined overlay information |

#### Menu Access
- **Path**: `Window > SoapKit > Hierarchy Overlay > ...`
- **Toggle**: `Alt+H` (Windows) / `Option+H` (Mac)

#### Features

**Visual Indicators**
- Color-coded connection status
- Performance warning badges
- Asset type icons
- Health status indicators

**Interactive Elements**
- Click to select referenced assets
- Hover for detailed information
- Context menu integration
- Direct debugging access

---

## Menu System

### SOAPKitMenu

Centralized menu system with quick actions and utilities.

```csharp
public static class SOAPKitMenu
```

#### Static Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `ShowDebugWindow()` | - | Opens debug window |
| `ShowAssetCreator()` | - | Opens asset creator |
| `ScanCurrentScene()` | - | Analyzes current scene for SOAP usage |
| `CleanUnusedAssets()` | - | Opens Asset Cleaner window |
| `ListAllSOAPAssets()` | - | Generates inventory report |
| `ValidateProject()` | - | Runs project validation |
| `GenerateReport()` | - | Creates system report |
| `OpenDocumentation()` | - | Opens online documentation |

#### Quick Actions

**🔍 Scan Current Scene**
- Analyzes active scene for SOAP asset usage
- Reports GameObject count with SOAP connections
- Shows total connection count across all GameObjects
- Provides instant overview of scene complexity

**🧹 Clean Unused Assets**  
- Opens professional Asset Cleaner window
- Smart detection of unused SOAP assets across project
- Advanced selection interface with tri-state functionality
- Safe deletion with double confirmation
- Batch operations with progress tracking

**📋 List All SOAP Assets**
- Comprehensive project inventory report
- Categorizes Events and Variables separately  
- Shows type information for each asset
- Sorted alphabetically for easy navigation

#### Menu Structure

```
Tools/
├── SoapKit/
│   ├── ⚙️ Settings
│   ├── 🐞 Debug Console         (Ctrl+Shift+D)
│   ├── Dependency Visualizer
│   ├── Performance Analyzer
│   ├── Asset Creator            (Ctrl+Alt+N)
│   ├── ─────────────────
│   ├── Quick Actions/
│   │   ├── 🔍 Scan Current Scene
│   │   ├── 🧹 Clean Unused Assets
│   │   └── 📋 List All SOAP Assets
│   ├── ─────────────────
│   ├── Validation/
│   │   ├── 🔍 Find Null References
│   │   └── 📊 Generate Usage Report
│   ├── ─────────────────
│   ├── Help/
│   │   ├── 📚 Open Documentation
│   │   ├── 🎮 Open Example Scene
│   │   └── 💬 About SoapKit

Window/
├── SoapKit/
│   ├── Debug Window
│   ├── Asset Creator
│   ├── Asset Cleaner
│   ├── Performance Analyzer
│   ├── ─────────────────
│   ├── Hierarchy Overlay/
│   │   ├── Enable Connections
│   │   ├── Enable Status
│   │   └── Enable Performance
│   └── Scene Overlay/
│       ├── Enable Connections
│       ├── Enable Values
│       └── Enable Events
```

---

## Project Validation

### SOAPValidator

Comprehensive project validation and health checking.

```csharp
public static class SOAPValidator
```

#### Static Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `ValidateProject()` | `ValidationReport` | Validates entire project |
| `ValidateAsset(ScriptableObject asset)` | `AssetValidationResult` | Validates specific asset |
| `FindUnusedAssets()` | `ScriptableObject[]` | Identifies unused assets |
| `FindBrokenReferences()` | `BrokenReferenceInfo[]` | Finds broken references |
| `GenerateHealthReport()` | `ProjectHealthReport` | Creates comprehensive report |

#### Validation Categories

| Category | Description |
|----------|-------------|
| `References` | Null and broken reference detection |
| `Performance` | Performance issue identification |
| `Architecture` | Design pattern violations |
| `Memory` | Memory leak and optimization issues |
| `Naming` | Asset naming convention validation |

#### Usage Example

```csharp
[MenuItem("Tools/SoapKit/Validate Project")]
static void ValidateProject()
{
    var report = SOAPValidator.ValidateProject();
    
    if (report.HasErrors)
    {
        Debug.LogError($"Project validation failed with {report.ErrorCount} errors");
        foreach (var error in report.Errors)
        {
            Debug.LogError(error.Message, error.Target);
        }
    }
    
    if (report.HasWarnings)
    {
        Debug.LogWarning($"Project has {report.WarningCount} warnings");
    }
    
    Debug.Log($"Validation complete. Score: {report.HealthScore}/100");
}
```

---

## Settings and Configuration

### SOAPKitSettings

Project-wide settings for SoapKit editor tools.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Settings")]
public class SOAPKitSettings : ScriptableObject
```

#### Settings Categories

**Debug Settings**
- Enable event history
- Performance monitoring frequency
- Debug overlay preferences
- Log verbosity levels

**Performance Settings**
- Profiling sample rates
- Memory monitoring thresholds
- Performance warning limits
- Optimization recommendations

**UI Settings**
- Window layout preferences
- Color schemes and themes
- Shortcut key customization
- Inspector enhancement options

#### Menu Access
- **Path**: `Tools > SoapKit > Settings`
- **Project Settings**: `Edit > Project Settings > SoapKit`

---

## Best Practices

### Tool Usage
1. Use Debug Window during development for real-time monitoring
2. Regular dependency analysis to maintain clean architecture
3. Performance profiling before production builds
4. Asset validation as part of build pipeline

### Performance Monitoring
1. Enable profiling during intensive development phases
2. Monitor event frequency in complex systems
3. Regular memory usage analysis
4. Automated performance regression testing

### Project Organization
1. Use Asset Creator for consistent asset creation
2. Regular unused asset cleanup
3. Dependency visualization for refactoring
4. Template-based asset creation for teams

### Debugging Workflow
1. Start with Debug Window for overview
2. Use Dependency Visualizer for complex issues  
3. Performance Analyzer for optimization
4. Hierarchy/Scene overlays for visual debugging

---

## See Also

- [Variables API Reference](./variables) - Variable system documentation
- [Events API Reference](./events) - Event system documentation
- [Performance Guide](../advanced/performance) - Optimization techniques
- [Best Practices](../advanced/best-practices) - Development guidelines
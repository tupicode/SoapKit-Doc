# API Reference Overview

Complete API reference for SoapKit - Unity's premier ScriptableObject Architecture Pattern (SOAP) implementation.

## Core Namespaces

SoapKit is organized into logical namespaces for clean architecture:

```csharp
using FarmGrowthToolkit.Soap;          // Core classes and interfaces
using FarmGrowthToolkit.Soap.Events;   // Event system components  
using FarmGrowthToolkit.Soap.Variables; // Variable system components
using FarmGrowthToolkit.Soap.Editor;   // Editor-only tools (conditional compilation)
```

## Architecture Overview

SoapKit implements a two-pillar architecture:

### Events System
- **GameEvent&lt;T&gt;**: Generic event base class for type-safe communication
- **Listener Management**: Add/remove listeners with automatic cleanup
- **Debug Integration**: Built-in debugging and performance monitoring
- **Event History**: Editor-only event tracking for development

### Variables System  
- **BaseVariable&lt;T&gt;**: Generic variable base class with change notifications
- **IReadOnlyVariable&lt;T&gt;**: Interface for read-only access patterns
- **Type-Specific Operations**: Specialized methods per variable type
- **Constraint Validation**: Built-in validation and constraint systems

## Core Interfaces

### IReadOnlyVariable&lt;T&gt;
```csharp
public interface IReadOnlyVariable<T>
{
    T Value { get; }
    event System.Action<T> OnValueChanged;
}
```

### IGameEvent
```csharp
public interface IGameEvent
{
    void AddListener(UnityAction action);
    void RemoveListener(UnityAction action);
    void Raise();
    int ListenerCount { get; }
}
```

### IGameEvent&lt;T&gt;
```csharp
public interface IGameEvent<T>
{
    void AddListener(UnityAction<T> action);
    void RemoveListener(UnityAction<T> action);
    void Raise(T value);
    int ListenerCount { get; }
}
```

## Core Classes

### BaseVariable&lt;T&gt;
The foundation of the variable system:

```csharp
[System.Serializable]
public abstract class BaseVariable<T> : ScriptableObject, IReadOnlyVariable<T>
{
    // Core Properties
    public T Value { get; protected set; }
    public virtual bool EnableChangeNotification { get; set; } = true;
    
    // Events
    public event System.Action<T> OnValueChanged;
    
    // Core Methods
    public virtual void SetValue(T newValue);
    public virtual void NotifyValueChanged();
    protected virtual bool AreValuesEqual(T a, T b);
    
    // Editor Integration
    [ContextMenu("Trigger Change Notification")]
    public void TriggerChangeNotification();
    
    #if UNITY_EDITOR
    [UnityEditor.MenuItem("CONTEXT/BaseVariable/Debug Value")]
    static void DebugValue(UnityEditor.MenuCommand command);
    #endif
}
```

### GameEvent&lt;T&gt;
The foundation of the event system:

```csharp
[System.Serializable]
public abstract class GameEvent<T> : ScriptableObject, IGameEvent<T>
{
    // Core Properties
    public int ListenerCount => listeners?.GetPersistentEventCount() ?? 0;
    public bool EnableEventHistory { get; set; } = true;
    
    // Core Methods
    public void AddListener(UnityAction<T> listener);
    public void RemoveListener(UnityAction<T> listener);
    public void Raise(T value);
    public void RemoveAllListeners();
    
    // Editor Integration
    [ContextMenu("Raise Test Event")]
    public virtual void RaiseTestEvent();
    
    #if UNITY_EDITOR
    public List<EventHistoryEntry> EventHistory { get; }
    public void ClearEventHistory();
    #endif
}
```

## Variable Types

### Primitive Variables
| Type | Class | Operations | Constraints |
|------|-------|------------|-------------|
| Bool | `BoolVariable` | Toggle, SetTrue/False, And, Or, Xor | None |
| Int | `IntVariable` | Add, Subtract, Multiply, Divide, Increment, Decrement | Min/Max values |
| Float | `FloatVariable` | Math operations, Percentage, Round | Min/Max values, decimal places |
| String | `StringVariable` | Append, Prepend, Replace, Trim, Case conversion | Length limits |

### Unity Types
| Type | Class | Operations | Constraints |
|------|-------|------------|-------------|
| Vector2 | `Vector2Variable` | Vector math, Normalize, Lerp, Magnitude | Magnitude limits |
| Vector3 | `Vector3Variable` | 3D operations, MoveTowards, Slerp | Magnitude limits |
| Vector2Int | `Vector2IntVariable` | Integer vector math | Magnitude limits |
| Color | `ColorVariable` | RGB/HSV, Lerp, Grayscale, Invert | None |
| GameObject | `GameObjectVariable` | Component access, Tag validation | Tag requirements |
| Transform | `TransformVariable` | Position/rotation, Hierarchy | None |

## Event Types

### Primitive Events
| Type | Class | Use Case |
|------|-------|----------|
| Unit | `GameEvent` | Simple notifications |
| Bool | `BoolGameEvent` | State changes, toggles |
| Int | `IntGameEvent` | Scores, counters, IDs |
| Float | `FloatGameEvent` | Values, percentages |
| String | `StringGameEvent` | Messages, names |

### Unity Type Events
| Type | Class | Use Case |
|------|-------|----------|
| Vector2 | `Vector2GameEvent` | 2D positions, UI coordinates |
| Vector3 | `Vector3GameEvent` | 3D positions, directions |
| Vector2Int | `Vector2IntGameEvent` | Grid coordinates |
| Color | `ColorGameEvent` | Color changes |
| GameObject | `GameObjectGameEvent` | Object references |
| Transform | `TransformGameEvent` | Transform references |

## Editor Tools API

### SoapKitDebugWindow
```csharp
public class SoapKitDebugWindow : EditorWindow
{
    // Static access
    [MenuItem("Tools/SoapKit/Debug Window")]
    public static void ShowWindow();
    
    // Runtime monitoring
    public void RefreshVariableList();
    public void RefreshEventList();
    public void ClearEventHistory();
}
```

### SOAPDependencyVisualizer
```csharp
public class SOAPDependencyVisualizer : EditorWindow
{
    // Visualization modes
    public enum ViewMode { GameObjectCentric, AssetCentric, Graph }
    
    // Core methods
    public void AnalyzeDependencies();
    public void ExportDependencyReport();
    public void RefreshVisualization();
}
```

### SOAPPerformanceAnalyzer
```csharp
public class SOAPPerformanceAnalyzer : EditorWindow
{
    // Performance monitoring
    public void StartProfiling();
    public void StopProfiling();
    public void GeneratePerformanceReport();
    
    // Hotspot detection
    public List<PerformanceHotspot> DetectHotspots();
    public void ShowOptimizationRecommendations();
}
```

## Usage Examples

### Basic Variable Usage
```csharp
// Create and use a variable
[SerializeField] private IntVariable playerHealth;

private void Start()
{
    // Subscribe to changes
    playerHealth.OnValueChanged += OnHealthChanged;
    
    // Use specialized operations
    playerHealth.Add(25);
    playerHealth.SetMax(150);
}

private void OnHealthChanged(int newHealth)
{
    Debug.Log($"Health changed to: {newHealth}");
}
```

### Basic Event Usage
```csharp
// Create and use an event
[SerializeField] private BoolGameEvent onGamePaused;

private void OnEnable()
{
    onGamePaused.AddListener(OnGamePausedChanged);
}

private void OnDisable()
{
    onGamePaused.RemoveListener(OnGamePausedChanged);
}

private void OnGamePausedChanged(bool isPaused)
{
    Time.timeScale = isPaused ? 0f : 1f;
}
```

## Performance Considerations

### Variable Performance
- **Change Notifications**: Only triggered when values actually change
- **Batch Operations**: Disable notifications during bulk updates
- **Memory Usage**: Minimal overhead per variable instance
- **Thread Safety**: Not thread-safe, use on main thread only

### Event Performance
- **Listener Management**: Efficient add/remove operations
- **Memory Leaks**: Always pair AddListener with RemoveListener
- **Event Frequency**: Monitor high-frequency events for performance impact
- **History Tracking**: Editor-only feature with no runtime cost

## Best Practices

### Variable Best Practices
1. **Initialization**: Always set initial values
2. **Constraints**: Use built-in validation when possible
3. **Change Detection**: Subscribe to OnValueChanged for reactive behavior
4. **Naming**: Use descriptive asset names for debugging

### Event Best Practices
1. **Lifecycle Management**: Subscribe in OnEnable, unsubscribe in OnDisable
2. **Parameter Types**: Use specific event types for type safety
3. **Event Handlers**: Keep handlers lightweight and fast
4. **Documentation**: Add tooltips and descriptions to event assets

## Migration Guide

### From Unity Events
```csharp
// Old Unity Event approach
[SerializeField] private UnityEvent onHealthChanged;

// New SoapKit approach  
[SerializeField] private IntGameEvent onHealthChanged;
```

### From Direct References
```csharp
// Old direct reference approach
[SerializeField] private HealthSystem healthSystem;

// New SoapKit approach
[SerializeField] private IntVariable playerHealth;
[SerializeField] private IntGameEvent onHealthChanged;
```

## Error Handling

### Common Issues
1. **Null References**: Always check for null before using ScriptableObject references
2. **Missing Listeners**: Use OnEnable/OnDisable pattern for reliable subscription
3. **Memory Leaks**: Unsubscribe from events to prevent memory leaks
4. **Performance**: Monitor listener counts and event frequency

### Debug Tools
- **SoapKit Debug Window**: Monitor variables and events in real-time
- **Performance Analyzer**: Identify performance bottlenecks
- **Dependency Visualizer**: Understand system relationships
- **Event History**: Track event flow for debugging

## Next Steps

- Explore [Variable API Reference](./variables) for detailed variable documentation
- Check [Event API Reference](./events) for comprehensive event system details
- Review [Editor Tools API](./editor-tools) for development workflow integration
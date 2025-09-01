# Performance Optimization

Learn how to optimize SoapKit usage for better performance in your Unity projects.

## Editor Performance Settings

SoapKit includes performance optimization settings specifically designed to reduce editor impact during gameplay testing. These settings can be configured through the [Settings Window](../editor-tools/settings-window).

### Performance Modes

#### 🚀 Performance Mode (Recommended for Gameplay Testing)
Optimizes all editor tools for smooth gameplay:
- Disables debug window auto-refresh during play mode
- Stops performance monitoring real-time updates
- Reduces refresh intervals to minimize impact
- Maintains essential debugging capabilities

#### 🔧 Development Mode (Full Debugging)
Enables all debugging features:
- Real-time variable monitoring
- Live event tracking
- High-frequency performance analysis
- Immediate visual feedback

### Automatic Optimizations

SoapKit automatically applies performance optimizations based on your current development phase:

```csharp
// Performance settings are automatically applied
if (Application.isPlaying && SOAPEditorSettings.DisableDebugDuringPlayMode)
{
    // Debug tools reduce their update frequency
    // Focus shifts to gameplay performance
}
```

### Manual Configuration

Access performance settings through multiple paths:
- `Window > SoapKit > Settings`
- `Tools > SoapKit > ⚙️ Settings` 
- Debug Window toolbar
- Project Settings integration

### Performance Impact Comparison

| Setting | Frame Time Impact | Memory Usage | Update Frequency |
|---------|-------------------|--------------|------------------|
| Performance Mode | ~0.1ms | Low | 3-5 seconds |
| Default Settings | ~0.3ms | Medium | 2 seconds |
| Development Mode | ~0.8ms | Higher | 1 second |

### Best Practices

1. **Use Performance Mode during final testing**
   - Ensures accurate performance measurements
   - Reduces editor interference with gameplay

2. **Switch to Development Mode for debugging**
   - Immediate feedback on system changes
   - Real-time monitoring of edge cases

3. **Export and share team settings**
   - Consistent performance profiles
   - Standardized debugging environments

## Event System Performance

### Listener Management

Efficiently manage event listeners to avoid performance issues:

```csharp
public class OptimizedEventListener : MonoBehaviour
{
    [SerializeField] private GameEvent targetEvent;
    
    private void OnEnable()
    {
        // Only subscribe when component is active
        targetEvent?.AddListener(HandleEvent);
    }
    
    private void OnDisable()
    {
        // Always unsubscribe to prevent memory leaks
        targetEvent?.RemoveListener(HandleEvent);
    }
    
    private void HandleEvent()
    {
        // Keep event handlers lightweight
        StartCoroutine(HandleEventAsync());
    }
    
    private IEnumerator HandleEventAsync()
    {
        // Move heavy operations to coroutines
        yield return null;
        // Heavy work here
    }
}
```

### Event Frequency Optimization

Throttle high-frequency events:

```csharp
public class ThrottledHealthSystem : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private float updateInterval = 0.1f;
    
    private int lastBroadcastHealth;
    private float lastUpdateTime;
    
    private void Update()
    {
        if (Time.time - lastUpdateTime >= updateInterval)
        {
            CheckHealthChange();
            lastUpdateTime = Time.time;
        }
    }
    
    private void CheckHealthChange()
    {
        if (playerHealth.Value != lastBroadcastHealth)
        {
            lastBroadcastHealth = playerHealth.Value;
            onHealthChanged.Raise(playerHealth.Value);
        }
    }
}
```

## Variable System Performance

### Efficient Value Setting

Minimize unnecessary change notifications:

```csharp
public class EfficientVariableUpdater : MonoBehaviour
{
    [SerializeField] private FloatVariable targetValue;
    
    public void UpdateValueEfficiently(float newValue)
    {
        // Only update if value actually changed
        if (!Mathf.Approximately(targetValue.Value, newValue))
        {
            targetValue.SetValue(newValue);
        }
    }
    
    public void BatchUpdateValues(float[] values)
    {
        // Temporarily disable notifications for batch operations
        bool wasNotifying = targetValue.EnableChangeNotification;
        targetValue.EnableChangeNotification = false;
        
        foreach (float value in values)
        {
            targetValue.SetValue(value);
        }
        
        // Re-enable and trigger final notification
        targetValue.EnableChangeNotification = wasNotifying;
        if (wasNotifying)
        {
            targetValue.NotifyValueChanged();
        }
    }
}
```

### Memory-Efficient Collections

Use object pooling for frequently created objects:

```csharp
public class PooledGameEventManager : MonoBehaviour
{
    private static readonly Queue<GameEventArgs> eventArgsPool = new Queue<GameEventArgs>();
    
    public static GameEventArgs GetEventArgs()
    {
        return eventArgsPool.Count > 0 ? eventArgsPool.Dequeue() : new GameEventArgs();
    }
    
    public static void ReturnEventArgs(GameEventArgs args)
    {
        args.Reset();
        eventArgsPool.Enqueue(args);
    }
}

public class GameEventArgs
{
    public float FloatValue { get; set; }
    public int IntValue { get; set; }
    public string StringValue { get; set; }
    
    public void Reset()
    {
        FloatValue = 0f;
        IntValue = 0;
        StringValue = string.Empty;
    }
}
```

## Asset Loading Performance

### Preload Critical Assets

Load frequently used ScriptableObjects at startup:

```csharp
public class AssetPreloader : MonoBehaviour
{
    [SerializeField] private ScriptableObject[] criticalAssets;
    
    private void Awake()
    {
        PreloadAssets();
    }
    
    private void PreloadAssets()
    {
        foreach (var asset in criticalAssets)
        {
            // Touch the asset to ensure it's loaded
            _ = asset.name;
        }
    }
}
```

### Lazy Loading

Implement lazy loading for non-critical assets:

```csharp
public class LazyAssetLoader : MonoBehaviour
{
    private IntVariable _cachedHealth;
    
    public IntVariable PlayerHealth
    {
        get
        {
            if (_cachedHealth == null)
            {
                _cachedHealth = Resources.Load<IntVariable>("Variables/PlayerHealth");
            }
            return _cachedHealth;
        }
    }
}
```

## Profiling and Monitoring

### Built-in Performance Monitoring

Use SoapKit's built-in performance tools:

```csharp
public class PerformanceMonitor : MonoBehaviour
{
    [SerializeField] private GameEvent[] eventsToMonitor;
    
    private void Update()
    {
        foreach (var gameEvent in eventsToMonitor)
        {
            // Monitor listener count
            if (gameEvent.ListenerCount > 10)
            {
                Debug.LogWarning($"Event {gameEvent.name} has {gameEvent.ListenerCount} listeners");
            }
            
            // Monitor event frequency
            if (gameEvent.EventsRaisedThisFrame > 5)
            {
                Debug.LogWarning($"Event {gameEvent.name} raised {gameEvent.EventsRaisedThisFrame} times this frame");
            }
        }
    }
}
```

### Custom Performance Metrics

Track your own performance metrics:

```csharp
public static class SoapKitProfiler
{
    private static readonly Dictionary<string, float> metrics = new Dictionary<string, float>();
    
    public static void StartTiming(string operation)
    {
        metrics[operation] = Time.realtimeSinceStartup;
    }
    
    public static void EndTiming(string operation)
    {
        if (metrics.TryGetValue(operation, out float startTime))
        {
            float duration = Time.realtimeSinceStartup - startTime;
            Debug.Log($"{operation} took {duration:F4}ms");
            metrics.Remove(operation);
        }
    }
}
```

## Best Practices

### Event System
1. **Limit Listeners**: Keep listener counts reasonable (< 20 per event)
2. **Lightweight Handlers**: Keep event handlers fast and simple
3. **Async Operations**: Move heavy work to coroutines or async methods
4. **Unsubscribe Properly**: Always pair AddListener with RemoveListener

### Variable System
1. **Batch Updates**: Group multiple variable changes when possible
2. **Check Before Set**: Only update when values actually change
3. **Use Appropriate Types**: Choose the right variable type for your data
4. **Validate Constraints**: Use built-in constraints instead of manual validation

### Asset Management
1. **Preload Critical Assets**: Load important assets at startup
2. **Use Asset References**: Prefer asset references over Resources.Load
3. **Pool Objects**: Reuse objects instead of constant allocation
4. **Monitor Memory**: Use Unity Profiler to track ScriptableObject memory usage

## Performance Testing

### Automated Performance Tests

```csharp
[TestFixture]
public class SoapKitPerformanceTests
{
    [Test]
    public void EventRaisePerformanceTest()
    {
        var gameEvent = ScriptableObject.CreateInstance<GameEvent>();
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        for (int i = 0; i < 10000; i++)
        {
            gameEvent.Raise();
        }
        
        stopwatch.Stop();
        Assert.Less(stopwatch.ElapsedMilliseconds, 100, "Event raising took too long");
    }
    
    [Test]
    public void VariableUpdatePerformanceTest()
    {
        var variable = ScriptableObject.CreateInstance<IntVariable>();
        var stopwatch = System.Diagnostics.Stopwatch.StartNew();
        
        for (int i = 0; i < 10000; i++)
        {
            variable.SetValue(i);
        }
        
        stopwatch.Stop();
        Assert.Less(stopwatch.ElapsedMilliseconds, 50, "Variable updates took too long");
    }
}
```

## Troubleshooting Performance Issues

### Common Performance Problems

1. **Too Many Listeners**: Check listener counts in the SoapKit Debug Window
2. **Frequent Events**: Monitor event frequency using built-in tools
3. **Memory Leaks**: Use Unity Profiler to detect growing memory usage
4. **Blocking Operations**: Profile event handlers for long-running code

### Using SoapKit Performance Analyzer

The SoapKit Performance Analyzer provides real-time monitoring:

1. Open **Window > SoapKit > Performance Analyzer**
2. Monitor hotspots in real-time
3. Get optimization recommendations
4. Track system health over time
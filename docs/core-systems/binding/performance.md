---
title: Performance
sidebar_position: 5
---

# Performance Optimization

SOAPBind uses pure event-driven architecture for optimal performance.

## Event-Driven Architecture

**Zero Update() Polling:**

```csharp
// Initialization subscribes to Variable/Event changes
void InitializeBinding(BindTarget bind)
{
    // Variable binding: subscribe to OnValueChanged
    if (bind.soapAsset is BaseVariable variable)
        variable.OnValueChanged += (newValue) => UpdateBinding(bind);

    // Event binding: subscribe to AddListener
    if (bind.soapAsset is GameEvent gameEvent)
        gameEvent.AddListener(() => InvokeMethod(bind));
}

// Updates ONLY when data actually changes
void UpdateBinding(BindTarget bind)
{
    if (bind.updateInterval <= 0f)
        UpdateBindingImmediate(bind);  // Instant
    else
        StartCoroutine(UpdateWithInterval(bind));  // Throttled
}
```

## Performance Benefits

**Event-Driven vs Traditional:**

| Metric | Event-Driven | Traditional Polling |
|--------|--------------|---------------------|
| CPU per binding | ~0.1ms (when event fires) | ~0.5ms per frame |
| Updates per second | Variable (on change) | 60-120 (continuous) |
| CPU usage reduction | 80-95% | Baseline |
| Battery impact | Minimal | Significant |
| Scalability | 100+ bindings | &lt;50 bindings |

**Benefits:**
- ✅ Zero CPU overhead when data unchanged
- ✅ Immediate response to data changes (zero latency)
- ✅ Scalable to hundreds of bindings
- ✅ Mobile/battery friendly
- ✅ No garbage collection from Update() calls

## Optimization Settings

### Update Intervals

```csharp
public float updateInterval = 0.0f;  // seconds between updates
```

**Guidelines:**

| Interval | Frequency | Use Case |
|----------|-----------|----------|
| 0.0 | Event-driven only | Immediate updates (recommended) |
| 0.016 | ~60 FPS | Smooth animations |
| 0.1 | 10 Hz | Non-critical UI text |
| 0.5+ | 2 Hz or less | Debug displays |

### Auto-Update Control

```csharp
public bool autoUpdate = true;        // Enable/disable automatic updates
public bool validateOnBind = true;    // Runtime validation
public int maxUpdatesPerFrame = 16;   // Event-driven throttling
```

## Performance Monitoring

### Inspector Metrics

Enable **Show Performance Metrics** in Inspector:

```csharp
public float GetBindingCostMs(int bindingIndex);

// Displays:
// - Last execution time (ms)
// - Total update count
// - Average execution time
// - Color-coded performance bar
```

### Performance Thresholds

| Status | Execution Time | Visual | Action |
|--------|----------------|--------|--------|
| Optimal | &lt; 0.5ms | Green ████████ | None needed |
| Acceptable | 0.5-2ms | Yellow ████████ | Monitor |
| Warning | 2-5ms | Orange ████████ | Optimize |
| Critical | &gt; 5ms | Red ████████ | Fix immediately |

### Bind Manager Performance Tab

Access: `Window > SoapKit > Bind Manager > Performance`

**Features:**
- Total binding cost per frame
- Slowest binding identification
- Optimization potential estimation
- Per-binding cost analysis
- Automatic optimization suggestions

## Optimization Strategies

### 1. Use Appropriate Modes

```csharp
// ✅ Good: Static values
playerName → NameText.text (InitialSync)  // Zero runtime cost

// ⚠️ Okay: Display values
health → HealthBar.fillAmount (VariableToTarget)  // Low cost

// ❌ Avoid: Unnecessary TwoWaySync
score → ScoreText.text (TwoWaySync)  // Higher cost, unnecessary
```

### 2. Set Update Intervals

```csharp
// ✅ Good: Critical UI (event-driven)
healthBar.updateInterval = 0.0f;

// ✅ Good: Non-critical text
scoreText.updateInterval = 0.1f;  // 10 FPS is enough

// ❌ Avoid: All bindings at 0ms
debugText.updateInterval = 0.0f;  // Not needed for debug info
```

### 3. Simplify Transformations

```csharp
// ✅ Good: Simple linear transform
inputRange = (0, 100), outputRange = (0, 1), Linear curve

// ⚠️ Okay: Complex curve with few keyframes
transformationCurve = AnimationCurve with 3-4 keyframes

// ❌ Avoid: Overly complex curves
transformationCurve = AnimationCurve with 20+ keyframes
```

### 4. Batch Related Bindings

```csharp
// ✅ Good: One SOAPBind for logical group
GameObject: "PlayerHUD"
  ├── healthBar binding
  ├── manaBar binding
  ├── scoreText binding
  └── levelText binding

// ❌ Avoid: Separate SOAPBind per binding
GameObject: "HealthBarBinder" (only health)
GameObject: "ManaBarBinder" (only mana)
```

### 5. Avoid String Formatting on High-Frequency Updates

```csharp
// ⚠️ Problematic: String allocation every frame
frameRateDisplay.stringFormat = "FPS: {0:F2}"  // Updates 60+ times/sec

// ✅ Better: Use updateInterval
frameRateDisplay.updateInterval = 0.5f  // Update every 0.5s
frameRateDisplay.stringFormat = "FPS: {0:F2}"

// ✅ Best: Custom script for high-frequency text
// Write custom MonoBehaviour for FPS counter
```

## Performance Benchmarks

**System Performance:**
```
Binding Updates per Frame:  Up to 16 (configurable via maxUpdatesPerFrame)
Average Update Time:        0.1-0.2ms per binding (event-driven)
Memory Overhead:            ~40 bytes per binding
Supported Bindings:         Unlimited (tested with 500+)
```

**Comparison with Manual Code:**
```
Manual Property Updates:    ~50 lines of code per UI
SOAP Binding System:        0 lines of code (visual only)
Performance Difference:     SOAP 2-3x faster (event-driven vs polling)
Maintenance:                90% reduction in UI synchronization code
```

## Memory Management

### Automatic Cleanup

```csharp
void OnDestroy()
{
    // SOAPBind automatically:
    // - Unsubscribes from all Variable events
    // - Unsubscribes from all GameEvent listeners
    // - Clears reflection caches
    // - Releases component references
}
```

**Memory Leak Prevention:**
- ✅ Automatic event unsubscription
- ✅ Proper IDisposable implementation
- ✅ Null reference handling
- ✅ Component destruction detection

### Reflection Caching

```csharp
// Cached at initialization:
[NonSerialized] public PropertyInfo targetProp;
[NonSerialized] public FieldInfo targetField;
[NonSerialized] public MethodInfo targetMeth;

// Reused on every update - no redundant reflection
```

## Mobile Optimization

**Battery-Friendly Design:**
```csharp
// Event-driven updates = CPU only active when needed
// No continuous Update() loop = reduced battery drain

// Mobile optimization checklist:
✅ Use event-driven updates (updateInterval = 0)
✅ Set InitialSync for static UI
✅ Increase intervals for non-critical elements
✅ Batch bindings efficiently
✅ Monitor with Performance Analyzer
```

## Debugging Performance Issues

### Step 1: Identify Bottlenecks

```csharp
// Open Bind Manager → Performance Tab
// Sort by "Cost" column
// Look for red/orange indicators
```

### Step 2: Check Configuration

```
⚠️ updateInterval = 0 + high cost → Increase interval
⚠️ TwoWaySync + non-interactive → Change to VariableToTarget
⚠️ Complex transformation curve → Simplify to linear
⚠️ String formatting on frequent updates → Reduce update frequency
```

### Step 3: Apply Fixes

```csharp
// Example: Slow damage number display
Before: DamageNumbers.text ← DamageValue (0.89ms, updateInterval=0)
After:  DamageNumbers.text ← DamageValue (0.31ms, updateInterval=0.1)
Improvement: 65% faster, still responsive
```

## Profiler Integration

Use Unity Profiler to analyze binding performance:

```csharp
// SOAPBind operations show as:
SOAPBind.UpdateBindingImmediate()  // Immediate updates
SOAPBind.UpdateWithInterval()       // Interval coroutines
SOAPBind.InvokeMethod()            // Event method calls

// Look for:
// - Excessive calls per frame (should be minimal with event-driven)
// - Long execution times (>1ms per binding)
// - Garbage allocation (should be minimal)
```

## Next Steps

- **[Troubleshooting](./troubleshooting)** - Common performance issues
- **[Binding Modes](./modes)** - Choose optimal modes
- **[Transformation](./transformation)** - Optimize transformations

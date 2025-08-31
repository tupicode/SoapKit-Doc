---
title: Troubleshooting Guide
sidebar_position: 10
---

# Troubleshooting Guide

This guide helps you diagnose and solve common issues when working with SoapKit. We've organized solutions by symptoms and provide step-by-step debugging approaches.

## Quick Diagnosis Checklist

When something isn't working, run through this quick checklist first:

- [ ] Are you in Play Mode? (Many features only work at runtime)
- [ ] Are all SoapKit assets assigned in the Inspector?
- [ ] Are you subscribing to events in `OnEnable` and unsubscribing in `OnDisable`?
- [ ] Are there any null reference exceptions in the Console?
- [ ] Is the SoapKit Debug Window showing data? (`Tools > SoapKit > Debug Window`)

## Installation Issues

### SoapKit Menu Items Missing

**Symptoms:**
- No `Tools > SoapKit` menu
- No `Create > SoapKit` options in Project window
- Import appears successful but features don't work

**Solutions:**

**Check Assembly Definition:**
```csharp
// Verify FarmGrowthToolkit.Soap.asmdef is present in:
// Assets/SoapKit/Runtime/FarmGrowthToolkit.Soap.asmdef

// If missing, reimport the package or check package contents
```

**Verify Script Compilation:**
```csharp
// Check Unity Console for compilation errors
// SoapKit requires all scripts to compile successfully

// Common compilation issues:
// 1. Missing using statements
// 2. Namespace conflicts
// 3. Unity version compatibility
```

**Reimport Package:**
```csharp
// In Project window:
// Right-click on SoapKit folder
// Choose "Reimport"
// Wait for reimport to complete
```

**Clear Unity Cache:**
```csharp
// Close Unity
// Delete Library folder in your project
// Reopen Unity and wait for reimport
```

### Package Manager Installation Failed

**Symptoms:**
- Git URL import fails
- "Unable to add package" error
- Package doesn't appear in Package Manager

**Solutions:**

**Check Git URL:**
```
Correct URL: https://github.com/farmgrowth/soapkit.git
Common typos: 
- Missing .git extension
- Wrong repository name
- Incorrect organization name
```

**Verify Git Installation:**
```bash
# Open command line and check:
git --version

# If Git not installed, download from: https://git-scm.com/
```

**Alternative Installation Methods:**
```csharp
// Method 1: Download ZIP
// 1. Download ZIP from GitHub
// 2. Extract to Assets/SoapKit/
// 3. Let Unity reimport

// Method 2: Git Clone
// 1. Clone repository outside project
// 2. Copy SoapKit folder to Assets/
// 3. Reimport in Unity
```

## Runtime Issues

### Variables Not Updating in Inspector

**Symptoms:**
- Variable values don't change in Inspector during Play Mode
- Inspector shows old/incorrect values
- Changes don't reflect in Debug Window

**Diagnosis:**
```csharp
// Check these common issues:

// 1. Not in Play Mode
if (!Application.isPlaying)
{
    Debug.LogWarning("Variable values only update during Play Mode");
}

// 2. Variable not assigned
if (playerHealth == null)
{
    Debug.LogError("Variable not assigned in Inspector");
}

// 3. SetValue() not being called
playerHealth.SetValue(newHealth); // ✅ Correct
playerHealth.Value = newHealth;   // ❌ Wrong - read-only property
```

**Solutions:**

**Enable Runtime Inspector Updates:**
```csharp
// In Inspector, ensure "Update Mode" is set to "Runtime"
// This is usually automatic but can be manually set

// For variables, check the Inspector shows:
// Current Value: [live updating value]
// Initial Value: [design time value]
```

**Debug Variable State:**
```csharp
public class VariableDebugger : MonoBehaviour
{
    [SerializeField] private IntVariable testVariable;
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.D))
        {
            Debug.Log($"Variable: {testVariable.name}");
            Debug.Log($"Current Value: {testVariable.Value}");
            Debug.Log($"Change Count: {testVariable.ChangeCount}");
            Debug.Log($"Is Valid: {testVariable.IsValid()}");
        }
    }
}
```

### Events Not Firing

**Symptoms:**
- Event.Raise() called but listeners don't respond
- Debug Window shows 0 listeners for events
- Expected behavior not happening

**Diagnosis:**
```csharp
public class EventDiagnostics : MonoBehaviour
{
    [SerializeField] private IntGameEvent testEvent;
    
    void Start()
    {
        DiagnoseEventIssues();
    }
    
    private void DiagnoseEventIssues()
    {
        if (testEvent == null)
        {
            Debug.LogError("Event not assigned!");
            return;
        }
        
        Debug.Log($"Event: {testEvent.name}");
        Debug.Log($"Listener Count: {testEvent.ListenerCount}");
        Debug.Log($"Has Been Raised: {testEvent.HasBeenRaised}");
        
        // Test raising
        testEvent.Raise(42);
        Debug.Log($"After test raise - Listener Count: {testEvent.ListenerCount}");
    }
}
```

**Common Solutions:**

**Check Event Assignment:**
```csharp
// Verify event assets are assigned in Inspector
[SerializeField] private IntGameEvent onHealthChanged; // Must be assigned!

void Start()
{
    if (onHealthChanged == null)
    {
        Debug.LogError($"Event not assigned on {gameObject.name}");
        return;
    }
}
```

**Verify Listener Registration:**
```csharp
// ✅ Correct listener pattern
void OnEnable()
{
    if (onHealthChanged != null)
        onHealthChanged.AddListener(OnHealthChangedHandler);
}

void OnDisable() 
{
    if (onHealthChanged != null)
        onHealthChanged.RemoveListener(OnHealthChangedHandler);
}

// ❌ Common mistakes
void Start()
{
    // Wrong: Using Start() instead of OnEnable()
    onHealthChanged.AddListener(OnHealthChangedHandler);
}

void OnDestroy()
{
    // Wrong: Only unsubscribing in OnDestroy()
    // Should also unsubscribe in OnDisable()
    onHealthChanged.RemoveListener(OnHealthChangedHandler);
}
```

**Check Listener Method Signature:**
```csharp
// ✅ Correct signature for IntGameEvent
private void OnHealthChangedHandler(int newHealth)
{
    // Handle health change
}

// ❌ Wrong signatures
private void OnHealthChangedHandler() // Missing parameter
private void OnHealthChangedHandler(float newHealth) // Wrong type
private void OnHealthChangedHandler(int newHealth, int oldHealth) // Too many parameters
```

### Memory Leaks

**Symptoms:**
- Memory usage increases over time
- Performance degrades during play
- Objects not being garbage collected

**Diagnosis:**
```csharp
// Use Unity Profiler to detect memory leaks:
// Window > Analysis > Profiler
// Look for increasing memory in "GC Alloc" and "Used Total"

// Check for event subscription leaks
public class MemoryLeakDetector : MonoBehaviour
{
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.M))
        {
            LogEventListenerCounts();
        }
    }
    
    private void LogEventListenerCounts()
    {
        // Find all events in scene and log listener counts
        var events = FindObjectsOfType<GameEvent<int>>();
        foreach (var evt in events)
        {
            Debug.Log($"Event {evt.name}: {evt.ListenerCount} listeners");
        }
    }
}
```

**Solutions:**

**Proper Event Lifecycle:**
```csharp
// ✅ Correct pattern - no memory leaks
public class MemoryLeakSafeListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    
    void OnEnable()
    {
        // Subscribe when enabled
        if (onHealthChanged != null)
            onHealthChanged.AddListener(OnHealthChanged);
    }
    
    void OnDisable()
    {
        // Unsubscribe when disabled - prevents memory leaks
        if (onHealthChanged != null)
            onHealthChanged.RemoveListener(OnHealthChanged);
    }
    
    private void OnHealthChanged(int health) { }
}

// ❌ Memory leak pattern
public class MemoryLeakListener : MonoBehaviour
{
    void Start()
    {
        onHealthChanged.AddListener(OnHealthChanged);
        // Never unsubscribes - causes memory leak!
    }
}
```

**Variable Reference Management:**
```csharp
// ✅ Good - clear references appropriately
public class SafeVariableUser : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    
    void OnDestroy()
    {
        // Clear event subscriptions
        if (playerHealth != null)
            playerHealth.OnValueChanged -= OnHealthChanged;
    }
}
```

## Performance Issues

### Slow Event Performance

**Symptoms:**
- Frame rate drops when events fire
- Profiler shows high CPU usage in event system
- Game stutters during event-heavy operations

**Diagnosis:**
```csharp
// Use SoapKit Performance Profiler
// Tools > SoapKit > Debug Window > Performance Tab

// Look for:
// - Events with high listener counts (>20)
// - Events firing very frequently (>30/second)
// - Expensive listener callbacks
```

**Solutions:**

**Optimize Event Frequency:**
```csharp
// ✅ Throttle high-frequency events
public class ThrottledEvents : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    [SerializeField] private float throttleInterval = 0.1f; // 10fps max
    
    private float lastEventTime;
    private Vector3 lastPosition;
    
    void Update()
    {
        if (Time.time - lastEventTime >= throttleInterval)
        {
            Vector3 currentPos = transform.position;
            if (Vector3.Distance(currentPos, lastPosition) > 0.1f)
            {
                onPlayerMoved.Raise(currentPos);
                lastEventTime = Time.time;
                lastPosition = currentPos;
            }
        }
    }
}
```

**Optimize Listener Performance:**
```csharp
// ✅ Efficient listeners
public class FastListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    
    // Cache expensive lookups
    private Text healthText;
    private Slider healthSlider;
    
    void Start()
    {
        healthText = GetComponent<Text>();
        healthSlider = GetComponent<Slider>();
    }
    
    private void OnHealthChanged(int health)
    {
        // Use cached references - fast
        if (healthText != null)
            healthText.text = health.ToString();
        if (healthSlider != null)
            healthSlider.value = health / 100f;
    }
}

// ❌ Slow listeners
public class SlowListener : MonoBehaviour
{
    private void OnHealthChanged(int health)
    {
        // Expensive lookups on every event - slow!
        var healthText = FindObjectOfType<Text>();
        var healthSlider = GameObject.Find("HealthBar").GetComponent<Slider>();
        
        healthText.text = health.ToString();
        healthSlider.value = health / 100f;
    }
}
```

### High Memory Usage

**Symptoms:**
- Large memory footprint from SoapKit
- Out of memory errors
- Slow garbage collection

**Solutions:**

**Asset Management:**
```csharp
// Keep reasonable limits on SoapKit assets
// Typical project usage:
// - Variables: 50-200 assets
// - Events: 30-150 assets  
// - Total size: <1MB

// If you have thousands of assets, consider:
// - Combining related variables
// - Using fewer, more generic events
// - Runtime asset creation instead of many static assets
```

**Event History Management:**
```csharp
// Adjust event history size in settings
// Tools > SoapKit > Settings > Debug > Event History Size
// Default: 1000 events per event type
// Reduce for memory-constrained platforms: 100-500
```

## Editor Issues

### Debug Window Not Working

**Symptoms:**
- Debug Window opens but shows no data
- Variables/Events tabs are empty
- Performance tab shows no metrics

**Solutions:**

**Enable Debug Mode:**
```csharp
// Check SoapKit Settings
// Edit > Project Settings > SoapKit > Debug
// Ensure "Enable Debug Mode" is checked
```

**Refresh Debug Data:**
```csharp
// In Debug Window, click "Refresh" button
// Or use keyboard shortcut: F5
// Or close and reopen window
```

**Check Play Mode:**
```csharp
// Many debug features require Play Mode
// Variables show design-time values in Edit Mode
// Events show runtime activity only in Play Mode
```

### Asset Creation Failed

**Symptoms:**
- "Create > SoapKit" menu works but assets aren't created
- Asset Creator window shows errors
- Created assets don't appear in Project

**Solutions:**

**Check Folder Permissions:**
```csharp
// Ensure target folder is writable
// Check that folder isn't locked by version control
// Try creating in different folder (e.g., Assets root)
```

**Verify Asset Database:**
```csharp
// Force refresh Asset Database
// Assets > Refresh (Ctrl+R)
// Or restart Unity
```

**Manual Asset Creation:**
```csharp
// If automatic creation fails, create manually:
// 1. Right-click in Project window
// 2. Create > ScriptableObject
// 3. Choose appropriate SoapKit type
// 4. Configure in Inspector
```

## Integration Issues

### SoapKit + Other Assets Conflicts

**Symptoms:**
- Compiler errors after importing other assets
- Missing references between SoapKit and other systems
- Performance conflicts

**Solutions:**

**Assembly Definition Conflicts:**
```csharp
// Check for conflicting assembly definitions
// SoapKit uses: FarmGrowthToolkit.Soap.asmdef

// If conflicts occur:
// 1. Add SoapKit assembly reference to other assets
// 2. Or exclude conflicting code from compilation
```

**Namespace Conflicts:**
```csharp
// Fully qualify SoapKit types if conflicts occur
using FarmGrowthToolkit.Soap;

// Or use alias
using Soap = FarmGrowthToolkit.Soap;
```

### Version Control Issues

**Symptoms:**
- SoapKit assets cause merge conflicts
- Team members have different asset configurations
- Assets appear modified when nothing changed

**Solutions:**

**Proper .gitignore:**
```
# Include SoapKit assets
!Assets/SoapKit/
!Assets/Data/Variables/
!Assets/Data/Events/

# Exclude temporary files
Library/
Temp/
*.tmp
```

**Asset Serialization:**
```csharp
// Use text serialization for SoapKit assets
// Edit > Project Settings > Editor > Asset Serialization Mode
// Set to "Force Text"
```

**Team Asset Standards:**
```csharp
// Establish naming conventions
// Use consistent folder structures
// Document asset dependencies
// Regular team asset reviews
```

## Platform-Specific Issues

### Mobile Performance

**Symptoms:**
- Poor performance on mobile devices
- High memory usage on mobile
- Frequent garbage collection

**Solutions:**

**Mobile Optimizations:**
```csharp
// Reduce event history size for mobile
#if UNITY_ANDROID || UNITY_IOS
    [SerializeField] private int mobileEventHistorySize = 100;
#else
    [SerializeField] private int desktopEventHistorySize = 1000;
#endif

// Throttle high-frequency events more aggressively
#if UNITY_ANDROID || UNITY_IOS
    [SerializeField] private float mobileThrottleRate = 0.2f; // 5fps
#else  
    [SerializeField] private float desktopThrottleRate = 0.033f; // 30fps
#endif
```

**Memory Management:**
```csharp
// Disable debug features in mobile builds
public class MobilePlatformAdapter : MonoBehaviour
{
    void Start()
    {
        #if UNITY_ANDROID || UNITY_IOS
        // Disable expensive debug features
        SoapKit.DebugMode = false;
        SoapKit.EventHistory = false;
        SoapKit.PerformanceTracking = false;
        #endif
    }
}
```

### WebGL Issues

**Symptoms:**
- SoapKit features not working in WebGL builds
- Performance issues in browser
- Threading-related errors

**Solutions:**

**WebGL Compatibility:**
```csharp
// Avoid threading in WebGL builds
#if !UNITY_WEBGL || UNITY_EDITOR
    // Use threading for performance
    StartCoroutine(BackgroundProcessing());
#else
    // Use main thread only
    ProcessOnMainThread();
#endif
```

**Browser Performance:**
```csharp
// Optimize for browser environment
public class WebGLOptimizer : MonoBehaviour
{
    void Start()
    {
        #if UNITY_WEBGL && !UNITY_EDITOR
        // Reduce update frequency
        Application.targetFrameRate = 30;
        
        // Disable expensive features
        QualitySettings.SetQualityLevel(0);
        #endif
    }
}
```

## Getting Help

### Community Support

**Discord Server:** [SoapKit Community](https://discord.gg/soapkit)
- Active community of developers
- Quick answers to common questions
- Share tips and best practices

**GitHub Issues:** [Report Bugs](https://github.com/farmgrowth/soapkit/issues)
- Bug reports and feature requests
- Technical discussions
- Contribution guidelines

**Documentation:** [Complete Docs](https://soapkit-docs.example.com)
- Comprehensive guides and tutorials
- API reference documentation
- Best practices and patterns

### Professional Support

**Email Support:** support@soapkit.dev
- Priority response for critical issues
- Custom integration assistance
- Performance optimization consulting

**Professional Services:**
- Custom SoapKit extensions
- Team training and workshops
- Architecture consultation
- Migration assistance

### Self-Help Resources

**Debug Checklist:**
1. Check Unity Console for errors
2. Verify all assets are assigned
3. Ensure proper event subscription patterns
4. Test in isolation with minimal scene
5. Use SoapKit Debug Window for insights

**Performance Profiling:**
1. Use Unity Profiler (Window > Analysis > Profiler)
2. Check SoapKit Performance tab
3. Monitor memory usage over time
4. Profile before and after changes

**Best Practices Review:**
1. Follow naming conventions
2. Proper event lifecycle management
3. Appropriate variable scoping
4. Regular code reviews
5. Team standards compliance

---

Most SoapKit issues stem from common patterns like missing event subscriptions, null references, or improper lifecycle management. Following the patterns in this guide will help you avoid 90% of common issues and build robust, maintainable games with SoapKit! 🛠️✨

**Remember:** When in doubt, check the Debug Window first - it provides real-time insights into your SOAP architecture and often reveals the root cause of issues immediately.
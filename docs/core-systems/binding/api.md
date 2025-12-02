---
title: API Reference
sidebar_position: 7
---

# API Reference

Public API for SOAPBind component and BindTarget configuration.

## SOAPBind Component

```csharp
[AddComponentMenu("SoapKit/SOAP Bind")]
[DisallowMultipleComponent]
public class SOAPBind : MonoBehaviour
```

### Public Properties

```csharp
// Binding Configuration
public List<BindTarget> bindings;

// Performance Settings
public bool enablePerformanceTracking = true;
public bool enableAutoOptimization = true;
public int maxUpdatesPerFrame = 16;

// Debug Settings
public bool enableDebugMode = false;
public bool showGizmosInScene = false;
```

### Public Methods

#### Binding Control

```csharp
// Refresh specific binding
public void RefreshBinding(int bindingIndex);

// Refresh all bindings
public void RefreshAllBindings();

// Add binding at runtime
public void AddBinding(BindTarget binding);

// Remove binding at runtime
public void RemoveBinding(int index);
```

#### Performance Monitoring

```csharp
// Get binding execution time (milliseconds)
public float GetBindingCostMs(int bindingIndex);

// Get total cost of all bindings
public float GetTotalCostMs();

// Check if binding is valid
public bool IsBindingValid(int bindingIndex);
```

### Events

```csharp
// Binding lifecycle events
public System.Action<BindTarget> OnBindingUpdated;
public System.Action<BindTarget, string> OnBindingError;
public System.Action<BindTarget> OnBindingValidated;

// Example usage:
soapBind.OnBindingUpdated += (bind) => {
    Debug.Log($"Binding updated: {bind.targetProperty}");
};
```

---

## BindTarget Class

```csharp
[Serializable]
public class BindTarget
```

### Required Configuration

```csharp
// Target Component
public Component targetComponent;       // Unity component to bind to
public string targetProperty;           // Property/method name
public string targetMethod;             // Method name (for EventToMethod)

// Source Asset
public ScriptableObject soapAsset;     // SOAP Variable or Event

// Binding Configuration
public BindingType bindingType;        // How to bind
public BindingMode bindingMode;        // Data flow direction
```

### Transformation Settings

```csharp
// Numeric Transformation
public bool useTransformation = false;
public AnimationCurve transformationCurve = AnimationCurve.Linear(0, 0, 1, 1);
public Vector2 inputRange = new Vector2(0, 1);
public Vector2 outputRange = new Vector2(0, 1);

// Boolean Transformation
public bool invertBool = false;

// String Formatting
public bool useStringFormat = false;
public string stringFormat = "{0}";
```

### Advanced Settings

```csharp
// Update Control
public bool autoUpdate = true;          // Enable automatic updates
public float updateInterval = 0.0f;     // Seconds between updates (0 = event-driven)

// Validation
public bool validateOnBind = true;      // Validate on initialization
public bool logBindEvents = false;      // Log updates to Console
```

### Runtime Properties (Non-Serialized)

```csharp
// Status
[NonSerialized] public bool isValid;
[NonSerialized] public string lastError;

// Performance Metrics
[NonSerialized] public float lastUpdateTime;
[NonSerialized] public int updateCount;

// Cached Reflection Data
[NonSerialized] public PropertyInfo targetProp;
[NonSerialized] public FieldInfo targetField;
[NonSerialized] public MethodInfo targetMeth;
[NonSerialized] public PropertyInfo assetValueProp;
```

---

## Enumerations

### BindingType

```csharp
public enum BindingType
{
    Property,           // Generic property/field binding
    UI,                 // UI component binding
    EventToMethod,      // Event → Method invocation
    AnimatorParameter,  // Animator parameter sync
    Light,              // Light component binding
    Transform,          // Transform component binding
    AudioSource,        // AudioSource component binding
    Renderer,           // Renderer component binding
    GameObject,         // GameObject binding
    Custom              // Custom binding type
}
```

### BindingMode

```csharp
public enum BindingMode
{
    VariableToTarget,   // Variable → Component (push)
    TargetToVariable,   // Component → Variable (pull)
    TwoWaySync,         // Bidirectional sync
    InitialSync         // One-time initialization
}
```

---

## Runtime API Examples

### Create Binding at Runtime

```csharp
// Get SOAPBind component
SOAPBind soapBind = GetComponent<SOAPBind>();

// Create new binding
BindTarget newBinding = new BindTarget
{
    targetComponent = GetComponent<Image>(),
    targetProperty = "fillAmount",
    soapAsset = healthVariable,
    bindingType = SOAPBind.BindingType.UI,
    bindingMode = SOAPBind.BindingMode.VariableToTarget,
    useTransformation = true,
    inputRange = new Vector2(0, 100),
    outputRange = new Vector2(0, 1)
};

// Add to SOAPBind
soapBind.AddBinding(newBinding);
```

### Modify Binding at Runtime

```csharp
// Access existing binding
BindTarget binding = soapBind.bindings[0];

// Change configuration
binding.updateInterval = 0.1f;
binding.useStringFormat = true;
binding.stringFormat = "HP: {0:F0}%";

// Refresh binding to apply changes
soapBind.RefreshBinding(0);
```

### Monitor Performance

```csharp
void Update()
{
    // Check each binding's performance
    for (int i = 0; i < soapBind.bindings.Count; i++)
    {
        float cost = soapBind.GetBindingCostMs(i);

        if (cost > 5.0f)
        {
            Debug.LogWarning($"Binding {i} is slow: {cost:F2}ms");
        }
    }

    // Check total cost
    float totalCost = soapBind.GetTotalCostMs();
    if (totalCost > 16.0f)
    {
        Debug.LogError($"Total binding cost exceeds 16ms: {totalCost:F2}ms");
    }
}
```

### Subscribe to Events

```csharp
void OnEnable()
{
    SOAPBind soapBind = GetComponent<SOAPBind>();

    // Subscribe to binding updates
    soapBind.OnBindingUpdated += HandleBindingUpdate;
    soapBind.OnBindingError += HandleBindingError;
}

void OnDisable()
{
    SOAPBind soapBind = GetComponent<SOAPBind>();

    // Unsubscribe
    soapBind.OnBindingUpdated -= HandleBindingUpdate;
    soapBind.OnBindingError -= HandleBindingError;
}

void HandleBindingUpdate(SOAPBind.BindTarget bind)
{
    Debug.Log($"Binding updated: {bind.targetProperty}");
}

void HandleBindingError(SOAPBind.BindTarget bind, string error)
{
    Debug.LogError($"Binding error on {bind.targetProperty}: {error}");
}
```

---

## Static Utility Methods

### Transformation Support Detection

```csharp
// Check if type supports numeric transformation
public static bool SupportsTransformation(System.Type valueType);
public static bool SupportsTransformation(ScriptableObject soapAsset);

// Example:
if (SOAPBind.SupportsTransformation(myVariable))
{
    binding.useTransformation = true;
}
```

---

## Editor-Only APIs

These are available only in UnityEditor assembly:

```csharp
#if UNITY_EDITOR
using FarmGrowthToolkit.Soap.Editor;

// Get all SOAPBind components in scene
SOAPBind[] allBinds = FindObjectsOfType<SOAPBind>();

// Validate binding configuration
bool isValid = SoapKitBindEditor.ValidateBinding(bindTarget);

// Get available properties for component
string[] properties = SoapKitBindEditor.GetComponentProperties(component);
#endif
```

---

## Configuration Best Practices

### Optimal Settings

```csharp
// For immediate UI updates (health bars, score)
new BindTarget {
    bindingMode = BindingMode.VariableToTarget,
    updateInterval = 0.0f,              // Event-driven
    autoUpdate = true,
    validateOnBind = true
};

// For user input (settings sliders)
new BindTarget {
    bindingMode = BindingMode.TwoWaySync,
    updateInterval = 0.0f,
    autoUpdate = true,
    validateOnBind = true
};

// For static values (player name)
new BindTarget {
    bindingMode = BindingMode.InitialSync,
    updateInterval = 0.0f,
    autoUpdate = false,                 // Not needed
    validateOnBind = true
};

// For non-critical updates (debug displays)
new BindTarget {
    bindingMode = BindingMode.VariableToTarget,
    updateInterval = 0.5f,              // Update every 0.5 seconds
    autoUpdate = true,
    validateOnBind = false              // Optional
};
```

---

## Migration from Manual Binding

### Before (Manual Code)

```csharp
public class HealthUI : MonoBehaviour
{
    [SerializeField] IntVariable health;
    [SerializeField] Image healthBar;

    void OnEnable()
    {
        health.OnValueChanged += UpdateHealthBar;
        UpdateHealthBar(health.Value);
    }

    void OnDisable()
    {
        health.OnValueChanged -= UpdateHealthBar;
    }

    void UpdateHealthBar(int newHealth)
    {
        healthBar.fillAmount = newHealth / 100f;
    }
}
```

### After (SOAPBind API)

```csharp
public class HealthUI : MonoBehaviour
{
    void Start()
    {
        // Get or add SOAPBind
        SOAPBind soapBind = gameObject.GetComponent<SOAPBind>();
        if (soapBind == null)
            soapBind = gameObject.AddComponent<SOAPBind>();

        // Create binding
        soapBind.AddBinding(new SOAPBind.BindTarget {
            targetComponent = GetComponent<Image>(),
            targetProperty = "fillAmount",
            soapAsset = FindObjectOfType<IntVariable>(), // Or reference directly
            bindingType = SOAPBind.BindingType.UI,
            bindingMode = SOAPBind.BindingMode.VariableToTarget,
            useTransformation = true,
            inputRange = new Vector2(0, 100),
            outputRange = new Vector2(0, 1)
        });
    }
}
```

**Result:** Same functionality, but binding is now managed by SOAPBind system with performance monitoring and visual debugging.

---

## Next Steps

- **[Overview](./overview)** - System architecture and basics
- **[Binding Types](./types)** - Component-specific bindings
- **[Binding Modes](./modes)** - Data flow directions
- **[Performance](./performance)** - Optimization strategies

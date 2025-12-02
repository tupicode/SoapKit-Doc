---
title: Troubleshooting
sidebar_position: 6
---

# Troubleshooting Guide

Common issues and solutions for the SOAP Binding System.

## Binding Not Updating

**Symptoms:** UI not reflecting Variable changes

### Diagnostics

1. **Check Binding Status**
   - Inspector shows ✅ Valid?
   - If ❌ Error, read error message

2. **Verify Configuration**
   ```csharp
   - SOAP asset assigned?
   - Target component assigned?
   - Property name correct?
   - Auto-update enabled?
   ```

3. **Enable Logging**
   ```csharp
   Advanced Settings:
   ☑ Log Bind Events = true

   // Check Console for:
   "[SOAPBind] Binding updated: health → fillAmount (value: 0.75)"
   ```

4. **Check Binding Mode**
   ```csharp
   // InitialSync updates once only
   Mode: InitialSync → Check if already executed

   // Should be VariableToTarget for continuous updates
   Mode: VariableToTarget ✅
   ```

### Common Causes

| Cause | Solution |
|-------|----------|
| Binding mode = InitialSync | Change to VariableToTarget |
| Component destroyed | Re-assign target component |
| Variable not changing | Verify Variable.SetValue() is called |
| Auto-update disabled | Enable in Advanced Settings |
| Update interval too high | Reduce interval (0 = event-driven) |

---

## Type Compatibility Errors

**Symptoms:** Binding shows ❌ error status

### Common Mismatches

| Source | Target | Issue | Solution |
|--------|--------|-------|----------|
| FloatVariable | TextMeshPro.text | Type incompatible | Enable String Formatting: `"{0:F2}"` |
| IntVariable | Image.fillAmount | Range mismatch | Enable Transformation: Input (0,100) → Output (0,1) |
| BoolVariable | Slider.value | Type incompatible | Use FloatVariable or IntVariable instead |
| StringVariable | Transform.position | Completely incompatible | Wrong target - choose string property |

### Type Validation Checklist

```csharp
✓ Float → float property     (direct)
✓ Float → string property    (with String Format)
✓ Int → int property         (direct)
✓ Int → float property       (with Transformation)
✓ Bool → bool property       (direct)
✓ Vector3 → Vector3 property (direct)
✗ Bool → float property      (use Float/IntVariable)
✗ String → numeric property  (incompatible)
```

---

## Transformation Not Working

**Symptoms:** Values not transformed as expected

### Diagnostics

1. **Verify Transformation Enabled**
   ```csharp
   ☑ Use Transformation = true
   ```

2. **Check Input Range**
   ```csharp
   // Input range must cover actual Variable values
   Variable value: 75
   Input Range: (0, 100) ✅
   Input Range: (0, 50)  ❌ Value out of range!
   ```

3. **Inspect Curve**
   ```csharp
   // Click curve field in Inspector
   // Verify curve shape is correct
   // Check keyframe positions
   ```

4. **Verify Output Range**
   ```csharp
   // Ensure output range matches target property
   Target: Image.fillAmount (expects 0-1)
   Output Range: (0, 1) ✅
   Output Range: (0, 100) ❌ Will exceed valid range!
   ```

### Transformation Limitations

**Unsupported Types:**
```csharp
❌ BoolVariable   → Cannot use numeric transformation
❌ StringVariable → Cannot use numeric transformation
❌ GameObject     → Cannot use numeric transformation

// Solution: Use appropriate transformation type
BoolVariable → Use Boolean Invert instead
StringVariable → Use String Formatting instead
```

---

## Performance Issues

**Symptoms:** Frame rate drops with active bindings

### Diagnostics

1. **Open Bind Manager**
   ```
   Window > SoapKit > Bind Manager > Performance Tab
   ```

2. **Identify Bottlenecks**
   ```csharp
   // Sort by "Cost" column
   // Look for red indicators (>5ms)
   // Check "Optimization Potential" section
   ```

3. **Check Inspector Metrics**
   ```csharp
   ☑ Show Performance Metrics
   // Look for orange/red bars
   ```

### Solutions

**High Execution Time:**
```csharp
// Problem: Binding costs >2ms
updateInterval = 0.0f  // Every frame

// Solution: Increase interval
updateInterval = 0.1f  // 10 FPS - often sufficient
```

**Too Many TwoWaySync Bindings:**
```csharp
// Problem: Non-interactive UI using TwoWaySync
Mode: TwoWaySync  // Higher overhead

// Solution: Change to one-way
Mode: VariableToTarget  // Lower overhead
```

**Complex Transformations:**
```csharp
// Problem: Curve with 20+ keyframes
transformationCurve = ComplexCurve(20 keyframes)

// Solution: Simplify to 3-5 keyframes
transformationCurve = SimpleCurve(3 keyframes)
```

**String Formatting on High-Frequency Updates:**
```csharp
// Problem: FPS counter updating 60 times/sec
stringFormat = "FPS: {0:F2}"
updateInterval = 0.0f

// Solution: Reduce update frequency
updateInterval = 0.5f  // Update every 0.5 seconds
```

---

## Event Binding Not Firing

**Symptoms:** EventToMethod binding doesn't execute

### Diagnostics

1. **Verify Event Asset**
   ```csharp
   // Is the correct GameEvent assigned?
   Asset: OnPlayerDied (UnitGameEvent) ✅
   ```

2. **Check Method Signature**
   ```csharp
   // Method must match event type
   UnitGameEvent → void Method()           ✅
   IntGameEvent  → void Method(int value)  ✅
   BoolGameEvent → void Method()           ❌ Missing parameter
   ```

3. **Confirm Event is Raised**
   ```csharp
   // Add logging to game code
   void Die() {
       Debug.Log("Raising OnPlayerDied");
       onPlayerDied.Raise();
   }
   ```

4. **Enable Binding Logs**
   ```csharp
   ☑ Log Bind Events = true
   // Should see: "[SOAPBind] Event raised: OnPlayerDied → Play()"
   ```

### Common Causes

| Cause | Solution |
|-------|----------|
| Wrong event asset assigned | Re-assign correct event |
| Method signature mismatch | Fix parameter types |
| Event never raised | Check game logic |
| Component destroyed | Re-create binding |

---

## Null Reference Errors

**Symptoms:** Console errors about null references

### Common Errors

**Missing SOAP Asset:**
```csharp
NullReferenceException: soapAsset is null

// Solution:
// 1. Select SOAPBind component
// 2. Find binding with missing asset (shown as ❌)
// 3. Drag SOAP asset to assignment field
```

**Destroyed Component:**
```csharp
MissingReferenceException: targetComponent has been destroyed

// Solution:
// 1. Remove or re-assign binding
// 2. Or delete GameObject with SOAPBind if no longer needed
```

**Missing Property:**
```csharp
MemberAccessException: Property 'fillAmount' not found

// Solution:
// 1. Verify component type is correct (e.g., Image not Text)
// 2. Check property name spelling
// 3. Refresh component list (click property dropdown again)
```

---

## TwoWaySync Issues

**Symptoms:** Infinite loops or unexpected behavior

### Loop Prevention

SOAPBind includes automatic loop detection:

```csharp
// Built-in safety:
// 1. Tracks last updated value
// 2. Skips update if value unchanged
// 3. Prevents circular updates

// But you should still avoid:
Variable A ↔ Component X ↔ Variable B ↔ Component Y ↔ Variable A
```

### Debugging TwoWaySync

1. **Enable Logging**
   ```csharp
   ☑ Log Bind Events = true
   // Watch for repeated updates
   ```

2. **Check for Loops**
   ```
   Window > SoapKit > Bind Manager > Validation Tab
   // Warns about potential circular dependencies
   ```

3. **Simplify Bindings**
   ```csharp
   // If problematic, change to one-way
   TwoWaySync → VariableToTarget or TargetToVariable
   ```

---

## Inspector Issues

**Symptoms:** Binding configuration not working properly

### Component Not Showing in Dropdown

**Cause:** Component not on selected GameObject or children

**Solution:**
```csharp
// 1. Verify component exists
GetComponent<Image>() != null

// 2. Refresh component list
// Click component dropdown → List refreshes

// 3. Check if component is on child
// Use GameObject mode or target child directly
```

### Property List Empty

**Cause:** No compatible properties for selected component

**Solution:**
```csharp
// 1. Check if component has public properties
// Example: SpriteRenderer has 'color' but not 'fillAmount'

// 2. Try different binding type
Type: UI → Type: Property

// 3. Verify component type is correct
// TextMeshProUGUI ≠ Text (legacy)
```

---

## Validation Warnings

**Symptoms:** ⚠️ warnings in Bind Manager Validation Tab

### Common Warnings

**Default String Format:**
```
⚠️ Using default string format "{0}"

// Not an error, but can be removed:
☐ Use String Format = false
```

**TwoWaySync with High Frequency:**
```
⚠️ TwoWaySync with updateInterval = 0 (high overhead)

// Consider one-way if UI is read-only:
Mode: VariableToTarget
```

**Unnecessary Linear Transformation:**
```
⚠️ Transformation enabled but curve is linear

// Can be replaced with simple input/output range:
☐ Use Transformation = false
// Just adjust Variable value directly
```

---

## Debug Workflow

### Step-by-Step Debugging

1. **Visual Inspection**
   ```
   Inspector: Check ✅/❌/⚠️ status
   ```

2. **Enable Logging**
   ```csharp
   ☑ Log Bind Events = true
   ```

3. **Test Manually**
   ```
   Click [▶️] button next to binding
   ```

4. **Check Bind Manager**
   ```
   Window > SoapKit > Bind Manager > Debugger Tab
   ```

5. **Validate All**
   ```
   Right-click SOAPBind → Validate All Bindings
   ```

---

## Getting Help

If issues persist:

1. **Export Validation Report**
   ```
   Bind Manager > Validation Tab > Export Report
   ```

2. **Check Documentation**
   - [Binding Modes](./modes) - Data flow issues
   - [Transformation](./transformation) - Value conversion issues
   - [Performance](./performance) - Optimization help

3. **Common Patterns**
   - See [Editor Tools](../../editor-tools/binding-system) for workflow guides

## Next Steps

- **[Performance](./performance)** - Optimize binding performance
- **[API Reference](./api)** - Public methods and properties
- **[Binding Modes](./modes)** - Understand data flow

---
title: Value Transformation
sidebar_position: 4
---

# Value Transformation System

Transform values before sending them to target components using curves, formatting, and boolean operations.

## Transformation Types

| Type | Applies To | Purpose |
|------|-----------|---------|
| **Numeric** | Float, Int, Vector, Color | AnimationCurve-based range mapping |
| **Boolean** | Bool | Simple NOT operation (inversion) |
| **String Format** | All types | C# composite string formatting |

## Numeric Transformation

Apply AnimationCurve-based transformations with input/output range mapping.

### Configuration

```csharp
public bool useTransformation = false;
public AnimationCurve transformationCurve = AnimationCurve.Linear(0, 0, 1, 1);
public Vector2 inputRange = new Vector2(0, 1);   // Source value range
public Vector2 outputRange = new Vector2(0, 1);  // Target value range
```

### Processing Pipeline

**3-Step Process:**

1. **Normalize**: Map input from `inputRange` to [0,1]
   ```csharp
   normalized = (input - inputRange.x) / (inputRange.y - inputRange.x)
   ```

2. **Evaluate Curve**: Apply AnimationCurve
   ```csharp
   curveValue = transformationCurve.Evaluate(normalized)
   ```

3. **Scale Output**: Map to `outputRange`
   ```csharp
   output = outputRange.x + (curveValue * (outputRange.y - outputRange.x))
   ```

### Practical Examples

**Health Bar (Linear)**
```csharp
// Map health (0-100) to fillAmount (0-1)
Input:  IntVariable playerHealth = 75
Config: inputRange = (0, 100), outputRange = (0, 1), Linear curve

Process:
  normalized = (75 - 0) / (100 - 0) = 0.75
  curveValue = curve.Evaluate(0.75) = 0.75
  output = 0 + (0.75 * (1 - 0)) = 0.75

Result: Image.fillAmount = 0.75 (75% filled)
```

**XP Bar (Exponential)**
```csharp
// Dramatic progression curve
Input:  IntVariable level = 50
Config: inputRange = (1, 100), outputRange = (0, 1), EaseOut curve

Process:
  normalized = (50 - 1) / (100 - 1) = 0.494
  curveValue = curve.Evaluate(0.494) = 0.7  // EaseOut effect
  output = 0 + (0.7 * (1 - 0)) = 0.7

Result: Appears 70% full despite level 50/100
```

**Audio Pitch by Speed**
```csharp
// Engine sound pitch
Input:  FloatVariable speed = 12.0
Config: inputRange = (0, 20), outputRange = (0.8, 2.0), EaseIn curve

Process:
  normalized = (12 - 0) / (20 - 0) = 0.6
  curveValue = curve.Evaluate(0.6) = 0.35  // EaseIn curve
  output = 0.8 + (0.35 * (2.0 - 0.8)) = 1.22

Result: AudioSource.pitch = 1.22
```

**Inverted Range (Damage Overlay)**
```csharp
// Low health = high opacity
Input:  FloatVariable health = 25
Config: inputRange = (0, 100), outputRange = (1, 0), Linear  // Inverted!

Process:
  normalized = (25 - 0) / (100 - 0) = 0.25
  curveValue = curve.Evaluate(0.25) = 0.25
  output = 1 + (0.25 * (0 - 1)) = 0.75

Result: Damage overlay alpha = 0.75 (opaque at low health)
```

### Common Configurations

| Use Case | Input Range | Output Range | Curve |
|----------|-------------|--------------|-------|
| Health → Fill Amount | (0, 100) | (0, 1) | Linear |
| Health → Damage Overlay | (0, 100) | (1, 0) | Linear (inverted) |
| Distance → Volume | (0, 50) | (1, 0) | EaseOut |
| Speed → Anim Speed | (0, 10) | (0.5, 2.0) | EaseIn |
| Level → XP Required | (1, 100) | (100, 10000) | Exponential |
| Temperature → Color | (-20, 40) | (0.2, 1.0) | Linear |

### Supported Types

- ✅ **FloatVariable** - Direct transformation
- ✅ **IntVariable** - Converted to float, transformed, rounded back
- ✅ **Vector2Variable** - Per-component (X, Y)
- ✅ **Vector3Variable** - Per-component (X, Y, Z)
- ✅ **ColorVariable** - RGB channels (alpha preserved)

---

## Boolean Transformation

Simple NOT operation for BoolVariable.

### Configuration

```csharp
public bool invertBool = false;  // true → false, false → true
```

### Use Cases

```csharp
// Hide UI when game is ready
BoolVariable isGameReady → GameObject.Active (invertBool = true)
// isGameReady = true → SetActive(false)

// Show death screen when NOT alive
BoolVariable isPlayerAlive → DeathScreen.Active (invertBool = true)
// isPlayerAlive = false → SetActive(true)

// Enable debug mode when NOT in production
BoolVariable isProduction → DebugPanel.Active (invertBool = true)
```

---

## String Formatting

C# composite formatting for any variable type.

### Configuration

```csharp
public bool useStringFormat = false;
public string stringFormat = "{0}";  // C# format string
```

### Format Examples

| Format String | Input | Output |
|---------------|-------|--------|
| `"{0:F2}"` | 3.14159 | `"3.14"` |
| `"Score: {0:N0}"` | 1234 | `"Score: 1,234"` |
| `"HP: {0:F0}%"` | 87.5 | `"HP: 88%"` |
| `"{0:P1}"` | 0.755 | `"75.5%"` |
| `"CPS: {0:F2}"` | 3.14159 | `"CPS: 3.14"` |
| `"Level {0:D2}"` | 5 | `"Level 05"` |
| `"{0:C}"` | 12.50 | `"$12.50"` |

### Quick Reference

| Format | Description | Example |
|--------|-------------|---------|
| `F2` | 2 decimal places | 3.14 |
| `N0` | Thousands separator | 1,234 |
| `P1` | Percentage (1 decimal) | 75.5% |
| `D3` | Padded integer | 005 |
| `C` | Currency (locale) | $12.50 |

### Practical Examples

```csharp
// Health percentage
IntVariable health = 87
Format: "HP: {0:F0}%"
Output: "HP: 87%"

// Score with thousands
IntVariable score = 1250000
Format: "Score: {0:N0} pts"
Output: "Score: 1,250,000 pts"

// CPS display
FloatVariable clicksPerSec = 3.14159
Format: "CPS: {0:F2}"
Output: "CPS: 3.14"

// Currency display
FloatVariable money = 1234.56
Format: "Gold: {0:C}"
Output: "Gold: $1,234.56"
```

---

## Transformation Pipeline

Values flow through transformations in this order:

```
Source Value (SOAP Variable)
         ↓
Boolean Inversion (if BoolVariable + invertBool)
         ↓
Numeric Transformation (if enabled + numeric type)
  1. Normalize to inputRange
  2. Evaluate AnimationCurve
  3. Scale to outputRange
         ↓
String Formatting (if enabled)
         ↓
Target Property (Unity Component)
```

## Type Support Matrix

| Variable Type | Numeric Transform | Boolean Invert | String Format |
|---------------|-------------------|----------------|---------------|
| BoolVariable | ❌ | ✅ | ✅ |
| FloatVariable | ✅ | ❌ | ✅ |
| IntVariable | ✅ | ❌ | ✅ |
| StringVariable | ❌ | ❌ | ✅ |
| Vector2Variable | ✅ (per-component) | ❌ | ✅ |
| Vector3Variable | ✅ (per-component) | ❌ | ✅ |
| ColorVariable | ✅ (RGB only) | ❌ | ❌ |
| GameObjectVariable | ❌ | ❌ | ✅ |
| TransformVariable | ❌ | ❌ | ✅ |

## Performance Impact

| Transformation | Overhead | Notes |
|----------------|----------|-------|
| None | Minimal | Direct value assignment |
| Boolean Invert | Negligible | Single NOT operation |
| Numeric Transform | Low | Cached curve evaluation |
| String Format | Low-Medium | String allocation per update |
| Combined | Medium | All transformations applied |

**Optimization Tips:**
- Use InitialSync mode for static formatted text
- Avoid string formatting on high-frequency bindings (>30 FPS)
- Prefer simple linear curves over complex multi-keyframe curves

## Next Steps

- **[Performance Optimization](./performance)** - Event-driven architecture details
- **[Binding Modes](./modes)** - Data flow direction control
- **[Troubleshooting](./troubleshooting)** - Common transformation issues

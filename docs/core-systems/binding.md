---
title: Binding System
sidebar_position: 3
---

# Data Binding System - Overview

## What is SOAPBind?

The SOAPBind component provides **event-driven data binding** between SOAP ScriptableObjects and Unity components. Eliminates manual UI synchronization code through declarative Inspector configuration.

**Key Principle:** Connect Variables/Events to component properties visually—updates happen automatically via events.

## Core Features

- **Zero-allocation event-driven updates** - No Update() polling
- **Reflection-based property invocation** - Runtime caching for performance
- **Multi-mode binding support** - One-way, two-way, bidirectional, one-time
- **Value transformation pipeline** - Curves, formatting, boolean inversion
- **Performance monitoring** - Real-time metrics and optimization

## Architecture

### Component Structure

```csharp
[AddComponentMenu("SoapKit/SOAP Bind")]
public class SOAPBind : MonoBehaviour
{
    public List<BindTarget> bindings;
}
```

Each `BindTarget` encapsulates:
- **Target**: Unity Component + property/method identifier
- **Source**: SOAP Variable or GameEvent ScriptableObject
- **Configuration**: Binding type, mode, transformation settings
- **Runtime Cache**: Reflected members, performance metrics

### Basic Example

```csharp
// Traditional approach (manual code):
void OnEnable() {
    playerHealth.OnValueChanged += UpdateHealthBar;
}
void UpdateHealthBar(int health) {
    healthBar.fillAmount = health / 100f;
}

// SOAPBind approach (zero code):
// 1. Add SOAPBind component
// 2. Create binding: playerHealth → healthBar.fillAmount
// 3. Done! Auto-updates via events
```

## Quick Start

**5-Minute Setup:**

1. **Add Component**
   ```
   GameObject → Add Component → SOAPBind
   ```

2. **Create Binding**
   ```
   Click "➕ Add Binding"
   - Target: Select component (e.g., Image)
   - Property: Choose property (e.g., fillAmount)
   - Asset: Assign SOAP Variable
   - Mode: VariableToTarget
   ```

3. **Test**
   ```
   Play Mode → Change Variable value → UI updates automatically
   ```

## Documentation Structure

### Core Concepts

- **[Binding Types](./types)** - Property, UI, EventToMethod, AnimatorParameter, etc.
- **[Binding Modes](./modes)** - VariableToTarget, TwoWaySync, InitialSync, etc.
- **[Transformation System](./transformation)** - Numeric curves, string formatting, boolean inversion

### Advanced Topics

- **[Performance](./performance)** - Event-driven architecture, optimization, benchmarks
- **[Troubleshooting](./troubleshooting)** - Common issues, diagnostics, solutions
- **[API Reference](./api)** - Public methods, configuration properties

### Editor Tools

- **[Editor Workflow](../../editor-tools/binding-system#editor-tools--workflow)** - Complete visual editor documentation

## Next Steps

**New to binding?** Start with [Binding Modes](./modes) to understand data flow directions.

**Need transformations?** See [Transformation System](./transformation) for curves and formatting.

**Performance concerns?** Check [Performance Optimization](./performance) for event-driven architecture details.

**Editor workflow?** Visit [Editor Tools](../../editor-tools/binding-system) for visual configuration guides.

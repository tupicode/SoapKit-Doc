---
title: Binding Types
sidebar_position: 2
---

# Binding Types

Binding types define **what kind of component** the binding targets and **how the binding operates**.

## Type Overview

| Type | Description | Use Case |
|------|-------------|----------|
| `Property` | Generic property/field binding | Any component property |
| `UI` | UI component optimized binding | TextMeshProUGUI, Image, Slider |
| `EventToMethod` | Event-to-method invocation | Button onClick, custom methods |
| `AnimatorParameter` | Animator parameter sync | Character animations |
| `Light` | Light component properties | Dynamic lighting |
| `Transform` | Transform properties | Position, rotation, scale |
| `AudioSource` | AudioSource properties | Volume, pitch control |
| `Renderer` | Material property binding | Shader parameters |
| `GameObject` | GameObject state control | Active state, layer, tag |

## Property Binding

Generic binding for any component property or field.

**Use Case:** When no specialized type applies.

```csharp
// Example: Custom component property
FloatVariable customValue → CustomComponent.someProperty

// Configuration:
Type: Property
Mode: VariableToTarget
Target: CustomComponent
Property: someProperty
```

## UI Binding

Optimized for Unity UI components.

**Supported Components:**
- TextMeshProUGUI / Text
- Image / RawImage
- Slider / Scrollbar
- Toggle / Button
- TMP_InputField

```csharp
// Example: Health bar
IntVariable playerHealth → Image.fillAmount
// Type: UI (auto-detected)
// Transformation: Input (0,100) → Output (0,1)

// Example: Score display
IntVariable score → TextMeshProUGUI.text
// Type: UI (auto-detected)
// String Format: "Score: {0:N0}"
```

## EventToMethod Binding

Connects GameEvents to component methods.

**Use Case:** Execute methods when events fire.

```csharp
// Example: Play sound on event
UnitGameEvent onPlayerDied → AudioSource.Play()

// Example: Trigger animation
StringGameEvent onAction → Animator.SetTrigger(string)

// Configuration:
Type: EventToMethod
Mode: VariableToTarget (events always push)
Target Method: Play() or SetTrigger()
```

**Supported Method Signatures:**
- `void Method()` - Parameterless
- `void Method(T value)` - Single parameter matching event type
- `void SetTrigger(string)` - Animator triggers

## AnimatorParameter Binding

Synchronizes Variables with Animator parameters.

**Supported Parameter Types:**
- Float → `SetFloat(string, float)`
- Int → `SetInteger(string, int)`
- Bool → `SetBool(string, bool)`
- Trigger → `SetTrigger(string)`

```csharp
// Example: Movement speed
FloatVariable moveSpeed → Animator.SetFloat("Speed")
// Updates "Speed" parameter automatically

// Example: Grounded state
BoolVariable isGrounded → Animator.SetBool("Grounded")
// Syncs grounded state to animation

// Configuration:
Type: AnimatorParameter
Target: Animator component
Parameter Name: "Speed" / "Grounded"
```

## Light Binding

Controls Light component properties.

**Supported Properties:**
- `color` - Light color
- `intensity` - Light brightness
- `range` - Light distance
- `enabled` - Light on/off

```csharp
// Example: Dynamic lighting
ColorVariable ambientColor → Light.color
FloatVariable brightness → Light.intensity

// Use Case: Day/night cycle, flashlight battery, etc.
```

## Transform Binding

Modifies Transform properties.

**Supported Properties:**
- `position` / `localPosition`
- `rotation` / `localRotation`
- `scale` / `localScale`
- `eulerAngles` / `localEulerAngles`

```csharp
// Example: Camera position
Vector3Variable cameraTarget → Transform.position

// Example: Object rotation
Vector3Variable rotationAngles → Transform.eulerAngles

// Note: Use Transform type for Transform-specific operations
```

## AudioSource Binding

Controls AudioSource properties.

**Supported Properties:**
- `volume` - Audio volume (0-1)
- `pitch` - Playback speed
- `panStereo` - Left/right balance
- `enabled` - Audio on/off

```csharp
// Example: Dynamic volume
FloatVariable masterVolume → AudioSource.volume

// Example: Speed-based pitch
FloatVariable engineSpeed → AudioSource.pitch
// Higher speed = higher pitch

// Use Case: Distance-based volume, engine sounds, etc.
```

## Renderer Binding

Updates Renderer material properties.

**Supported Operations:**
- Material properties (color, float, vector, texture)
- Shader parameters via `_PropertyName`
- Material swapping

```csharp
// Example: Team color
ColorVariable teamColor → Renderer.material.color
// Or shader property:
ColorVariable teamColor → Renderer._BaseColor

// Example: Dissolve effect
FloatVariable dissolveAmount → Renderer._DissolveProgress

// Note: Requires shader to have matching property names
```

## GameObject Binding

Direct GameObject control without targeting child components.

**Supported Properties:**
- `Active` - Show/hide GameObject (SetActive)
- `Name` - GameObject name in hierarchy
- `Tag` - GameObject tag
- `Layer` - GameObject layer

```csharp
// Example: UI panel visibility
BoolVariable menuOpen → GameObject.Active
// menuOpen = true → GameObject.SetActive(true)

// Example: Dynamic naming
StringVariable playerName → GameObject.Name
// Updates GameObject name in hierarchy

// Example: Layer switching
IntVariable uiLayer → GameObject.Layer
// Changes GameObject rendering layer

// Configuration:
Component: GameObject (first option in dropdown)
Property: Active / Name / Tag / Layer
```

**Use Case:** When you need to control the GameObject itself, not specific components.

## Type Auto-Detection

The Inspector automatically suggests binding types:

```
Component Selected        → Suggested Type
─────────────────────────────────────────
TextMeshProUGUI           → UI
Image, Slider             → UI
Animator                  → AnimatorParameter
Light                     → Light
Transform                 → Transform
AudioSource               → AudioSource
Renderer                  → Renderer
GameObject                → GameObject
Other components          → Property
```

## Choosing the Right Type

**Decision Tree:**

```
What are you binding to?
├─ UI Component (Text, Image, Slider)     → UI
├─ Animator                                → AnimatorParameter
├─ Light                                   → Light
├─ Transform                               → Transform
├─ AudioSource                             → AudioSource
├─ Renderer                                → Renderer
├─ GameObject itself                       → GameObject
├─ Event → Method                          → EventToMethod
└─ Other component property                → Property
```

## Performance by Type

| Type | Overhead | Notes |
|------|----------|-------|
| UI | Low | Optimized UI update paths |
| Property | Low | Cached reflection |
| AnimatorParameter | Low | Direct Animator API |
| Transform | Very Low | Direct Transform access |
| Light | Very Low | Direct component access |
| AudioSource | Very Low | Direct component access |
| Renderer | Medium | Material property access |
| GameObject | Very Low | Direct GameObject API |
| EventToMethod | Low | Cached method invocation |

## Next Steps

- **[Binding Modes](./modes)** - Understand data flow directions
- **[Transformation](./transformation)** - Value conversion and formatting
- **[Performance](./performance)** - Optimization strategies

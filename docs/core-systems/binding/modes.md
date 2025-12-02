---
title: Binding Modes
sidebar_position: 3
---

# Binding Modes

Binding modes control the **direction** and **frequency** of data flow between SOAP assets and Unity components.

## Mode Overview

| Mode | Direction | Data Flow | Update Trigger | Performance |
|------|-----------|-----------|----------------|-------------|
| `VariableToTarget` | Push | Variable → Component | Variable OnValueChanged event | Low overhead |
| `TargetToVariable` | Pull | Component → Variable | Component change events | Medium overhead |
| `TwoWaySync` | Bidirectional | Variable ↔ Component | Both event sources | Higher overhead |
| `InitialSync` | One-time | Variable → Component (once) | Initialization only | Zero runtime cost |

## VariableToTarget (Push Mode)

**Direction:** SOAP Variable → UI Component
**Use Case:** Display game state in UI (health bars, score displays, status text)

The most common mode. Variable changes automatically push updates to the component.

### Examples

```csharp
// Example 1: Health bar updates when player takes damage
IntVariable playerHealth → Image.fillAmount
// When: playerHealth.SetValue(50) is called
// Result: Image.fillAmount immediately updates to 0.5 (with transformation)
// Direction: Variable pushes to UI

// Example 2: Score display updates when points earned
IntVariable currentScore → TextMeshProUGUI.text
// When: currentScore.Add(100) is called
// Result: Text immediately updates to "100"
// Direction: Variable pushes to UI

// Example 3: Enemy visibility controlled by detection state
BoolVariable isPlayerDetected → EnemyIndicator.SetActive
// When: isPlayerDetected.SetValue(true) is called
// Result: EnemyIndicator.SetActive(true) immediately executes
// Direction: Variable pushes to GameObject
```

### Event Flow

```
Game Logic                Variable                 UI Component
─────────┐                ────────                 ────────────
         │ SetValue(50)
         └──────────────> OnValueChanged fires
                          ────────┐
                                  │ UpdateBinding()
                                  └──────────────> fillAmount = 0.5
```

### When to Use

- Read-only UI displays
- Visual feedback elements
- State-driven UI visibility
- Any scenario where game logic drives UI

---

## TargetToVariable (Pull Mode)

**Direction:** UI Component → SOAP Variable
**Use Case:** User input controls game state (sliders, input fields, toggles)

Component changes pull updates into the Variable. Useful for settings and player input.

### Examples

```csharp
// Example 1: Volume slider controls audio setting
Slider.value → FloatVariable masterVolume
// When: User drags slider to 0.75
// Result: masterVolume.SetValue(0.75) is called
// Direction: UI pulls into Variable

// Example 2: Player name input field
TMP_InputField.text → StringVariable playerName
// When: User types "Warrior"
// Result: playerName.SetValue("Warrior") is called
// Direction: UI pulls into Variable

// Example 3: Graphics quality dropdown
TMP_Dropdown.value → IntVariable qualityLevel
// When: User selects option 2 (High)
// Result: qualityLevel.SetValue(2) is called
// Direction: UI pulls into Variable
```

### Event Flow

```
User Input                UI Component             Variable
──────────                ────────────             ────────
Drag slider
─────────────────────────> onValueChanged fires
                          ────────┐
                                  │ UpdateVariable()
                                  └──────────────> SetValue(0.75)
```

### When to Use

- Settings menus
- User input forms
- Configuration panels
- Any scenario where UI drives game logic

---

## TwoWaySync (Bidirectional Mode)

**Direction:** SOAP Variable ↔ UI Component (both directions)
**Use Case:** Settings that can be changed by both code and UI (volume controls with mute button, synchronized inputs)

Changes in either direction update the other. Most flexible but higher overhead.

### Examples

```csharp
// Example 1: Volume slider + mute button interaction
FloatVariable masterVolume ↔ Slider.value
// Scenario A - User drags slider:
//   Slider.value changes → masterVolume updates → other UI syncs
// Scenario B - Mute button clicked:
//   Code calls masterVolume.SetValue(0) → Slider updates to 0
// Direction: Both push and pull

// Example 2: Settings panel with apply/reset buttons
IntVariable graphicsQuality ↔ TMP_Dropdown.value
// Scenario A - User selects "Ultra":
//   Dropdown.value = 3 → graphicsQuality.SetValue(3)
// Scenario B - Reset button clicked:
//   Code calls graphicsQuality.SetValue(1) → Dropdown updates to "Medium"
// Direction: Both push and pull

// Example 3: Character customization with randomize button
ColorVariable skinTone ↔ ColorPicker.color
// Scenario A - User picks color:
//   ColorPicker.color changes → skinTone updates → character updates
// Scenario B - Randomize button:
//   Code sets skinTone → ColorPicker updates → character updates
// Direction: Both push and pull
```

### Event Flow

```
Variable                  Binding                  Component
────────                  ───────                  ─────────
SetValue(0.5)
─────────────────────────> OnValueChanged
                          ────────┐
                                  └──────────────> value = 0.5
                                                   │
User drags to 0.8 <───────────────────────────────┘
│                         ────────┐
└─────────────────────────> onValueChanged
                          ────────┐
SetValue(0.8) <───────────────────┘
```

:::warning Loop Prevention
Can create infinite loops if not careful. SOAPBind includes automatic loop prevention.
:::

### When to Use

- Settings menus with apply/reset functionality
- Synchronized UI elements
- Input fields with code-driven validation/formatting
- Complex UI where both user and system modify values

---

## InitialSync (One-Time Mode)

**Direction:** SOAP Variable → UI Component (once at initialization)
**Use Case:** Static configuration values that never change during gameplay

Sets the component value once at startup, then stops listening. **Zero runtime overhead.**

### Examples

```csharp
// Example 1: Player name display (set once, never changes)
StringVariable savedPlayerName → TextMeshProUGUI.text (InitialSync)
// When: Scene loads
// Result: Text set to "PlayerName" once
// Direction: Variable pushes once, then disconnects

// Example 2: Max health display in character sheet
IntVariable maxHealth → TextMeshProUGUI.text (InitialSync)
// When: Character panel opens
// Result: Text set to "100" once
// Direction: Variable pushes once, then disconnects

// Example 3: Team color configuration
ColorVariable teamColor → Image.color (InitialSync)
// When: UI instantiates
// Result: Color set once based on team selection
// Direction: Variable pushes once, then disconnects
```

### Event Flow

```
Initialization            Binding                  Component
──────────────            ───────                  ─────────
OnEnable()
─────────────────────────> InitializeBinding()
                          ────────┐
                                  │ Read variable.Value
                                  └──────────────> text = "PlayerName"

                          Unsubscribe from events
                          (No further updates)
```

### Performance Benefits

- ✅ Zero Update() calls
- ✅ Zero event subscriptions after initialization
- ✅ Zero memory for event handlers
- ✅ Ideal for static data display

### When to Use

- Player profile information
- Static configuration values
- Initial UI setup
- One-time data transfer scenarios

---

## Mode Selection Guide

Choose the appropriate mode based on data flow requirements:

### Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                    Decision Tree                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│ Does the value change during gameplay?                      │
│  ├─ NO  → InitialSync (zero runtime cost)                  │
│  └─ YES → Continue...                                       │
│                                                              │
│ Who changes the value?                                      │
│  ├─ Only Game Logic → VariableToTarget (push)              │
│  ├─ Only User/UI    → TargetToVariable (pull)              │
│  └─ Both           → TwoWaySync (bidirectional)            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Real-World Patterns

| UI Element | Typical Mode | Rationale |
|------------|--------------|-----------|
| Health Bar | `VariableToTarget` | Game logic controls health |
| Score Display | `VariableToTarget` | Game logic awards points |
| Volume Slider | `TwoWaySync` | User adjusts, code can reset |
| Input Field | `TargetToVariable` | User input drives data |
| Player Name Label | `InitialSync` | Set once, never changes |
| Pause Overlay | `VariableToTarget` | Game state controls visibility |
| Graphics Dropdown | `TargetToVariable` | User selection drives setting |
| Ammo Counter | `VariableToTarget` | Game logic tracks ammunition |

## Performance Comparison

| Mode | CPU Cost | Memory | Use Case |
|------|----------|--------|----------|
| InitialSync | Zero (after init) | Minimal | Static values |
| VariableToTarget | Low | Low | Most common |
| TargetToVariable | Medium | Medium | User input |
| TwoWaySync | Higher | Higher | Synchronized |

## Next Steps

- **[Binding Types](./types)** - Understand component-specific bindings
- **[Transformation](./transformation)** - Value conversion and formatting
- **[Performance](./performance)** - Optimization strategies

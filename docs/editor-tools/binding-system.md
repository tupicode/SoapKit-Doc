---
title: Binding System Inspector
sidebar_position: 3
---

# Binding System Inspector & Tools

Professional Unity-native editor tools for visual binding configuration, debugging, and project-wide management.

:::tip Core System Documentation
This page focuses on **editor tools and workflow**. For binding system architecture, modes, types, and API reference, see **[Binding System Documentation](../core-systems/binding)**.
:::

---

## SOAPBind Custom Inspector

Visual interface for configuring data bindings between SOAP assets and Unity components with intelligent auto-detection and real-time feedback.

<div style={{textAlign: 'center'}}>
  <img src="/img/soap-bind-component.png" alt="SOAP Bind Component Inspector" style={{width: '100%', maxWidth: '600px'}} />
</div>

### Inspector Workflow

**Step 1: Add SOAPBind Component**
```csharp
Select GameObject → Add Component → Search "SOAP Bind"
```

**Step 2: Add Binding**
- Click **"➕ Add Binding"**
- New BindTarget created and auto-expanded

**Step 3: Select Component**
- **GameObject Mode**: "GameObject" dropdown option
  - Properties: Active, Name, Tag, Layer
  - See [GameObject binding](../core-systems/binding/types#gameobject-binding)
- **Component Mode**: Specific component (Image, Text, Slider, etc.)
  - Shows component-specific properties/methods
  - See [All binding types](../core-systems/binding/types)

**Step 4: Choose Property/Method**
- Auto-filtered by selected component
- Properties marked with 📝
- Methods marked with ⚙️
- Organized alphabetically

**Step 5: Assign SOAP Asset**
- Drag-and-drop from Project window
- Object picker (filtered by type compatibility)
- Shows asset type icon

**Step 6: Configure Binding Type** (Auto-detected)
```
Component Type        → Suggested Type
──────────────────────────────────────
TextMeshProUGUI       → UI
Image, Slider         → UI
Transform             → Transform
Animator              → AnimatorParameter
Light                 → Light
AudioSource           → AudioSource
Renderer              → Renderer
GameObject            → GameObject
Other                 → Property
```
See [Binding Types Documentation](../core-systems/binding/types) for details.

**Step 7: Select Binding Mode**
- **VariableToTarget** - Display data (Variable → Component)
- **TargetToVariable** - User input (Component → Variable)
- **TwoWaySync** - Bidirectional synchronization
- **InitialSync** - One-time setup

See [Binding Modes Documentation](../core-systems/binding/modes) for detailed mode explanations with examples.

**Step 8: Optional - Value Transformation**
- Enable **"Use Transformation"**
- Edit **AnimationCurve** for numeric conversion
- Set **Input Range** (min, max)
- Set **Output Range** (min, max)
- Enable **"Invert Bool"** for boolean logic inversion

See [Transformation Documentation](../core-systems/binding/transformation) for comprehensive examples.

**Step 9: Optional - String Formatting**
- Enable **"Use String Format"**
- Enter format string: `"HP: {0:F0}%"`
- Supports full C# composite format syntax
- Preview shows example output

See [String Formatting](../core-systems/binding/transformation#string-formatting) for format examples.

**Step 10: Optional - Advanced Settings**
- **Auto Update**: Enable/disable automatic synchronization
- **Update Interval**: Seconds between updates (0 = event-driven)
- **Validate On Bind**: Startup validation toggle
- **Log Bind Events**: Debug logging toggle

---

### Visual Status Indicators

Inspector displays real-time binding status:

```
✅ Valid      - Configuration correct, binding operational
⚠️ Warning    - Non-critical issue (performance hint, default format)
❌ Error      - Invalid configuration (missing refs, type mismatch)
🔄 Processing - Currently updating (Play mode only)
⏸️ Disabled   - Auto-update off or InitialSync completed
```

---

### Performance Monitoring

Enable **"Show Performance Metrics"** checkbox for real-time analysis:

**Per-Binding Metrics:**
- Last execution time (milliseconds)
- Total update count
- Average execution time
- Color-coded performance bar

**Performance Thresholds:**

| Status | Execution Time | Visual | Action |
|--------|----------------|--------|--------|
| Optimal | < 0.5ms | Green ████████ | None needed |
| Acceptable | 0.5-2ms | Yellow ████████ | Monitor |
| Warning | 2-5ms | Orange ████████ | Optimize |
| Critical | > 5ms | Red ████████ | Fix immediately |

See [Performance Optimization Guide](../core-systems/binding/performance) for detailed optimization strategies.

---

### Binding List Management

**Visual Organization:**
```
┌─────────────────────────────────────────────────┐
│ Binding 1 [▼] [✅ Valid]           [🗑️] [▶️]   │
├─────────────────────────────────────────────────┤
│   Component: Image (HealthBar)                  │
│   Property:  fillAmount                         │
│   Asset:     PlayerHealth (IntVariable)         │
│   Mode:      VariableToTarget                   │
│   ⚡ 0.12ms  [████░░░░░░] Updates: 145          │
└─────────────────────────────────────────────────┘
```

**Controls:**
- **[▼]/[▶]** - Expand/collapse binding details
- **[✅/❌/⚠️]** - Real-time validation status
- **[🗑️]** - Delete binding (with confirmation)
- **[▶️]** - Test manually (trigger single update)
- **[📊]** - Performance metrics (Play mode)

**Multi-Binding Features:**
- Collapsible headers for clean organization
- Status indicator below each header
- Performance bars inline with controls
- Perfect vertical alignment of action buttons

---

### Context Menu Actions

Right-click **SOAPBind** component header:

```
Copy Binding Configuration    → Export to JSON clipboard
Paste Binding Configuration   → Import from JSON clipboard
Duplicate All Bindings        → Copy to another GameObject
Clear All Bindings            → Remove all (confirmation required)
Test All Bindings             → Manual trigger for all bindings
Validate All Bindings         → Validation without execution
```

---

### Binding Templates

Quick-create common binding patterns:

**Available Templates:**
```csharp
Health Bar Setup     → IntVariable → Image.fillAmount + transformation
Score Display        → IntVariable → TextMeshProUGUI.text + formatting
Toggle Button        → BoolVariable ↔ Toggle.isOn (TwoWaySync)
Volume Slider        → FloatVariable ↔ Slider.value (TwoWaySync)
Event Trigger        → GameEvent → Method invocation
```

**Usage:**
1. Click **"📋 Use Template"** button
2. Select template from list
3. Binding auto-configured with recommended settings
4. Assign specific SOAP asset and target component

---

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + Shift + B` | Add new binding |
| `Delete` | Remove selected binding |
| `Ctrl/Cmd + D` | Duplicate selected binding |
| `Ctrl/Cmd + T` | Test selected binding |
| `F2` | Rename binding (if named) |

---

## Bind Manager Window

Project-wide binding management and analysis tool.

**Access:** `Window > SoapKit > Bind Manager`

<div style={{textAlign: 'center'}}>
  <img src="/img/bind-manager-window.png" alt="Bind Manager Window" style={{width: '100%', maxWidth: '900px'}} />
</div>

### Overview Tab

Project statistics and binding inventory:

```csharp
// Statistics Display:
Total SOAPBind Components:    15
Total Active Bindings:        47
Most Used Binding Type:       UI (28 bindings)
Most Used Variable Type:      FloatVariable (18)
Average Bindings/Component:   3.1

// Component List:
GameObject                Bindings    Status
────────────────────────────────────────────
Canvas/HealthPanel       5           ✅ All Valid
UI/ScoreDisplay          2           ✅ All Valid
Player/StatusEffects     8           ⚠️ 1 Warning
```

**Actions per Component:**
- **Select** - Highlight in Hierarchy
- **Ping** - Flash in Scene View
- **Inspect** - Focus in Inspector
- **Expand** - Show all bindings

---

### Performance Tab

Real-time performance monitoring with optimization recommendations:

```csharp
// Performance Summary:
Total Binding Cost:       2.45ms/frame
Slowest Binding:          0.89ms (DamageNumbers.text)
Update Frequency:         142 updates/sec
Optimization Potential:   Save ~1.2ms with recommended changes

// Performance List (sorted by cost):
Binding                           Cost    Recommendation
─────────────────────────────────────────────────────────
DamageNumbers.text ← Damage      0.89ms  ⚠️ Increase interval to 0.1s
HealthBar.fillAmount ← Health    0.45ms  ✅ Optimal performance
ScoreText.text ← Score           0.31ms  ✅ Optimal performance
```

**Auto-Optimization Features:**
- Detects `updateInterval=0` with high execution time
- Suggests interval adjustments for non-critical UI
- Identifies `InitialSync` candidates (static values)
- Highlights redundant bindings (same source/target)
- Color-coded performance indicators

**Threshold Indicators:**
- 🟢 **Good**: Total < 8ms per frame
- 🟡 **Warning**: Total 8-16ms per frame
- 🔴 **Critical**: Total > 16ms per frame

See [Performance Architecture](../core-systems/binding/performance) for event-driven system details.

---

### Validation Tab

Project-wide error detection with auto-fix capabilities:

```csharp
// Validation Summary:
Valid Bindings:     42
Warnings:           3
Errors:             2

// Issue List:
⚠️ HealthText - Default string format "{0}" (unnecessary)
⚠️ VolumeSlider - TwoWaySync + updateInterval=0 (performance)
⚠️ BossHealth - Linear curve (default, can remove)

❌ PlayButton - Missing SOAP asset reference
❌ AmmoDisplay - Target component destroyed

// Quick Actions:
[Fix Auto-fixable Issues] [Ignore All Warnings] [Export Report]
```

**Auto-Fix Capabilities:**
- Remove default/unnecessary formats
- Optimize update intervals for TwoWaySync
- Remove unnecessary linear transformations
- Detect and remove null references
- Reset invalid configurations

---

### Debugger Tab

Live binding execution monitoring (Play mode only):

```csharp
// Real-time Event Log:
[14:32:15.234] PlayerHealth changed: 75 → 50
              ↳ HealthBar.fillAmount: 0.75 → 0.50 (0.12ms)
              ↳ HealthText.text: "75%" → "50%" (0.08ms)
              ↳ DamageOverlay.color updated (0.15ms)

[14:32:15.891] OnPlayerDied event fired
              ↳ GameOverPanel.SetActive(true) (0.05ms)
              ↳ RestartButton.onClick invoked (0.03ms)

// Filter Controls:
☑ Show Variable Updates  ☑ Show Events  ☐ Performance Only
☑ Auto-scroll           ☐ Timestamps   ☑ Highlight Errors
```

**Features:**
- Real-time execution trace with timestamps
- Value change history (before → after)
- Per-binding execution time
- Error/exception highlighting
- Export log to file (CSV/JSON)
- Pause/resume monitoring
- Clear log buffer

---

## Scene View Integration

Enable via **"Show Gizmos In Scene"** checkbox in Inspector:

### Visual Connection Lines

**Color Coding:**
- **Green lines** - Valid VariableToTarget bindings
- **Blue lines** - Valid TargetToVariable bindings
- **Purple lines** - Valid TwoWaySync bindings
- **Gray lines** - InitialSync (completed, inactive)
- **Red lines** - Invalid/error bindings
- **Yellow flash** - Binding executing (Play mode)

### Gizmo Interactions

- **Click line** → Select SOAPBind component in Inspector
- **Hover** → Tooltip with binding details
  ```
  PlayerHealth → HealthBar.fillAmount
  Mode: VariableToTarget
  Status: ✅ Valid
  Last Update: 0.12ms
  ```
- **Double-click** → Open SOAP asset in Inspector
- **Shift+Click** → Multi-select bindings

---

## Integration with SoapKit Tools

### Debug Console Integration
- Bindings appear in dependency graph
- Variable changes show all connected bindings
- Synced performance metrics across tools

See [Debug Window Documentation](./debug-window)

### Asset Creator Integration
- Create Variable → Auto-suggest binding setup wizard
- Create Event → Auto-suggest method binding templates

See [Asset Creator Documentation](./asset-creator)

### Dependency Visualizer Integration
- Binding connections in graph view
- Highlight circular TwoWaySync dependencies
- Export architecture diagrams with bindings

See [Dependency Visualizer Documentation](./dependency-visualizer)

---

## Batch Operations

Select multiple bindings using **Shift+Click** or **Ctrl+Click**:

```
[✓] Binding 1 - HealthBar.fillAmount
[✓] Binding 2 - HealthText.text
[✓] Binding 3 - HealthColor.color

Available Batch Actions:
[Set Mode: VariableToTarget]
[Set Update Interval: 0.016]
[Enable Transformation]
[Disable All Selected]
[Delete Selected]
```

**Supported Batch Operations:**
- Change binding mode (all selected)
- Set update interval (bulk performance tuning)
- Enable/disable transformations
- Enable/disable auto-update
- Delete multiple bindings (with confirmation)

---

## Troubleshooting with Editor Tools

### Binding Not Updating

**Inspector Checks:**
1. **Status Indicator** - Look for ❌ or ⚠️ symbols
2. **Validation Panel** - Check error messages
3. **Performance Metrics** - Verify update count is incrementing
4. **Auto Update** - Ensure toggle is enabled
5. **SOAP Asset** - Verify reference is assigned

**Bind Manager Checks:**
1. Open **Validation Tab** → Check for errors
2. Open **Debugger Tab** (Play mode) → Monitor live updates
3. Check **Performance Tab** → Verify binding is executing

See [Full Troubleshooting Guide](../core-systems/binding/troubleshooting)

### Performance Issues

**Identify Bottlenecks:**
1. Open **Bind Manager → Performance Tab**
2. Sort by "Cost" column
3. Look for red/orange indicators (> 2ms)
4. Check "Optimization Potential" recommendations

**Quick Fixes:**
- Increase `updateInterval` for non-critical bindings
- Change mode to `InitialSync` for static values
- Simplify transformation curves
- Reduce string formatting frequency

See [Performance Optimization](../core-systems/binding/performance)

### Type Compatibility Errors

**Inspector Validation:**
- **Red underline** on property field → Type mismatch
- **Warning icon** → Automatic conversion available
- **Error message** → Shows expected vs actual type

**Solutions:**
1. Enable **transformation** for numeric conversion
2. Use **string formatting** for text conversion
3. Change to compatible property/method
4. Verify SOAP asset type matches target

See [Type Compatibility](../core-systems/binding/troubleshooting#type-compatibility-errors)

---

## Best Practices

### Inspector Organization

**✅ Recommended:**
- Group related bindings on the same GameObject
- Use descriptive GameObject names ("UI_HealthPanel_Bindings")
- Start with centralized hubs for small projects
- Use component-level bindings for prefabs
- Collapse bindings not actively being edited

**❌ Avoid:**
- Separate SOAPBind for each single binding
- Mixed unrelated bindings in same component
- Generic names like "BindingHub" without context

### Performance Monitoring

**✅ Recommended:**
- Enable performance metrics during development
- Monitor Bind Manager regularly
- Set appropriate update intervals
- Use event-driven bindings (interval = 0) when possible
- Profile in target platform (mobile, PC, console)

**❌ Avoid:**
- Ignoring yellow/orange performance warnings
- Using 0ms intervals for heavy string formatting
- Leaving debug logging enabled in builds
- Creating excessive conditional bindings

### Debugging Workflow

**✅ Recommended:**
- Enable gizmos for visual debugging
- Use Debugger Tab to monitor live updates
- Check Validation Tab before builds
- Export validation reports for team review
- Test bindings in Play mode before finalizing

**❌ Avoid:**
- Leaving "Log Bind Events" on in production
- Ignoring validation warnings
- Skipping edge case testing
- Disabling auto-optimization without reason

---

## Next Steps

**Learn Binding System:**
- **[Binding Overview](../core-systems/binding)** - Complete system documentation
- **[Binding Types](../core-systems/binding/types)** - Component-specific bindings
- **[Binding Modes](../core-systems/binding/modes)** - Data flow directions
- **[Transformation](../core-systems/binding/transformation)** - Value conversion
- **[Performance](../core-systems/binding/performance)** - Optimization guide
- **[API Reference](../core-systems/binding/api)** - Runtime API

**Related Editor Tools:**
- **[Debug Window](./debug-window)** - Monitor SOAP system activity
- **[Performance Analyzer](./performance-analyzer)** - Advanced profiling
- **[Dependency Visualizer](./dependency-visualizer)** - Architecture visualization

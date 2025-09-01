---
title: Asset Creator
sidebar_position: 1
---

# SoapKit Asset Creator

The **SoapKit Asset Creator** is a productivity powerhouse that streamlines the creation of Variables and Events. Instead of manually creating assets one-by-one, the Asset Creator templating, and intelligent naming conventions.

## Opening the Asset Creator

Access the Asset Creator through Unity's menu:
```
Tools > SoapKit > Asset Creator
```

## Creation Modes

The Asset Creator provides three creation modes to fit different workflows:

### 1. Default Asset Creation

Perfect for creating default assets with full customization:

<div style={{textAlign: 'center'}}>
  <img src={require('@site/static/img/asset-creator-default.png').default} alt="Default Asset Creation" style={{width: '400px'}} />
</div>

**Features:**
- **Type Selection**: Choose from all available Variable and Event types
- **Custom Naming**: Set specific names with validation
- **Folder Selection**: Choose exact location in project hierarchy
- **Values**: Set default values for variables
- **Constraints**: Configure min/max values and validation rules

**Example: Creating a Health Variable**
```
Asset Type: IntVariable
Name: PlayerHealth
Location: Assets/Data/Variables/Player/
Value: 100
Min Value: 0
Max Value: 100
Description: "Player's current health points"
```

### 2. Custom Asset Creation

Create your own custom variable and event types with specialized behavior:

<div style={{textAlign: 'center'}}>
  <img src={require('@site/static/img/asset-creator-custom.png').default} alt="Custom Creation" style={{width: '400px'}} />
</div>

**Features:**
- **Custom Variable Types**: Create variables with specialized operations and constraints
- **Custom Event Types**: Design events for complex data structures  
- **Advanced Validation**: Implement custom validation logic
- **Type-Safe Generation**: Automatic code generation with proper typing
- **Integration Ready**: Full compatibility with SoapKit debugging tools

**Custom Creation Process:**
1. **Choose Base Type**: Select Variable or Event as foundation
2. **Define Data Structure**: Create your custom data struct/class
3. **Add Custom Operations**: Implement specialized methods
4. **Configure Validation**: Set up custom validation rules
5. **Generate Code**: Asset Creator generates the complete implementation
6. **Integration**: Seamlessly works with all SoapKit tools

> **💡 Tip**: For detailed examples of custom variables and events, see the [Variables System](../core-systems/variables#custom-variable-types) and [Events System](../core-systems/events#custom-event-types) documentation.

### 3. Template Creation

Use predefined templates for common game systems:

<div style={{textAlign: 'center'}}>
  <img src={require('@site/static/img/asset-creator-templates.png').default} alt="Template Creation" style={{width: '400px'}} />
</div>

**Built-in Templates:**
- **Player System**: Health, Mana, XP, Level variables + related events
- **Inventory System**: Item count, capacity variables + item events
- **UI System**: Menu states, button events, display variables
- **Audio System**: Volume controls, sound trigger events
- **Game State**: Pause, menu, game over states and transitions

**Custom Templates:**
Create your own templates for reuse across projects:

```json
{
  "name": "RPG Character Template",
  "description": "Complete RPG character with stats and events",
  "variables": [
    { "type": "IntVariable", "name": "{CharacterName}Health", "min": 0, "max": 100 },
    { "type": "IntVariable", "name": "{CharacterName}Mana", "min": 0, "max": 50 },
    { "type": "IntVariable", "name": "{CharacterName}Strength", "min": 1, "max": 20 },
    { "type": "IntVariable", "name": "{CharacterName}Intelligence", "min": 1, "max": 20 }
  ],
  "events": [
    { "type": "IntGameEvent", "name": "On{CharacterName}HealthChanged" },
    { "type": "UnitGameEvent", "name": "On{CharacterName}Died" },
    { "type": "IntGameEvent", "name": "On{CharacterName}LevelUp" }
  ]
}
```

## Advanced Features

### Smart Naming

The Asset Creator includes intelligent naming features:

**Auto-Completion:**
- Type `Player` → suggests `PlayerHealth`, `PlayerMana`, `PlayerLevel`
- Type `Enemy` → suggests `EnemyHealth`, `EnemyDamage`, `EnemySpeed`
- Type `Game` → suggests `GameScore`, `GameTime`, `GameState`

**Naming Conventions:**
```csharp
// Variables: PascalCase nouns
PlayerHealth ✅
playerhealth ❌
player_health ❌

// Events: PascalCase with "On" prefix
OnPlayerDied ✅
PlayerDied ❌
onplayerdied ❌
```

**Pattern Expansion:**
```
Input Pattern: "Level{1-5}Score"
Generated Names:
- Level1Score
- Level2Score  
- Level3Score
- Level4Score
- Level5Score
```

### Folder Organization

**Auto-Organization:**
The Asset Creator automatically organizes assets into logical folder structures:

```
Assets/Data/
├── Variables/
│   ├── Player/
│   │   ├── PlayerHealth.asset
│   │   ├── PlayerMana.asset
│   │   └── PlayerExperience.asset
│   ├── Game/
│   │   ├── GameScore.asset
│   │   ├── GameTime.asset
│   │   └── IsPaused.asset
│   └── UI/
│       ├── MenuIndex.asset
│       └── VolumeLevel.asset
└── Events/
    ├── Player/
    │   ├── OnPlayerDied.asset
    │   ├── OnHealthChanged.asset
    │   └── OnLevelUp.asset
    ├── Game/
    │   ├── OnGameStart.asset
    │   ├── OnGameEnd.asset
    │   └── OnPauseToggle.asset
    └── UI/
        ├── OnMenuChanged.asset
        └── OnButtonClicked.asset
```

**Custom Folder Rules:**
```csharp
// Configure in Asset Creator Settings
Variables → "Assets/Data/Variables/{Category}/"
Events → "Assets/Data/Events/{Category}/"
Custom Types → "Assets/Data/Custom/{Type}/"
```

### Validation and Error Prevention

**Name Validation:**
- **Duplicate Detection**: Prevents creating assets with existing names
- **Reserved Words**: Avoids Unity and C# reserved keywords  
- **Character Validation**: Ensures valid filename characters
- **Length Limits**: Prevents overly long asset names

**Type Validation:**
- **Constraint Checking**: Validates min/max values make sense
- **Reference Validation**: Ensures linked assets exist
- **Circular Reference Detection**: Prevents problematic dependencies

**Example Validation Messages:**
```
❌ "Health" already exists in Assets/Data/Variables/Player/
❌ "class" is a reserved keyword and cannot be used
❌ "Player@Health" contains invalid characters (@)
✅ "PlayerHealth" is available and valid
```

## Asset Configuration

The Asset Creator provides intuitive configuration options for all asset types:

**Configuration Features:**
- **Smart Defaults**: Sensible default values based on asset type
- **Constraint Setting**: Set min/max values, length limits, and validation rules
- **Category Organization**: Automatically organize assets by type and purpose
- **Description Fields**: Add documentation for team collaboration
- **Tag System**: Tag assets for easy searching and filtering

<!-- Add screenshot of asset configuration interface -->

**Quick Configuration:**
```
✅ Use descriptive names (PlayerHealth vs Health)
✅ Set appropriate constraints (health 0-100, not 0-99999)
✅ Add meaningful descriptions for team members
✅ Organize with consistent folder structure
✅ Use tags for cross-cutting concerns (debug, core, ui)
```

> **💡 Detailed Configuration**: For comprehensive configuration examples, see [Variables System](../core-systems/variables#variable-configuration) and [Events System](../core-systems/events#event-configuration) documentation.

## Performance Considerations

**Asset Loading:**
The Asset Creator optimizes for fast project loading:
- **Lazy Loading**: Assets loaded only when needed
- **Reference Caching**: Efficient reference resolution
- **Minimal Dependencies**: Clean asset dependency graphs

### Memory Usage

**Asset Memory Profile:**
```
IntVariable: ~40 bytes
FloatVariable: ~44 bytes
StringVariable: ~48 bytes + string length
Vector3Variable: ~56 bytes
GameEvent<T>: ~32 bytes + listener overhead
```

**Optimization Tips:**
- Use appropriate types (prefer `int` over `float` when possible)
- Avoid overly long string initial values
- Group related assets in same folders for better loading

## Advanced Workflows

### Game System Templates

**Create Complete Game Systems with One Click:**

The Asset Creator includes professionally designed templates for common game systems:

**Available Templates:**
- **Health System** - Player health, damage, healing, and death events
- **Inventory System** - Item management, capacity, and transaction events  
- **Input System** - Input handling, key bindings, and controller events
- **Audio System** - Volume controls, sound triggers, and music management
- **Settings System** - Graphics, audio, and gameplay configuration
- **UI System** - Menu states, navigation, and display variables

> **💡 Template Details**: For complete template breakdowns and usage examples, see [Variables System Templates](../core-systems/variables#variable-system-templates) and [Events System Templates](../core-systems/events#event-system-templates).

### Performance Issues

**Memory Management:**
- Clear asset creator cache regularly: `Tools > SoapKit > Clear Cache`
- Close Asset Creator window when not in use

---

The Asset Creator transforms the tedious process of manual asset creation into an efficient, error-free workflow. Master these techniques to dramatically speed up your SOAP development!

**Next Steps:**
- [Dependency Visualizer](./dependency-visualizer) - Visualize asset relationships
- [Debug Window](./debug-window) - Monitor your created assets
- [Performance Analyzer](./performance-analyzer) - Optimize asset usage
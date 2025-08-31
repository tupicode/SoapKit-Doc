---
title: Variables System
sidebar_position: 1
---

# SoapKit Variables System

The **Variables System** is SoapKit's second core pillar, providing intelligent, constraint-aware ScriptableObject variables that replace traditional public fields and properties with a more robust, debuggable, and flexible approach.

## Overview

SoapKit Variables are ScriptableObject-based data containers that provide:

- 🔒 **Type Safety** - Full compile-time checking and IntelliSense support
- 🎯 **Smart Operations** - Built-in mathematical and manipulation methods for each type
- ✅ **Validation & Constraints** - Min/max values, length limits, and custom validation
- 🔄 **Change Notifications** - C# events for reactive programming
- 🛠️ **Professional Debugging** - Real-time monitoring and editor integration
- 📊 **Read-Only Interface** - Clean separation between readers and writers

### Key Benefits

**Traditional Approach Problems:**
```csharp
// ❌ Hard to debug, tightly coupled
public class PlayerStats : MonoBehaviour 
{
    public int health = 100;          // No validation
    public float speed = 5f;          // No constraints
    public string playerName = "";    // No length limits
    
    // Other systems need direct references
    public UIHealthBar healthBar;     // Tight coupling
    public AudioSource audioSource;  // Tight coupling
}
```

**SoapKit Variables Solution:**
```csharp
// ✅ Debuggable, decoupled, validated
public class PlayerStats : MonoBehaviour 
{
    [SerializeField] private IntVariable health;      // Constraint-aware
    [SerializeField] private FloatVariable speed;     // Min/max validation
    [SerializeField] private StringVariable playerName; // Length limits
    
    // No direct system references needed!
    // Other systems subscribe to variable change events
}
```

## Basic Variable Usage

### Creating Variables

Variables are created as ScriptableObject assets:


```
Right-click in Project → Create → SoapKit → Variables → [Type] Variable
```

**Available Variable Types:**
- `BoolVariable` - Boolean values with logical operations
- `IntVariable` - Integer values with math operations and constraints
- `FloatVariable` - Float values with math operations and constraints
- `StringVariable` - String values with manipulation and validation
- `Vector2Variable` - 2D vectors with vector math operations
- `Vector3Variable` - 3D vectors with vector math operations
- `Vector2IntVariable` - Integer vectors with specialized operations
- `ColorVariable` - Colors with RGB/HSV manipulation
- `GameObjectVariable` - GameObject references with validation
- `TransformVariable` - Transform references with hierarchy operations

### Using Variables

**Basic Value Access:**
```csharp
public class HealthSystem : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntVariable maxHealth;
    
    void Start()
    {
        // Get values
        int currentHealth = playerHealth.Value;
        int maximum = maxHealth.Value;
        
        // Set values
        playerHealth.SetValue(100);
        maxHealth.SetValue(120);
        
        // Subscribe to changes
        playerHealth.OnValueChanged += OnHealthChanged;
    }
    
    private void OnHealthChanged(int newHealth)
    {
        Debug.Log($"Health changed to: {newHealth}");
    }
}
```

**Read-Only Interface:**
```csharp
public class HealthUI : MonoBehaviour
{
    // Use IReadOnlyVariable<T> for systems that only need to read
    [SerializeField] private IReadOnlyVariable<int> playerHealth;
    [SerializeField] private IReadOnlyVariable<int> maxHealth;
    
    void Start()
    {
        // Can read values
        UpdateHealthBar(playerHealth.Value, maxHealth.Value);
        
        // Can subscribe to changes
        playerHealth.OnValueChanged += UpdateHealthDisplay;
        
        // Cannot modify values - compile-time safety!
        // playerHealth.SetValue(50); // ❌ Compiler error
    }
}
```

## Type-Specific Operations

Each variable type includes specialized operations relevant to that data type:

### IntVariable Operations

```csharp
[SerializeField] private IntVariable score;
[SerializeField] private IntVariable playerLevel;

void ExampleIntOperations()
{
    // Basic math operations
    score.Add(100);              // score += 100
    score.Subtract(25);          // score -= 25
    score.Multiply(2);           // score *= 2
    score.Divide(3);             // score /= 3
    
    // Increment/Decrement
    playerLevel.Increment();     // playerLevel++
    playerLevel.Decrement();     // playerLevel--
    
    // Constraints (set in inspector)
    score.Min = 0;              // Minimum value
    score.Max = 9999;           // Maximum value
    
    // Clamping
    score.ClampToConstraints(); // Ensures value stays within min/max
}
```

### FloatVariable Operations

```csharp
[SerializeField] private FloatVariable playerSpeed;
[SerializeField] private FloatVariable healthPercentage;

void ExampleFloatOperations()
{
    // Math operations
    playerSpeed.Add(1.5f);
    playerSpeed.Multiply(0.8f);
    
    // Percentage operations
    healthPercentage.SetAsPercentage(0.75f);  // 75%
    float percent = healthPercentage.AsPercentage(); // Returns 0.0-1.0
    
    // Rounding
    playerSpeed.RoundToDecimals(2);    // Round to 2 decimal places
    playerSpeed.RoundToNearest(0.5f);  // Round to nearest 0.5
    
    // Interpolation
    playerSpeed.LerpTo(10f, Time.deltaTime); // Smooth lerp to target
    
    // Constraints
    playerSpeed.Min = 0.1f;
    playerSpeed.Max = 15f;
}
```

### StringVariable Operations

```csharp
[SerializeField] private StringVariable playerName;
[SerializeField] private StringVariable chatMessage;

void ExampleStringOperations()
{
    // String manipulation
    playerName.Append(" (VIP)");        // Add to end
    playerName.Prepend("Sir ");         // Add to beginning
    
    // Case operations
    chatMessage.ToUpperCase();          // CONVERT TO CAPS
    chatMessage.ToLowerCase();          // convert to lowercase
    chatMessage.ToTitleCase();          // Convert To Title Case
    
    // Cleaning operations
    chatMessage.Trim();                 // Remove whitespace
    chatMessage.Replace("bad", "***");  // Replace text
    
    // Validation
    playerName.MaxLength = 20;          // Character limit
    playerName.MinLength = 3;           // Minimum length
    
    // Validation checking
    bool isValid = playerName.IsValid(); // Check against constraints
}
```

### Vector3Variable Operations

```csharp
[SerializeField] private Vector3Variable playerPosition;
[SerializeField] private Vector3Variable targetPosition;

void ExampleVectorOperations()
{
    // Vector math
    playerPosition.Add(Vector3.up * 2f);     // Move up
    playerPosition.Normalize();              // Normalize vector
    
    // Interpolation
    playerPosition.LerpTo(targetPosition.Value, Time.deltaTime);
    playerPosition.SlerpTo(targetPosition.Value, Time.deltaTime);
    playerPosition.MoveTowards(targetPosition.Value, 5f * Time.deltaTime);
    
    // Component operations
    playerPosition.SetX(10f);               // Set individual components
    playerPosition.SetY(0f);
    playerPosition.SetZ(5f);
    
    float distance = playerPosition.DistanceTo(targetPosition.Value);
    
    // Constraints
    playerPosition.MaxMagnitude = 100f;     // Limit how far from origin
    playerPosition.MinMagnitude = 1f;       // Minimum distance from origin
}
```

### ColorVariable Operations

```csharp
[SerializeField] private ColorVariable playerColor;
[SerializeField] private ColorVariable targetColor;

void ExampleColorOperations()
{
    // Color manipulation
    playerColor.SetRed(0.8f);           // Modify RGB components
    playerColor.SetGreen(0.6f);
    playerColor.SetBlue(0.4f);
    playerColor.SetAlpha(0.5f);         // Transparency
    
    // HSV operations
    playerColor.SetHue(0.33f);          // Green hue
    playerColor.SetSaturation(1f);      // Full saturation
    playerColor.SetBrightness(0.8f);    // 80% brightness
    
    // Color utilities
    playerColor.Invert();               // Invert colors
    playerColor.Grayscale();            // Convert to grayscale
    
    // Interpolation
    playerColor.LerpTo(targetColor.Value, Time.deltaTime);
    
    // Presets
    playerColor.SetValue(Color.red);    // Use Unity color presets
}
```

### GameObjectVariable Operations

```csharp
[SerializeField] private GameObjectVariable targetObject;
[SerializeField] private GameObjectVariable playerObject;

void ExampleGameObjectOperations()
{
    // Component access
    var renderer = targetObject.GetComponent<Renderer>();
    var rigidbody = targetObject.GetComponent<Rigidbody>();
    
    // Safe component operations
    if (targetObject.HasComponent<Collider>())
    {
        var collider = targetObject.GetComponent<Collider>();
        collider.enabled = false;
    }
    
    // Tag validation
    targetObject.RequiredTag = "Enemy";     // Only accept objects with this tag
    bool isValidTag = targetObject.IsValid(); // Check tag requirement
    
    // Hierarchy operations
    bool isActive = targetObject.IsActive();
    targetObject.SetActive(false);
    
    // Null safety
    if (targetObject.HasValue())
    {
        // Safe to use targetObject.Value
        Debug.Log(targetObject.Value.name);
    }
}
```

## Advanced Variable Features

### Constraints and Validation

**Numeric Constraints:**
```csharp
[SerializeField] private IntVariable playerHealth;

void SetupHealthConstraints()
{
    // Set in code or inspector
    playerHealth.Min = 0;           // Can't go below 0
    playerHealth.Max = 100;         // Can't exceed 100
    playerHealth.SetValue(150);     // Automatically clamped to 100
    
    // Custom validation
    playerHealth.OnValidate += (value) => 
    {
        if (value < 0) return 0;
        if (value > 100) return 100;
        return value;
    };
}
```

**String Constraints:**
```csharp
[SerializeField] private StringVariable username;

void SetupUsernameValidation()
{
    username.MinLength = 3;
    username.MaxLength = 20;
    
    // Custom validation
    username.OnValidate += (value) => 
    {
        // Remove forbidden words
        value = value.Replace("admin", "");
        value = value.Replace("test", "");
        return value;
    };
}
```

### Change Notifications

**Multiple Subscription Patterns:**
```csharp
public class PlayerStatsUI : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntVariable playerMana;
    [SerializeField] private StringVariable playerName;
    
    void OnEnable()
    {
        // Subscribe to individual changes
        playerHealth.OnValueChanged += OnHealthChanged;
        playerMana.OnValueChanged += OnManaChanged;
        playerName.OnValueChanged += OnNameChanged;
        
        // Subscribe to any change (useful for save systems)
        playerHealth.OnValueChanged += (_) => SavePlayerData();
        playerMana.OnValueChanged += (_) => SavePlayerData();
        playerName.OnValueChanged += (_) => SavePlayerData();
    }
    
    void OnDisable()
    {
        // Always unsubscribe
        if (playerHealth != null) playerHealth.OnValueChanged -= OnHealthChanged;
        if (playerMana != null) playerMana.OnValueChanged -= OnManaChanged;
        if (playerName != null) playerName.OnValueChanged -= OnNameChanged;
    }
}
```

**Conditional Change Notifications:**
```csharp
public class AchievementSystem : MonoBehaviour
{
    [SerializeField] private IntVariable playerScore;
    
    void OnEnable()
    {
        playerScore.OnValueChanged += CheckScoreAchievements;
    }
    
    private void CheckScoreAchievements(int newScore)
    {
        // Only trigger achievements on score increases
        if (newScore > playerScore.PreviousValue)
        {
            CheckHighScoreAchievements(newScore);
        }
    }
}
```

## Professional Debugging

### Inspector Integration

Variables provide rich debugging information in the Inspector:

- **Current Value**: Real-time value display during play mode
- **Previous Value**: Shows last value for comparison
- **Change Count**: Number of times value has changed
- **Constraints**: Visual display of min/max values
- **Validation Status**: Shows if current value is valid
- **Debug Buttons**: Set test values, trigger changes

### Debug Window Integration

The SoapKit Debug Window provides comprehensive variable monitoring:

1. **Open Debug Window**: `Tools > SoapKit > Debug Window`
2. **Variables Tab**: See all variables with current values
3. **Real-time Updates**: Watch values change during gameplay
4. **Constraint Visualization**: See min/max limits visually
5. **Change History**: Track how values change over time

### Runtime Debugging

```csharp
public class VariableDebugger : MonoBehaviour
{
    [SerializeField] private IntVariable debugTarget;
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.D))
        {
            // Debug variable state
            Debug.Log($"Variable: {debugTarget.name}");
            Debug.Log($"Current: {debugTarget.Value}");
            Debug.Log($"Previous: {debugTarget.PreviousValue}");
            Debug.Log($"Min: {debugTarget.Min}, Max: {debugTarget.Max}");
            Debug.Log($"Is Valid: {debugTarget.IsValid()}");
            Debug.Log($"Change Count: {debugTarget.ChangeCount}");
        }
    }
}
```

## Performance Optimization

### Memory Efficiency

Variables are designed for performance:

- **ScriptableObject Benefits**: Shared references, no duplication
- **Efficient Change Detection**: Only notifies when values actually change
- **Minimal Allocation**: No boxing/unboxing for value types
- **Smart Caching**: Expensive operations cached when possible

### Best Practices

**✅ Efficient Variable Usage:**
```csharp
public class OptimizedVariableUser : MonoBehaviour
{
    [SerializeField] private IntVariable health;
    private int cachedHealth;
    private bool healthCached;
    
    void Start()
    {
        // Cache initial value
        cachedHealth = health.Value;
        healthCached = true;
        
        // Only subscribe when needed
        health.OnValueChanged += OnHealthChanged;
    }
    
    private void OnHealthChanged(int newHealth)
    {
        // Update cache
        cachedHealth = newHealth;
        
        // Do work only when necessary
        if (newHealth <= 0)
            HandleDeath();
    }
    
    public int GetHealth()
    {
        // Return cached value for performance
        return healthCached ? cachedHealth : health.Value;
    }
}
```

**❌ Avoid These Patterns:**
```csharp
public class IneffientVariableUser : MonoBehaviour
{
    [SerializeField] private IntVariable health;
    
    void Update()
    {
        // ❌ Don't access .Value every frame unnecessarily
        if (health.Value <= 0)
            HandleDeath();
        
        // ❌ Don't create expensive operations in change handlers
        health.OnValueChanged += (newHealth) => 
        {
            FindObjectOfType<HealthBar>().UpdateDisplay(newHealth);
        };
    }
}
```

## Common Patterns

### Save System Integration

```csharp
public class SaveSystem : MonoBehaviour
{
    [SerializeField] private IntVariable playerLevel;
    [SerializeField] private FloatVariable playerExperience;
    [SerializeField] private StringVariable playerName;
    
    void Start()
    {
        LoadPlayerData();
        
        // Subscribe to all variables for auto-save
        playerLevel.OnValueChanged += (_) => SavePlayerData();
        playerExperience.OnValueChanged += (_) => SavePlayerData();
        playerName.OnValueChanged += (_) => SavePlayerData();
    }
    
    private void LoadPlayerData()
    {
        playerLevel.SetValue(PlayerPrefs.GetInt("PlayerLevel", 1));
        playerExperience.SetValue(PlayerPrefs.GetFloat("PlayerXP", 0f));
        playerName.SetValue(PlayerPrefs.GetString("PlayerName", "Player"));
    }
    
    private void SavePlayerData()
    {
        PlayerPrefs.SetInt("PlayerLevel", playerLevel.Value);
        PlayerPrefs.SetFloat("PlayerXP", playerExperience.Value);
        PlayerPrefs.SetString("PlayerName", playerName.Value);
        PlayerPrefs.Save();
    }
}
```

### Configuration Management

```csharp
public class GameSettings : MonoBehaviour
{
    [Header("Audio Settings")]
    [SerializeField] private FloatVariable masterVolume;
    [SerializeField] private FloatVariable musicVolume;
    [SerializeField] private FloatVariable sfxVolume;
    
    [Header("Graphics Settings")]
    [SerializeField] private IntVariable qualityLevel;
    [SerializeField] private BoolVariable fullscreen;
    [SerializeField] private Vector2IntVariable resolution;
    
    void Start()
    {
        // Set up constraints
        masterVolume.Min = 0f; masterVolume.Max = 1f;
        musicVolume.Min = 0f; musicVolume.Max = 1f;
        sfxVolume.Min = 0f; sfxVolume.Max = 1f;
        qualityLevel.Min = 0; qualityLevel.Max = 5;
        
        // Apply settings when they change
        masterVolume.OnValueChanged += AudioListener.SetVolume;
        qualityLevel.OnValueChanged += QualitySettings.SetQualityLevel;
        fullscreen.OnValueChanged += Screen.SetFullscreen;
    }
}
```

### State Management

```csharp
public enum GameState { Menu, Playing, Paused, GameOver }

public class GameStateManager : MonoBehaviour
{
    [SerializeField] private EnumVariable<GameState> currentState;
    [SerializeField] private FloatVariable gameTime;
    [SerializeField] private BoolVariable isPaused;
    
    void Start()
    {
        // Initialize state
        currentState.SetValue(GameState.Menu);
        
        // Link variables
        isPaused.OnValueChanged += OnPauseStateChanged;
        currentState.OnValueChanged += OnGameStateChanged;
    }
    
    private void OnPauseStateChanged(bool paused)
    {
        Time.timeScale = paused ? 0f : 1f;
    }
    
    private void OnGameStateChanged(GameState newState)
    {
        switch(newState)
        {
            case GameState.Playing:
                gameTime.SetValue(0f);
                isPaused.SetValue(false);
                break;
                
            case GameState.Paused:
                isPaused.SetValue(true);
                break;
                
            case GameState.GameOver:
                isPaused.SetValue(false);
                Time.timeScale = 1f;
                break;
        }
    }
}
```

## Custom Variable Types

Create your own specialized variable types with custom operations and validation:

### Defining Custom Variables

**Example: Player Stats Variable**
```csharp
// Custom struct for player statistics
[System.Serializable]
public struct PlayerStats
{
    public int health;
    public int mana;
    public int experience;
    public int level;
}

// Generated custom variable
[CreateAssetMenu(menuName = "SoapKit/Variables/PlayerStats Variable")]
public class PlayerStatsVariable : BaseVariable<PlayerStats>
{
    // Custom operations specific to player stats
    public void AddExperience(int exp)
    {
        var stats = Value;
        stats.experience += exp;
        
        // Level up logic
        while (stats.experience >= GetRequiredExpForLevel(stats.level + 1))
        {
            stats.level++;
            stats.health = GetMaxHealthForLevel(stats.level);
            stats.mana = GetMaxManaForLevel(stats.level);
        }
        
        SetValue(stats);
    }
    
    public void LevelUp()
    {
        var stats = Value;
        stats.level++;
        stats.health = GetMaxHealthForLevel(stats.level);
        stats.mana = GetMaxManaForLevel(stats.level);
        SetValue(stats);
    }
    
    private int GetRequiredExpForLevel(int level) => level * 100;
    private int GetMaxHealthForLevel(int level) => 100 + (level - 1) * 20;
    private int GetMaxManaForLevel(int level) => 50 + (level - 1) * 10;
}
```

### Variable Configuration

When creating variables, configure important properties for robust behavior:

**Numeric Variables (Int, Float):**
```csharp
Name: PlayerHealth
Type: IntVariable
Value: 100
Min Value: 0        // Cannot go below 0
Max Value: 100      // Cannot exceed 100
Clamp Mode: Auto    // Automatically clamp to range
Description: "Player's current health points"
Category: Player    // For organization
Tags: health, player, core  // For searching
```

**String Variables:**
```csharp
Name: PlayerName
Type: StringVariable
Value: "Player"
Min Length: 1       // Must have at least 1 character
Max Length: 20      // Cannot exceed 20 characters
Description: "Player's display name"
```

**Unity Type Variables:**
```csharp
Name: PlayerPosition
Type: Vector3Variable
Initial Value: (0, 0, 0)
Max Magnitude: 100  // Cannot be more than 100 units from origin
Description: "Player's world position"
```

### Variable System Templates

**Complete Health System Variables:**
```csharp
// Health system variable collection
IntVariable: PlayerHealth      // Current health value
IntVariable: MaxHealth         // Maximum possible health
IntVariable: HealthRegenRate   // Health regeneration per second
BoolVariable: IsAlive         // Player alive status
FloatVariable: LastDamageTime // When last damage occurred
```

**Inventory System Variables:**
```csharp
IntVariable: InventoryCount     // Current item count
IntVariable: InventoryCapacity  // Maximum capacity
BoolVariable: IsInventoryFull   // At capacity status
StringVariable: LastItemAdded   // Name of recently added item
GameObjectVariable: SelectedItem // Currently selected item
```

## Testing Variables

### Unit Testing

```csharp
[Test]
public void TestIntVariableConstraints()
{
    // Arrange
    var health = ScriptableObject.CreateInstance<IntVariable>();
    health.Min = 0;
    health.Max = 100;
    
    // Act & Assert
    health.SetValue(150);
    Assert.AreEqual(100, health.Value, "Should clamp to max value");
    
    health.SetValue(-50);
    Assert.AreEqual(0, health.Value, "Should clamp to min value");
}

[Test]
public void TestVariableChangeNotification()
{
    // Arrange
    var score = ScriptableObject.CreateInstance<IntVariable>();
    bool changeNotified = false;
    score.OnValueChanged += (_) => changeNotified = true;
    
    // Act
    score.SetValue(100);
    
    // Assert
    Assert.IsTrue(changeNotified, "Should notify when value changes");
}
```

## Next Steps

Now that you understand the Variables System, explore:

- **[Quick Guide](./quick-guide)** - Common variable patterns and recipes
- **[Debug Window](../editor-tools/debug-window)** - Professional debugging tools
- **[Custom Variables](../advanced/custom-variables)** - Creating your own variable types
- **[Best Practices](../advanced/best-practices)** - Professional development patterns

---

The Variables System provides the foundation for data-driven, debuggable game development. Combined with the Events System, you have everything needed to build professional Unity games with clean, maintainable architecture! 🎯
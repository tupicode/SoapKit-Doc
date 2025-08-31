---
title: Quick Reference Guide
sidebar_position: 3
---

# SoapKit Quick Reference Guide

This guide provides quick recipes and common patterns for using SoapKit Events and Variables effectively. Perfect for developers who want to quickly implement professional game architecture patterns.

## Quick Setup Recipes

### Player Health System (2 minutes)

**Assets Needed:**
```
Create > SoapKit > Variables > Int Variable → "PlayerHealth"
Create > SoapKit > Variables > Int Variable → "MaxHealth"  
Create > SoapKit > Events > Int Event → "OnHealthChanged"
Create > SoapKit > Events > Unit Event → "OnPlayerDied"
```

**Code:**
```csharp
public class HealthSystem : MonoBehaviour
{
    [SerializeField] private IntVariable health;
    [SerializeField] private IntVariable maxHealth;
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    void Start()
    {
        health.OnValueChanged += (h) => onHealthChanged.Raise(h);
        health.OnValueChanged += CheckDeath;
    }
    
    public void TakeDamage(int damage) => health.Subtract(damage);
    public void Heal(int amount) => health.Add(Mathf.Min(amount, maxHealth.Value - health.Value));
    
    private void CheckDeath(int h) { if (h <= 0) onPlayerDied.Raise(); }
}
```

### Score System (1 minute)

**Assets:**
```
Create > SoapKit > Variables > Int Variable → "PlayerScore"
Create > SoapKit > Events > Int Event → "OnScoreChanged"
```

**Code:**
```csharp
public class ScoreManager : MonoBehaviour
{
    [SerializeField] private IntVariable score;
    [SerializeField] private IntGameEvent onScoreChanged;
    
    void Start() => score.OnValueChanged += onScoreChanged.Raise;
    
    public void AddScore(int points) => score.Add(points);
}
```

### UI Health Bar (1 minute)

**Code:**
```csharp
public class HealthBar : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private IntVariable maxHealth;
    [SerializeField] private Slider healthSlider;
    
    void OnEnable() => onHealthChanged.AddListener(UpdateBar);
    void OnDisable() => onHealthChanged.RemoveListener(UpdateBar);
    
    private void UpdateBar(int health)
    {
        healthSlider.value = (float)health / maxHealth.Value;
    }
}
```

## Common Patterns

### Observer Pattern (Reactive Systems)

**Problem:** Multiple systems need to react to changes
**Solution:** One variable, multiple listeners

```csharp
// ✅ One source of truth, multiple observers
public class GameManager : MonoBehaviour
{
    [SerializeField] private BoolVariable isPaused;
    
    void Start()
    {
        // Multiple systems listen to one variable
        isPaused.OnValueChanged += pauseMenu.SetActive;
        isPaused.OnValueChanged += (paused) => Time.timeScale = paused ? 0 : 1;
        isPaused.OnValueChanged += audioSource.SetPaused;
        isPaused.OnValueChanged += playerInput.SetEnabled;
    }
}
```

### State Machine Pattern

**Assets:**
```
Create > SoapKit > Events > String Event → "OnStateChanged"
```

**Code:**
```csharp
public class GameStateMachine : MonoBehaviour
{
    [SerializeField] private StringGameEvent onStateChanged;
    private string currentState = "Menu";
    
    public void ChangeState(string newState)
    {
        if (currentState == newState) return;
        currentState = newState;
        onStateChanged.Raise(newState);
    }
    
    // Other systems listen and react
    void OnEnable() => onStateChanged.AddListener(HandleStateChange);
    
    private void HandleStateChange(string state)
    {
        switch(state)
        {
            case "Playing": StartGameplay(); break;
            case "Paused": ShowPauseMenu(); break;
            case "GameOver": ShowGameOver(); break;
        }
    }
}
```

### Resource Management Pattern

```csharp
public class ResourceManager : MonoBehaviour
{
    [SerializeField] private IntVariable coins;
    [SerializeField] private IntVariable gems;
    [SerializeField] private IntGameEvent onCoinsChanged;
    [SerializeField] private IntGameEvent onGemsChanged;
    [SerializeField] private BoolGameEvent onPurchaseResult;
    
    void Start()
    {
        coins.OnValueChanged += onCoinsChanged.Raise;
        gems.OnValueChanged += onGemsChanged.Raise;
    }
    
    public void TryPurchase(int coinCost, int gemCost = 0)
    {
        if (coins.Value >= coinCost && gems.Value >= gemCost)
        {
            coins.Subtract(coinCost);
            gems.Subtract(gemCost);
            onPurchaseResult.Raise(true); // Success
        }
        else
        {
            onPurchaseResult.Raise(false); // Failed
        }
    }
}
```

### Inventory System Pattern

```csharp
public class SimpleInventory : MonoBehaviour
{
    [SerializeField] private IntVariable itemCount;
    [SerializeField] private IntVariable maxCapacity;
    [SerializeField] private StringGameEvent onItemAdded;
    [SerializeField] private BoolGameEvent onInventoryFull;
    
    public void AddItem(string itemName)
    {
        if (itemCount.Value >= maxCapacity.Value)
        {
            onInventoryFull.Raise(true);
            return;
        }
        
        itemCount.Increment();
        onItemAdded.Raise(itemName);
        
        if (itemCount.Value >= maxCapacity.Value)
            onInventoryFull.Raise(true);
    }
}
```

## Editor Workflow Tips

### Asset Organization

**Recommended Folder Structure:**
```
Assets/Data/
├── Variables/
│   ├── Player/
│   │   ├── PlayerHealth.asset
│   │   ├── PlayerScore.asset
│   │   └── PlayerName.asset
│   └── Game/
│       ├── GameScore.asset
│       └── IsPaused.asset
└── Events/
    ├── Player/
    │   ├── OnPlayerDied.asset
    │   └── OnHealthChanged.asset
    └── Game/
        ├── OnGameStart.asset
        └── OnLevelComplete.asset
```

### Naming Conventions

**Variables:** Descriptive nouns
- ✅ `PlayerHealth`, `MaxHealth`, `GameScore`
- ❌ `health`, `max`, `score`

**Events:** Action-oriented with "On" prefix
- ✅ `OnHealthChanged`, `OnPlayerDied`, `OnLevelComplete`
- ❌ `HealthChange`, `PlayerDeath`, `LevelDone`

### Batch Asset Creation

Use the **SoapKit Asset Creator** for efficiency:

1. `Tools > SoapKit > Asset Creator`
2. Select **Batch Creation** mode
3. Choose variable/event types
4. Enter names (one per line)
5. Set output folder
6. Click **Create All**

### Debug Workflow

**Daily Debugging Routine:**

1. **Open Debug Window** (`Tools > SoapKit > Debug Window`)
2. **Monitor Tab:** Watch key variables during gameplay
3. **Events Tab:** Test events manually 
4. **Performance Tab:** Check for bottlenecks
5. **Dependencies Tab:** Visualize system relationships

## Performance Quick Wins

### Memory Optimization

```csharp
// ✅ Cache references, avoid repeated lookups
public class OptimizedSystem : MonoBehaviour
{
    [SerializeField] private IntVariable health;
    private int cachedHealth;
    
    void Start()
    {
        cachedHealth = health.Value;
        health.OnValueChanged += UpdateCache;
    }
    
    private void UpdateCache(int newHealth) => cachedHealth = newHealth;
    
    // Use cached value instead of health.Value in Update()
    void Update()
    {
        if (cachedHealth <= 0) HandleDeath();
    }
}
```

### Event Subscription Management

```csharp
// ✅ Use OnEnable/OnDisable for temporary listeners
public class TemporaryListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent onScoreChanged;
    
    void OnEnable() => onScoreChanged.AddListener(HandleScore);
    void OnDisable() => onScoreChanged.RemoveListener(HandleScore);
    
    private void HandleScore(int score) { /* Handle score */ }
}
```

### Avoid Common Performance Traps

```csharp
// ❌ DON'T: Access .Value repeatedly
void Update()
{
    if (health.Value <= 0 && health.Value > previousHealth) // BAD
        HandleHealthChange();
}

// ✅ DO: Cache and use change events
private int cachedHealth;
void Start()
{
    cachedHealth = health.Value;
    health.OnValueChanged += (h) => cachedHealth = h;
}

void Update()
{
    if (cachedHealth <= 0) // GOOD
        HandleHealthChange();
}
```

## Game-Specific Patterns

### Mobile Game Pattern

```csharp
public class MobileGameManager : MonoBehaviour
{
    [Header("Progression")]
    [SerializeField] private IntVariable playerLevel;
    [SerializeField] private FloatVariable experience;
    [SerializeField] private IntVariable currency;
    
    [Header("Session")]
    [SerializeField] private FloatVariable sessionTime;
    [SerializeField] private BoolVariable isConnected;
    
    [Header("Events")]
    [SerializeField] private UnitGameEvent onLevelUp;
    [SerializeField] private IntGameEvent onCurrencyChanged;
    
    void Start()
    {
        // Auto-save on any progression change
        playerLevel.OnValueChanged += (_) => SaveProgress();
        experience.OnValueChanged += (_) => SaveProgress();
        currency.OnValueChanged += onCurrencyChanged.Raise;
        
        // Level up check
        experience.OnValueChanged += CheckLevelUp;
    }
    
    private void CheckLevelUp(float xp)
    {
        int requiredXP = playerLevel.Value * 100;
        if (xp >= requiredXP)
        {
            playerLevel.Increment();
            experience.SetValue(0);
            onLevelUp.Raise();
        }
    }
}
```

### RPG Pattern

```csharp
public class RPGCharacter : MonoBehaviour
{
    [Header("Core Stats")]
    [SerializeField] private IntVariable health;
    [SerializeField] private IntVariable mana;
    [SerializeField] private IntVariable stamina;
    
    [Header("Attributes")]  
    [SerializeField] private IntVariable strength;
    [SerializeField] private IntVariable intelligence;
    [SerializeField] private IntVariable dexterity;
    
    [Header("Events")]
    [SerializeField] private StringGameEvent onStatChanged;
    
    void Start()
    {
        // Link derived stats to base stats
        strength.OnValueChanged += (str) => 
        {
            health.Max = 100 + (str * 10);
            onStatChanged.Raise($"Strength: {str}");
        };
        
        intelligence.OnValueChanged += (intel) => 
        {
            mana.Max = 50 + (intel * 15);
            onStatChanged.Raise($"Intelligence: {intel}");
        };
    }
}
```

### Platformer Pattern

```csharp
public class PlatformerController : MonoBehaviour
{
    [Header("Movement")]
    [SerializeField] private FloatVariable moveSpeed;
    [SerializeField] private FloatVariable jumpPower;
    [SerializeField] private BoolVariable isGrounded;
    
    [Header("Events")]
    [SerializeField] private Vector2GameEvent onPlayerMoved;
    [SerializeField] private UnitGameEvent onJumped;
    [SerializeField] private UnitGameEvent onLanded;
    
    void Update()
    {
        // Movement
        float horizontal = Input.GetAxis("Horizontal");
        if (horizontal != 0)
        {
            Vector2 movement = new Vector2(horizontal * moveSpeed.Value, 0);
            onPlayerMoved.Raise(movement);
        }
        
        // Jumping
        if (Input.GetKeyDown(KeyCode.Space) && isGrounded.Value)
        {
            isGrounded.SetValue(false);
            onJumped.Raise();
        }
    }
    
    void OnCollisionEnter2D(Collision2D col)
    {
        if (col.gameObject.CompareTag("Ground"))
        {
            isGrounded.SetValue(true);
            onLanded.Raise();
        }
    }
}
```

## Testing Recipes

### Unit Test Template

```csharp
[Test]
public void TestHealthSystem()
{
    // Arrange
    var health = ScriptableObject.CreateInstance<IntVariable>();
    var onDied = ScriptableObject.CreateInstance<UnitGameEvent>();
    
    bool playerDied = false;
    onDied.AddListener(() => playerDied = true);
    
    var healthSystem = new GameObject().AddComponent<HealthSystem>();
    // Set up healthSystem with health and onDied...
    
    // Act
    healthSystem.TakeDamage(150);
    
    // Assert
    Assert.AreEqual(0, health.Value);
    Assert.IsTrue(playerDied);
}
```

### Integration Test Template

```csharp
[Test]
public void TestScoreUIIntegration()
{
    // Test that UI updates when score changes
    var score = ScriptableObject.CreateInstance<IntVariable>();
    var onScoreChanged = ScriptableObject.CreateInstance<IntGameEvent>();
    
    var ui = new GameObject().AddComponent<ScoreUI>();
    // Set up UI with score and event...
    
    score.SetValue(100);
    
    Assert.AreEqual("100", ui.scoreText.text);
}
```

## Common Pitfalls & Solutions

### Memory Leak Prevention

```csharp
// ❌ WRONG: Forgetting to unsubscribe
public class LeakyListener : MonoBehaviour
{
    void Start()
    {
        someEvent.AddListener(HandleEvent);
        // Missing unsubscribe = memory leak!
    }
}

// ✅ CORRECT: Always unsubscribe
public class ProperListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent someEvent;
    
    void OnEnable() => someEvent.AddListener(HandleEvent);
    void OnDisable() => someEvent.RemoveListener(HandleEvent);
    
    private void HandleEvent(int value) { /* Handle */ }
}
```

### Null Reference Prevention

```csharp
// ✅ Always null-check in OnDisable
void OnDisable()
{
    if (healthEvent != null)
        healthEvent.RemoveListener(OnHealthChanged);
    
    if (scoreEvent != null)
        scoreEvent.RemoveListener(OnScoreChanged);
}
```

### Event Order Dependencies

```csharp
// ❌ WRONG: Depending on event order
void Start()
{
    healthEvent.AddListener(UpdateUI);     // Which runs first?
    healthEvent.AddListener(CheckDeath);   // Undefined order!
}

// ✅ CORRECT: Use separate events for ordered operations
void Start()
{
    onHealthChanged.AddListener(UpdateUI);
    onPlayerDied.AddListener(HandleDeath); // Clear sequence
}
```

## Cheat Sheet

### Most Used Code Snippets

**Variable Declaration:**
```csharp
[SerializeField] private IntVariable variableName;
```

**Event Declaration:**
```csharp
[SerializeField] private IntGameEvent eventName;
```

**Subscribe Pattern:**
```csharp
void OnEnable() => eventName.AddListener(MethodName);
void OnDisable() => eventName.RemoveListener(MethodName);
```

**Variable Operations:**
```csharp
variable.SetValue(newValue);
variable.Add(amount);
variable.OnValueChanged += HandleChange;
```

**Event Operations:**
```csharp
eventName.Raise(value);
eventName.AddListener(method);
eventName.RemoveListener(method);
```

---

This quick reference covers 90% of common SoapKit usage patterns. For advanced scenarios, check out the [Advanced Patterns Guide](../advanced/patterns) and [Best Practices](../advanced/best-practices) sections. Happy coding!
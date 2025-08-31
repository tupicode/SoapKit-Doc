---
title: Best Practices
sidebar_position: 5
---

# SoapKit Best Practices

This guide presents battle-tested patterns and practices for building professional games with SoapKit. These recommendations come from real-world projects and help you avoid common pitfalls while maximizing the benefits of the SOAP architecture.

## Architecture Principles

### 1. Single Responsibility Principle

**✅ Good: Focused Systems**
```csharp
// Each system has one clear responsibility
public class HealthSystem : MonoBehaviour
{
    // Only handles health logic - damage, healing, death
}

public class HealthUI : MonoBehaviour  
{
    // Only handles health-related UI updates
}

public class HealthAudio : MonoBehaviour
{
    // Only handles health-related audio
}
```

**❌ Bad: God Objects**
```csharp
// Violates single responsibility - too many concerns
public class PlayerSystem : MonoBehaviour
{
    void Update()
    {
        HandleMovement();     // Movement concern
        HandleHealth();       // Health concern  
        HandleInventory();    // Inventory concern
        HandleAudio();        // Audio concern
        HandleUI();          // UI concern
        // ... this system knows too much!
    }
}
```

### 2. Dependency Inversion

**✅ Good: Depend on Abstractions**
```csharp
public class WeaponSystem : MonoBehaviour
{
    // Depends on SoapKit abstractions, not concrete types
    [SerializeField] private IntVariable playerHealth;     // Abstract variable
    [SerializeField] private IntGameEvent onDamageDealt;  // Abstract event
    
    public void DealDamage(int damage)
    {
        playerHealth.Subtract(damage);    // Uses variable interface
        onDamageDealt.Raise(damage);     // Uses event interface
    }
}
```

**❌ Bad: Depend on Concrete Types**
```csharp
public class WeaponSystem : MonoBehaviour
{
    // Depends on concrete implementations - tight coupling
    public HealthSystem healthSystem;     // Concrete dependency
    public UIManager uiManager;          // Concrete dependency
    public AudioManager audioManager;    // Concrete dependency
    
    public void DealDamage(int damage)
    {
        healthSystem.TakeDamage(damage);        // Direct method call
        uiManager.UpdateHealthDisplay();        // Direct method call
        audioManager.PlayDamageSound();         // Direct method call
    }
}
```

## Event Design Patterns

### 3. Event Naming Conventions

**Events should be named as past-tense actions or state changes:**

**✅ Good Event Names:**
```csharp
OnPlayerHealthChanged    // Clear what happened
OnItemEquipped          // Past tense, specific action
OnLevelCompleted        // Clear completion event
OnEnemySpawned          // Specific spawn event
OnQuestStarted          // Clear beginning event
OnInventoryFull         // Clear state change
```

**❌ Bad Event Names:**
```csharp
PlayerEvent             // Too generic
ItemStuff               // Unclear purpose
LevelThing              // Vague naming
EnemyUpdate             // Present tense, unclear
QuestEvent              // Not specific enough
InventoryChange         // What kind of change?
```

### 4. Event Data Design

**Use immutable structs for event data:**

**✅ Good Event Data:**
```csharp
[System.Serializable]
public struct DamageEventData
{
    public readonly int amount;
    public readonly DamageType type;
    public readonly GameObject source;
    public readonly Vector3 hitPoint;
    
    public DamageEventData(int amount, DamageType type, GameObject source, Vector3 hitPoint)
    {
        this.amount = amount;
        this.type = type;
        this.source = source;
        this.hitPoint = hitPoint;
    }
}
```

**❌ Bad Event Data:**
```csharp
[System.Serializable]
public class BadDamageData
{
    public int amount;              // Mutable, can be changed by listeners
    public string type;             // String instead of enum - error prone
    public Transform source;        // Can become null unexpectedly
    public float[] hitData;         // Array - unnecessary complexity
}
```

### 5. Event Frequency Management

**Handle high-frequency events efficiently:**

**✅ Good: Throttled High-Frequency Events**
```csharp
public class OptimizedMovementEvents : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    [SerializeField] private float eventThrottleRate = 0.1f; // 10fps max
    
    private float lastEventTime;
    private Vector3 lastPosition;
    
    void Update()
    {
        Vector3 currentPosition = transform.position;
        
        // Only raise event if enough time has passed and position changed significantly
        if (Time.time - lastEventTime >= eventThrottleRate && 
            Vector3.Distance(currentPosition, lastPosition) > 0.1f)
        {
            onPlayerMoved.Raise(currentPosition);
            lastEventTime = Time.time;
            lastPosition = currentPosition;
        }
    }
}
```

**❌ Bad: Unthrottled High-Frequency Events**
```csharp
public class BadMovementEvents : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    
    void Update()
    {
        // Raises event every frame (60+ times per second!)
        // Can cause performance issues and spam listeners
        onPlayerMoved.Raise(transform.position);
    }
}
```

## Variable Management

### 6. Variable Scope and Lifetime

**Choose appropriate variable types for different scopes:**

**✅ Good: Appropriate Variable Scopes**
```csharp
// Global/Persistent Variables - use ScriptableObject variables
[SerializeField] private IntVariable playerLevel;        // Persists across scenes
[SerializeField] private StringVariable playerName;      // Global player data
[SerializeField] private IntVariable totalScore;         // Game-wide score

// Local/Temporary Variables - use regular fields
private float currentAnimationTime;                      // Temporary animation state
private bool isCurrentlyJumping;                        // Temporary movement state
private Vector3 localTargetPosition;                    // Local calculation result
```

**❌ Bad: Wrong Variable Scopes**
```csharp
// Don't use ScriptableObject variables for temporary/local data
[SerializeField] private FloatVariable animationTime;    // Should be local field
[SerializeField] private BoolVariable isJumping;        // Should be local field
[SerializeField] private Vector3Variable tempPosition;   // Should be local field
```

### 7. Variable Initialization and Reset

**Handle variable initialization properly:**

**✅ Good: Proper Variable Initialization**
```csharp
public class GameManager : MonoBehaviour
{
    [SerializeField] private IntVariable playerScore;
    [SerializeField] private BoolVariable isGameActive;
    [SerializeField] private FloatVariable gameTime;
    
    void Start()
    {
        InitializeGameVariables();
    }
    
    private void InitializeGameVariables()
    {
        // Set initial values explicitly
        playerScore.SetValue(0);
        isGameActive.SetValue(false);
        gameTime.SetValue(0f);
        
        // Subscribe to changes after initialization
        isGameActive.OnValueChanged += OnGameActiveChanged;
    }
    
    public void StartNewGame()
    {
        // Reset to initial state
        playerScore.SetValue(0);
        gameTime.SetValue(0f);
        isGameActive.SetValue(true);
    }
}
```

**❌ Bad: Undefined Initialization**
```csharp
public class BadGameManager : MonoBehaviour
{
    [SerializeField] private IntVariable playerScore;
    [SerializeField] private BoolVariable isGameActive;
    
    void Start()
    {
        // Assumes variables have correct initial values
        // No explicit initialization - can lead to bugs
        isGameActive.OnValueChanged += OnGameActiveChanged;
    }
}
```

## Memory Management

### 8. Event Subscription Lifecycle

**Always unsubscribe from events to prevent memory leaks:**

**✅ Good: Proper Event Lifecycle Management**
```csharp
public class HealthUI : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    void OnEnable()
    {
        // Subscribe when enabled
        if (onHealthChanged != null)
            onHealthChanged.AddListener(UpdateHealthDisplay);
        if (onPlayerDied != null)
            onPlayerDied.AddListener(ShowDeathScreen);
    }
    
    void OnDisable()
    {
        // Always unsubscribe when disabled
        if (onHealthChanged != null)
            onHealthChanged.RemoveListener(UpdateHealthDisplay);
        if (onPlayerDied != null)
            onPlayerDied.RemoveListener(ShowDeathScreen);
    }
    
    private void UpdateHealthDisplay(int health) { /* Update UI */ }
    private void ShowDeathScreen() { /* Show death UI */ }
}
```

**❌ Bad: Missing Unsubscribe**
```csharp
public class BadHealthUI : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    
    void Start()
    {
        // Subscribe but never unsubscribe
        onHealthChanged.AddListener(UpdateHealthDisplay);
        // Memory leak! Event holds reference to this object even after destruction
    }
    
    private void UpdateHealthDisplay(int health) { /* Update UI */ }
}
```

### 9. Null Safety

**Always check for null references:**

**✅ Good: Null-Safe Event Handling**
```csharp
public class SafeEventHandler : MonoBehaviour
{
    [SerializeField] private IntGameEvent onScoreChanged;
    
    void OnEnable()
    {
        if (onScoreChanged != null)
            onScoreChanged.AddListener(OnScoreChanged);
    }
    
    void OnDisable()
    {
        // Null check prevents errors during shutdown
        if (onScoreChanged != null)
            onScoreChanged.RemoveListener(OnScoreChanged);
    }
    
    private void OnScoreChanged(int score)
    {
        // Additional null checks for referenced objects
        if (scoreText != null)
            scoreText.text = score.ToString();
    }
    
    public void RaiseScoreEvent(int score)
    {
        // Null check before raising
        if (onScoreChanged != null)
            onScoreChanged.Raise(score);
    }
}
```

**❌ Bad: No Null Checking**
```csharp
public class UnsafeEventHandler : MonoBehaviour
{
    [SerializeField] private IntGameEvent onScoreChanged;
    
    void OnEnable()
    {
        // Will throw NullReferenceException if onScoreChanged is null
        onScoreChanged.AddListener(OnScoreChanged);
    }
    
    void OnDisable()
    {
        // Will throw NullReferenceException during shutdown
        onScoreChanged.RemoveListener(OnScoreChanged);
    }
}
```

## Performance Optimization

### 10. Efficient Event Listening

**Optimize event listeners for performance:**

**✅ Good: Efficient Event Listeners**
```csharp
public class OptimizedListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    
    // Cache expensive lookups
    private Text healthText;
    private Image healthBar;
    private int cachedHealth = -1;
    
    void Start()
    {
        // Cache UI references once
        healthText = GetComponent<Text>();
        healthBar = GetComponent<Image>();
    }
    
    void OnEnable()
    {
        onHealthChanged.AddListener(OnHealthChanged);
    }
    
    void OnDisable()
    {
        if (onHealthChanged != null)
            onHealthChanged.RemoveListener(OnHealthChanged);
    }
    
    private void OnHealthChanged(int newHealth)
    {
        // Only update if value actually changed
        if (cachedHealth == newHealth) return;
        cachedHealth = newHealth;
        
        // Use cached references
        if (healthText != null)
            healthText.text = newHealth.ToString();
    }
}
```

**❌ Bad: Inefficient Event Listeners**
```csharp
public class SlowListener : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    
    void OnEnable()
    {
        onHealthChanged.AddListener(OnHealthChanged);
    }
    
    private void OnHealthChanged(int newHealth)
    {
        // Expensive operations on every event
        var healthText = FindObjectOfType<Text>();  // Slow search
        var healthBar = GameObject.Find("HealthBar").GetComponent<Image>(); // Slow search
        
        // Update even if value hasn't changed
        healthText.text = newHealth.ToString();
        healthBar.fillAmount = newHealth / 100f;
        
        // Unnecessary expensive operations
        Resources.UnloadUnusedAssets();  // Very expensive!
    }
}
```

### 11. Variable Access Patterns

**Optimize variable access for performance:**

**✅ Good: Cached Variable Access**
```csharp
public class EfficientVariableUser : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private FloatVariable moveSpeed;
    
    // Cache values when they change
    private int cachedHealth;
    private float cachedSpeed;
    
    void Start()
    {
        // Cache initial values
        cachedHealth = playerHealth.Value;
        cachedSpeed = moveSpeed.Value;
        
        // Subscribe to changes to update cache
        playerHealth.OnValueChanged += (h) => cachedHealth = h;
        moveSpeed.OnValueChanged += (s) => cachedSpeed = s;
    }
    
    void Update()
    {
        // Use cached values in performance-critical code
        if (cachedHealth <= 0)
            HandleDeath();
            
        transform.Translate(Vector3.forward * cachedSpeed * Time.deltaTime);
    }
}
```

**❌ Bad: Repeated Variable Access**
```csharp
public class SlowVariableUser : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private FloatVariable moveSpeed;
    
    void Update()
    {
        // Accesses .Value multiple times per frame - inefficient
        if (playerHealth.Value <= 0)
            HandleDeath();
            
        if (playerHealth.Value < 25)
            ShowLowHealthWarning();
            
        transform.Translate(Vector3.forward * moveSpeed.Value * Time.deltaTime);
        
        // Even worse - accessing in nested loops
        for (int i = 0; i < enemies.Length; i++)
        {
            if (Vector3.Distance(enemies[i].position, transform.position) < moveSpeed.Value)
            {
                // Accessing moveSpeed.Value inside loop!
            }
        }
    }
}
```

## Debugging and Testing

### 12. Debug-Friendly Design

**Design systems to be easily debuggable:**

**✅ Good: Debug-Friendly Implementation**
```csharp
public class DebuggableHealthSystem : MonoBehaviour
{
    [Header("Debug Info")]
    [SerializeField] private bool enableDebugLogging = true;
    [SerializeField] private bool showDebugGUI = false;
    
    [Header("Health Data")]
    [SerializeField] private IntVariable currentHealth;
    [SerializeField] private IntGameEvent onHealthChanged;
    
    public void TakeDamage(int damage, string source = "unknown")
    {
        if (enableDebugLogging)
            Debug.Log($"[HealthSystem] Taking {damage} damage from {source}. Health: {currentHealth.Value} -> {currentHealth.Value - damage}");
        
        int newHealth = Mathf.Max(0, currentHealth.Value - damage);
        currentHealth.SetValue(newHealth);
        onHealthChanged.Raise(newHealth);
        
        if (enableDebugLogging && newHealth <= 0)
            Debug.Log($"[HealthSystem] Player died from {source}");
    }
    
    // Debug methods accessible from inspector
    [ContextMenu("Debug: Take 25 Damage")]
    private void DebugTakeDamage() => TakeDamage(25, "debug");
    
    [ContextMenu("Debug: Heal to Full")]
    private void DebugHealFull() => currentHealth.SetValue(100);
    
    [ContextMenu("Debug: Log Health Status")]
    private void DebugLogStatus() => Debug.Log($"Health: {currentHealth.Value}/100");
    
    #if UNITY_EDITOR
    void OnGUI()
    {
        if (!showDebugGUI || !Application.isPlaying) return;
        
        GUILayout.BeginArea(new Rect(10, 10, 200, 100));
        GUILayout.Label($"Health: {currentHealth.Value}");
        if (GUILayout.Button("Damage 25")) TakeDamage(25, "debug");
        if (GUILayout.Button("Heal Full")) currentHealth.SetValue(100);
        GUILayout.EndArea();
    }
    #endif
}
```

**❌ Bad: Hard to Debug**
```csharp
public class HardToDebugSystem : MonoBehaviour
{
    [SerializeField] private IntVariable h; // Unclear naming
    [SerializeField] private IntGameEvent e; // Unclear naming
    
    public void D(int d) // Unclear method name
    {
        // No logging, no feedback
        h.SetValue(h.Value - d);
        e.Raise(h.Value);
        
        if (h.Value <= 0)
        {
            // Magic happens with no explanation
            GameObject.Find("Player").SetActive(false);
        }
    }
}
```

### 13. Testing Strategies

**Design for testability:**

**✅ Good: Testable Design**
```csharp
public class TestableInventorySystem : MonoBehaviour
{
    [SerializeField] private IntVariable itemCount;
    [SerializeField] private IntVariable capacity;
    [SerializeField] private StringGameEvent onItemAdded;
    
    // Exposed properties for testing
    public int ItemCount => itemCount.Value;
    public int Capacity => capacity.Value;
    public bool IsFull => itemCount.Value >= capacity.Value;
    
    // Clear interface methods
    public bool TryAddItem(string itemName)
    {
        if (IsFull) return false;
        
        itemCount.Increment();
        onItemAdded.Raise(itemName);
        return true;
    }
    
    public void RemoveItem()
    {
        if (itemCount.Value > 0)
            itemCount.Decrement();
    }
    
    // Test helper methods
    public void ClearInventory() => itemCount.SetValue(0);
    public void SetCapacity(int newCapacity) => capacity.SetValue(newCapacity);
}

// Corresponding test
[Test]
public void TestInventorySystem()
{
    var system = CreateTestInventorySystem();
    
    Assert.IsTrue(system.TryAddItem("Sword"));
    Assert.AreEqual(1, system.ItemCount);
    Assert.IsFalse(system.IsFull);
}
```

## Team Collaboration

### 14. Asset Organization

**Organize SoapKit assets for team collaboration:**

**✅ Good: Organized Asset Structure**
```
Assets/
├── Data/
│   ├── Variables/
│   │   ├── Player/
│   │   │   ├── Combat/
│   │   │   │   ├── PlayerHealth.asset
│   │   │   │   ├── PlayerMana.asset
│   │   │   │   └── PlayerStamina.asset
│   │   │   ├── Progression/
│   │   │   │   ├── PlayerLevel.asset
│   │   │   │   ├── PlayerExperience.asset
│   │   │   │   └── PlayerSkillPoints.asset
│   │   │   └── Social/
│   │   │       ├── PlayerName.asset
│   │   │       ├── GuildName.asset
│   │   │       └── FriendsList.asset
│   │   ├── Game/
│   │   │   ├── GameScore.asset
│   │   │   ├── GameTime.asset
│   │   │   └── CurrentLevel.asset
│   │   └── UI/
│   │       ├── MenuIndex.asset
│   │       ├── VolumeLevel.asset
│   │       └── ScreenBrightness.asset
│   └── Events/
│       ├── Player/
│       │   ├── OnPlayerDied.asset
│       │   ├── OnPlayerLevelUp.asset
│       │   └── OnPlayerJoined.asset
│       ├── Game/
│       │   ├── OnGameStart.asset
│       │   ├── OnGamePause.asset
│       │   └── OnLevelComplete.asset
│       └── UI/
│           ├── OnMenuChanged.asset
│           └── OnButtonClicked.asset
```

### 15. Documentation Standards

**Document your SOAP architecture:**

**✅ Good: Well-Documented System**
```csharp
/// <summary>
/// Manages player health including damage, healing, regeneration, and death.
/// 
/// Dependencies:
/// - PlayerHealth (IntVariable): Current health value
/// - MaxHealth (IntVariable): Maximum possible health
/// - OnHealthChanged (IntGameEvent): Raised when health changes
/// - OnPlayerDied (UnitGameEvent): Raised when player dies
/// 
/// Events Raised:
/// - OnHealthChanged: When health value changes
/// - OnPlayerDied: When health reaches 0
/// - OnRegenStarted: When health regeneration begins
/// 
/// Events Listened To:
/// - None (this system is autonomous)
/// 
/// Usage:
/// - TakeDamage(amount): Applies damage to player
/// - Heal(amount): Heals player by specified amount
/// - SetInvulnerable(bool): Toggles damage immunity
/// </summary>
public class HealthSystem : MonoBehaviour
{
    // Implementation...
}
```

**❌ Bad: Undocumented System**
```csharp
// No documentation about what this does or how it works
public class HealthSystem : MonoBehaviour
{
    // Mystery variables with no explanation
    [SerializeField] private IntVariable h;
    [SerializeField] private IntGameEvent e1;
    [SerializeField] private UnitGameEvent e2;
    
    // Implementation with no comments...
}
```

## Common Anti-Patterns to Avoid

### 16. Over-Engineering

**❌ Bad: Over-Complicated for Simple Needs**
```csharp
// Don't create SOAP variables for every single value
public class OverEngineeredButton : MonoBehaviour
{
    [SerializeField] private BoolVariable isButtonHovered;     // Overkill
    [SerializeField] private BoolVariable isButtonPressed;     // Overkill
    [SerializeField] private FloatVariable buttonAlpha;       // Overkill
    [SerializeField] private Vector2Variable buttonSize;      // Overkill
    [SerializeField] private ColorVariable buttonColor;       // Overkill
    
    // This should just be a regular Unity Button with Animator
}
```

**✅ Good: Appropriate Scope**
```csharp
// Only use SOAP for data that needs to be shared across systems
public class AppropriateButton : MonoBehaviour
{
    [SerializeField] private StringGameEvent onButtonClicked; // Good - other systems need this
    
    // Local button state doesn't need SOAP variables
    private bool isHovered;
    private bool isPressed;
    private float currentAlpha;
}
```

### 17. Event Spam

**❌ Bad: Too Many Granular Events**
```csharp
// Don't create separate events for every tiny thing
public class EventSpammer : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged1;
    [SerializeField] private IntGameEvent onHealthChanged2;
    [SerializeField] private IntGameEvent onHealthChanged3;
    [SerializeField] private IntGameEvent onHealthIncreasedBy1;
    [SerializeField] private IntGameEvent onHealthIncreasedBy5;
    [SerializeField] private IntGameEvent onHealthIncreasedBy10;
    // ... way too many events!
}
```

**✅ Good: Appropriate Event Granularity**
```csharp
// Use fewer, more meaningful events
public class AppropriateEvents : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;     // General health change
    [SerializeField] private IntGameEvent onDamageTaken;      // Specific damage event
    [SerializeField] private IntGameEvent onHealthHealed;     // Specific heal event
    [SerializeField] private UnitGameEvent onPlayerDied;     // Critical state change
}
```

---

Following these best practices will help you build robust, maintainable, and professional games with SoapKit. Remember: **start simple and evolve complexity as needed**. The SOAP architecture's strength lies in its ability to scale gracefully as your project grows. 🏗️✨

**Key Principles Summary:**
1. **Single Responsibility** - One concern per system
2. **Null Safety** - Always check for null references
3. **Memory Management** - Subscribe and unsubscribe properly
4. **Performance** - Cache values, throttle high-frequency events
5. **Debuggability** - Make systems easy to inspect and test
6. **Documentation** - Document dependencies and interactions
7. **Team Collaboration** - Organize assets logically

**Next Steps:**
- Review your existing code against these practices
- Set up coding standards for your team
- Create templates that follow these patterns
- Regular code reviews focusing on SOAP architecture

By following these practices, you'll create Unity games that are not just functional, but professional, maintainable, and scalable! 🎮🚀
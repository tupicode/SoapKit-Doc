---
title: Creating Custom Events
sidebar_position: 1
---

# Creating Custom Events

While SoapKit provides events for all common Unity types, you'll often need custom events for your specific game data. This guide shows you how to create powerful, type-safe custom events that integrate seamlessly with SoapKit's professional debugging tools.

## Basic Custom Events

### Creating a Simple Custom Event

For simple data types, creating custom events is straightforward:

```csharp
using UnityEngine;
using FarmGrowthToolkit.Soap;

[System.Serializable]
public struct PlayerStats
{
    public int health;
    public int mana;
    public int level;
    
    public PlayerStats(int health, int mana, int level)
    {
        this.health = health;
        this.mana = mana;
        this.level = level;
    }
}

[CreateAssetMenu(menuName = "SoapKit/Events/PlayerStats Event")]
public class PlayerStatsGameEvent : GameEvent<PlayerStats>
{
    // That's it! The base class handles everything
}
```

### Using Your Custom Event

```csharp
public class PlayerManager : MonoBehaviour
{
    [SerializeField] private PlayerStatsGameEvent onPlayerStatsChanged;
    
    private PlayerStats currentStats = new PlayerStats(100, 50, 1);
    
    public void UpdateStats(int healthChange, int manaChange)
    {
        currentStats.health += healthChange;
        currentStats.mana += manaChange;
        
        // Raise the custom event
        onPlayerStatsChanged.Raise(currentStats);
    }
}

public class StatsUI : MonoBehaviour
{
    [SerializeField] private PlayerStatsGameEvent onPlayerStatsChanged;
    [SerializeField] private Text healthText;
    [SerializeField] private Text manaText;
    [SerializeField] private Text levelText;
    
    void OnEnable()
    {
        onPlayerStatsChanged.AddListener(UpdateUI);
    }
    
    void OnDisable()
    {
        if (onPlayerStatsChanged != null)
            onPlayerStatsChanged.RemoveListener(UpdateUI);
    }
    
    private void UpdateUI(PlayerStats stats)
    {
        healthText.text = $"Health: {stats.health}";
        manaText.text = $"Mana: {stats.mana}";
        levelText.text = $"Level: {stats.level}";
    }
}
```

## Advanced Custom Events

### Enum-Based Events

For state management and game flow control:

```csharp
public enum GameState
{
    MainMenu,
    Loading,
    Playing,
    Paused,
    GameOver,
    Victory
}

[System.Serializable]
public struct GameStateTransition
{
    public GameState fromState;
    public GameState toState;
    public float transitionTime;
    
    public GameStateTransition(GameState from, GameState to, float time = 0f)
    {
        fromState = from;
        toState = to;
        transitionTime = time;
    }
}

[CreateAssetMenu(menuName = "SoapKit/Events/Game State Transition Event")]
public class GameStateTransitionEvent : GameEvent<GameStateTransition>
{
    // Add custom validation if needed
    protected override bool ValidateEventData(GameStateTransition data)
    {
        // Prevent invalid transitions
        if (data.fromState == data.toState)
        {
            Debug.LogWarning("Cannot transition to the same state");
            return false;
        }
        
        // Add business logic validation
        if (data.fromState == GameState.Loading && data.toState == GameState.GameOver)
        {
            Debug.LogWarning("Cannot go directly from Loading to GameOver");
            return false;
        }
        
        return true;
    }
}
```

### Complex Data Events

For sophisticated game systems:

```csharp
[System.Serializable]
public class InventoryItem
{
    public string itemId;
    public string displayName;
    public int quantity;
    public Sprite icon;
    public ItemRarity rarity;
    
    public InventoryItem(string id, string name, int qty, Sprite icon, ItemRarity rarity)
    {
        itemId = id;
        displayName = name;
        quantity = qty;
        this.icon = icon;
        this.rarity = rarity;
    }
}

public enum ItemRarity { Common, Uncommon, Rare, Epic, Legendary }

[System.Serializable]
public struct ItemTransactionData
{
    public InventoryItem item;
    public int quantityChanged;
    public TransactionType transactionType;
    public string source; // Where the transaction came from
    
    public ItemTransactionData(InventoryItem item, int quantity, TransactionType type, string source)
    {
        this.item = item;
        quantityChanged = quantity;
        transactionType = type;
        this.source = source;
    }
}

public enum TransactionType { Add, Remove, Use, Sell, Buy }

[CreateAssetMenu(menuName = "SoapKit/Events/Inventory Transaction Event")]
public class InventoryTransactionEvent : GameEvent<ItemTransactionData>
{
    [Header("Event Configuration")]
    [SerializeField] private bool logTransactions = true;
    [SerializeField] private bool validateQuantities = true;
    
    protected override void OnEventRaised(ItemTransactionData data)
    {
        base.OnEventRaised(data);
        
        if (logTransactions)
        {
            Debug.Log($"Inventory: {data.transactionType} {data.quantityChanged}x {data.item.displayName} from {data.source}");
        }
    }
    
    protected override bool ValidateEventData(ItemTransactionData data)
    {
        if (data.item == null)
        {
            Debug.LogError("InventoryTransactionEvent: Item cannot be null");
            return false;
        }
        
        if (validateQuantities && data.quantityChanged <= 0)
        {
            Debug.LogError("InventoryTransactionEvent: Quantity must be positive");
            return false;
        }
        
        return true;
    }
}
```

## Events with Custom Behavior

### Events with Built-in Logic

Sometimes you want events that do more than just notify:

```csharp
[System.Serializable]
public struct DamageData
{
    public int damage;
    public DamageType damageType;
    public GameObject source;
    public GameObject target;
    public Vector3 hitPoint;
    public bool isCritical;
    
    public DamageData(int damage, DamageType type, GameObject source, GameObject target, Vector3 hitPoint, bool critical = false)
    {
        this.damage = damage;
        damageType = type;
        this.source = source;
        this.target = target;
        this.hitPoint = hitPoint;
        isCritical = critical;
    }
}

public enum DamageType { Physical, Fire, Ice, Lightning, Poison, Healing }

[CreateAssetMenu(menuName = "SoapKit/Events/Damage Event")]
public class DamageEvent : GameEvent<DamageData>
{
    [Header("Damage Configuration")]
    [SerializeField] private bool enableDamageReduction = true;
    [SerializeField] private bool enableCriticalHits = true;
    [SerializeField] private float criticalMultiplier = 2.0f;
    
    // Cache for performance
    private readonly Dictionary<DamageType, float> damageTypeModifiers = new()
    {
        { DamageType.Physical, 1.0f },
        { DamageType.Fire, 1.2f },
        { DamageType.Ice, 0.8f },
        { DamageType.Lightning, 1.5f },
        { DamageType.Poison, 0.9f },
        { DamageType.Healing, -1.0f } // Negative damage = healing
    };
    
    protected override void OnEventRaised(DamageData data)
    {
        // Process damage before notifying listeners
        var processedData = ProcessDamage(data);
        
        // Call base to notify listeners with processed data
        base.OnEventRaised(processedData);
        
        // Additional post-processing
        CreateDamageEffects(processedData);
    }
    
    private DamageData ProcessDamage(DamageData original)
    {
        var processed = original;
        
        // Apply damage type modifiers
        if (damageTypeModifiers.TryGetValue(original.damageType, out float modifier))
        {
            processed.damage = Mathf.RoundToInt(original.damage * modifier);
        }
        
        // Apply critical hit
        if (enableCriticalHits && original.isCritical)
        {
            processed.damage = Mathf.RoundToInt(processed.damage * criticalMultiplier);
        }
        
        // Apply damage reduction from target
        if (enableDamageReduction && original.target != null)
        {
            var defense = original.target.GetComponent<DefenseComponent>();
            if (defense != null)
            {
                processed.damage = Mathf.Max(1, processed.damage - defense.GetDefense(original.damageType));
            }
        }
        
        return processed;
    }
    
    private void CreateDamageEffects(DamageData data)
    {
        // Create visual effects based on damage type
        // This could raise additional events for VFX systems
        switch (data.damageType)
        {
            case DamageType.Fire:
                // Raise fire effect event
                break;
            case DamageType.Ice:
                // Raise ice effect event
                break;
            // etc.
        }
    }
}
```

### Events with Conditions

Create events that only fire under certain conditions:

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Conditional Score Event")]
public class ConditionalScoreEvent : GameEvent<int>
{
    [Header("Score Conditions")]
    [SerializeField] private int minimumScoreToRaise = 0;
    [SerializeField] private int maximumScoreToRaise = int.MaxValue;
    [SerializeField] private BoolVariable gameIsActive;
    [SerializeField] private StringVariable currentLevel;
    [SerializeField] private string[] allowedLevels;
    
    public override void Raise(int score)
    {
        // Check all conditions before raising
        if (!ShouldRaiseEvent(score))
            return;
            
        base.Raise(score);
    }
    
    private bool ShouldRaiseEvent(int score)
    {
        // Score range check
        if (score < minimumScoreToRaise || score > maximumScoreToRaise)
            return false;
            
        // Game state check
        if (gameIsActive != null && !gameIsActive.Value)
            return false;
            
        // Level restriction check
        if (allowedLevels != null && allowedLevels.Length > 0 && currentLevel != null)
        {
            if (!System.Array.Exists(allowedLevels, level => level == currentLevel.Value))
                return false;
        }
        
        return true;
    }
    
    protected override void OnEventRaised(int score)
    {
        base.OnEventRaised(score);
        
        // Additional logic for score milestones
        CheckScoreMilestones(score);
    }
    
    private void CheckScoreMilestones(int score)
    {
        // Could raise additional events for achievements
        if (score >= 1000 && score < 1100) // First time hitting 1000+
        {
            // Raise achievement event
        }
    }
}
```

## Integration with SoapKit Debugging

### Making Events Debug-Friendly

Ensure your custom events work well with SoapKit's debugging tools:

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Debug-Friendly Event")]
public class DebugFriendlyEvent : GameEvent<ComplexData>
{
    // Implement ToString for better debug display
    protected override string GetDebugString(ComplexData data)
    {
        return $"ComplexData(id: {data.id}, value: {data.value}, active: {data.isActive})";
    }
    
    // Provide debug information
    protected override void OnEventRaised(ComplexData data)
    {
        base.OnEventRaised(data);
        
        #if UNITY_EDITOR && SOAP_DEBUG
        // Additional debug information in editor
        UnityEngine.Debug.Log($"[{name}] Raised with data: {GetDebugString(data)}");
        UnityEngine.Debug.Log($"[{name}] Listener count: {ListenerCount}");
        #endif
    }
    
    // Custom editor validation
    #if UNITY_EDITOR
    protected override void OnValidate()
    {
        base.OnValidate();
        
        // Custom validation logic
        if (string.IsNullOrEmpty(name))
        {
            Debug.LogWarning($"Event {GetInstanceID()} has no name set");
        }
    }
    #endif
}
```

### Performance Considerations

For high-frequency events, optimize for performance:

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/High Frequency Event")]
public class HighFrequencyEvent : GameEvent<Vector3>
{
    [Header("Performance Settings")]
    [SerializeField] private bool enableThrottling = true;
    [SerializeField] private float throttleInterval = 0.016f; // ~60fps
    [SerializeField] private bool enableBatching = true;
    
    private float lastRaiseTime;
    private Vector3 batchedValue;
    private bool hasBatchedValue;
    
    public override void Raise(Vector3 position)
    {
        if (enableThrottling)
        {
            float currentTime = Time.unscaledTime;
            
            if (enableBatching)
            {
                // Batch multiple raises within the throttle interval
                batchedValue = position;
                hasBatchedValue = true;
                
                if (currentTime - lastRaiseTime >= throttleInterval)
                {
                    if (hasBatchedValue)
                    {
                        base.Raise(batchedValue);
                        lastRaiseTime = currentTime;
                        hasBatchedValue = false;
                    }
                }
            }
            else
            {
                // Simple throttling
                if (currentTime - lastRaiseTime >= throttleInterval)
                {
                    base.Raise(position);
                    lastRaiseTime = currentTime;
                }
            }
        }
        else
        {
            base.Raise(position);
        }
    }
    
    // Ensure batched events are sent on disable
    void OnDisable()
    {
        if (enableBatching && hasBatchedValue)
        {
            base.Raise(batchedValue);
            hasBatchedValue = false;
        }
    }
}
```

## Testing Custom Events

### Unit Testing Framework

```csharp
using NUnit.Framework;
using UnityEngine;

[TestFixture]
public class CustomEventTests
{
    private PlayerStatsGameEvent testEvent;
    private bool eventWasRaised;
    private PlayerStats receivedStats;
    
    [SetUp]
    public void Setup()
    {
        testEvent = ScriptableObject.CreateInstance<PlayerStatsGameEvent>();
        eventWasRaised = false;
        receivedStats = default;
    }
    
    [TearDown]
    public void Teardown()
    {
        if (testEvent != null)
            ScriptableObject.DestroyImmediate(testEvent);
    }
    
    [Test]
    public void TestEventRaisesCorrectly()
    {
        // Arrange
        var testStats = new PlayerStats(100, 50, 5);
        testEvent.AddListener(OnTestEventRaised);
        
        // Act
        testEvent.Raise(testStats);
        
        // Assert
        Assert.IsTrue(eventWasRaised, "Event should have been raised");
        Assert.AreEqual(testStats.health, receivedStats.health);
        Assert.AreEqual(testStats.mana, receivedStats.mana);
        Assert.AreEqual(testStats.level, receivedStats.level);
    }
    
    [Test]
    public void TestEventValidation()
    {
        // Test custom validation logic
        var invalidStats = new PlayerStats(-10, -5, 0); // Invalid values
        
        // If your event has validation, test it
        Assert.IsFalse(testEvent.ValidateEventData(invalidStats));
    }
    
    private void OnTestEventRaised(PlayerStats stats)
    {
        eventWasRaised = true;
        receivedStats = stats;
    }
}
```

### Integration Testing

```csharp
[Test]
public void TestEventSystemIntegration()
{
    // Test event chain: Damage -> Health Change -> Death
    var damageEvent = ScriptableObject.CreateInstance<DamageEvent>();
    var healthChangeEvent = ScriptableObject.CreateInstance<IntGameEvent>();
    var deathEvent = ScriptableObject.CreateInstance<UnitGameEvent>();
    
    bool playerDied = false;
    deathEvent.AddListener(() => playerDied = true);
    
    // Create a test health system
    var healthSystem = new GameObject().AddComponent<HealthSystem>();
    // ... setup health system with events
    
    // Act - cause damage that should kill player
    var lethalDamage = new DamageData(1000, DamageType.Physical, null, healthSystem.gameObject, Vector3.zero);
    damageEvent.Raise(lethalDamage);
    
    // Assert
    Assert.IsTrue(playerDied, "Player should have died from lethal damage");
}
```

## Best Practices

### Event Naming

```csharp
// ✅ Good: Clear, descriptive names
OnPlayerHealthChanged
OnInventoryItemAdded
OnQuestCompleted
OnLevelTransitionStarted

// ❌ Bad: Vague or abbreviated names
OnHC  // What does HC mean?
PlayerEvent // Too generic
ItemChange // Unclear what changed
```

### Data Structure Design

```csharp
// ✅ Good: Immutable, serializable structs
[System.Serializable]
public struct QuestData
{
    public readonly string questId;
    public readonly string questName;
    public readonly QuestStatus status;
    public readonly float progress;
    
    public QuestData(string id, string name, QuestStatus status, float progress)
    {
        questId = id;
        questName = name;
        this.status = status;
        this.progress = Mathf.Clamp01(progress);
    }
}

// ❌ Bad: Mutable classes with no validation
public class BadQuestData
{
    public string questId; // Can be null
    public QuestStatus status; // Can be invalid
    public float progress; // Can be negative or > 1
}
```

### Performance Guidelines

```csharp
// ✅ Good: Lightweight, focused events
public struct MovementData
{
    public Vector3 position;
    public Vector3 velocity;
}

// ❌ Bad: Heavy events with unnecessary data
public class HeavyMovementData
{
    public Vector3 position;
    public Vector3 velocity;
    public Transform transform; // Heavy reference
    public Collider[] nearbyColliders; // Expensive array
    public Dictionary<string, object> metadata; // Unnecessary complexity
}
```

## Advanced Patterns

### Event Factories

Create events dynamically for modular systems:

```csharp
public static class EventFactory
{
    public static GameEvent<T> CreateEvent<T>(string eventName) where T : struct
    {
        var eventAsset = ScriptableObject.CreateInstance<GameEvent<T>>();
        eventAsset.name = eventName;
        
        #if UNITY_EDITOR
        // Save to assets in editor
        UnityEditor.AssetDatabase.CreateAsset(eventAsset, $"Assets/Events/Generated/{eventName}.asset");
        UnityEditor.AssetDatabase.SaveAssets();
        #endif
        
        return eventAsset;
    }
}
```

### Event Composition

Combine multiple events for complex scenarios:

```csharp
public class CompositeQuestEvent : MonoBehaviour
{
    [SerializeField] private QuestGameEvent onQuestStarted;
    [SerializeField] private QuestGameEvent onQuestUpdated;
    [SerializeField] private QuestGameEvent onQuestCompleted;
    
    public void RaiseQuestEvent(QuestData quest)
    {
        switch (quest.status)
        {
            case QuestStatus.Started:
                onQuestStarted.Raise(quest);
                break;
            case QuestStatus.InProgress:
                onQuestUpdated.Raise(quest);
                break;
            case QuestStatus.Completed:
                onQuestCompleted.Raise(quest);
                break;
        }
    }
}
```

---

Custom events are the key to extending SoapKit's power to match your specific game needs. By following these patterns and best practices, you'll create robust, performant events that integrate seamlessly with SoapKit's professional tooling ecosystem. 🎯✨

**Next Steps:**
- [Custom Variables](./custom-variables) - Create custom variable types
- [Advanced Patterns](./patterns) - Complex SOAP architecture patterns
- [Performance Optimization](./performance) - Optimize your SOAP systems
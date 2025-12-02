---
title: Events System
sidebar_position: 2
---

# Events System

The **Events System** is one of ScriptableObject Kit’s core pillars, offering a professional, type-safe event architecture that enables decoupled communication between systems while maintaining high performance and advanced debugging capabilities.


## Overview

Events are `ScriptableObject`-based channels that allow different parts of your game to communicate **without direct references**. Instead of components calling each other, they raise events that other systems can listen to.

### Key Benefits

- 🔧 **Decoupled Architecture** - No direct dependencies between systems
- 🔒 **Type Safety** - Full compile-time validation and IntelliSense
- ⚡ **Performance** - Lightweight, optimized for frequent usage
- 🧠 **Debuggable** - Built-in history tracking and monitoring tools
- 🧪 **Testable** - Easily raise events in unit tests and editor scripts


## Basic Usage

### Creating Events

Create events using the context menu:

```
Right-click in Project → Create → SoapKit → Events → [Type] Event
```

**Available Event Types:**

- `UnitGameEvent` — No parameters
- `BoolGameEvent`
- `IntGameEvent`
- `FloatGameEvent`
- `StringGameEvent`
- `Vector2GameEvent`
- `Vector3GameEvent`
- `Vector2IntGameEvent`
- `ColorGameEvent`
- `GameObjectGameEvent`
- `TransformGameEvent`


### Raising Events

**From MonoBehaviours:**

```csharp
public class PlayerController : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    [SerializeField] private IntGameEvent onScoreChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;

    void Update()
    {
        if (moved)
            onPlayerMoved.Raise(transform.position);
    }

    public void AddScore(int points)
    {
        score += points;
        onScoreChanged.Raise(score);
    }

    public void Die()
    {
        onPlayerDied.Raise(); // No parameters
    }
}
```

**From Scripts or Tests:**

```csharp
var eventAsset = ScriptableObject.CreateInstance<IntGameEvent>();
eventAsset.Raise(25);

Resources.Load<IntGameEvent>("Events/OnHealthChanged").Raise(50);
```


### Listening to Events

**Approach 1: AddListener / RemoveListener**

```csharp
public class HealthUI : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;

    void OnEnable()
    {
        onHealthChanged.AddListener(UpdateHealthBar);
        onPlayerDied.AddListener(ShowGameOver);
    }

    void OnDisable()
    {
        onHealthChanged?.RemoveListener(UpdateHealthBar);
        onPlayerDied?.RemoveListener(ShowGameOver);
    }

    private void UpdateHealthBar(int value) => healthSlider.value = value;
    private void ShowGameOver() => gameOverPanel.SetActive(true);
}
```

**Approach 2: Listener Components**

```csharp
public class AudioEventListener : MonoBehaviour
{
    [SerializeField] private StringGameEvent onSoundRequested;
    [SerializeField] private AudioSource audioSource;
    [SerializeField] private AudioClip[] soundClips;

    void OnEnable() => onSoundRequested.AddListener(PlaySound);
    void OnDisable() => onSoundRequested?.RemoveListener(PlaySound);

    private void PlaySound(string clipName)
    {
        var clip = Array.Find(soundClips, c => c.name == clipName);
        if (clip != null)
            audioSource.PlayOneShot(clip);
    }
}
```

## Advanced Patterns

### Event Chaining

```csharp
public class GameManager : MonoBehaviour
{
    [SerializeField] private UnitGameEvent onEnemyKilled;
    [SerializeField] private IntGameEvent onScoreChanged;
    [SerializeField] private UnitGameEvent onLevelComplete;

    private int enemiesKilled = 0;

    void OnEnable() => onEnemyKilled.AddListener(HandleKill);
    void OnDisable() => onEnemyKilled?.RemoveListener(HandleKill);

    private void HandleKill()
    {
        enemiesKilled++;
        onScoreChanged.Raise(enemiesKilled * 100);

        if (enemiesKilled >= 10)
            onLevelComplete.Raise();
    }
}
```

### Conditional Listeners

```csharp
public class PowerUpSystem : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private BoolVariable isPoweredUp;
    [SerializeField] private FloatVariable multiplier;

    void OnEnable() => onHealthChanged.AddListener(OnHealthChanged);

    private void OnHealthChanged(int health)
    {
        if (!isPoweredUp.Value) return;

        int bonus = Mathf.RoundToInt(health * multiplier.Value);
        Debug.Log($"Power-up bonus: {bonus}");
    }
}
```

### Event Aggregation

```csharp
public class ComboSystem : MonoBehaviour
{
    [SerializeField] private UnitGameEvent onJump;
    [SerializeField] private UnitGameEvent onAttack;
    [SerializeField] private UnitGameEvent onComboAchieved;

    private bool jumped, attacked;
    private float lastActionTime;
    private float comboWindow = 2f;

    void OnEnable()
    {
        onJump.AddListener(OnJump);
        onAttack.AddListener(OnAttack);
    }

    void OnJump() { jumped = true; lastActionTime = Time.time; CheckCombo(); }
    void OnAttack() { attacked = true; lastActionTime = Time.time; CheckCombo(); }

    void CheckCombo()
    {
        if (jumped && attacked && Time.time - lastActionTime < comboWindow)
        {
            onComboAchieved.Raise();
            jumped = attacked = false;
        }
    }
}
```

## Debugging & Testing

### Event History (Editor)

```csharp
#if UNITY_EDITOR
var history = onScoreChanged.GetEventHistory(10);
foreach (var entry in history)
    Debug.Log($"[{entry.timestamp}] Value: {entry.value}");
#endif
```

### Debug Window

Access via:

```
Tools → SoapKit → Debug Window
```

Features:

- 🔎 Real-time event monitoring
- 📊 Listener count and event stats
- 🧪 Manual test triggering
- 🕘 History of recent raises

### Inspector Info

Each event shows:

- **Listener Count**
- **Raise Count**
- **Last Raised**
- **Manual Raise Button**

##  Performance

### ✅ Do This

```csharp
private int cachedValue;

private void OnEnable() => onHealthChanged.AddListener(OnChanged);
private void OnDisable() => onHealthChanged?.RemoveListener(OnChanged);

private void OnChanged(int value)
{
    if (value == cachedValue) return;
    cachedValue = value;

    UpdateUI(value);
}
```

### ❌ Avoid This

```csharp
// Anti-pattern: expensive lookup & missing unsubscribe
void Start() => onHealthChanged.AddListener(OnChanged);

private void OnChanged(int value)
{
    FindObjectOfType<HealthBar>().Set(value); // Avoid this
}
```

### Benchmarks

| Method                  | Time per call |
|------------------------|---------------|
| `SendMessage` (Unity)  | ~2000 ns      |
| `UnityEvent`           | ~800 ns       |
| **SoapKit Event**      | **~200 ns** ⚡ |


## 🧪 Unit Testing

```csharp
[Test]
public void ShouldRaiseDeathEventWhenHealthZero()
{
    var healthEvent = ScriptableObject.CreateInstance<IntGameEvent>();
    var deathEvent = ScriptableObject.CreateInstance<UnitGameEvent>();
    var system = new GameObject().AddComponent<HealthSystem>();

    bool died = false;
    deathEvent.AddListener(() => died = true);

    healthEvent.Raise(0);

    Assert.IsTrue(died);
}
```

## 🧩 Common Event Use Cases

### State Transitions

```csharp
public class GameStateManager : MonoBehaviour
{
    [SerializeField] private GameStateGameEvent onStateChanged;
    private GameState current = GameState.Menu;

    public void ChangeState(GameState next)
    {
        if (next == current) return;

        var previous = current;
        current = next;

        onStateChanged.Raise(new GameStateData { previousState = previous, newState = next });
    }
}
```

### Resource Tracking

```csharp
public class ResourceManager : MonoBehaviour
{
    [SerializeField] private IntGameEvent onCoinsChanged;
    [SerializeField] private BoolGameEvent onCanAfford;

    public void Spend(int amount)
    {
        if (coins >= amount)
        {
            coins -= amount;
            onCoinsChanged.Raise(coins);
            onCanAfford.Raise(coins >= itemCost);
        }
    }
}
```

### Animation Integration

```csharp
public class AnimationEventBridge : MonoBehaviour
{
    [SerializeField] private UnitGameEvent onStart;
    [SerializeField] private UnitGameEvent onEnd;
    [SerializeField] private StringGameEvent onTrigger;

    public void OnAnimationStart() => onStart.Raise();
    public void OnAnimationEnd() => onEnd.Raise();
    public void OnAnimationTrigger(string name) => onTrigger.Raise(name);
}
```

---

## Custom Event Types

Create your own specialized event types for complex data structures and custom validation:

### Defining Custom Events

**Example: Player Action Event**
```csharp
// Define custom data structure
[System.Serializable]
public struct PlayerActionData
{
    public string actionName;
    public Vector3 position;
    public float intensity;
    public GameObject target;
}

// Create custom event type
[CreateAssetMenu(menuName = "SoapKit/Events/PlayerAction Event")]
public class PlayerActionEvent : GameEvent<PlayerActionData>
{
    // Custom validation for player actions
    protected override bool ValidateEventData(PlayerActionData data)
    {
        if (string.IsNullOrEmpty(data.actionName))
        {
            Debug.LogWarning("Player action name cannot be empty");
            return false;
        }
        
        if (data.intensity < 0f || data.intensity > 1f)
        {
            Debug.LogWarning("Player action intensity must be between 0 and 1");
            return false;
        }
        
        return true;
    }
    
    // Custom logging for debugging
    protected override void OnEventRaised(PlayerActionData data)
    {
        base.OnEventRaised(data);
        
        #if UNITY_EDITOR
        Debug.Log($"Player Action: {data.actionName} at {data.position} with intensity {data.intensity:F2}");
        #endif
    }
}
```

### Event Configuration

**Advanced Event Setup:**
```csharp
Name: OnHealthChanged
Type: IntGameEvent
Description: "Raised when player health changes"
Debug Mode: Enabled     // Show in debug window
History Size: 100       // Remember last 100 raises
Performance Tracking: Enabled  // Track performance metrics
```

**Event Categories:**
- **Gameplay**: Core game mechanics
- **UI**: User interface interactions  
- **Audio**: Sound and music triggers
- **System**: Low-level system events
- **Debug**: Development and testing events

### Event System Templates

**Complete Health System Events:**
```csharp
// Health system event collection
IntGameEvent: OnHealthChanged    // Health value updates
IntGameEvent: OnDamageTaken     // Damage amount
UnitGameEvent: OnPlayerDied     // Death notification
UnitGameEvent: OnPlayerHealed   // Healing notification
BoolGameEvent: OnCriticalHealth // Low health warning
```

**Inventory System Events:**
```csharp
StringGameEvent: OnItemAdded     // Item name added
StringGameEvent: OnItemRemoved   // Item name removed 
BoolGameEvent: OnInventoryFull   // Capacity reached
IntGameEvent: OnCountChanged     // Item count updates
GameObjectGameEvent: OnItemUsed  // Item object used
```

## Next Steps

- [Variables System](./variables.md) — Reactive data channels
- [Quick Guide](./quick-guide.md) — Common usage patterns
- [Debug Tools](../editor-tools/debug-window.md) — Live event analysis
- [Custom Events](../advanced/custom-events.md) — Define new event types

---

> The **Events System** is the backbone of SoapKit's architecture. Mastering events gives you the power to build flexible, testable, professional Unity systems — no tight coupling required.

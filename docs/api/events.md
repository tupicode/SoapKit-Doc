# Events API Reference

Complete API reference for ScriptableObject Kit's event system.

## Base Classes

### GameEvent&lt;T&gt;

The foundation class for all typed events in ScriptableObject Kit.

```csharp
[System.Serializable]
public abstract class GameEvent<T> : ScriptableObject, IGameEvent<T>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `ListenerCount` | `int` | Number of registered listeners |
| `EnableEventHistory` | `bool` | Whether to track event history (Editor only) |

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `AddListener(UnityAction<T> listener)` | `UnityAction<T> listener` | Adds event listener |
| `RemoveListener(UnityAction<T> listener)` | `UnityAction<T> listener` | Removes event listener |
| `Raise(T value)` | `T value` | Raises event with typed parameter |
| `RemoveAllListeners()` | - | Removes all registered listeners |
| `RaiseTestEvent()` | - | Context menu method for testing |

#### Editor Properties (Editor Only)

| Property | Type | Description |
|----------|------|-------------|
| `EventHistory` | `List<EventHistoryEntry>` | Historical event data |
| `EventsRaisedThisFrame` | `int` | Events raised in current frame |
| `TotalEventsRaised` | `long` | Total events raised since startup |

#### Editor Methods (Editor Only)

| Method | Description |
|--------|-------------|
| `ClearEventHistory()` | Clears event history |
| `GetEventFrequency()` | Returns events per second |

---

## Unit Events

### GameEvent

Parameter-less event for simple notifications.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Unit Event")]
public class GameEvent : ScriptableObject, IGameEvent
```

#### Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `AddListener(UnityAction listener)` | `UnityAction listener` | Adds parameter-less listener |
| `RemoveListener(UnityAction listener)` | `UnityAction listener` | Removes parameter-less listener |
| `Raise()` | - | Raises event without parameters |

#### Usage Example

```csharp
[SerializeField] private GameEvent onGameStart;
[SerializeField] private GameEvent onPlayerDeath;

private void Start()
{
    onGameStart.Raise();
}

private void OnEnable()
{
    onPlayerDeath.AddListener(HandlePlayerDeath);
}

private void OnDisable()
{
    onPlayerDeath.RemoveListener(HandlePlayerDeath);
}

private void HandlePlayerDeath()
{
    // Handle player death
}
```

---

## Primitive Event Types

### BoolGameEvent

Boolean event for state changes and toggles.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Bool Event")]
public class BoolGameEvent : GameEvent<bool>
```

#### Usage Example

```csharp
[SerializeField] private BoolGameEvent onGamePaused;

private void TogglePause()
{
    bool newPauseState = !isPaused;
    onGamePaused.Raise(newPauseState);
}

private void OnEnable()
{
    onGamePaused.AddListener(OnPauseStateChanged);
}

private void OnPauseStateChanged(bool isPaused)
{
    Time.timeScale = isPaused ? 0f : 1f;
}
```

### IntGameEvent

Integer event for scores, counters, and numeric IDs.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Int Event")]
public class IntGameEvent : GameEvent<int>
```

#### Usage Example

```csharp
[SerializeField] private IntGameEvent onScoreChanged;
[SerializeField] private IntGameEvent onHealthChanged;

private void AddScore(int points)
{
    onScoreChanged.Raise(points);
}

private void TakeDamage(int damage)
{
    onHealthChanged.Raise(-damage);
}
```

### FloatGameEvent

Float event for values, percentages, and measurements.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Float Event")]
public class FloatGameEvent : GameEvent<float>
```

#### Usage Example

```csharp
[SerializeField] private FloatGameEvent onVolumeChanged;
[SerializeField] private FloatGameEvent onProgressUpdated;

private void SetMasterVolume(float volume)
{
    onVolumeChanged.Raise(volume);
}

private void UpdateProgress(float percentage)
{
    onProgressUpdated.Raise(percentage);
}
```

### StringGameEvent

String event for messages, names, and text data.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/String Event")]
public class StringGameEvent : GameEvent<string>
```

#### Usage Example

```csharp
[SerializeField] private StringGameEvent onDialogueSpoken;
[SerializeField] private StringGameEvent onSceneChanged;

private void ShowDialogue(string text)
{
    onDialogueSpoken.Raise(text);
}

private void LoadScene(string sceneName)
{
    onSceneChanged.Raise(sceneName);
}
```

---

## Unity Type Events

### Vector2GameEvent

2D vector event for positions, UI coordinates, and directions.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Vector2 Event")]
public class Vector2GameEvent : GameEvent<Vector2>
```

#### Usage Example

```csharp
[SerializeField] private Vector2GameEvent onMouseClicked;
[SerializeField] private Vector2GameEvent onPlayerMoved2D;

private void HandleMouseClick()
{
    Vector2 mousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
    onMouseClicked.Raise(mousePos);
}
```

### Vector3GameEvent

3D vector event for positions, directions, and velocities.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Vector3 Event")]
public class Vector3GameEvent : GameEvent<Vector3>
```

#### Usage Example

```csharp
[SerializeField] private Vector3GameEvent onPlayerMoved;
[SerializeField] private Vector3GameEvent onObjectSpawned;

private void UpdatePlayerPosition(Vector3 newPosition)
{
    onPlayerMoved.Raise(newPosition);
}

private void SpawnObject(Vector3 spawnPoint)
{
    onObjectSpawned.Raise(spawnPoint);
}
```

### Vector2IntGameEvent

Integer 2D vector event for grid coordinates and tile positions.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Vector2Int Event")]
public class Vector2IntGameEvent : GameEvent<Vector2Int>
```

#### Usage Example

```csharp
[SerializeField] private Vector2IntGameEvent onTileSelected;
[SerializeField] private Vector2IntGameEvent onGridMoved;

private void SelectTile(int x, int y)
{
    Vector2Int tileCoord = new Vector2Int(x, y);
    onTileSelected.Raise(tileCoord);
}
```

### ColorGameEvent

Color event for visual effects and theme changes.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Color Event")]
public class ColorGameEvent : GameEvent<Color>
```

#### Usage Example

```csharp
[SerializeField] private ColorGameEvent onThemeColorChanged;
[SerializeField] private ColorGameEvent onPlayerColorSelected;

private void ChangeTheme(Color newThemeColor)
{
    onThemeColorChanged.Raise(newThemeColor);
}
```

### GameObjectGameEvent

GameObject event for object references and interactions.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/GameObject Event")]
public class GameObjectGameEvent : GameEvent<GameObject>
```

#### Usage Example

```csharp
[SerializeField] private GameObjectGameEvent onObjectInteracted;
[SerializeField] private GameObjectGameEvent onEnemyDefeated;

private void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Interactable"))
    {
        onObjectInteracted.Raise(other.gameObject);
    }
}
```

### TransformGameEvent

Transform event for transform references and spatial data.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Transform Event")]
public class TransformGameEvent : GameEvent<Transform>
```

#### Usage Example

```csharp
[SerializeField] private TransformGameEvent onTargetChanged;
[SerializeField] private TransformGameEvent onWaypointReached;

private void SetNewTarget(Transform target)
{
    onTargetChanged.Raise(target);
}
```

---

## Advanced Event Patterns

### Custom Event Types

Create custom events for complex data structures:

```csharp
[System.Serializable]
public class PlayerData
{
    public string playerName;
    public int level;
    public Vector3 position;
}

[CreateAssetMenu(menuName = "Game/Events/Player Event")]
public class PlayerDataEvent : GameEvent<PlayerData>
{
    [ContextMenu("Raise Test Player Event")]
    public override void RaiseTestEvent()
    {
        var testData = new PlayerData
        {
            playerName = "TestPlayer",
            level = 1,
            position = Vector3.zero
        };
        Raise(testData);
    }
}
```

### Event Chains

Chain events for complex workflows:

```csharp
public class GameFlowManager : MonoBehaviour
{
    [Header("Game Flow Events")]
    [SerializeField] private GameEvent onGameStart;
    [SerializeField] private GameEvent onLevelLoaded;
    [SerializeField] private GameEvent onPlayerReady;
    [SerializeField] private GameEvent onGameplayStart;
    
    private void OnEnable()
    {
        onGameStart.AddListener(StartLevel);
        onLevelLoaded.AddListener(InitializePlayer);
        onPlayerReady.AddListener(BeginGameplay);
    }
    
    private void StartLevel() => onLevelLoaded.Raise();
    private void InitializePlayer() => onPlayerReady.Raise();
    private void BeginGameplay() => onGameplayStart.Raise();
}
```

### Conditional Events

Implement conditional event raising:

```csharp
public class ConditionalEventRaiser : MonoBehaviour
{
    [SerializeField] private BoolVariable canTrigger;
    [SerializeField] private IntVariable triggerCount;
    [SerializeField] private GameEvent conditionalEvent;
    
    public void TryRaiseEvent()
    {
        if (canTrigger.Value && triggerCount.Value > 0)
        {
            conditionalEvent.Raise();
            triggerCount.Subtract(1);
        }
    }
}
```

---

## Performance Considerations

### Listener Management

#### Efficient Subscription Pattern

```csharp
public class EfficientEventListener : MonoBehaviour
{
    [SerializeField] private GameEvent[] criticalEvents;
    
    private void OnEnable()
    {
        foreach (var evt in criticalEvents)
        {
            evt?.AddListener(HandleCriticalEvent);
        }
    }
    
    private void OnDisable()
    {
        foreach (var evt in criticalEvents)
        {
            evt?.RemoveListener(HandleCriticalEvent);
        }
    }
    
    private void HandleCriticalEvent()
    {
        // Lightweight handling only
        StartCoroutine(HandleEventAsync());
    }
    
    private IEnumerator HandleEventAsync()
    {
        yield return null; // Defer heavy work
        // Heavy processing here
    }
}
```

### Event Frequency Monitoring

```csharp
public class EventPerformanceMonitor : MonoBehaviour
{
    [SerializeField] private GameEvent[] monitoredEvents;
    
    private void Update()
    {
        foreach (var evt in monitoredEvents)
        {
            if (evt.EventsRaisedThisFrame > 10)
            {
                Debug.LogWarning($"High frequency event: {evt.name} raised {evt.EventsRaisedThisFrame} times this frame");
            }
        }
    }
}
```

---

## Debugging and Testing

### Event History Analysis

```csharp
#if UNITY_EDITOR
public class EventHistoryAnalyzer : MonoBehaviour
{
    [SerializeField] private GameEvent targetEvent;
    
    [ContextMenu("Analyze Event History")]
    private void AnalyzeEventHistory()
    {
        if (targetEvent == null || targetEvent.EventHistory == null) return;
        
        Debug.Log($"Event {targetEvent.name} History:");
        Debug.Log($"Total Events: {targetEvent.EventHistory.Count}");
        
        if (targetEvent.EventHistory.Count > 0)
        {
            var recent = targetEvent.EventHistory.TakeLast(5);
            Debug.Log("Recent events:");
            foreach (var entry in recent)
            {
                Debug.Log($"  {entry.timestamp}: {entry.parameters}");
            }
        }
    }
}
#endif
```

### Automated Event Testing

```csharp
[System.Serializable]
public class EventTest
{
    public GameEvent eventToTest;
    public float interval = 1f;
    public bool enabled = true;
}

public class EventTester : MonoBehaviour
{
    [SerializeField] private EventTest[] eventTests;
    
    private void Start()
    {
        foreach (var test in eventTests)
        {
            if (test.enabled && test.eventToTest != null)
            {
                InvokeRepeating(nameof(RaiseTestEvent), 0f, test.interval);
            }
        }
    }
    
    private void RaiseTestEvent()
    {
        foreach (var test in eventTests)
        {
            if (test.enabled)
            {
                test.eventToTest.Raise();
            }
        }
    }
}
```

---

## Best Practices

### Event Design
1. Use specific event types instead of generic objects
2. Keep event parameters simple and focused
3. Avoid raising events in Update() loops without throttling
4. Use descriptive names for event assets

### Listener Management
1. Always pair AddListener with RemoveListener
2. Use OnEnable/OnDisable pattern for automatic cleanup
3. Keep event handlers lightweight and fast
4. Move heavy processing to coroutines or separate frames

### Performance
1. Monitor listener counts using debug tools
2. Avoid excessive event chaining
3. Use conditional logic to prevent unnecessary events
4. Profile event-heavy systems regularly

### Debugging
1. Enable event history during development
2. Use SoapKit Debug Window for real-time monitoring
3. Implement event testing utilities
4. Add validation for critical event flows

---

## See Also

- [Variables API Reference](./variables) - Variable system documentation
- [Editor Tools API](./editor-tools) - Development tools reference
- [Performance Guide](../advanced/performance) - Optimization techniques
- [Design Patterns](../advanced/patterns) - Event system patterns
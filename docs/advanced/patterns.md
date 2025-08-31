# Design Patterns

Common design patterns and best practices when using SoapKit in your Unity projects.

## Observer Pattern with Events

SoapKit's event system implements the Observer pattern, allowing for loose coupling between systems.

### Basic Observer Setup

```csharp
public class HealthSystem : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private GameEvent onPlayerDeath;
    
    private void Update()
    {
        if (playerHealth.Value <= 0)
        {
            onPlayerDeath.Raise();
        }
    }
}

public class UIHealthBar : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private Slider healthSlider;
    
    private void OnEnable()
    {
        playerHealth.OnValueChanged += UpdateHealthBar;
    }
    
    private void OnDisable()
    {
        playerHealth.OnValueChanged -= UpdateHealthBar;
    }
    
    private void UpdateHealthBar(int newHealth)
    {
        healthSlider.value = newHealth;
    }
}
```

## State Management Pattern

Use SoapKit variables to manage game state centrally.

### Game State Manager

```csharp
public class GameStateManager : MonoBehaviour
{
    [Header("Game State")]
    [SerializeField] private BoolVariable isGamePaused;
    [SerializeField] private BoolVariable isGameOver;
    [SerializeField] private IntVariable currentLevel;
    
    [Header("Events")]
    [SerializeField] private GameEvent onGameStart;
    [SerializeField] private GameEvent onGameEnd;
    [SerializeField] private BoolGameEvent onPauseToggle;
    
    private void Start()
    {
        InitializeGameState();
    }
    
    private void InitializeGameState()
    {
        isGamePaused.SetValue(false);
        isGameOver.SetValue(false);
        currentLevel.SetValue(1);
        
        onGameStart.Raise();
    }
    
    public void PauseGame()
    {
        bool newPauseState = !isGamePaused.Value;
        isGamePaused.SetValue(newPauseState);
        onPauseToggle.Raise(newPauseState);
    }
}
```

## Command Pattern with Events

Implement command pattern using events for action handling.

### Command System

```csharp
[CreateAssetMenu(menuName = "SoapKit/Events/Command Event")]
public class CommandEvent : GameEvent<ICommand>
{
    private Stack<ICommand> commandHistory = new Stack<ICommand>();
    
    public void ExecuteCommand(ICommand command)
    {
        command.Execute();
        commandHistory.Push(command);
        Raise(command);
    }
    
    public void UndoLastCommand()
    {
        if (commandHistory.Count > 0)
        {
            var lastCommand = commandHistory.Pop();
            lastCommand.Undo();
        }
    }
}

public interface ICommand
{
    void Execute();
    void Undo();
}
```

## Factory Pattern for Asset Creation

Create factory methods for consistent asset creation.

### Variable Factory

```csharp
public static class VariableFactory
{
    public static T CreateVariable<T>(string name, object initialValue) where T : ScriptableObject
    {
        var asset = ScriptableObject.CreateInstance<T>();
        asset.name = name;
        
        // Set initial value using reflection or specific methods
        if (asset is BaseVariable<object> variable)
        {
            variable.SetValue(initialValue);
        }
        
        return asset;
    }
}
```

## Mediator Pattern

Use events as mediators between systems.

### System Communication

```csharp
public class InventorySystem : MonoBehaviour
{
    [SerializeField] private IntGameEvent onItemCollected;
    [SerializeField] private IntGameEvent onItemUsed;
    
    private void OnEnable()
    {
        onItemCollected.AddListener(HandleItemCollected);
        onItemUsed.AddListener(HandleItemUsed);
    }
    
    private void OnDisable()
    {
        onItemCollected.RemoveListener(HandleItemCollected);
        onItemUsed.RemoveListener(HandleItemUsed);
    }
    
    private void HandleItemCollected(int itemId)
    {
        // Add item to inventory
        // Update UI
        // Save game state
    }
    
    private void HandleItemUsed(int itemId)
    {
        // Remove item from inventory
        // Apply item effects
        // Update UI
    }
}
```

## Data Binding Pattern

Implement two-way data binding with variables.

### UI Data Binding

```csharp
public class DataBinder : MonoBehaviour
{
    [SerializeField] private StringVariable playerName;
    [SerializeField] private InputField nameInput;
    
    private void Start()
    {
        // Bind variable to UI
        nameInput.text = playerName.Value;
        nameInput.onValueChanged.AddListener(OnNameChanged);
        
        // Bind UI to variable
        playerName.OnValueChanged += OnVariableChanged;
    }
    
    private void OnNameChanged(string newName)
    {
        playerName.SetValue(newName);
    }
    
    private void OnVariableChanged(string newName)
    {
        if (nameInput.text != newName)
        {
            nameInput.text = newName;
        }
    }
}
```

## Repository Pattern

Use ScriptableObjects as data repositories.

### Game Data Repository

```csharp
[CreateAssetMenu(menuName = "Data/Game Repository")]
public class GameDataRepository : ScriptableObject
{
    [Header("Player Data")]
    public IntVariable playerHealth;
    public IntVariable playerMana;
    public StringVariable playerName;
    
    [Header("Game Settings")]
    public FloatVariable masterVolume;
    public BoolVariable enableVSync;
    
    public void ResetToDefaults()
    {
        playerHealth.SetValue(100);
        playerMana.SetValue(50);
        playerName.SetValue("Player");
        masterVolume.SetValue(1.0f);
        enableVSync.SetValue(true);
    }
}
```

## Best Practices

1. **Single Responsibility**: Each ScriptableObject should have one clear purpose
2. **Loose Coupling**: Use events to communicate between unrelated systems
3. **Consistent Naming**: Follow naming conventions for assets and references
4. **Event Lifecycle**: Always pair AddListener with RemoveListener
5. **Validation**: Use constraints and validation in custom variables
6. **Documentation**: Add tooltips and help text to inspector fields

## Anti-Patterns to Avoid

1. **Direct References**: Avoid direct MonoBehaviour references between systems
2. **Event Spam**: Don't raise events in Update() loops without throttling
3. **Memory Leaks**: Always unsubscribe from events in OnDisable/OnDestroy
4. **Global State Abuse**: Don't make everything a ScriptableObject variable
5. **Complex Dependencies**: Keep dependency chains simple and traceable
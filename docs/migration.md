---
title: Migration Guide
sidebar_position: 9
---

# Migrating to SoapKit

This guide helps you migrate existing Unity projects to SoapKit's SOAP architecture. Whether you're coming from traditional Unity patterns, other event systems, or legacy architectures, we'll show you how to make the transition smoothly and incrementally.

## Migration Strategy

### Gradual Migration Approach

**✅ Recommended: Incremental Migration**

Don't try to convert everything at once. Instead, migrate system by system:

1. **Start with new features** - Implement new systems using SoapKit from day one
2. **Migrate high-value systems** - Convert systems that would benefit most from decoupling  
3. **Integrate gradually** - Connect legacy systems to SOAP systems through adapters
4. **Refactor incrementally** - Convert remaining systems over time

**❌ Avoid: Big Bang Migration**

Don't attempt to convert your entire project in one go - this leads to:
- Extended development downtime
- High risk of introducing bugs
- Team confusion and resistance
- Difficulty isolating migration issues

## Common Migration Scenarios

### From Traditional Unity Patterns

**Before: Direct Component References**
```csharp
// Legacy tightly-coupled approach
public class LegacyPlayer : MonoBehaviour
{
    public HealthBar healthBar;
    public AudioSource audioSource;
    public ParticleSystem damageEffect;
    public GameManager gameManager;
    
    private int health = 100;
    
    public void TakeDamage(int damage)
    {
        health -= damage;
        
        // Direct calls to other systems
        healthBar.UpdateHealth(health);
        audioSource.PlayOneShot(damageSound);
        damageEffect.Play();
        
        if (health <= 0)
            gameManager.PlayerDied();
    }
}
```

**After: SoapKit SOAP Architecture**
```csharp
// Modern decoupled approach
public class ModernPlayer : MonoBehaviour
{
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private IntGameEvent onDamageTaken;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    public void TakeDamage(int damage)
    {
        playerHealth.Subtract(damage);
        onDamageTaken.Raise(damage);
        
        if (playerHealth.Value <= 0)
            onPlayerDied.Raise();
    }
}

// Other systems listen independently
public class HealthBar : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private Slider healthSlider;
    
    void OnEnable() => onHealthChanged.AddListener(UpdateHealth);
    void OnDisable() => onHealthChanged.RemoveListener(UpdateHealth);
    
    private void UpdateHealth(int health)
    {
        healthSlider.value = health / 100f;
    }
}
```

### Migration Steps

**Step 1: Identify Coupling Points**
```csharp
// Analyze your legacy code to identify:
// 1. Direct component references
// 2. GetComponent calls across objects  
// 3. FindObjectOfType usage
// 4. Static method calls between systems
// 5. Singleton dependencies

// Example: Identify all places that need health information
public class CouplingAnalysis
{
    // Find all references like:
    GetComponent<HealthSystem>().currentHealth    // Direct coupling
    FindObjectOfType<Player>().health            // Indirect coupling
    GameManager.Instance.playerHealth            // Singleton coupling
    healthSystem.OnHealthChanged += Handler;     // Event coupling (good!)
}
```

**Step 2: Create SoapKit Assets**
```csharp
// Replace direct access with SoapKit variables
// Create > SoapKit > Variables > Int Variable → "PlayerHealth"
// Create > SoapKit > Events > Int Event → "OnHealthChanged"  
// Create > SoapKit > Events > Unit Event → "OnPlayerDied"
```

**Step 3: Create Adapter Layer**
```csharp
// Create adapters to bridge legacy and SOAP systems
public class LegacyToSOAPAdapter : MonoBehaviour
{
    [Header("Legacy References")]
    [SerializeField] private LegacyPlayer legacyPlayer;
    
    [Header("SOAP Integration")]
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntGameEvent onHealthChanged;
    
    void Start()
    {
        // Sync initial values
        playerHealth.SetValue(legacyPlayer.GetHealth());
        
        // Keep systems in sync
        legacyPlayer.OnHealthChanged += SyncToSOAP;
        playerHealth.OnValueChanged += SyncToLegacy;
    }
    
    void OnDestroy()
    {
        if (legacyPlayer != null)
            legacyPlayer.OnHealthChanged -= SyncToSOAP;
    }
    
    private void SyncToSOAP(int health)
    {
        playerHealth.SetValue(health);
        onHealthChanged.Raise(health);
    }
    
    private void SyncToLegacy(int health)
    {
        legacyPlayer.SetHealth(health);
    }
}
```

**Step 4: Migrate Systems Incrementally**
```csharp
// Convert one system at a time
// Start with systems that have many dependencies

// Before: HealthUI tightly coupled
public class LegacyHealthUI : MonoBehaviour
{
    private LegacyPlayer player;
    
    void Start()
    {
        player = FindObjectOfType<LegacyPlayer>();
    }
    
    void Update()
    {
        if (player != null)
            healthText.text = player.GetHealth().ToString();
    }
}

// After: HealthUI uses SOAP
public class SOAPHealthUI : MonoBehaviour
{
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private Text healthText;
    
    void OnEnable() => onHealthChanged.AddListener(UpdateHealth);
    void OnDisable() => onHealthChanged.RemoveListener(UpdateHealth);
    
    private void UpdateHealth(int health)
    {
        healthText.text = health.ToString();
    }
}
```

### From Unity Events

**Before: UnityEvents**
```csharp
// Legacy UnityEvent usage
public class LegacyEventSystem : MonoBehaviour
{
    [Header("Unity Events")]
    public UnityEvent<int> OnHealthChanged;
    public UnityEvent OnPlayerDied;
    
    private int health = 100;
    
    public void TakeDamage(int damage)
    {
        health -= damage;
        OnHealthChanged?.Invoke(health);
        
        if (health <= 0)
            OnPlayerDied?.Invoke();
    }
}
```

**After: SoapKit Events**
```csharp
// Modern SoapKit approach
public class SOAPEventSystem : MonoBehaviour
{
    [Header("SOAP Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    [Header("Variables")]
    [SerializeField] private IntVariable playerHealth;
    
    public void TakeDamage(int damage)
    {
        playerHealth.Subtract(damage);
        onHealthChanged.Raise(playerHealth.Value);
        
        if (playerHealth.Value <= 0)
            onPlayerDied.Raise();
    }
}
```

**Migration Bridge:**
```csharp
// Bridge UnityEvents to SoapKit during transition
public class UnityEventToSOAPBridge : MonoBehaviour
{
    [Header("Legacy Unity Events")]
    [SerializeField] private LegacyEventSystem legacySystem;
    
    [Header("SOAP Events")]
    [SerializeField] private IntGameEvent soapHealthChanged;
    [SerializeField] private UnitGameEvent soapPlayerDied;
    
    void Start()
    {
        // Bridge Unity Events to SOAP Events
        legacySystem.OnHealthChanged.AddListener(health => soapHealthChanged.Raise(health));
        legacySystem.OnPlayerDied.AddListener(() => soapPlayerDied.Raise());
    }
}
```

### From Singletons

**Before: Singleton Pattern**
```csharp
// Legacy Singleton approach
public class GameManager : MonoBehaviour
{
    public static GameManager Instance;
    
    [Header("Game State")]
    public int playerScore;
    public bool isGamePaused;
    public string currentLevel;
    
    void Awake()
    {
        if (Instance == null)
            Instance = this;
        else
            Destroy(gameObject);
    }
    
    public void AddScore(int points)
    {
        playerScore += points;
        // All systems access through GameManager.Instance.playerScore
    }
}

// Systems accessing singleton
public class ScoreUI : MonoBehaviour
{
    void Update()
    {
        // Tight coupling to singleton
        scoreText.text = GameManager.Instance.playerScore.ToString();
    }
}
```

**After: SoapKit Variables**
```csharp
// Modern distributed approach
public class ModernGameManager : MonoBehaviour
{
    [Header("SOAP Variables")]
    [SerializeField] private IntVariable playerScore;
    [SerializeField] private BoolVariable isGamePaused;
    [SerializeField] private StringVariable currentLevel;
    
    [Header("SOAP Events")]
    [SerializeField] private IntGameEvent onScoreChanged;
    
    public void AddScore(int points)
    {
        playerScore.Add(points);
        onScoreChanged.Raise(playerScore.Value);
    }
}

// Systems use SOAP variables
public class ModernScoreUI : MonoBehaviour
{
    [SerializeField] private IntGameEvent onScoreChanged;
    [SerializeField] private Text scoreText;
    
    void OnEnable() => onScoreChanged.AddListener(UpdateScore);
    void OnDisable() => onScoreChanged.RemoveListener(UpdateScore);
    
    private void UpdateScore(int score)
    {
        scoreText.text = score.ToString();
    }
}
```

**Migration Strategy for Singletons:**
```csharp
// Phase 1: Wrap singleton with SOAP
public class SingletonToSOAPAdapter : MonoBehaviour
{
    [Header("SOAP Variables")]
    [SerializeField] private IntVariable playerScore;
    [SerializeField] private BoolVariable isGamePaused;
    
    [Header("SOAP Events")]
    [SerializeField] private IntGameEvent onScoreChanged;
    
    void Start()
    {
        // Sync initial values from singleton
        playerScore.SetValue(GameManager.Instance.playerScore);
        isGamePaused.SetValue(GameManager.Instance.isGamePaused);
        
        // Keep in sync
        InvokeRepeating(nameof(SyncFromSingleton), 0f, 0.1f);
    }
    
    private void SyncFromSingleton()
    {
        if (playerScore.Value != GameManager.Instance.playerScore)
        {
            playerScore.SetValue(GameManager.Instance.playerScore);
            onScoreChanged.Raise(playerScore.Value);
        }
        
        if (isGamePaused.Value != GameManager.Instance.isGamePaused)
        {
            isGamePaused.SetValue(GameManager.Instance.isGamePaused);
        }
    }
}
```

## Migration Tools and Scripts

### Automated Migration Assistant

```csharp
#if UNITY_EDITOR
using UnityEngine;
using UnityEditor;

public class SOAPMigrationAssistant : EditorWindow
{
    [MenuItem("Tools/SoapKit/Migration Assistant")]
    public static void ShowWindow()
    {
        GetWindow<SOAPMigrationAssistant>("SOAP Migration Assistant");
    }
    
    void OnGUI()
    {
        GUILayout.Label("SoapKit Migration Assistant", EditorStyles.boldLabel);
        
        GUILayout.Space(10);
        
        if (GUILayout.Button("Scan for Direct Component References"))
        {
            ScanForDirectReferences();
        }
        
        if (GUILayout.Button("Find GetComponent<> Usage"))
        {
            FindGetComponentUsage();
        }
        
        if (GUILayout.Button("Detect Singleton Dependencies"))
        {
            DetectSingletonDependencies();
        }
        
        if (GUILayout.Button("Generate SOAP Assets from Legacy"))
        {
            GenerateSOAPAssetsFromLegacy();
        }
    }
    
    private void ScanForDirectReferences()
    {
        // Scan all MonoBehaviours for public component references
        var monoBehaviours = FindObjectsOfType<MonoBehaviour>();
        foreach (var mb in monoBehaviours)
        {
            var fields = mb.GetType().GetFields();
            foreach (var field in fields)
            {
                if (field.FieldType.IsSubclassOf(typeof(Component)) && 
                    field.IsPublic && 
                    field.GetValue(mb) != null)
                {
                    Debug.Log($"Direct reference found: {mb.name}.{field.Name} -> {field.FieldType.Name}");
                }
            }
        }
    }
    
    private void FindGetComponentUsage()
    {
        // Use reflection to find GetComponent usage in scripts
        Debug.Log("Scanning for GetComponent usage...");
        // Implementation would scan script files for GetComponent patterns
    }
    
    private void DetectSingletonDependencies()
    {
        // Detect singleton pattern usage
        Debug.Log("Scanning for singleton dependencies...");
        // Implementation would find static Instance properties
    }
    
    private void GenerateSOAPAssetsFromLegacy()
    {
        // Generate SOAP assets based on detected dependencies
        Debug.Log("Generating SOAP assets...");
        // Implementation would create Variables and Events
    }
}
#endif
```

### Legacy System Wrapper

```csharp
// Generic wrapper for legacy systems
public class LegacySystemWrapper<T> : MonoBehaviour where T : MonoBehaviour
{
    [Header("Legacy System")]
    [SerializeField] private T legacySystem;
    
    [Header("SOAP Integration")]
    [SerializeField] private List<VariableWrapper> variableWrappers;
    [SerializeField] private List<EventWrapper> eventWrappers;
    
    void Start()
    {
        InitializeWrappers();
    }
    
    private void InitializeWrappers()
    {
        foreach (var wrapper in variableWrappers)
        {
            wrapper.Initialize(legacySystem);
        }
        
        foreach (var wrapper in eventWrappers)
        {
            wrapper.Initialize(legacySystem);
        }
    }
}

[System.Serializable]
public class VariableWrapper
{
    public string legacyFieldName;
    public IntVariable soapVariable;
    
    public void Initialize(MonoBehaviour legacySystem)
    {
        // Use reflection to sync legacy field with SOAP variable
        var field = legacySystem.GetType().GetField(legacyFieldName);
        if (field != null && field.FieldType == typeof(int))
        {
            int value = (int)field.GetValue(legacySystem);
            soapVariable.SetValue(value);
        }
    }
}
```

## Testing During Migration

### Validation Strategy

```csharp
// Ensure legacy and SOAP systems stay in sync during migration
public class MigrationValidator : MonoBehaviour
{
    [Header("Systems to Validate")]
    [SerializeField] private LegacyPlayer legacyPlayer;
    [SerializeField] private IntVariable soapPlayerHealth;
    
    void Update()
    {
        ValidateHealthSync();
    }
    
    private void ValidateHealthSync()
    {
        int legacyHealth = legacyPlayer.GetHealth();
        int soapHealth = soapPlayerHealth.Value;
        
        if (legacyHealth != soapHealth)
        {
            Debug.LogError($"Health sync error! Legacy: {legacyHealth}, SOAP: {soapHealth}");
        }
    }
}
```

### A/B Testing Framework

```csharp
// Test both legacy and SOAP versions side by side
public class MigrationABTest : MonoBehaviour
{
    [Header("Test Configuration")]
    [SerializeField] private bool useLegacySystem = false;
    [SerializeField] private bool useSOAPSystem = true;
    [SerializeField] private bool validateConsistency = true;
    
    [Header("Systems")]
    [SerializeField] private GameObject legacySystemRoot;
    [SerializeField] private GameObject soapSystemRoot;
    
    void Start()
    {
        legacySystemRoot.SetActive(useLegacySystem);
        soapSystemRoot.SetActive(useSOAPSystem);
        
        if (validateConsistency && useLegacySystem && useSOAPSystem)
        {
            StartCoroutine(ValidateConsistency());
        }
    }
    
    private System.Collections.IEnumerator ValidateConsistency()
    {
        while (true)
        {
            // Compare states between systems
            yield return new WaitForSeconds(1f);
        }
    }
}
```

## Team Migration Process

### Phase 1: Training & Setup (1-2 weeks)
- **Team Training**: SoapKit fundamentals workshop
- **Tool Setup**: Install SoapKit, configure Debug Window
- **Standards**: Establish naming conventions and asset organization
- **Pilot System**: Choose simple system for first migration

### Phase 2: Pilot Migration (1-2 weeks)  
- **Small System**: Migrate a simple, isolated system first
- **Team Review**: Code review focusing on SOAP patterns
- **Documentation**: Document lessons learned
- **Tools**: Create project-specific migration tools

### Phase 3: Incremental Migration (4-12 weeks)
- **System Priority**: Migrate high-value systems first  
- **Adapter Pattern**: Use adapters to maintain compatibility
- **Parallel Development**: New features use SOAP from day one
- **Regular Reviews**: Weekly migration progress reviews

### Phase 4: Legacy Cleanup (2-4 weeks)
- **Remove Adapters**: Replace adapter bridges with direct SOAP
- **Code Cleanup**: Remove unused legacy code
- **Performance Optimization**: Optimize SOAP system performance
- **Final Testing**: Comprehensive testing of migrated systems

### Phase 5: Team Mastery (Ongoing)
- **Advanced Patterns**: Implement advanced SOAP patterns
- **Custom Extensions**: Create project-specific SOAP extensions
- **Mentoring**: Senior developers mentor junior team members
- **Continuous Improvement**: Regular retrospectives and improvements

## Common Migration Challenges

### Challenge 1: Circular Dependencies

**Problem**: Legacy systems have circular references
```csharp
// Legacy circular dependency
public class PlayerSystem : MonoBehaviour
{
    public EnemySystem enemySystem; // Circular reference
}

public class EnemySystem : MonoBehaviour  
{
    public PlayerSystem playerSystem; // Circular reference
}
```

**Solution**: Break cycles with events
```csharp
// SOAP solution - no direct references
public class PlayerSystem : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    
    void Update()
    {
        if (hasMoved)
            onPlayerMoved.Raise(transform.position);
    }
}

public class EnemySystem : MonoBehaviour
{
    [SerializeField] private Vector3GameEvent onPlayerMoved;
    
    void OnEnable() => onPlayerMoved.AddListener(ReactToPlayerMovement);
    void OnDisable() => onPlayerMoved.RemoveListener(ReactToPlayerMovement);
    
    private void ReactToPlayerMovement(Vector3 playerPos)
    {
        // React to player movement
    }
}
```

### Challenge 2: Performance Concerns

**Problem**: Team worried about SOAP performance impact

**Solution**: Measure and demonstrate
```csharp
// Create performance comparison tool
public class PerformanceComparison : MonoBehaviour
{
    void Start()
    {
        CompareLegacyVsSOAP();
    }
    
    private void CompareLegacyVsSOAP()
    {
        // Measure legacy approach
        float legacyTime = MeasureLegacyPerformance();
        
        // Measure SOAP approach
        float soapTime = MeasureSOAPPerformance();
        
        Debug.Log($"Legacy: {legacyTime}ms, SOAP: {soapTime}ms");
        Debug.Log($"SOAP is {legacyTime/soapTime:F1}x faster");
    }
}
```

### Challenge 3: Team Resistance

**Problem**: Team members reluctant to change

**Solution**: Gradual adoption with clear benefits
- Start with volunteers and early adopters
- Show concrete improvements in debug tools
- Demonstrate reduced bugs and faster development
- Provide mentoring and support

**Success Metrics**:
- Reduced coupling between systems
- Faster iteration on features
- Fewer merge conflicts  
- Improved debugging capabilities
- Higher team satisfaction

## Migration Checklist

### Pre-Migration
- [ ] Team trained on SoapKit fundamentals
- [ ] Asset organization standards established
- [ ] Migration tools and scripts prepared
- [ ] Pilot system identified
- [ ] Success metrics defined

### During Migration  
- [ ] Systems migrated in priority order
- [ ] Adapters maintain compatibility
- [ ] Regular testing validates migration
- [ ] Team reviews provide feedback
- [ ] Documentation updated continuously

### Post-Migration
- [ ] All legacy code removed
- [ ] Performance benchmarks met
- [ ] Team comfortable with SOAP patterns
- [ ] Documentation complete
- [ ] Migration retrospective conducted

---

Migrating to SoapKit is a journey, not a destination. Take it one step at a time, measure your progress, and celebrate the improvements in code quality, team productivity, and debugging capabilities. The investment in migration pays dividends in long-term maintainability and development velocity! 🚀✨
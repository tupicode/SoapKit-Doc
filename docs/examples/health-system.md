---
title: Complete Health System
sidebar_position: 1
---

# Complete Health System Example

This comprehensive example demonstrates building a professional health system using SoapKit's full feature set. You'll learn how to create a scalable, debuggable health system that integrates seamlessly with UI, audio, effects, and other game systems.

## System Overview

Our health system will include:
- **Core Health Logic** - Damage, healing, death detection
- **Reactive UI** - Health bars, damage indicators, death screen
- **Audio Integration** - Damage sounds, death music, healing effects
- **Visual Effects** - Damage particles, screen effects, healing animations
- **Analytics** - Damage tracking, death statistics
- **Save/Load** - Persistent health state

![Health System Architecture](../../static/img/health-system-diagram.png)

## Assets Setup

First, let's create all the SoapKit assets we'll need:

### Variables
```
Create > SoapKit > Variables > Int Variable
- PlayerHealth (Initial: 100, Min: 0, Max: 100)
- MaxHealth (Initial: 100, Min: 1, Max: 1000)
- LastDamageAmount (Initial: 0, Min: 0, Max: 1000)

Create > SoapKit > Variables > Float Variable  
- HealthPercentage (Initial: 1.0, Min: 0.0, Max: 1.0)
- RegenRate (Initial: 2.0, Min: 0.0, Max: 50.0)
- LastDamageTime (Initial: 0.0)

Create > SoapKit > Variables > Bool Variable
- IsAlive (Initial: true)
- IsRegenerating (Initial: false)
- IsInvulnerable (Initial: false)
```

### Events
```
Create > SoapKit > Events > Int Event
- OnHealthChanged
- OnDamageTaken  
- OnHealthHealed
- OnMaxHealthChanged

Create > SoapKit > Events > Float Event
- OnHealthPercentageChanged

Create > SoapKit > Events > Unit Event
- OnPlayerDied
- OnPlayerRevived
- OnRegenStarted
- OnRegenStopped

Create > SoapKit > Events > String Event
- OnDamageType (for different damage effects)
```

## Core Health System

```csharp title="HealthSystem.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

public class HealthSystem : MonoBehaviour
{
    [Header("Health Variables")]
    [SerializeField] private IntVariable currentHealth;
    [SerializeField] private IntVariable maxHealth;
    [SerializeField] private IntVariable lastDamageAmount;
    [SerializeField] private FloatVariable healthPercentage;
    [SerializeField] private FloatVariable regenRate;
    [SerializeField] private FloatVariable lastDamageTime;
    
    [Header("State Variables")]
    [SerializeField] private BoolVariable isAlive;
    [SerializeField] private BoolVariable isRegenerating;
    [SerializeField] private BoolVariable isInvulnerable;
    
    [Header("Health Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private IntGameEvent onDamageTaken;
    [SerializeField] private IntGameEvent onHealthHealed;
    [SerializeField] private IntGameEvent onMaxHealthChanged;
    [SerializeField] private FloatGameEvent onHealthPercentageChanged;
    
    [Header("State Events")]
    [SerializeField] private UnitGameEvent onPlayerDied;
    [SerializeField] private UnitGameEvent onPlayerRevived;
    [SerializeField] private UnitGameEvent onRegenStarted;
    [SerializeField] private UnitGameEvent onRegenStopped;
    [SerializeField] private StringGameEvent onDamageType;
    
    [Header("Settings")]
    [SerializeField] private float regenDelay = 3f;
    [SerializeField] private bool enableAutoRegen = true;
    [SerializeField] private float invulnerabilityDuration = 1f;
    
    private Coroutine regenCoroutine;
    private Coroutine invulnerabilityCoroutine;
    
    void Start()
    {
        InitializeHealth();
        SubscribeToEvents();
    }
    
    void OnDestroy()
    {
        UnsubscribeFromEvents();
    }
    
    #region Initialization
    private void InitializeHealth()
    {
        // Set initial values
        currentHealth.SetValue(maxHealth.Value);
        UpdateHealthPercentage();
        isAlive.SetValue(true);
        isRegenerating.SetValue(false);
        isInvulnerable.SetValue(false);
        
        // Raise initial events
        onHealthChanged.Raise(currentHealth.Value);
        onHealthPercentageChanged.Raise(healthPercentage.Value);
    }
    
    private void SubscribeToEvents()
    {
        currentHealth.OnValueChanged += OnCurrentHealthChanged;
        maxHealth.OnValueChanged += OnMaxHealthChanged;
        isAlive.OnValueChanged += OnAliveStateChanged;
    }
    
    private void UnsubscribeFromEvents()
    {
        if (currentHealth != null) currentHealth.OnValueChanged -= OnCurrentHealthChanged;
        if (maxHealth != null) maxHealth.OnValueChanged -= OnMaxHealthChanged;
        if (isAlive != null) isAlive.OnValueChanged -= OnAliveStateChanged;
    }
    #endregion
    
    #region Public Interface
    public void TakeDamage(int damage, string damageType = "generic")
    {
        if (!isAlive.Value || isInvulnerable.Value || damage <= 0)
            return;
            
        // Store damage info
        lastDamageAmount.SetValue(damage);
        lastDamageTime.SetValue(Time.time);
        
        // Apply damage
        int newHealth = Mathf.Max(0, currentHealth.Value - damage);
        currentHealth.SetValue(newHealth);
        
        // Raise events
        onDamageTaken.Raise(damage);
        onDamageType.Raise(damageType);
        
        // Handle death
        if (newHealth <= 0)
        {
            Die();
        }
        else
        {
            // Start invulnerability frames
            StartInvulnerability();
            
            // Reset regeneration
            StopRegeneration();
            if (enableAutoRegen)
                StartRegeneration();
        }
    }
    
    public void Heal(int healAmount)
    {
        if (!isAlive.Value || healAmount <= 0)
            return;
            
        int newHealth = Mathf.Min(maxHealth.Value, currentHealth.Value + healAmount);
        int actualHealAmount = newHealth - currentHealth.Value;
        
        if (actualHealAmount > 0)
        {
            currentHealth.SetValue(newHealth);
            onHealthHealed.Raise(actualHealAmount);
        }
    }
    
    public void SetMaxHealth(int newMaxHealth)
    {
        if (newMaxHealth <= 0) return;
        
        int oldMax = maxHealth.Value;
        maxHealth.SetValue(newMaxHealth);
        
        // Adjust current health proportionally
        float healthRatio = (float)currentHealth.Value / oldMax;
        int newCurrentHealth = Mathf.RoundToInt(newMaxHealth * healthRatio);
        currentHealth.SetValue(newCurrentHealth);
        
        onMaxHealthChanged.Raise(newMaxHealth);
    }
    
    public void Revive(int reviveHealth = -1)
    {
        if (isAlive.Value) return;
        
        if (reviveHealth == -1)
            reviveHealth = maxHealth.Value;
            
        currentHealth.SetValue(Mathf.Min(reviveHealth, maxHealth.Value));
        isAlive.SetValue(true);
        
        onPlayerRevived.Raise();
    }
    
    public void SetInvulnerable(bool invulnerable)
    {
        isInvulnerable.SetValue(invulnerable);
    }
    #endregion
    
    #region Private Methods
    private void Die()
    {
        if (!isAlive.Value) return;
        
        isAlive.SetValue(false);
        StopRegeneration();
        
        onPlayerDied.Raise();
    }
    
    private void StartInvulnerability()
    {
        if (invulnerabilityCoroutine != null)
            StopCoroutine(invulnerabilityCoroutine);
            
        invulnerabilityCoroutine = StartCoroutine(InvulnerabilityCoroutine());
    }
    
    private System.Collections.IEnumerator InvulnerabilityCoroutine()
    {
        isInvulnerable.SetValue(true);
        yield return new WaitForSeconds(invulnerabilityDuration);
        isInvulnerable.SetValue(false);
    }
    
    private void StartRegeneration()
    {
        if (regenCoroutine != null)
            StopCoroutine(regenCoroutine);
            
        regenCoroutine = StartCoroutine(RegenerationCoroutine());
    }
    
    private void StopRegeneration()
    {
        if (regenCoroutine != null)
        {
            StopCoroutine(regenCoroutine);
            regenCoroutine = null;
        }
        
        if (isRegenerating.Value)
        {
            isRegenerating.SetValue(false);
            onRegenStopped.Raise();
        }
    }
    
    private System.Collections.IEnumerator RegenerationCoroutine()
    {
        yield return new WaitForSeconds(regenDelay);
        
        if (!isRegenerating.Value)
        {
            isRegenerating.SetValue(true);
            onRegenStarted.Raise();
        }
        
        while (currentHealth.Value < maxHealth.Value && isAlive.Value)
        {
            int healAmount = Mathf.RoundToInt(regenRate.Value * Time.deltaTime);
            if (healAmount > 0)
                Heal(healAmount);
                
            yield return null;
        }
        
        StopRegeneration();
    }
    
    private void UpdateHealthPercentage()
    {
        float percentage = maxHealth.Value > 0 ? (float)currentHealth.Value / maxHealth.Value : 0f;
        healthPercentage.SetValue(percentage);
    }
    #endregion
    
    #region Event Handlers
    private void OnCurrentHealthChanged(int newHealth)
    {
        UpdateHealthPercentage();
        onHealthChanged.Raise(newHealth);
    }
    
    private void OnMaxHealthChanged(int newMaxHealth)
    {
        UpdateHealthPercentage();
    }
    
    private void OnAliveStateChanged(bool alive)
    {
        if (!alive)
        {
            // Stop all health-related processes when dead
            StopRegeneration();
            if (invulnerabilityCoroutine != null)
            {
                StopCoroutine(invulnerabilityCoroutine);
                isInvulnerable.SetValue(false);
            }
        }
    }
    #endregion
    
    #region Public Properties (for debugging)
    public int CurrentHealth => currentHealth.Value;
    public int MaxHealth => maxHealth.Value;
    public float HealthPercentage => healthPercentage.Value;
    public bool IsAlive => isAlive.Value;
    public bool IsRegenerating => isRegenerating.Value;
    public bool IsInvulnerable => isInvulnerable.Value;
    #endregion
}
```

## UI Integration

```csharp title="HealthUI.cs"
using UnityEngine;
using UnityEngine.UI;
using FarmGrowthToolkit.Soap;

public class HealthUI : MonoBehaviour
{
    [Header("Health Variables")]
    [SerializeField] private IntVariable currentHealth;
    [SerializeField] private IntVariable maxHealth;
    [SerializeField] private FloatVariable healthPercentage;
    [SerializeField] private BoolVariable isAlive;
    [SerializeField] private BoolVariable isRegenerating;
    
    [Header("Health Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private IntGameEvent onDamageTaken;
    [SerializeField] private IntGameEvent onHealthHealed;
    [SerializeField] private UnitGameEvent onPlayerDied;
    [SerializeField] private UnitGameEvent onRegenStarted;
    [SerializeField] private UnitGameEvent onRegenStopped;
    
    [Header("UI References")]
    [SerializeField] private Slider healthSlider;
    [SerializeField] private Text healthText;
    [SerializeField] private Text maxHealthText;
    [SerializeField] private Image healthFill;
    [SerializeField] private Image regenIndicator;
    [SerializeField] private GameObject gameOverPanel;
    [SerializeField] private CanvasGroup damageFlash;
    [SerializeField] private CanvasGroup healFlash;
    
    [Header("UI Settings")]
    [SerializeField] private Color healthyColor = Color.green;
    [SerializeField] private Color warnColor = Color.yellow;
    [SerializeField] private Color dangerColor = Color.red;
    [SerializeField] private float flashDuration = 0.5f;
    [SerializeField] private AnimationCurve healthBarAnimation = AnimationCurve.EaseInOut(0, 0, 1, 1);
    
    private Coroutine healthBarCoroutine;
    private Coroutine damageFlashCoroutine;
    private Coroutine healFlashCoroutine;
    
    void OnEnable()
    {
        SubscribeToEvents();
        UpdateUI();
    }
    
    void OnDisable()
    {
        UnsubscribeFromEvents();
    }
    
    #region Event Subscription
    private void SubscribeToEvents()
    {
        onHealthChanged.AddListener(OnHealthChanged);
        onDamageTaken.AddListener(OnDamageTaken);
        onHealthHealed.AddListener(OnHealthHealed);
        onPlayerDied.AddListener(OnPlayerDied);
        onRegenStarted.AddListener(OnRegenStarted);
        onRegenStopped.AddListener(OnRegenStopped);
    }
    
    private void UnsubscribeFromEvents()
    {
        if (onHealthChanged != null) onHealthChanged.RemoveListener(OnHealthChanged);
        if (onDamageTaken != null) onDamageTaken.RemoveListener(OnDamageTaken);
        if (onHealthHealed != null) onHealthHealed.RemoveListener(OnHealthHealed);
        if (onPlayerDied != null) onPlayerDied.RemoveListener(OnPlayerDied);
        if (onRegenStarted != null) onRegenStarted.RemoveListener(OnRegenStarted);
        if (onRegenStopped != null) onRegenStopped.RemoveListener(OnRegenStopped);
    }
    #endregion
    
    #region Event Handlers
    private void OnHealthChanged(int newHealth)
    {
        UpdateUI();
        AnimateHealthBar();
    }
    
    private void OnDamageTaken(int damage)
    {
        ShowDamageFlash();
        // Could also show damage numbers here
    }
    
    private void OnHealthHealed(int healAmount)
    {
        ShowHealFlash();
        // Could also show heal numbers here
    }
    
    private void OnPlayerDied()
    {
        ShowGameOverPanel();
    }
    
    private void OnRegenStarted()
    {
        if (regenIndicator != null)
            regenIndicator.gameObject.SetActive(true);
    }
    
    private void OnRegenStopped()
    {
        if (regenIndicator != null)
            regenIndicator.gameObject.SetActive(false);
    }
    #endregion
    
    #region UI Updates
    private void UpdateUI()
    {
        // Update text
        if (healthText != null)
            healthText.text = currentHealth.Value.ToString();
            
        if (maxHealthText != null)
            maxHealthText.text = $"/ {maxHealth.Value}";
        
        // Update health fill color
        if (healthFill != null)
        {
            float percentage = healthPercentage.Value;
            if (percentage > 0.6f)
                healthFill.color = Color.Lerp(warnColor, healthyColor, (percentage - 0.6f) / 0.4f);
            else if (percentage > 0.3f)
                healthFill.color = Color.Lerp(dangerColor, warnColor, (percentage - 0.3f) / 0.3f);
            else
                healthFill.color = dangerColor;
        }
    }
    
    private void AnimateHealthBar()
    {
        if (healthSlider == null) return;
        
        if (healthBarCoroutine != null)
            StopCoroutine(healthBarCoroutine);
            
        healthBarCoroutine = StartCoroutine(AnimateHealthBarCoroutine());
    }
    
    private System.Collections.IEnumerator AnimateHealthBarCoroutine()
    {
        float startValue = healthSlider.value;
        float targetValue = healthPercentage.Value;
        float duration = 0.5f;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            float easedT = healthBarAnimation.Evaluate(t);
            
            healthSlider.value = Mathf.Lerp(startValue, targetValue, easedT);
            yield return null;
        }
        
        healthSlider.value = targetValue;
    }
    
    private void ShowDamageFlash()
    {
        if (damageFlash == null) return;
        
        if (damageFlashCoroutine != null)
            StopCoroutine(damageFlashCoroutine);
            
        damageFlashCoroutine = StartCoroutine(FlashCoroutine(damageFlash, flashDuration));
    }
    
    private void ShowHealFlash()
    {
        if (healFlash == null) return;
        
        if (healFlashCoroutine != null)
            StopCoroutine(healFlashCoroutine);
            
        healFlashCoroutine = StartCoroutine(FlashCoroutine(healFlash, flashDuration));
    }
    
    private System.Collections.IEnumerator FlashCoroutine(CanvasGroup flashGroup, float duration)
    {
        flashGroup.alpha = 1f;
        float elapsed = 0f;
        
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            flashGroup.alpha = Mathf.Lerp(1f, 0f, elapsed / duration);
            yield return null;
        }
        
        flashGroup.alpha = 0f;
    }
    
    private void ShowGameOverPanel()
    {
        if (gameOverPanel != null)
            gameOverPanel.SetActive(true);
    }
    #endregion
}
```

## Audio Integration

```csharp title="HealthAudioManager.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

public class HealthAudioManager : MonoBehaviour
{
    [Header("Events")]
    [SerializeField] private IntGameEvent onDamageTaken;
    [SerializeField] private IntGameEvent onHealthHealed;
    [SerializeField] private UnitGameEvent onPlayerDied;
    [SerializeField] private StringGameEvent onDamageType;
    [SerializeField] private FloatGameEvent onHealthPercentageChanged;
    
    [Header("Audio Sources")]
    [SerializeField] private AudioSource sfxSource;
    [SerializeField] private AudioSource musicSource;
    [SerializeField] private AudioSource ambientSource;
    
    [Header("Health Sounds")]
    [SerializeField] private AudioClip[] damageSounds;
    [SerializeField] private AudioClip[] healSounds;
    [SerializeField] private AudioClip deathSound;
    [SerializeField] private AudioClip criticalHealthMusic;
    [SerializeField] private AudioClip heartbeatSound;
    
    [Header("Damage Type Sounds")]
    [SerializeField] private DamageTypeSound[] damageTypeSounds;
    
    [Header("Settings")]
    [SerializeField] private float criticalHealthThreshold = 0.3f;
    [SerializeField] private float heartbeatVolume = 0.5f;
    
    private bool isPlayingCriticalMusic = false;
    private Coroutine heartbeatCoroutine;
    
    void OnEnable()
    {
        SubscribeToEvents();
    }
    
    void OnDisable()
    {
        UnsubscribeFromEvents();
    }
    
    #region Event Subscription
    private void SubscribeToEvents()
    {
        onDamageTaken.AddListener(OnDamageTaken);
        onHealthHealed.AddListener(OnHealthHealed);
        onPlayerDied.AddListener(OnPlayerDied);
        onDamageType.AddListener(OnDamageType);
        onHealthPercentageChanged.AddListener(OnHealthPercentageChanged);
    }
    
    private void UnsubscribeFromEvents()
    {
        if (onDamageTaken != null) onDamageTaken.RemoveListener(OnDamageTaken);
        if (onHealthHealed != null) onHealthHealed.RemoveListener(OnHealthHealed);
        if (onPlayerDied != null) onPlayerDied.RemoveListener(OnPlayerDied);
        if (onDamageType != null) onDamageType.RemoveListener(OnDamageType);
        if (onHealthPercentageChanged != null) onHealthPercentageChanged.RemoveListener(OnHealthPercentageChanged);
    }
    #endregion
    
    #region Event Handlers
    private void OnDamageTaken(int damage)
    {
        if (damageSounds.Length > 0 && sfxSource != null)
        {
            var randomSound = damageSounds[Random.Range(0, damageSounds.Length)];
            sfxSource.PlayOneShot(randomSound);
        }
    }
    
    private void OnHealthHealed(int healAmount)
    {
        if (healSounds.Length > 0 && sfxSource != null)
        {
            var randomSound = healSounds[Random.Range(0, healSounds.Length)];
            sfxSource.PlayOneShot(randomSound);
        }
    }
    
    private void OnPlayerDied()
    {
        StopCriticalHealthAudio();
        
        if (deathSound != null && sfxSource != null)
        {
            sfxSource.PlayOneShot(deathSound);
        }
    }
    
    private void OnDamageType(string damageType)
    {
        var typeSound = System.Array.Find(damageTypeSounds, x => x.damageType == damageType);
        if (typeSound != null && typeSound.sound != null && sfxSource != null)
        {
            sfxSource.PlayOneShot(typeSound.sound);
        }
    }
    
    private void OnHealthPercentageChanged(float percentage)
    {
        if (percentage <= criticalHealthThreshold)
        {
            StartCriticalHealthAudio();
        }
        else
        {
            StopCriticalHealthAudio();
        }
    }
    #endregion
    
    #region Critical Health Audio
    private void StartCriticalHealthAudio()
    {
        if (isPlayingCriticalMusic) return;
        
        isPlayingCriticalMusic = true;
        
        // Play critical health music
        if (criticalHealthMusic != null && musicSource != null)
        {
            musicSource.clip = criticalHealthMusic;
            musicSource.loop = true;
            musicSource.Play();
        }
        
        // Start heartbeat sound
        if (heartbeatCoroutine != null)
            StopCoroutine(heartbeatCoroutine);
        heartbeatCoroutine = StartCoroutine(HeartbeatCoroutine());
    }
    
    private void StopCriticalHealthAudio()
    {
        if (!isPlayingCriticalMusic) return;
        
        isPlayingCriticalMusic = false;
        
        // Stop critical music
        if (musicSource != null && musicSource.clip == criticalHealthMusic)
        {
            musicSource.Stop();
        }
        
        // Stop heartbeat
        if (heartbeatCoroutine != null)
        {
            StopCoroutine(heartbeatCoroutine);
            heartbeatCoroutine = null;
        }
    }
    
    private System.Collections.IEnumerator HeartbeatCoroutine()
    {
        while (isPlayingCriticalMusic)
        {
            if (heartbeatSound != null && ambientSource != null)
            {
                ambientSource.PlayOneShot(heartbeatSound, heartbeatVolume);
            }
            
            yield return new WaitForSeconds(1.2f); // Heartbeat interval
        }
    }
    #endregion
}

[System.Serializable]
public class DamageTypeSound
{
    public string damageType;
    public AudioClip sound;
}
```

## Debug Integration

```csharp title="HealthDebugger.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

#if UNITY_EDITOR
using UnityEditor;
#endif

public class HealthDebugger : MonoBehaviour
{
    [Header("References")]
    [SerializeField] private HealthSystem healthSystem;
    
    [Header("Debug Variables")]
    [SerializeField] private IntVariable debugDamageAmount;
    [SerializeField] private IntVariable debugHealAmount;
    [SerializeField] private StringVariable debugDamageType;
    
    [Header("Quick Test Values")]
    [SerializeField] private int quickDamage = 25;
    [SerializeField] private int quickHeal = 15;
    [SerializeField] private string quickDamageType = "debug";
    
    void Update()
    {
        if (!Application.isPlaying) return;
        
        // Keyboard shortcuts for testing
        if (Input.GetKeyDown(KeyCode.H))
            TestHeal();
            
        if (Input.GetKeyDown(KeyCode.J))
            TestDamage();
            
        if (Input.GetKeyDown(KeyCode.K))
            TestKill();
            
        if (Input.GetKeyDown(KeyCode.L))
            TestRevive();
    }
    
    #region Public Debug Methods
    [ContextMenu("Test Damage")]
    public void TestDamage()
    {
        if (healthSystem != null)
        {
            int damage = debugDamageAmount != null ? debugDamageAmount.Value : quickDamage;
            string damageType = debugDamageType != null ? debugDamageType.Value : quickDamageType;
            
            healthSystem.TakeDamage(damage, damageType);
            Debug.Log($"Debug: Applied {damage} {damageType} damage");
        }
    }
    
    [ContextMenu("Test Heal")]
    public void TestHeal()
    {
        if (healthSystem != null)
        {
            int heal = debugHealAmount != null ? debugHealAmount.Value : quickHeal;
            
            healthSystem.Heal(heal);
            Debug.Log($"Debug: Applied {heal} healing");
        }
    }
    
    [ContextMenu("Test Kill")]
    public void TestKill()
    {
        if (healthSystem != null)
        {
            healthSystem.TakeDamage(9999, "debug_kill");
            Debug.Log("Debug: Killed player");
        }
    }
    
    [ContextMenu("Test Revive")]
    public void TestRevive()
    {
        if (healthSystem != null)
        {
            healthSystem.Revive();
            Debug.Log("Debug: Revived player");
        }
    }
    
    [ContextMenu("Test Invulnerability")]
    public void TestInvulnerability()
    {
        if (healthSystem != null)
        {
            healthSystem.SetInvulnerable(!healthSystem.IsInvulnerable);
            Debug.Log($"Debug: Invulnerability {(healthSystem.IsInvulnerable ? "enabled" : "disabled")}");
        }
    }
    
    [ContextMenu("Log Health Status")]
    public void LogHealthStatus()
    {
        if (healthSystem != null)
        {
            Debug.Log($"Health Status: {healthSystem.CurrentHealth}/{healthSystem.MaxHealth} " +
                     $"({healthSystem.HealthPercentage:P0}) - Alive: {healthSystem.IsAlive} - " +
                     $"Regen: {healthSystem.IsRegenerating} - Invuln: {healthSystem.IsInvulnerable}");
        }
    }
    #endregion
    
    #region Editor GUI
    #if UNITY_EDITOR
    void OnGUI()
    {
        if (!Application.isPlaying) return;
        
        GUILayout.BeginArea(new Rect(10, 10, 200, 300));
        GUILayout.Label("Health System Debug", EditorStyles.boldLabel);
        
        if (healthSystem != null)
        {
            GUILayout.Label($"Health: {healthSystem.CurrentHealth}/{healthSystem.MaxHealth}");
            GUILayout.Label($"Percentage: {healthSystem.HealthPercentage:P1}");
            GUILayout.Label($"Alive: {healthSystem.IsAlive}");
            GUILayout.Label($"Regenerating: {healthSystem.IsRegenerating}");
            GUILayout.Label($"Invulnerable: {healthSystem.IsInvulnerable}");
            
            GUILayout.Space(10);
            
            if (GUILayout.Button("Damage 25"))
                TestDamage();
                
            if (GUILayout.Button("Heal 15"))
                TestHeal();
                
            if (GUILayout.Button("Kill"))
                TestKill();
                
            if (GUILayout.Button("Revive"))
                TestRevive();
                
            if (GUILayout.Button("Toggle Invuln"))
                TestInvulnerability();
        }
        else
        {
            GUILayout.Label("No HealthSystem found!");
        }
        
        GUILayout.EndArea();
    }
    #endif
    #endregion
}
```

## Scene Setup

### GameObject Hierarchy
```
Player
├── HealthSystem (HealthSystem script)
├── HealthDebugger (HealthDebugger script)
└── Audio
    ├── SFX (AudioSource for sound effects)
    ├── Music (AudioSource for music)
    └── Ambient (AudioSource for ambient sounds like heartbeat)

Canvas
├── HealthUI (HealthUI script)
├── HealthBar (UI Slider)
├── HealthText (UI Text)
├── DamageFlash (UI Image with CanvasGroup)
├── HealFlash (UI Image with CanvasGroup)
└── GameOverPanel (UI Panel)

Managers
└── HealthAudioManager (HealthAudioManager script)
```

### Variable Assignment
Connect all the ScriptableObject assets you created to the appropriate script fields in the inspector.

## Testing & Validation

### Manual Testing Checklist

**Basic Functionality:**
- ✅ Player takes damage correctly
- ✅ Health UI updates in real-time
- ✅ Damage sounds play
- ✅ Player dies at 0 health
- ✅ Death UI appears
- ✅ Player can be revived

**Edge Cases:**
- ✅ Damage while invulnerable is ignored
- ✅ Healing when at full health is ignored
- ✅ Negative damage values are handled
- ✅ Extremely large damage values work
- ✅ Regeneration stops when taking damage
- ✅ Regeneration starts after delay

**Integration Testing:**
- ✅ All systems react to health events
- ✅ Debug window shows all variables updating
- ✅ No memory leaks from event subscriptions
- ✅ Performance remains stable

### Automated Tests

```csharp title="HealthSystemTests.cs"
using NUnit.Framework;
using UnityEngine;
using FarmGrowthToolkit.Soap;

[TestFixture]
public class HealthSystemTests
{
    private GameObject testObject;
    private HealthSystem healthSystem;
    private IntVariable health;
    private IntVariable maxHealth;
    private UnitGameEvent onDied;
    
    [SetUp]
    public void Setup()
    {
        testObject = new GameObject("TestHealthSystem");
        healthSystem = testObject.AddComponent<HealthSystem>();
        
        health = ScriptableObject.CreateInstance<IntVariable>();
        maxHealth = ScriptableObject.CreateInstance<IntVariable>();
        onDied = ScriptableObject.CreateInstance<UnitGameEvent>();
        
        health.SetValue(100);
        maxHealth.SetValue(100);
        
        // Setup healthSystem with test variables
        // (This requires exposing fields or using reflection)
    }
    
    [TearDown]
    public void Teardown()
    {
        if (testObject != null)
            Object.DestroyImmediate(testObject);
            
        Object.DestroyImmediate(health);
        Object.DestroyImmediate(maxHealth);
        Object.DestroyImmediate(onDied);
    }
    
    [Test]
    public void TestBasicDamage()
    {
        // Arrange
        int initialHealth = 100;
        int damage = 25;
        
        // Act
        healthSystem.TakeDamage(damage);
        
        // Assert
        Assert.AreEqual(initialHealth - damage, health.Value);
        Assert.IsTrue(healthSystem.IsAlive);
    }
    
    [Test]
    public void TestDeath()
    {
        // Arrange
        bool playerDied = false;
        onDied.AddListener(() => playerDied = true);
        
        // Act
        healthSystem.TakeDamage(150); // More than max health
        
        // Assert
        Assert.AreEqual(0, health.Value);
        Assert.IsFalse(healthSystem.IsAlive);
        Assert.IsTrue(playerDied);
    }
    
    [Test]
    public void TestHealing()
    {
        // Arrange
        healthSystem.TakeDamage(50); // Health = 50
        
        // Act
        healthSystem.Heal(25);
        
        // Assert
        Assert.AreEqual(75, health.Value);
    }
    
    [Test]
    public void TestInvulnerability()
    {
        // Arrange
        healthSystem.SetInvulnerable(true);
        
        // Act
        healthSystem.TakeDamage(50);
        
        // Assert
        Assert.AreEqual(100, health.Value); // No damage taken
    }
}
```

## Performance Considerations

### Optimization Tips

**Event Frequency:**
```csharp
// ✅ Good: Only raise events when values actually change
private void OnCurrentHealthChanged(int newHealth)
{
    if (newHealth != healthPercentage.Value)
    {
        UpdateHealthPercentage();
        onHealthChanged.Raise(newHealth);
    }
}
```

**Memory Management:**
```csharp
// ✅ Good: Proper cleanup
void OnDestroy()
{
    // Stop all coroutines
    if (regenCoroutine != null)
        StopCoroutine(regenCoroutine);
        
    // Unsubscribe from events
    UnsubscribeFromEvents();
}
```

**UI Performance:**
```csharp
// ✅ Good: Update UI only when needed
private void OnHealthChanged(int newHealth)
{
    // Cache to avoid repeated calculations
    if (newHealth != cachedHealthValue)
    {
        cachedHealthValue = newHealth;
        UpdateUI();
    }
}
```

## Extensions & Variations

### Armor System Integration
```csharp
public void TakeDamage(int damage, string damageType = "generic")
{
    // Apply armor reduction before damage
    if (armorVariable != null)
    {
        damage = armorVariable.CalculateDamageReduction(damage, damageType);
    }
    
    // Proceed with normal damage logic...
}
```

### Multiple Health Types
```csharp
// Create separate health systems for:
// - Physical Health
// - Mental Health  
// - Stamina
// Each with their own variables, events, and regeneration
```

### Temporary Health Buffs
```csharp
public void AddTemporaryMaxHealth(int bonus, float duration)
{
    var originalMax = maxHealth.Value;
    SetMaxHealth(originalMax + bonus);
    
    StartCoroutine(RemoveTemporaryHealthAfterDelay(originalMax, duration));
}
```

---

This complete health system demonstrates SoapKit's power in creating professional, maintainable game systems. The decoupled architecture allows each component (UI, Audio, Effects) to operate independently while staying synchronized through events. 🎮💪

**Key Takeaways:**
- Variables provide centralized, debuggable state
- Events enable loose coupling between systems  
- Professional debugging tools accelerate development
- The system scales easily with new features
- Testing is straightforward with isolated components

**Next Steps:**
- [Inventory System Example](./inventory-system) - Build a complete inventory system
- [UI Integration Example](./ui-integration) - Advanced UI patterns with SoapKit
- [State Management Example](./state-management) - Game state architecture patterns
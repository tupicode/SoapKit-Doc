---
title: Getting Started
sidebar_position: 3
---

# Getting Started with SoapKit

Get up and running with SoapKit in under 10 minutes! This guide will walk you through installation, your first event and variable, and a complete working example.

## 📦 Installation

1. **Download from Asset Store**
   - Search for "SoapKit" in the Asset Store
   - Download and import the package

## ✅ Verify Installation

After installation, verify everything is working:

1. **Check Menu Items**
   - `Tools > SoapKit > Debug Window`
   - `Window > SoapKit > Asset Creator`

2. **Check Create Menu**
   - Right-click in Project window
   - `Create > SoapKit > Variables > Int Variable`
   - `Create > SoapKit > Events > Unit Event`

If you see these menu items, you're ready to go! 🎉

## 🎯 Your First 5 Minutes with SoapKit

Let's build a simple health system to understand the core concepts.

### Step 1: Create Your Assets

**Create a Health Variable:**
1. Right-click in your Project window
2. `Create > SoapKit > Variables > Int Variable`
3. Name it `PlayerHealth`
4. Set the value to `100` in the inspector

**Create Health Events:**
1. `Create > SoapKit > Events > Int Event`
2. Name it `OnHealthChanged`
3. `Create > SoapKit > Events > Unit Event`  
4. Name it `OnPlayerDied`

Your Project should now look like this:
```
Assets/
├── PlayerHealth (IntVariable)
├── OnHealthChanged (IntGameEvent)
└── OnPlayerDied (UnitGameEvent)
```

### Step 2: Create the Health System

Create a new script called `HealthSystem.cs`:

```csharp title="HealthSystem.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

public class HealthSystem : MonoBehaviour
{
    [Header("Health Configuration")]
    [SerializeField] private IntVariable health;
    [SerializeField] private IntVariable maxHealth;
    
    [Header("Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    void Start()
    {
        // Subscribe to health changes
        health.OnValueChanged += OnHealthValueChanged;
        
        // Initialize health
        if (maxHealth != null)
            health.SetValue(maxHealth.Value);
        else
            health.SetValue(100);
    }
    
    void OnDestroy()
    {
        // Always unsubscribe to prevent memory leaks
        if (health != null)
            health.OnValueChanged -= OnHealthValueChanged;
    }
    
    public void TakeDamage(int damage)
    {
        // Use built-in math operations
        health.Subtract(damage);
        
        // Check for death
        if (health.Value <= 0)
        {
            health.SetValue(0); // Clamp to 0
            onPlayerDied.Raise();
        }
    }
    
    public void Heal(int amount)
    {
        health.Add(amount);
        
        // Clamp to max health
        if (maxHealth != null && health.Value > maxHealth.Value)
            health.SetValue(maxHealth.Value);
    }
    
    private void OnHealthValueChanged(int newHealth)
    {
        // Raise event for UI and other systems
        onHealthChanged.Raise(newHealth);
        
        Debug.Log($"Health changed to: {newHealth}");
    }
}
```

### Step 3: Create the UI System

Create a script called `HealthUI.cs`:

```csharp title="HealthUI.cs"
using UnityEngine;
using UnityEngine.UI;
using FarmGrowthToolkit.Soap;

public class HealthUI : MonoBehaviour
{
    [Header("UI References")]
    [SerializeField] private Slider healthSlider;
    [SerializeField] private Text healthText;
    
    [Header("Health Variables")]
    [SerializeField] private IntVariable health;
    [SerializeField] private IntVariable maxHealth;
    
    [Header("Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    void Start()
    {
        // Subscribe to events
        onHealthChanged.AddListener(UpdateHealthUI);
        onPlayerDied.AddListener(OnPlayerDied);
        
        // Initialize UI
        UpdateHealthUI(health.Value);
    }
    
    void OnDestroy()
    {
        // Unsubscribe from events
        if (onHealthChanged != null)
            onHealthChanged.RemoveListener(UpdateHealthUI);
        if (onPlayerDied != null)
            onPlayerDied.RemoveListener(OnPlayerDied);
    }
    
    private void UpdateHealthUI(int currentHealth)
    {
        // Update slider
        if (healthSlider != null)
        {
            healthSlider.maxValue = maxHealth.Value;
            healthSlider.value = currentHealth;
        }
        
        // Update text
        if (healthText != null)
            healthText.text = $"{currentHealth} / {maxHealth.Value}";
    }
    
    private void OnPlayerDied()
    {
        Debug.Log("Game Over!");
        // Handle game over logic here
    }
}
```

### Step 4: Set Up the Scene

1. **Create the Health System GameObject:**
   - Create empty GameObject, name it "HealthSystem"
   - Add the `HealthSystem` component
   - Drag your created assets to the appropriate fields

2. **Create the UI:**
   - Create a Canvas (`UI > Canvas`)
   - Add a Slider (`UI > Slider`)
   - Add a Text element (`UI > Text`)
   - Create empty GameObject "HealthUI" with the `HealthUI` component
   - Connect the UI references and SoapKit assets

3. **Create Max Health Variable:**
   - `Create > SoapKit > Variables > Int Variable`
   - Name it `MaxHealth`, set to `100`
   - Assign it to both HealthSystem and HealthUI

### Step 5: Test Your System

**Add Debug Buttons** (Optional):

```csharp title="HealthDebugger.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

public class HealthDebugger : MonoBehaviour
{
    [SerializeField] private HealthSystem healthSystem;
    
    void Update()
    {
        // Test damage with 'D' key
        if (Input.GetKeyDown(KeyCode.D))
            healthSystem.TakeDamage(25);
            
        // Test healing with 'H' key
        if (Input.GetKeyDown(KeyCode.H))
            healthSystem.Heal(15);
    }
}
```

**Using the SoapKit Debug Window:**
1. `Tools > SoapKit > Debug Window`
2. Find your events in the "Events" tab
3. Click "Raise" to test events manually
4. Monitor variable values in real-time

## 🎉 Congratulations!

You've just built your first SoapKit system! Here's what you accomplished:

✅ **Decoupled Architecture**: Health system doesn't know about UI  
✅ **Event-Driven Design**: UI reacts to health changes automatically  
✅ **Data-Driven Configuration**: Health values controlled by ScriptableObjects  
✅ **Professional Debugging**: Real-time monitoring with Debug Window  

## 🚀 Next Steps

### Quick Wins (5-10 minutes each)

1. **[Explore Core Systems](./core-systems/events)** - Deep dive into Events and Variables
2. **[Try the Debug Window](./editor-tools/debug-window)** - Professional debugging tools
3. **[Check Examples](./examples/health-system)** - More complex real-world examples

### Build Something Bigger (30-60 minutes)

1. **Add Audio System:**
   ```csharp
   public class AudioSystem : MonoBehaviour 
   {
       [SerializeField] private IntGameEvent onHealthChanged;
       [SerializeField] private UnitGameEvent onPlayerDied;
       
       void Start() {
           onHealthChanged.AddListener(PlayHealthSound);
           onPlayerDied.AddListener(PlayDeathSound);
       }
       
       private void PlayHealthSound(int health) { /* Audio code */ }
       private void PlayDeathSound() { /* Death sound code */ }
   }
   ```

2. **Add Particle Effects:**
   ```csharp
   public class EffectsSystem : MonoBehaviour 
   {
       [SerializeField] private IntGameEvent onHealthChanged;
       
       void Start() {
           onHealthChanged.AddListener(ShowDamageEffect);
       }
       
       private void ShowDamageEffect(int health) { /* VFX code */ }
   }
   ```

3. **Add Save System:**
   ```csharp
   public class SaveSystem : MonoBehaviour 
   {
       [SerializeField] private IntVariable health;
       [SerializeField] private IntGameEvent onHealthChanged;
       
       void Start() {
           onHealthChanged.AddListener(SaveHealth);
           LoadHealth();
       }
       
       private void SaveHealth(int h) { PlayerPrefs.SetInt("Health", h); }
       private void LoadHealth() { health.SetValue(PlayerPrefs.GetInt("Health", 100)); }
   }
   ```

Notice how **each system is completely independent** but works together seamlessly! 🎯

## 💡 Pro Tips

### **Organization Best Practices**
```
Assets/
├── Data/
│   ├── Variables/
│   │   ├── Player/
│   │   └── Game/
│   └── Events/
│       ├── Player/
│       └── Game/
└── Scripts/
    ├── Systems/
    └── UI/
```

### **Naming Conventions**
- Variables: `PlayerHealth`, `MaxHealth`, `GameScore`
- Events: `OnHealthChanged`, `OnPlayerDied`, `OnLevelComplete`
- Use descriptive names that make the purpose clear

### **Performance Tips**
- Unsubscribe from events in `OnDestroy()`
- Use `OnEnable()`/`OnDisable()` for temporary listeners
- Group related events for better organization

## 🆘 Need Help?

### **Common Issues**

**Q: "Create > SoapKit menu is missing"**  
A: Reimport the package and check Unity console for errors

**Q: "Variables not updating in Inspector"**  
A: Make sure you're in Play Mode to see runtime values

**Q: "Events not firing"**  
A: Check that listeners are added in `Start()` or `OnEnable()`

**Q: "Memory leaks"**  
A: Always unsubscribe from events in `OnDestroy()`

### **Get Support**
- **[Troubleshooting Guide](./troubleshooting)** - Common issues and solutions
- **[Community Discord](https://discord.gg/soapkit)** - Get help from other developers  
- **[GitHub Issues](https://github.com/farmgrowth/soapkit/issues)** - Report bugs and feature requests
- **[API Documentation](./api/overview)** - Complete reference guide

---

**Ready to build professional Unity games?** Let's dive deeper into the [Core Systems](./core-systems/events)! 🎮
---
title: Getting Started
sidebar_position: 2
---

# Your First SoapKit System 🚀

Ready to experience the magic of decoupled game architecture? In the next 10 minutes, you'll build a complete health system that would make any senior developer proud.

<!-- ![Getting Started Hero](../static/img/getting-started-hero.png) -->

## Step 1: Installation

**From Unity Asset Store:**
1. Search for "SoapKit" 
2. Download and import
3. Let Unity refresh - grab some coffee ☕

**Verify Everything Works:**
- Check `Tools > SoapKit > Debug Window` exists
- Right-click in Project: `Create > SoapKit` should be there

If you see these menus, you're golden! 🎉

## Step 2: Create Your First Assets

Here's where SoapKit shines. Instead of hard-coding values in scripts, we create ScriptableObject assets that multiple systems can share.

**Create a Player Health Variable:**
1. Right-click in Project → `Create > SoapKit > Variables > Int Variable`
2. Name it `Player Health` 
3. In the Inspector, set Value to `100`

**Create Health Events:**
1. `Create > SoapKit > Events > Unit Event` → name it `On Player Died`
2. `Create > SoapKit > Events > Int Event` → name it `On Health Changed`

Your project now has shared data (the health variable) and communication channels (the events). Any script can reference these assets!

<!-- ![Assets Created](../static/img/assets-created.png) -->

## Step 3: Build the Health System

Time for the fun part. Create a new script called `HealthSystem.cs`:

```csharp title="HealthSystem.cs"
using UnityEngine;
using FarmGrowthToolkit.Soap;

public class HealthSystem : MonoBehaviour
{
    [Header("📊 Health Data")]
    [SerializeField] IntVariable playerHealth;
    
    [Header("📡 Events")]  
    [SerializeField] UnitGameEvent onPlayerDied;
    [SerializeField] IntGameEvent onHealthChanged;
    
    void Start()
    {
        // Listen for health changes
        playerHealth.OnValueChanged += HandleHealthChanged;
        
        // Set starting health
        playerHealth.SetValue(100);
    }
    
    public void TakeDamage(int damage)
    {
        playerHealth.Subtract(damage);  // SoapKit's built-in math!
    }
    
    public void Heal(int amount)
    {
        playerHealth.Add(amount);
        
        // Cap at 100
        if (playerHealth.Value > 100)
            playerHealth.SetValue(100);
    }
    
    void HandleHealthChanged(int newHealth)
    {
        onHealthChanged.Raise(newHealth);  // Tell everyone health changed
        
        if (newHealth <= 0)
            onPlayerDied.Raise();  // Tell everyone player died
        
        Debug.Log($"Player health: {newHealth}");
    }
    
    void OnDestroy()
    {
        // Always clean up event subscriptions!
        playerHealth.OnValueChanged -= HandleHealthChanged;
    }
}
```

Look how clean that is! No direct references to UI, audio, or any other systems. The health system just manages health and broadcasts what happened.

## Step 4: Add a UI System

Now let's create a UI that reacts to health changes automatically. Create `HealthUI.cs`:

```csharp title="HealthUI.cs"
using UnityEngine;
using UnityEngine.UI;
using FarmGrowthToolkit.Soap;

public class HealthUI : MonoBehaviour
{
    [Header("🎨 UI Components")]
    [SerializeField] Slider healthBar;
    [SerializeField] Text healthText;
    
    [Header("📡 Events to Listen To")]
    [SerializeField] IntGameEvent onHealthChanged;
    [SerializeField] UnitGameEvent onPlayerDied;
    
    void OnEnable()
    {
        // Subscribe to events - UI reacts automatically!
        onHealthChanged.AddListener(UpdateHealthDisplay);
        onPlayerDied.AddListener(ShowGameOver);
    }
    
    void OnDisable()
    {
        // Always clean up
        onHealthChanged.RemoveListener(UpdateHealthDisplay);
        onPlayerDied.RemoveListener(ShowGameOver);
    }
    
    void UpdateHealthDisplay(int newHealth)
    {
        healthBar.value = newHealth;
        healthText.text = $"Health: {newHealth}";
    }
    
    void ShowGameOver()
    {
        healthText.text = "GAME OVER";
        healthText.color = Color.red;
    }
}
```

Notice something cool? The UI system knows nothing about the health system, yet they work together perfectly through events!

## Step 5: Wire Everything Up

**Set up the Scene:**
1. Create an empty GameObject called "Health Manager"
2. Add your `HealthSystem` script 
3. Drag your SoapKit assets into the script fields

**Create Simple UI:**
1. Create a Canvas (`UI > Canvas`)
2. Add a Slider (`UI > Slider`) - set Max Value to 100
3. Add a Text element (`UI > Text`)
4. Create empty GameObject called "Health UI"
5. Add the `HealthUI` script and connect the UI references

**Connect the Events:**
- Drag the same event assets to both the Health System and Health UI
- This is the magic - shared events connect your systems!

<!-- ![Scene Setup](../static/img/scene-setup.png) -->

## Step 6: Test It Out! 

**Quick Testing with Keyboard:**
Add this simple script for testing:

```csharp title="HealthTester.cs"
using UnityEngine;

public class HealthTester : MonoBehaviour
{
    [SerializeField] HealthSystem healthSystem;
    
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.X))
            healthSystem.TakeDamage(25);  // Press X to take damage
            
        if (Input.GetKeyDown(KeyCode.Z))
            healthSystem.Heal(20);        // Press Z to heal
    }
}
```

**Or Use SoapKit's Debug Window:**
1. Open `Tools > SoapKit > Debug Window` 
2. Find your variables and events
3. Watch values change in real-time
4. Click events to test them instantly

Hit Play and press X a few times. Watch the magic happen! ✨

<!-- ![Debug Window in Action](../static/img/debug-window-demo.gif) -->

## 🎉 You Did It!

In just a few minutes, you built a professional-grade system architecture! Here's what makes this special:

✅ **Zero Dependencies** - Health system has no idea UI exists  
✅ **Automatic Updates** - UI responds instantly when health changes  
✅ **Designer Friendly** - Anyone can tweak values in the Inspector  
✅ **Easily Testable** - Each system works in isolation  
✅ **Infinitely Expandable** - Add new systems without changing existing code

## The "Aha!" Moment 💡

Here's what just clicked: **systems don't talk to each other directly**. They talk to shared data (Variables) and broadcast notifications (Events). It's like having a bulletin board that everyone can read and post to!

## What's Next?

### **Experiment Right Now (5 minutes):**
Try adding an audio system that plays a sound when health changes:

```csharp
public class HealthAudio : MonoBehaviour 
{
    [SerializeField] IntGameEvent onHealthChanged;
    [SerializeField] AudioSource audioSource;
    
    void OnEnable() {
        onHealthChanged.AddListener(PlayHealthSound);
    }
    
    void PlayHealthSound(int health) {
        audioSource.Play();  // Plays automatically when health changes!
    }
}
```

No changes to existing code needed! Just subscribe to the same events. 🎵

### **Level Up Your Skills:**
- **[🎯 Master Events & Variables](./core-systems/events)** - Deep dive into the core concepts
- **[🛠️ Build Real Systems](./examples/health-system)** - Complex examples with best practices  
- **[🔧 Debug Like a Pro](./editor-tools/debug-window)** - Professional debugging tools

### **Join the Community:**
- **Discord** - Get help and share your creations
- **GitHub** - Contribute and request features
- **Asset Store** - Leave a review if SoapKit helped you!

---

## 💭 What Just Happened?

You experienced the core philosophy of SoapKit: **systems that work together without being tangled together**. This isn't just cleaner code - it's a completely different way of thinking about game architecture.

Traditional approach: *"How do I make the UI know about the health system?"*  
SoapKit approach: *"How do I let any interested system know when health changes?"*

The difference is profound. With SoapKit, you're not building dependencies - you're building a communication network where systems can join and leave conversations naturally.

Welcome to professional game development! 🎮✨
---
title: Welcome to SoapKit
sidebar_position: 1
slug: /
---

# Build Better Unity Games 🎮

SoapKit brings **professional game architecture** to Unity through the power of ScriptableObjects. Instead of tangled spaghetti code, you get clean, maintainable systems that actually scale.

<!-- ![SoapKit Hero Image](../static/img/soapkit-hero.png) -->

## The Problem We Solve

Every Unity developer hits this wall: your game starts simple, but as features pile up, everything becomes connected to everything else. Adding new systems becomes a nightmare of dependencies, and debugging feels impossible.

```csharp
// This looks familiar, right? 😅
public class PlayerController : MonoBehaviour 
{
    public UIManager ui;           // For health bars
    public AudioManager audio;     // For sound effects  
    public EffectsManager vfx;     // For particle effects
    public GameManager game;       // For game state
    public SaveManager save;       // For persistence
    // ... and it keeps growing
}
```

## The SoapKit Way

What if systems could communicate without knowing about each other? What if adding new features didn't require touching existing code?

```csharp
// Clean, decoupled, maintainable ✨
public class PlayerController : MonoBehaviour 
{
    [SerializeField] IntVariable playerHealth;
    [SerializeField] IntGameEvent onDamageTaken;
    
    public void TakeDamage(int amount) 
    {
        playerHealth.Subtract(amount);
        onDamageTaken.Raise(amount);
        // UI, audio, VFX all react automatically!
    }
}
```

## Your First 5 Minutes

Ready to see the magic? Here's a complete health system in SoapKit:

```csharp
public class HealthSystem : MonoBehaviour
{
    [SerializeField] IntVariable playerHealth;
    [SerializeField] UnitGameEvent onPlayerDied;
    
    void Start()
    {
        playerHealth.SetValue(100);
        playerHealth.OnValueChanged += CheckForDeath;
    }
    
    public void TakeDamage(int damage)
    {
        playerHealth.Subtract(damage);  // Built-in math operations
    }
    
    void CheckForDeath(int health)
    {
        if (health <= 0) 
            onPlayerDied.Raise();  // Everyone listening reacts automatically
    }
}
```

That's it! Your UI, audio, VFX, and any other systems can listen to these events without creating dependencies.

<!-- ![Health System Demo](../static/img/health-system-demo.gif) -->

## What You Get

### 🎯 **Two Simple Building Blocks**

**Variables** - Shared data that systems can read and modify:
```csharp
playerHealth.Add(25);        // Built-in math operations
playerName.Append(" VIP");   // String operations  
playerColor.SetAlpha(0.5f);  // Type-specific helpers
```

**Events** - Notifications that systems can listen to:
```csharp
onPlayerDied.Raise();           // Notify everyone
onScoreChanged.Raise(newScore); // Pass data along
onLevelLoaded.Raise("Forest");  // Strongly typed
```

### 🔧 **Professional Tools**

<!-- ![Debug Window Screenshot](../static/img/debug-window.png) -->

- **Debug Window** - Watch variables change in real-time
- **Dependency Visualizer** - See how systems connect
- **Performance Analyzer** - Find bottlenecks instantly  
- **Asset Creator** - Generate SOAP assets quickly

### ⚡ **Built for Performance**

- Zero garbage collection during gameplay
- Faster than Unity's built-in events
- Optimized for mobile and console
- Production-tested architecture

## Why Developers Love SoapKit

### 🚀 **Faster Development**
- Add new systems without breaking existing code
- Test individual systems in isolation  
- Designers can tweak values without programmer involvement
- Parallel development - no more merge conflicts

### 🐛 **Easier Debugging**
- Watch all your game data in real-time
- See exactly which systems are connected
- Test events with one-click in the editor
- Track down issues with visual dependency graphs

### 📈 **Scales with Your Project**
Whether you're building a simple mobile game or a complex RPG, SoapKit grows with you:

```csharp
// Same health event, infinite possibilities
onPlayerDied.AddListener(ShowGameOverUI);     // UI System
onPlayerDied.AddListener(PlayDeathSound);     // Audio System  
onPlayerDied.AddListener(SpawnDeathEffect);   // VFX System
onPlayerDied.AddListener(SaveGameState);      // Save System
onPlayerDied.AddListener(TrackAnalytics);     // Analytics System
// Add more systems anytime - no code changes needed!
```

## Ready to Build Better Games?

SoapKit transforms how you think about game architecture. Instead of fighting against complex dependencies, you'll build systems that naturally work together.

### Your Learning Path 📚

**[🚀 Get Started](./getting-started)** - Install SoapKit and build your first system in 10 minutes

**[🎯 Master the Basics](./core-systems/events)** - Learn events and variables inside-out  

**[🛠️ Build Real Systems](./examples/health-system)** - Follow along with complete examples

**[🔧 Power User Tools](./editor-tools/debug-window)** - Professional debugging and visualization

**[🚀 Advanced Patterns](./advanced/custom-events)** - Custom implementations and optimization

---

### System Requirements

- Unity 2022.3 LTS or newer  
- Unity 6 fully supported
- All platforms (PC, Mobile, Console, WebGL)

### Community & Support

- **GitHub** - Issues, feature requests, and discussions  
- **Discord** - Real-time help from the community
- **Documentation** - Complete guides and API reference

---

**Let's build something amazing together!** 🎮✨
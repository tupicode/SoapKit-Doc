---
title: SoapKit Overview
sidebar_position: 1
slug: /
---

# SoapKit Documentation

Welcome to **SoapKit**, the professional **ScriptableObject Architecture Pattern (SOAP)** implementation for Unity. SoapKit provides a complete, production-ready framework for building decoupled, event-driven game systems using Unity's powerful ScriptableObject foundation.

## What is SoapKit?

SoapKit is a Unity package that implements the ScriptableObject Architecture Pattern, offering a modern approach to game architecture that emphasizes:

- **Decoupling**: Reduce dependencies between game systems
- **Data-Driven Design**: Use ScriptableObjects for configuration and communication
- **Event-Driven Architecture**: React to changes without tight coupling
- **Professional Tooling**: Advanced editor tools for debugging and visualization
- **Performance**: Optimized for production games

## Quick Start

```csharp title="Creating a Health System"
// 1. Create Variables (Create > SoapKit > Variables > Int Variable)
[SerializeField] private IntVariable playerHealth;
[SerializeField] private IntVariable maxHealth;

// 2. Create Events (Create > SoapKit > Events > Unit Event)  
[SerializeField] private UnitGameEvent onPlayerDied;

public class HealthSystem : MonoBehaviour
{
    void Start()
    {
        // Subscribe to health changes
        playerHealth.OnValueChanged += OnHealthChanged;
        
        // Set initial values
        maxHealth.SetValue(100);
        playerHealth.SetValue(100);
    }
    
    public void TakeDamage(int damage)
    {
        // Use built-in operations
        playerHealth.Subtract(damage);
        
        if (playerHealth.Value <= 0)
        {
            onPlayerDied.Raise(); // Notify all listeners
        }
    }
    
    private void OnHealthChanged(int newHealth)
    {
        Debug.Log($"Health changed to: {newHealth}");
    }
}
```

## Core Features

### **Events System**
Professional event system with type safety, debugging tools, and performance monitoring.

```csharp
// Create typed events for any data type
[SerializeField] private BoolGameEvent onGamePaused;
[SerializeField] private Vector3GameEvent onPlayerMoved;
[SerializeField] private StringGameEvent onPlayerNameChanged;
```

### **Variables System**
Smart variables with constraints, validation, and specialized operations.

```csharp
// Variables with built-in operations
playerScore.Add(100);           // Add to score
playerName.Append(" (VIP)");    // String operations
playerPosition.Normalize();     // Vector operations
playerColor.SetAlpha(0.5f);     // Color operations
```

### **Professional Editor Tools**
Industry-level debugging and visualization tools.

- **Debug Window**: Real-time monitoring and testing
- **Dependency Visualizer**: Interactive system relationship graphs
- **Performance Analyzer**: Bottleneck detection and optimization
- **Asset Creator**: Batch creation with templates
- **Hierarchy Overlay**: Visual connection indicators

## Architecture Benefits

SoapKit's architecture provides several key advantages over traditional approaches:

### Traditional Approach Problems
```csharp
// ❌ Tight coupling
public class PlayerHealth : MonoBehaviour 
{
    public UIHealthBar healthBar;     // Direct reference
    public GameManager gameManager;   // Direct reference
    public AudioSource audioSource;  // Direct reference
    
    void TakeDamage(int damage) 
    {
        health -= damage;
        healthBar.UpdateHealth(health);     // Tight coupling
        gameManager.CheckGameOver();        // Tight coupling
        audioSource.PlayOneShot(hurtSound); // Tight coupling
    }
}
```

### SoapKit Approach Benefits
```csharp
// ✅ Decoupled, flexible
public class PlayerHealth : MonoBehaviour 
{
    [SerializeField] private IntVariable health;
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private UnitGameEvent onPlayerDied;
    
    void TakeDamage(int damage) 
    {
        health.Subtract(damage);           // Update data
        onHealthChanged.Raise(health.Value); // Notify interested systems
        
        if (health.Value <= 0)
            onPlayerDied.Raise();          // Let systems react independently
    }
}
```

## Package Structure

```
Assets/SoapKit/
├── package.json              # UPM Package Manifest
├── Runtime/
│   ├── Events/               # GameEvent<T> implementations
│   │   ├── GameEvent.cs      # Base event system
│   │   ├── BoolGameEvent.cs  # Typed events
│   │   └── ...               # All Unity types covered
│   └── Variables/            # BaseVariable<T> implementations
│       ├── BaseVariable.cs   # Base variable system
│       ├── BoolVariable.cs   # Typed variables
│       └── ...               # All Unity types with operations
└── Examples/                 # Production-ready examples
    ├── Scripts/              # Complete system implementations
    └── Scenes/               # Demo scenes
```

## Unity Compatibility

- **Unity Version**: 2022.3 LTS or newer
- **Unity 6**: Full compatibility
- **Package Manager**: UPM compatible
- **Assembly Definition**: Clean compilation boundaries
- **Platforms**: All Unity-supported platforms

## Next Steps

1. **[Why Choose SoapKit?](./why-soapkit)** - Learn about the benefits and advantages
2. **[Getting Started](./getting-started)** - Installation and first steps
3. **[Core Systems](./core-systems/events)** - Deep dive into Events and Variables
4. **[Editor Tools](./editor-tools/debug-window)** - Professional debugging tools
5. **[Examples](./examples/health-system)** - Real-world implementations

---

Ready to transform your Unity project architecture? Let's get started! 🚀
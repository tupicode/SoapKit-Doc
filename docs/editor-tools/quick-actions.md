# Quick Actions

The **Quick Actions** menu provides instant access to the most commonly used SoapKit development tasks. These tools are designed for rapid project analysis, maintenance, and reporting during your development workflow.

## Overview

Quick Actions are accessible through the main SoapKit menu and provide one-click solutions for:
- Scene analysis and SOAP usage reporting
- Project-wide asset cleanup and maintenance  
- Comprehensive asset inventory and documentation

## Accessing Quick Actions

**Menu Path**: `Tools > SoapKit > Quick Actions`

All Quick Actions are also available in the SoapKit Debug Window for contextual access during debugging sessions.

---

## 🔍 Scan Current Scene

Instantly analyze the active scene for SOAP asset usage and integration complexity.

### What It Does
- Scans all GameObjects in the currently loaded scene
- Identifies GameObjects that reference SOAP assets (Variables or Events)
- Counts total SOAP connections across all objects
- Provides immediate overview of scene complexity

### Output Format
The scan results are logged to the Unity Console with this format:
```
🔍 Scene '[SceneName]' scan results:
GameObjects with SOAP: [X]
Total SOAP connections: [Y]
```

### Use Cases
- **Scene Complexity Assessment**: Understand how heavily a scene uses SOAP architecture
- **Performance Planning**: Identify scenes that may need performance optimization
- **Architecture Review**: Quick overview of SOAP adoption in specific scenes
- **Team Communication**: Generate quick stats for scene complexity discussions
- **Debugging**: Verify that SOAP assets are properly connected in scenes

### Example Results
```
🔍 Scene 'MainMenu' scan results:
GameObjects with SOAP: 12
Total SOAP connections: 28
```

This indicates 12 GameObjects have SOAP references, with an average of ~2.3 connections per object.

---

## 🧹 Clean Unused Assets

Opens the professional [Asset Cleaner](./asset-cleaner) window for safe identification and removal of unused SOAP assets.

### What It Does
- Launches the comprehensive Asset Cleaner interface
- Automatically begins scanning for unused SOAP assets
- Provides advanced selection and filtering capabilities
- Enables safe batch deletion with confirmation dialogs

### Key Features
- **Smart Detection**: Identifies truly unused SOAP assets across entire project
- **Visual Interface**: Professional selection interface with checkboxes and filters
- **Safe Deletion**: Double confirmation with detailed asset preview
- **Batch Operations**: Process multiple assets efficiently
- **Real-time Filtering**: Search and sort capabilities for large asset lists

### When to Use
- **Project Maintenance**: Regular cleanup of accumulated unused assets
- **Pre-Release**: Optimize project size before builds or submissions
- **Post-Refactoring**: Remove assets left behind after architectural changes
- **Team Transitions**: Clean up project before handoffs to new team members
- **Storage Optimization**: Reduce project size and repository bloat

### Safety Features
- Version control recommendations
- Double confirmation dialogs
- Detailed deletion reports
- Automatic asset database refresh
- Error handling for locked or protected files

For detailed usage instructions, see the [Asset Cleaner documentation](./asset-cleaner).

---

## 📋 List All SOAP Assets

Generate a comprehensive inventory report of all SOAP assets in your project.

### What It Does
- Scans entire project for SOAP Variables and Events
- Categorizes assets by type (Events vs Variables)  
- Displays specific type information for each asset
- Sorts results alphabetically for easy navigation
- Outputs detailed report to Unity Console

### Output Format
```
📊 SoapKit Assets Report

⚡ Events ([count]):
  • [EventName] ([EventType])
  • ...

📋 Variables ([count]):  
  • [VariableName] ([VariableType])
  • ...
```

### Example Output
```
📊 SoapKit Assets Report

⚡ Events (8):
  • OnGamePaused (BoolGameEvent)
  • OnHealthChanged (IntGameEvent)  
  • OnLevelCompleted (UnitGameEvent)
  • OnPlayerDied (UnitGameEvent)

📋 Variables (15):
  • GameIsPaused (BoolVariable)
  • PlayerHealth (IntVariable)
  • PlayerMana (IntVariable)
  • PlayerPosition (Vector3Variable)
  • PlayerSpeed (FloatVariable)
```

### Use Cases

#### Documentation & Auditing
- **Project Documentation**: Generate asset inventories for documentation
- **Code Reviews**: Provide comprehensive asset lists for review processes
- **Team Onboarding**: Help new team members understand project architecture
- **Asset Audits**: Regular inventory for project management and planning

#### Development Planning
- **Refactoring Planning**: Understand scope before architectural changes
- **Performance Analysis**: Identify potential optimization targets
- **Feature Planning**: See existing assets that could be reused
- **Naming Convention Review**: Ensure consistent asset naming across project

#### Project Management
- **Progress Tracking**: Monitor asset creation over development cycles
- **Scope Estimation**: Understand project complexity for planning
- **Resource Planning**: Identify areas that may need additional development
- **Quality Assurance**: Verify asset creation follows project standards

---

## Best Practices

### Regular Usage Patterns

**Daily Development**
- Use **Scan Current Scene** when working on specific scenes to understand complexity
- Quick sanity check before committing scene changes

**Weekly Maintenance**  
- Run **List All SOAP Assets** to review project growth and organization
- Check for naming inconsistencies or architectural drift

**Monthly Cleanup**
- Use **Clean Unused Assets** for regular project maintenance
- Remove accumulated prototype and experimental assets

**Pre-Release**
- Complete asset inventory with **List All SOAP Assets**
- Comprehensive cleanup with **Clean Unused Assets**
- Final scene analysis with **Scan Current Scene** for critical scenes

### Integration with Workflow

#### Version Control Integration
- Run Quick Actions before major commits to ensure clean state
- Include asset reports in pull request descriptions
- Use cleanup tools before merging feature branches

#### Team Collaboration
- Share asset inventory reports during team meetings
- Use scene scan results to discuss performance optimizations
- Coordinate asset cleanup activities across team members

#### Continuous Integration
- Include Quick Action reports in automated build processes
- Set up alerts for unexpected asset growth
- Automate unused asset detection as part of quality gates

## Keyboard Shortcuts

While Quick Actions don't have dedicated shortcuts, you can create custom shortcuts for frequently used actions:

```csharp
// Example: Custom shortcut for scene scanning
[MenuItem("Tools/Quick Scan Scene %&s")] // Ctrl+Alt+S
static void QuickScanScene()
{
    SOAPKitMenu.ScanCurrentScene();
}
```

## See Also

- [Asset Cleaner](./asset-cleaner) - Detailed asset cleanup documentation
- [Debug Window](./debug-window) - Real-time monitoring and debugging
- [Performance Analyzer](./performance-analyzer) - Performance optimization tools
- [Settings Window](./settings-window) - Configure SoapKit behavior
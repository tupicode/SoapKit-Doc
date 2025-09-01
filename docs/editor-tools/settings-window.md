# Settings Window

The SoapKit Settings Window provides a centralized interface for configuring performance settings, accessing tools, and managing editor behavior during development and gameplay.

## Opening the Settings Window

Access the Settings Window through multiple paths:

- **Window Menu**: `Window > SoapKit > Settings`
- **Tools Menu**: `Tools > SoapKit > ⚙️ Settings`
- **Debug Window**: Click the ⚙️ Settings button in the toolbar
- **Scene Overlay**: Use the "⚙️ Performance Settings" button

## Interface Overview

<div style={{textAlign: 'center'}}>
  <img src={require('@site/static/img/settings-window.png').default} alt="Settings Window Interface" style={{width: '400px'}} />
</div>

The Settings Window is organized into several sections:

### Performance Settings

Configure how SoapKit editor tools behave during different development phases:

#### Debug Window Settings
- **Disable Debug Window Updates During Play Mode**: Stops auto-refresh and live monitoring during gameplay to improve performance
- **Debug Refresh Interval**: Controls how often debug windows refresh their data (0.5-10 seconds)

#### Performance Monitoring Settings  
- **Disable Performance Monitoring During Play Mode**: Stops performance analyzer real-time updates during gameplay

### Tools Quick Access

Direct access buttons to all SoapKit editor tools:

```
🔍 Debug Window          📊 Performance Analyzer
🎯 Asset Creator         🔗 Dependency Visualizer
```

### Current Status

Real-time display of:
- **Play Mode Status**: Shows whether you're in Play Mode or Edit Mode
- **Performance Optimizations**: Lists which optimizations are currently active
- **Settings Changes**: Indicates when settings have been modified

### Preset Actions

Quick configuration presets for common scenarios:

#### 🚀 Performance Mode
Optimizes all settings for smooth gameplay:
- Disables debug window updates during play mode
- Disables performance monitoring during play mode  
- Sets refresh interval to 3 seconds

#### 🔧 Development Mode
Enables all debugging features:
- Enables all real-time monitoring
- Sets refresh interval to 1 second
- Full debugging capabilities active

#### Other Actions
- **🔄 Reset to Defaults**: Restores factory settings
- **💾 Export Settings**: Save current configuration to JSON file
- **📥 Import Settings**: Load configuration from JSON file

## Performance Impact

Understanding when and why to use different settings:

### During Development (Edit Mode)
- All tools are fully active
- Real-time monitoring provides immediate feedback
- Performance impact is minimal as game isn't running

### During Gameplay Testing (Play Mode)
- Performance optimizations automatically activate
- Debug tools reduce their update frequency
- Maintains smooth gameplay while preserving essential debugging

### Performance Comparison

| Setting | Edit Mode Impact | Play Mode Impact | Recommended Use |
|---------|------------------|------------------|-----------------|
| All Optimizations Enabled | None | Minimal | Production testing |
| Development Mode | Low | Medium | Active debugging |
| Default Settings | None | Low | General development |

## Settings Persistence

All settings are automatically saved and persist between Unity sessions using Unity's `EditorPrefs` system:

```csharp
// Settings are stored with the prefix "SoapKit_"
EditorPrefs.GetBool("SoapKit_DisableDebugDuringPlayMode", true);
```

## Import/Export

### Exporting Settings
1. Click **💾 Export Settings**
2. Choose save location
3. Settings saved as human-readable JSON

### Importing Settings
1. Click **📥 Import Settings**  
2. Select JSON file
3. Settings applied immediately

### Settings File Format

```json
{
  "disableDebugDuringPlay": true,
  "disablePerformanceDuringPlay": true,
  "refreshInterval": 2.0
}
```

## Visual Indicators

The Settings Window provides real-time visual feedback:

### Status Colors
- **🟢 Green**: Performance optimizations active
- **🟡 Yellow**: Settings recently changed
- **🔴 Red**: Tool actively consuming resources

### Icons and Badges
- **▶️**: Play Mode active
- **⏸️**: Edit Mode active  
- **✅**: Optimization enabled
- **🔥**: Tool running at full capacity

## Integration with Other Tools

### Debug Window Integration
- Settings button in toolbar provides quick access
- Performance mode indicator shows current state
- Live monitoring respects performance settings

### Performance Analyzer Integration  
- Monitoring automatically pauses based on settings
- Visual indicators show when monitoring is disabled
- Settings accessible from analyzer toolbar

## Best Practices

### For Solo Development
- Use **Development Mode** during active debugging
- Switch to **Performance Mode** for gameplay testing
- Export settings when finding optimal configuration

### For Team Development
- Share settings files across team members
- Document team-specific performance configurations
- Use consistent settings for build validation

### For Different Project Phases

#### Early Development
- Full monitoring enabled
- Low refresh intervals for immediate feedback
- All debugging tools active

#### Late Development/Polishing
- Performance optimizations enabled
- Focus on gameplay smoothness
- Minimal debugging overhead

#### Pre-Production
- Maximum performance settings
- Disable all non-essential monitoring
- Focus on final optimization

## Troubleshooting

### Settings Not Saving
- Check Unity console for permission errors
- Verify disk space availability
- Reset to defaults and reconfigure

### Performance Still Poor
- Ensure Performance Mode is active
- Check for other Unity editor extensions
- Consider closing unused SoapKit windows

### Import Fails
- Verify JSON file format
- Check file path accessibility
- Use Export to see correct format example

## API Access

Access settings programmatically through `SOAPEditorSettings`:

```csharp
// Check current settings
bool debugDisabled = SOAPEditorSettings.DisableDebugDuringPlayMode;
float interval = SOAPEditorSettings.DebugRefreshInterval;

// Modify settings
SOAPEditorSettings.DisablePerformanceMonitoringDuringPlayMode = true;
SOAPEditorSettings.DebugRefreshInterval = 5.0f;
```

## See Also

- [Debug Window](./debug-window) - Main debugging interface
- [Performance Analyzer](./performance-analyzer) - Performance monitoring tool
- [Performance Guide](../advanced/performance) - Optimization techniques
- [Best Practices](../advanced/best-practices) - Development guidelines
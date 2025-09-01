# Asset Cleaner

The **Asset Cleaner** is a professional tool for identifying and safely removing unused SOAP assets from your project. It provides an advanced interface with smart detection, flexible selection options, and safe deletion workflows.

## Overview

The Asset Cleaner scans your entire project to find SOAP assets (Variables and Events) that are not currently used in any scenes or prefabs. It then presents them in an organized, filterable list where you can selectively choose which assets to delete.

## Opening the Asset Cleaner

### Via Menu
- **Tools > SoapKit > Quick Actions > 🧹 Clean Unused Assets**
- **Window > SoapKit > Asset Cleaner**

### Programmatically
```csharp
SOAPAssetCleanerWindow.ShowWindow();
```

## Features

### Smart Detection

The Asset Cleaner uses intelligent scanning to identify truly unused assets:

- **Comprehensive Scan**: Analyzes all ScriptableObjects in your project
- **SOAP Asset Filtering**: Only considers actual SoapKit Variables and Events  
- **Usage Analysis**: Checks scenes, prefabs, and script references
- **Progress Tracking**: Shows progress bar for large projects
- **Error Handling**: Gracefully handles missing or corrupted assets

### Advanced Selection Interface

The tool provides flexible ways to select assets for deletion:

#### Tri-State Selection
- **Individual Checkboxes**: Select specific assets
- **Select All**: Master checkbox with three states:
  - ✅ **Checked**: All assets selected
  - ❌ **Unchecked**: No assets selected  
  - ➖ **Mixed**: Some assets selected

#### Selection Scope Options
- **Apply to filtered only**: Selection actions affect only visible/filtered assets
- **Apply to all**: Selection actions affect all unused assets regardless of filter
- **Invert Selection**: Flip the selection state of all assets in scope

### Powerful Filtering & Sorting

Find assets quickly with comprehensive filtering options:

#### Search Filter
- **Real-time Search**: Filter as you type
- **Multiple Fields**: Search by asset name, type, or path
- **Clear Button**: Quick filter reset with ✖ button

#### Sorting Options
- **Sort By**: Name, Type, or Path
- **Sort Order**: Ascending (▲) or Descending (▼) 
- **Live Sorting**: Results update immediately

### Visual Asset Information

Each asset is displayed with comprehensive information:

- **Asset Icon**: Unity's cached asset icons for easy identification
- **Asset Name**: Click to select and ping asset in Project window
- **Type Display**: Shows specific type (IntVariable, BoolGameEvent, etc.)
- **Full Path**: Complete project path for precise location
- **Action Buttons**:
  - **📍 Ping**: Locate asset in Project window
  - **🔎 Reveal**: Show asset in Finder/Explorer

### Safe Deletion Workflow

The Asset Cleaner ensures safe deletion with multiple safeguards:

#### Double Confirmation
- **First Dialog**: Confirms deletion intent with preview
- **Asset Preview**: Shows up to 7 assets, with "and X more" for larger selections
- **Clear Warning**: States that deletion cannot be undone without version control

#### Batch Processing
- **Progress Tracking**: Shows deletion progress for large batches
- **Error Handling**: Continues processing if individual deletions fail
- **Detailed Reporting**: Reports success/failure counts with specific errors

#### Post-Deletion Actions
- **Automatic Refresh**: Updates Asset Database after deletion
- **Result Dialog**: Shows comprehensive results including any failures
- **Automatic Rescan**: Refreshes unused asset list to show current state

## User Interface

### Header Section
- **Title**: "SOAP Asset Cleaner"
- **Scan Button**: 🔄 Manual rescan for unused assets  
- **Filter Controls**: Search field with clear button
- **Sort Controls**: Dropdown and order toggle
- **Selection Controls**: Scope toggle, Select All, Invert Selection
- **Summary**: Shows total assets and selection count

### Asset List
- **Scrollable View**: Handles large asset lists efficiently
- **Boxed Items**: Clear visual separation between assets
- **Interactive Elements**: Clickable names, hover tooltips
- **Status Indicators**: Visual feedback for selection state

### Footer Section  
- **Delete Button**: 🗑️ Prominent deletion button with count
- **Visual Styling**: Red text to indicate destructive action
- **Disabled State**: Grayed out when no assets selected
- **Close Button**: ❌ Safe exit without changes
- **Warning Message**: Persistent reminder about version control

## Best Practices

### Before Using
1. **Version Control**: Ensure your project is committed to version control
2. **Backup**: Consider creating a project backup for safety
3. **Team Communication**: Notify team members before major cleanups

### During Usage
1. **Review Carefully**: Examine asset names and paths before deletion
2. **Use Filters**: Narrow down to specific asset types or locations
3. **Small Batches**: Delete in smaller groups rather than all at once
4. **Test Scenes**: Verify critical scenes still work after cleanup

### After Cleanup
1. **Test Build**: Ensure project still builds successfully
2. **Run Tests**: Execute any automated tests you have
3. **Scene Validation**: Check that important scenes load correctly
4. **Performance Check**: Verify no performance regressions

## Common Use Cases

### Project Maintenance
- **Regular Cleanup**: Monthly or quarterly unused asset removal
- **Pre-Release**: Clean up before major releases or submissions
- **Team Handoffs**: Prepare clean project state for new team members

### Development Workflows  
- **Prototype Cleanup**: Remove experimental assets after prototyping
- **Feature Removal**: Clean up assets from removed features
- **Refactoring**: Remove assets replaced during architecture changes

### Project Analysis
- **Asset Inventory**: Review what SOAP assets exist in your project
- **Usage Patterns**: Understand which assets are actively used
- **Storage Optimization**: Reduce project size by removing dead assets

## Troubleshooting

### Common Issues

**Assets Marked as Used But Seem Unused**
- Check prefabs in Resources folders
- Verify assets aren't referenced in code via Resources.Load
- Look for indirect references through other ScriptableObjects

**Deletion Fails for Some Assets**
- Ensure assets aren't in use during deletion
- Check file permissions and locks
- Verify assets aren't imported as part of packages

**Performance Issues with Large Projects**
- Use filters to reduce visible asset count
- Process deletions in smaller batches
- Consider closing other Unity windows during scanning

### Recovery
If assets are accidentally deleted:
1. **Version Control**: Restore from your version control system
2. **Unity Cache**: Check Unity's asset server cache if applicable  
3. **Backups**: Restore from project backups
4. **Recreation**: Recreate assets using Asset Creator if necessary

## See Also

- [Asset Creator](./asset-creator) - Creating new SOAP assets
- [Debug Window](./debug-window) - Monitoring asset usage
- [Settings Window](./settings-window) - Configuring SoapKit behavior
- [Performance Analyzer](./performance-analyzer) - Optimizing asset performance
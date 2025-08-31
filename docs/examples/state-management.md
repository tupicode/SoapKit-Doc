# State Management Example

Learn how to implement persistent game state using SoapKit's variable and event systems.

## Overview

This example demonstrates how to create a comprehensive state management system that handles saving/loading game data, managing game sessions, and providing clean state transitions using SoapKit architecture.

## Core State Components

### Game State Variables

Create these ScriptableObject assets for core game state:

```csharp
// Player State Variables (Create > SoapKit > Variables > ...)
[SerializeField] private StringVariable playerName;
[SerializeField] private IntVariable playerLevel;
[SerializeField] private IntVariable playerExperience;
[SerializeField] private IntVariable playerHealth;
[SerializeField] private IntVariable playerMana;
[SerializeField] private Vector3Variable playerPosition;

// Game Session Variables
[SerializeField] private StringVariable currentScene;
[SerializeField] private FloatVariable sessionStartTime;
[SerializeField] private IntVariable currentCheckpoint;
[SerializeField] private BoolVariable isNewGame;

// Settings Variables
[SerializeField] private FloatVariable masterVolume;
[SerializeField] private IntVariable graphicsQuality;
[SerializeField] private BoolVariable fullscreenMode;
```

### State Management Events

```csharp
// Create these custom events
[CreateAssetMenu(menuName = "SoapKit/Events/Save Event")]
public class SaveEvent : GameEvent<SaveData> { }

[CreateAssetMenu(menuName = "SoapKit/Events/Load Event")]  
public class LoadEvent : GameEvent<SaveData> { }

[CreateAssetMenu(menuName = "SoapKit/Events/State Change Event")]
public class StateChangeEvent : GameEvent<GameStateInfo> { }

[System.Serializable]
public class GameStateInfo
{
    public GameState previousState;
    public GameState currentState;
    public string reason;
}

public enum GameState
{
    MainMenu,
    Loading,
    Playing,
    Paused,
    GameOver,
    Settings
}
```

## Save Data Structure

### Serializable Save Data

```csharp
[System.Serializable]
public class SaveData
{
    [Header("Player Data")]
    public string playerName;
    public int playerLevel;
    public int playerExperience;
    public int playerHealth;
    public int playerMana;
    public SerializableVector3 playerPosition;
    
    [Header("Game Session")]
    public string currentScene;
    public float sessionStartTime;
    public int currentCheckpoint;
    public long saveTimestamp;
    
    [Header("Settings")]
    public float masterVolume;
    public int graphicsQuality;
    public bool fullscreenMode;
    
    [Header("Inventory")]
    public List<InventoryItemData> inventoryItems;
    
    [Header("Quest Progress")]
    public List<QuestProgressData> questProgress;
    
    public SaveData()
    {
        inventoryItems = new List<InventoryItemData>();
        questProgress = new List<QuestProgressData>();
        saveTimestamp = System.DateTime.Now.ToBinary();
    }
}

[System.Serializable]
public class SerializableVector3
{
    public float x, y, z;
    
    public SerializableVector3(Vector3 vector)
    {
        x = vector.x;
        y = vector.y;
        z = vector.z;
    }
    
    public Vector3 ToVector3()
    {
        return new Vector3(x, y, z);
    }
}

[System.Serializable]
public class InventoryItemData
{
    public string itemId;
    public int quantity;
    public int slotIndex;
}

[System.Serializable]
public class QuestProgressData
{
    public string questId;
    public int currentStep;
    public bool isCompleted;
    public List<string> completedObjectives;
}
```

## State Manager Implementation

### Core State Manager

```csharp
using FarmGrowthToolkit.Soap;
using System.IO;
using UnityEngine;

public class GameStateManager : MonoBehaviour
{
    [Header("State Variables")]
    [SerializeField] private StringVariable currentGameState;
    [SerializeField] private BoolVariable isGameLoaded;
    [SerializeField] private BoolVariable hasSaveData;
    
    [Header("State Events")]
    [SerializeField] private SaveEvent onSaveRequested;
    [SerializeField] private LoadEvent onLoadRequested;
    [SerializeField] private StateChangeEvent onStateChanged;
    [SerializeField] private GameEvent onGameInitialized;
    
    [Header("Player State")]
    [SerializeField] private StringVariable playerName;
    [SerializeField] private IntVariable playerLevel;
    [SerializeField] private IntVariable playerExperience;
    [SerializeField] private IntVariable playerHealth;
    [SerializeField] private IntVariable playerMana;
    [SerializeField] private Vector3Variable playerPosition;
    
    [Header("Session State")]
    [SerializeField] private StringVariable currentScene;
    [SerializeField] private FloatVariable sessionStartTime;
    [SerializeField] private IntVariable currentCheckpoint;
    [SerializeField] private BoolVariable isNewGame;
    
    [Header("Settings State")]
    [SerializeField] private FloatVariable masterVolume;
    [SerializeField] private IntVariable graphicsQuality;
    [SerializeField] private BoolVariable fullscreenMode;
    
    private const string SAVE_FILE_NAME = "gamesave.json";
    private string SaveFilePath => Path.Combine(Application.persistentDataPath, SAVE_FILE_NAME);
    
    private GameState currentState = GameState.MainMenu;
    
    private void Start()
    {
        InitializeGameState();
    }
    
    private void OnEnable()
    {
        onSaveRequested.AddListener(SaveGameState);
        onLoadRequested.AddListener(LoadGameState);
    }
    
    private void OnDisable()
    {
        onSaveRequested.RemoveListener(SaveGameState);
        onLoadRequested.RemoveListener(LoadGameState);
    }
    
    private void InitializeGameState()
    {
        // Check if save file exists
        bool saveExists = File.Exists(SaveFilePath);
        hasSaveData.SetValue(saveExists);
        
        // Load settings regardless
        LoadSettings();
        
        if (saveExists && !isNewGame.Value)
        {
            // Auto-load existing save
            LoadGameFromFile();
        }
        else
        {
            // Initialize new game state
            InitializeNewGameState();
        }
        
        onGameInitialized.Raise();
    }
    
    private void InitializeNewGameState()
    {
        playerName.SetValue("Player");
        playerLevel.SetValue(1);
        playerExperience.SetValue(0);
        playerHealth.SetValue(100);
        playerMana.SetValue(50);
        playerPosition.SetValue(Vector3.zero);
        
        currentScene.SetValue("StartingArea");
        sessionStartTime.SetValue(Time.time);
        currentCheckpoint.SetValue(0);
        
        isGameLoaded.SetValue(true);
        ChangeState(GameState.Playing, "New game started");
    }
    
    public void ChangeState(GameState newState, string reason = "")
    {
        if (currentState == newState) return;
        
        GameState previousState = currentState;
        currentState = newState;
        
        currentGameState.SetValue(newState.ToString());
        
        var stateInfo = new GameStateInfo
        {
            previousState = previousState,
            currentState = newState,
            reason = reason
        };
        
        onStateChanged.Raise(stateInfo);
    }
    
    private void SaveGameState(SaveData saveData = null)
    {
        if (saveData == null)
        {
            saveData = CreateSaveDataFromCurrentState();
        }
        
        try
        {
            string jsonData = JsonUtility.ToJson(saveData, true);
            File.WriteAllText(SaveFilePath, jsonData);
            
            hasSaveData.SetValue(true);
            Debug.Log($"Game saved successfully to {SaveFilePath}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to save game: {e.Message}");
        }
    }
    
    private void LoadGameState(SaveData saveData = null)
    {
        if (saveData != null)
        {
            ApplySaveDataToCurrentState(saveData);
        }
        else
        {
            LoadGameFromFile();
        }
    }
    
    private void LoadGameFromFile()
    {
        try
        {
            if (!File.Exists(SaveFilePath))
            {
                Debug.LogWarning("Save file not found");
                return;
            }
            
            string jsonData = File.ReadAllText(SaveFilePath);
            SaveData saveData = JsonUtility.FromJson<SaveData>(jsonData);
            
            ApplySaveDataToCurrentState(saveData);
            isGameLoaded.SetValue(true);
            
            Debug.Log("Game loaded successfully");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load game: {e.Message}");
        }
    }
    
    private SaveData CreateSaveDataFromCurrentState()
    {
        var saveData = new SaveData
        {
            // Player data
            playerName = this.playerName.Value,
            playerLevel = this.playerLevel.Value,
            playerExperience = this.playerExperience.Value,
            playerHealth = this.playerHealth.Value,
            playerMana = this.playerMana.Value,
            playerPosition = new SerializableVector3(this.playerPosition.Value),
            
            // Session data
            currentScene = this.currentScene.Value,
            sessionStartTime = this.sessionStartTime.Value,
            currentCheckpoint = this.currentCheckpoint.Value,
            
            // Settings
            masterVolume = this.masterVolume.Value,
            graphicsQuality = this.graphicsQuality.Value,
            fullscreenMode = this.fullscreenMode.Value
        };
        
        // Collect data from other systems
        CollectInventoryData(saveData);
        CollectQuestData(saveData);
        
        return saveData;
    }
    
    private void ApplySaveDataToCurrentState(SaveData saveData)
    {
        // Apply player data
        playerName.SetValue(saveData.playerName);
        playerLevel.SetValue(saveData.playerLevel);
        playerExperience.SetValue(saveData.playerExperience);
        playerHealth.SetValue(saveData.playerHealth);
        playerMana.SetValue(saveData.playerMana);
        playerPosition.SetValue(saveData.playerPosition.ToVector3());
        
        // Apply session data
        currentScene.SetValue(saveData.currentScene);
        sessionStartTime.SetValue(saveData.sessionStartTime);
        currentCheckpoint.SetValue(saveData.currentCheckpoint);
        
        // Apply settings
        masterVolume.SetValue(saveData.masterVolume);
        graphicsQuality.SetValue(saveData.graphicsQuality);
        fullscreenMode.SetValue(saveData.fullscreenMode);
        
        // Apply data to other systems
        ApplyInventoryData(saveData);
        ApplyQuestData(saveData);
    }
    
    private void CollectInventoryData(SaveData saveData)
    {
        // Collect from inventory system
        var inventoryManager = FindObjectOfType<InventoryManager>();
        if (inventoryManager != null)
        {
            saveData.inventoryItems = inventoryManager.GetSaveData();
        }
    }
    
    private void CollectQuestData(SaveData saveData)
    {
        // Collect from quest system
        var questManager = FindObjectOfType<QuestManager>();
        if (questManager != null)
        {
            saveData.questProgress = questManager.GetSaveData();
        }
    }
    
    private void ApplyInventoryData(SaveData saveData)
    {
        var inventoryManager = FindObjectOfType<InventoryManager>();
        if (inventoryManager != null)
        {
            inventoryManager.LoadFromSaveData(saveData.inventoryItems);
        }
    }
    
    private void ApplyQuestData(SaveData saveData)
    {
        var questManager = FindObjectOfType<QuestManager>();
        if (questManager != null)
        {
            questManager.LoadFromSaveData(saveData.questProgress);
        }
    }
    
    private void LoadSettings()
    {
        // Load settings from PlayerPrefs or separate settings file
        masterVolume.SetValue(PlayerPrefs.GetFloat("MasterVolume", 1.0f));
        graphicsQuality.SetValue(PlayerPrefs.GetInt("GraphicsQuality", 2));
        fullscreenMode.SetValue(PlayerPrefs.GetInt("FullscreenMode", 1) == 1);
    }
    
    public void SaveSettings()
    {
        PlayerPrefs.SetFloat("MasterVolume", masterVolume.Value);
        PlayerPrefs.SetInt("GraphicsQuality", graphicsQuality.Value);
        PlayerPrefs.SetInt("FullscreenMode", fullscreenMode.Value ? 1 : 0);
        PlayerPrefs.Save();
    }
    
    // Public API methods
    public void SaveGame()
    {
        onSaveRequested.Raise();
    }
    
    public void LoadGame()
    {
        onLoadRequested.Raise();
    }
    
    public void StartNewGame()
    {
        isNewGame.SetValue(true);
        InitializeNewGameState();
    }
    
    public void QuitToMainMenu()
    {
        SaveGame(); // Auto-save before quitting
        ChangeState(GameState.MainMenu, "Quit to main menu");
    }
}
```

## Auto-Save System

### Checkpoint-Based Auto-Save

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;

public class AutoSaveManager : MonoBehaviour
{
    [Header("Auto-Save Settings")]
    [SerializeField] private float autoSaveInterval = 300f; // 5 minutes
    [SerializeField] private BoolVariable enableAutoSave;
    
    [Header("Auto-Save Events")]
    [SerializeField] private GameEvent onAutoSaveTriggered;
    [SerializeField] private IntGameEvent onCheckpointReached;
    [SerializeField] private StringGameEvent onSceneChanged;
    
    [Header("State Manager")]
    [SerializeField] private GameStateManager stateManager;
    
    private float lastAutoSaveTime;
    
    private void OnEnable()
    {
        onCheckpointReached.AddListener(OnCheckpointReached);
        onSceneChanged.AddListener(OnSceneChanged);
    }
    
    private void OnDisable()
    {
        onCheckpointReached.RemoveListener(OnCheckpointReached);
        onSceneChanged.RemoveListener(OnSceneChanged);
    }
    
    private void Update()
    {
        if (enableAutoSave.Value && ShouldAutoSave())
        {
            TriggerAutoSave();
        }
    }
    
    private bool ShouldAutoSave()
    {
        return Time.time - lastAutoSaveTime >= autoSaveInterval;
    }
    
    private void TriggerAutoSave()
    {
        lastAutoSaveTime = Time.time;
        stateManager.SaveGame();
        onAutoSaveTriggered.Raise();
        
        Debug.Log("Auto-save completed");
    }
    
    private void OnCheckpointReached(int checkpointId)
    {
        // Auto-save at checkpoints
        stateManager.SaveGame();
        Debug.Log($"Checkpoint {checkpointId} auto-save completed");
    }
    
    private void OnSceneChanged(string newScene)
    {
        // Auto-save when changing scenes
        stateManager.SaveGame();
        Debug.Log($"Scene change auto-save completed for {newScene}");
    }
}
```

## State Persistence Utilities

### Save Slot Management

```csharp
using FarmGrowthToolkit.Soap;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class SaveSlotManager : MonoBehaviour
{
    [Header("Save Slot Events")]
    [SerializeField] private SaveEvent onSaveToSlot;
    [SerializeField] private LoadEvent onLoadFromSlot;
    [SerializeField] private IntGameEvent onSlotSelected;
    
    private const string SAVE_FOLDER = "SaveSlots";
    private const int MAX_SAVE_SLOTS = 5;
    
    private string SaveFolderPath => Path.Combine(Application.persistentDataPath, SAVE_FOLDER);
    
    private void Start()
    {
        if (!Directory.Exists(SaveFolderPath))
        {
            Directory.CreateDirectory(SaveFolderPath);
        }
    }
    
    public void SaveToSlot(int slotIndex, SaveData saveData)
    {
        if (slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) return;
        
        string filePath = GetSaveFilePath(slotIndex);
        
        try
        {
            string jsonData = JsonUtility.ToJson(saveData, true);
            File.WriteAllText(filePath, jsonData);
            
            Debug.Log($"Game saved to slot {slotIndex}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to save to slot {slotIndex}: {e.Message}");
        }
    }
    
    public SaveData LoadFromSlot(int slotIndex)
    {
        if (slotIndex < 0 || slotIndex >= MAX_SAVE_SLOTS) return null;
        
        string filePath = GetSaveFilePath(slotIndex);
        
        if (!File.Exists(filePath)) return null;
        
        try
        {
            string jsonData = File.ReadAllText(filePath);
            return JsonUtility.FromJson<SaveData>(jsonData);
        }
        catch (System.Exception e)
        {
            Debug.LogError($"Failed to load from slot {slotIndex}: {e.Message}");
            return null;
        }
    }
    
    public List<SaveSlotInfo> GetAllSaveSlots()
    {
        var slots = new List<SaveSlotInfo>();
        
        for (int i = 0; i < MAX_SAVE_SLOTS; i++)
        {
            var slotInfo = GetSaveSlotInfo(i);
            slots.Add(slotInfo);
        }
        
        return slots;
    }
    
    public SaveSlotInfo GetSaveSlotInfo(int slotIndex)
    {
        var slotInfo = new SaveSlotInfo
        {
            slotIndex = slotIndex,
            isEmpty = true
        };
        
        string filePath = GetSaveFilePath(slotIndex);
        
        if (File.Exists(filePath))
        {
            try
            {
                var saveData = LoadFromSlot(slotIndex);
                if (saveData != null)
                {
                    slotInfo.isEmpty = false;
                    slotInfo.playerName = saveData.playerName;
                    slotInfo.playerLevel = saveData.playerLevel;
                    slotInfo.currentScene = saveData.currentScene;
                    slotInfo.saveTimestamp = System.DateTime.FromBinary(saveData.saveTimestamp);
                    slotInfo.fileSize = new FileInfo(filePath).Length;
                }
            }
            catch (System.Exception e)
            {
                Debug.LogError($"Error reading save slot {slotIndex}: {e.Message}");
            }
        }
        
        return slotInfo;
    }
    
    private string GetSaveFilePath(int slotIndex)
    {
        return Path.Combine(SaveFolderPath, $"save_slot_{slotIndex}.json");
    }
}

[System.Serializable]
public class SaveSlotInfo
{
    public int slotIndex;
    public bool isEmpty;
    public string playerName;
    public int playerLevel;
    public string currentScene;
    public System.DateTime saveTimestamp;
    public long fileSize;
}
```

## Integration with Other Systems

This state management system integrates with:

- [Health System](./health-system) - For player health persistence
- [Inventory System](./inventory-system) - For item persistence
- [UI Integration](./ui-integration) - For settings and UI state

## Best Practices

1. **Automatic Saves**: Implement auto-save at key moments (checkpoints, scene transitions)
2. **Error Handling**: Always handle file I/O errors gracefully
3. **Data Validation**: Validate save data before applying it
4. **Backup Systems**: Consider multiple save slots and backup strategies
5. **Performance**: Don't save too frequently, batch changes when possible

## Next Steps

- Explore [Health System](./health-system) integration
- Learn about [Inventory System](./inventory-system) persistence
- Check out [UI Integration](./ui-integration) for settings panels
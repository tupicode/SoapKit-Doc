# UI Integration Examples

Learn how to create reactive UI systems using SoapKit's data binding capabilities.

## Overview

This guide shows you how to build responsive user interfaces that automatically update when game state changes, using SoapKit's variable and event systems for clean separation between UI and game logic.

## Basic UI Data Binding

### Health Bar Integration

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class HealthBarUI : MonoBehaviour
{
    [Header("Health Variables")]
    [SerializeField] private IntVariable currentHealth;
    [SerializeField] private IntVariable maxHealth;
    
    [Header("Health Events")]
    [SerializeField] private IntGameEvent onHealthChanged;
    [SerializeField] private GameEvent onPlayerDeath;
    
    [Header("UI Components")]
    [SerializeField] private Slider healthSlider;
    [SerializeField] private TextMeshProUGUI healthText;
    [SerializeField] private Image healthFill;
    [SerializeField] private Gradient healthColorGradient;
    
    private void OnEnable()
    {
        // Bind to variable changes
        currentHealth.OnValueChanged += UpdateHealthDisplay;
        maxHealth.OnValueChanged += UpdateMaxHealth;
        
        // Bind to events
        onHealthChanged.AddListener(OnHealthChanged);
        onPlayerDeath.AddListener(OnPlayerDeath);
    }
    
    private void OnDisable()
    {
        currentHealth.OnValueChanged -= UpdateHealthDisplay;
        maxHealth.OnValueChanged -= UpdateMaxHealth;
        
        onHealthChanged.RemoveListener(OnHealthChanged);
        onPlayerDeath.RemoveListener(OnPlayerDeath);
    }
    
    private void Start()
    {
        InitializeHealthDisplay();
    }
    
    private void InitializeHealthDisplay()
    {
        healthSlider.maxValue = maxHealth.Value;
        UpdateHealthDisplay(currentHealth.Value);
    }
    
    private void UpdateHealthDisplay(int newHealth)
    {
        healthSlider.value = newHealth;
        healthText.text = $"{newHealth}/{maxHealth.Value}";
        
        // Update color based on health percentage
        float healthPercentage = (float)newHealth / maxHealth.Value;
        healthFill.color = healthColorGradient.Evaluate(healthPercentage);
    }
    
    private void UpdateMaxHealth(int newMaxHealth)
    {
        healthSlider.maxValue = newMaxHealth;
        UpdateHealthDisplay(currentHealth.Value);
    }
    
    private void OnHealthChanged(int healthChange)
    {
        // Show floating damage/heal text
        if (healthChange < 0)
        {
            ShowFloatingText($"-{Mathf.Abs(healthChange)}", Color.red);
        }
        else if (healthChange > 0)
        {
            ShowFloatingText($"+{healthChange}", Color.green);
        }
    }
    
    private void OnPlayerDeath()
    {
        // Show death screen or game over UI
        ShowDeathScreen();
    }
    
    private void ShowFloatingText(string text, Color color)
    {
        // Implementation for floating damage text
        // This could use a separate FloatingTextManager
    }
    
    private void ShowDeathScreen()
    {
        // Implementation for death screen
    }
}
```

### Menu System Integration

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;

public class GameMenuManager : MonoBehaviour
{
    [Header("Game State")]
    [SerializeField] private BoolVariable isGamePaused;
    [SerializeField] private BoolVariable isMenuOpen;
    [SerializeField] private StringVariable currentMenuState;
    
    [Header("Menu Events")]
    [SerializeField] private StringGameEvent onMenuChanged;
    [SerializeField] private BoolGameEvent onPauseToggle;
    
    [Header("Menu Panels")]
    [SerializeField] private GameObject mainMenuPanel;
    [SerializeField] private GameObject optionsPanel;
    [SerializeField] private GameObject inventoryPanel;
    [SerializeField] private GameObject pauseOverlay;
    
    private void OnEnable()
    {
        // Subscribe to state changes
        isGamePaused.OnValueChanged += UpdatePauseUI;
        isMenuOpen.OnValueChanged += UpdateMenuVisibility;
        currentMenuState.OnValueChanged += UpdateActiveMenu;
        
        // Subscribe to events
        onMenuChanged.AddListener(ChangeMenu);
        onPauseToggle.AddListener(HandlePauseToggle);
    }
    
    private void OnDisable()
    {
        isGamePaused.OnValueChanged -= UpdatePauseUI;
        isMenuOpen.OnValueChanged -= UpdateMenuVisibility;
        currentMenuState.OnValueChanged -= UpdateActiveMenu;
        
        onMenuChanged.RemoveListener(ChangeMenu);
        onPauseToggle.RemoveListener(HandlePauseToggle);
    }
    
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            TogglePauseMenu();
        }
        
        if (Input.GetKeyDown(KeyCode.I))
        {
            ToggleInventoryMenu();
        }
    }
    
    private void UpdatePauseUI(bool isPaused)
    {
        pauseOverlay.SetActive(isPaused);
        Time.timeScale = isPaused ? 0f : 1f;
    }
    
    private void UpdateMenuVisibility(bool isVisible)
    {
        // Enable/disable UI canvas or specific panels
        if (!isVisible)
        {
            CloseAllMenus();
        }
    }
    
    private void UpdateActiveMenu(string menuName)
    {
        CloseAllMenus();
        
        switch (menuName.ToLower())
        {
            case "main":
                mainMenuPanel.SetActive(true);
                break;
            case "options":
                optionsPanel.SetActive(true);
                break;
            case "inventory":
                inventoryPanel.SetActive(true);
                break;
        }
    }
    
    private void ChangeMenu(string newMenu)
    {
        currentMenuState.SetValue(newMenu);
        isMenuOpen.SetValue(!string.IsNullOrEmpty(newMenu));
    }
    
    private void HandlePauseToggle(bool isPaused)
    {
        if (isPaused)
        {
            ChangeMenu("main");
        }
        else
        {
            ChangeMenu("");
        }
    }
    
    private void TogglePauseMenu()
    {
        bool newPauseState = !isGamePaused.Value;
        isGamePaused.SetValue(newPauseState);
        onPauseToggle.Raise(newPauseState);
    }
    
    private void ToggleInventoryMenu()
    {
        string targetMenu = currentMenuState.Value == "inventory" ? "" : "inventory";
        onMenuChanged.Raise(targetMenu);
    }
    
    private void CloseAllMenus()
    {
        mainMenuPanel.SetActive(false);
        optionsPanel.SetActive(false);
        inventoryPanel.SetActive(false);
    }
    
    // UI Button callbacks
    public void OnResumeClicked()
    {
        isGamePaused.SetValue(false);
        onPauseToggle.Raise(false);
    }
    
    public void OnOptionsClicked()
    {
        onMenuChanged.Raise("options");
    }
    
    public void OnQuitClicked()
    {
        Application.Quit();
    }
}
```

## Advanced UI Patterns

### Settings Panel with Data Binding

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class SettingsPanel : MonoBehaviour
{
    [Header("Audio Settings")]
    [SerializeField] private FloatVariable masterVolume;
    [SerializeField] private FloatVariable musicVolume;
    [SerializeField] private FloatVariable sfxVolume;
    
    [Header("Graphics Settings")]
    [SerializeField] private BoolVariable isFullscreen;
    [SerializeField] private IntVariable qualityLevel;
    [SerializeField] private BoolVariable vSyncEnabled;
    
    [Header("Gameplay Settings")]
    [SerializeField] private FloatVariable mouseSensitivity;
    [SerializeField] private BoolVariable invertY;
    
    [Header("UI Controls")]
    [SerializeField] private Slider masterVolumeSlider;
    [SerializeField] private Slider musicVolumeSlider;
    [SerializeField] private Slider sfxVolumeSlider;
    [SerializeField] private Toggle fullscreenToggle;
    [SerializeField] private TMP_Dropdown qualityDropdown;
    [SerializeField] private Toggle vsyncToggle;
    [SerializeField] private Slider sensitivitySlider;
    [SerializeField] private Toggle invertYToggle;
    
    private void OnEnable()
    {
        BindUIToVariables();
        InitializeUIValues();
    }
    
    private void OnDisable()
    {
        UnbindUIFromVariables();
    }
    
    private void BindUIToVariables()
    {
        // Audio bindings
        masterVolumeSlider.onValueChanged.AddListener(OnMasterVolumeChanged);
        musicVolumeSlider.onValueChanged.AddListener(OnMusicVolumeChanged);
        sfxVolumeSlider.onValueChanged.AddListener(OnSFXVolumeChanged);
        
        // Graphics bindings
        fullscreenToggle.onValueChanged.AddListener(OnFullscreenChanged);
        qualityDropdown.onValueChanged.AddListener(OnQualityChanged);
        vsyncToggle.onValueChanged.AddListener(OnVSyncChanged);
        
        // Gameplay bindings
        sensitivitySlider.onValueChanged.AddListener(OnSensitivityChanged);
        invertYToggle.onValueChanged.AddListener(OnInvertYChanged);
        
        // Variable change listeners
        masterVolume.OnValueChanged += UpdateMasterVolumeUI;
        musicVolume.OnValueChanged += UpdateMusicVolumeUI;
        sfxVolume.OnValueChanged += UpdateSFXVolumeUI;
        isFullscreen.OnValueChanged += UpdateFullscreenUI;
        qualityLevel.OnValueChanged += UpdateQualityUI;
        vSyncEnabled.OnValueChanged += UpdateVSyncUI;
        mouseSensitivity.OnValueChanged += UpdateSensitivityUI;
        invertY.OnValueChanged += UpdateInvertYUI;
    }
    
    private void UnbindUIFromVariables()
    {
        // Remove UI listeners
        masterVolumeSlider.onValueChanged.RemoveListener(OnMasterVolumeChanged);
        musicVolumeSlider.onValueChanged.RemoveListener(OnMusicVolumeChanged);
        sfxVolumeSlider.onValueChanged.RemoveListener(OnSFXVolumeChanged);
        fullscreenToggle.onValueChanged.RemoveListener(OnFullscreenChanged);
        qualityDropdown.onValueChanged.RemoveListener(OnQualityChanged);
        vsyncToggle.onValueChanged.RemoveListener(OnVSyncChanged);
        sensitivitySlider.onValueChanged.RemoveListener(OnSensitivityChanged);
        invertYToggle.onValueChanged.RemoveListener(OnInvertYChanged);
        
        // Remove variable change listeners
        masterVolume.OnValueChanged -= UpdateMasterVolumeUI;
        musicVolume.OnValueChanged -= UpdateMusicVolumeUI;
        sfxVolume.OnValueChanged -= UpdateSFXVolumeUI;
        isFullscreen.OnValueChanged -= UpdateFullscreenUI;
        qualityLevel.OnValueChanged -= UpdateQualityUI;
        vSyncEnabled.OnValueChanged -= UpdateVSyncUI;
        mouseSensitivity.OnValueChanged -= UpdateSensitivityUI;
        invertY.OnValueChanged -= UpdateInvertYUI;
    }
    
    private void InitializeUIValues()
    {
        masterVolumeSlider.value = masterVolume.Value;
        musicVolumeSlider.value = musicVolume.Value;
        sfxVolumeSlider.value = sfxVolume.Value;
        fullscreenToggle.isOn = isFullscreen.Value;
        qualityDropdown.value = qualityLevel.Value;
        vsyncToggle.isOn = vSyncEnabled.Value;
        sensitivitySlider.value = mouseSensitivity.Value;
        invertYToggle.isOn = invertY.Value;
    }
    
    // UI to Variable callbacks
    private void OnMasterVolumeChanged(float value) => masterVolume.SetValue(value);
    private void OnMusicVolumeChanged(float value) => musicVolume.SetValue(value);
    private void OnSFXVolumeChanged(float value) => sfxVolume.SetValue(value);
    private void OnFullscreenChanged(bool value) => isFullscreen.SetValue(value);
    private void OnQualityChanged(int value) => qualityLevel.SetValue(value);
    private void OnVSyncChanged(bool value) => vSyncEnabled.SetValue(value);
    private void OnSensitivityChanged(float value) => mouseSensitivity.SetValue(value);
    private void OnInvertYChanged(bool value) => invertY.SetValue(value);
    
    // Variable to UI callbacks
    private void UpdateMasterVolumeUI(float value) => masterVolumeSlider.value = value;
    private void UpdateMusicVolumeUI(float value) => musicVolumeSlider.value = value;
    private void UpdateSFXVolumeUI(float value) => sfxVolumeSlider.value = value;
    private void UpdateFullscreenUI(bool value) => fullscreenToggle.isOn = value;
    private void UpdateQualityUI(int value) => qualityDropdown.value = value;
    private void UpdateVSyncUI(bool value) => vsyncToggle.isOn = value;
    private void UpdateSensitivityUI(float value) => sensitivitySlider.value = value;
    private void UpdateInvertYUI(bool value) => invertYToggle.isOn = value;
}
```

### Reactive List UI

```csharp
using FarmGrowthToolkit.Soap;
using System.Collections.Generic;
using UnityEngine;

public class QuestLogUI : MonoBehaviour
{
    [Header("Quest Events")]
    [SerializeField] private QuestEvent onQuestAdded;
    [SerializeField] private QuestEvent onQuestCompleted;
    [SerializeField] private QuestEvent onQuestUpdated;
    
    [Header("UI References")]
    [SerializeField] private Transform questListParent;
    [SerializeField] private GameObject questItemPrefab;
    
    private Dictionary<string, QuestItemUI> activeQuestItems = new Dictionary<string, QuestItemUI>();
    
    private void OnEnable()
    {
        onQuestAdded.AddListener(AddQuestToUI);
        onQuestCompleted.AddListener(RemoveQuestFromUI);
        onQuestUpdated.AddListener(UpdateQuestInUI);
    }
    
    private void OnDisable()
    {
        onQuestAdded.RemoveListener(AddQuestToUI);
        onQuestCompleted.RemoveListener(RemoveQuestFromUI);
        onQuestUpdated.RemoveListener(UpdateQuestInUI);
    }
    
    private void AddQuestToUI(Quest quest)
    {
        if (activeQuestItems.ContainsKey(quest.id))
            return;
        
        GameObject questItemObj = Instantiate(questItemPrefab, questListParent);
        QuestItemUI questItemUI = questItemObj.GetComponent<QuestItemUI>();
        
        questItemUI.SetQuest(quest);
        activeQuestItems[quest.id] = questItemUI;
    }
    
    private void RemoveQuestFromUI(Quest quest)
    {
        if (activeQuestItems.TryGetValue(quest.id, out QuestItemUI questItem))
        {
            questItem.AnimateCompletion(() =>
            {
                Destroy(questItem.gameObject);
                activeQuestItems.Remove(quest.id);
            });
        }
    }
    
    private void UpdateQuestInUI(Quest quest)
    {
        if (activeQuestItems.TryGetValue(quest.id, out QuestItemUI questItem))
        {
            questItem.UpdateQuest(quest);
        }
    }
}
```

## Animations and Transitions

### Animated UI Updates

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;
using DG.Tweening; // Using DOTween for animations

public class AnimatedHealthBar : MonoBehaviour
{
    [Header("Health Variables")]
    [SerializeField] private IntVariable currentHealth;
    [SerializeField] private IntVariable maxHealth;
    
    [Header("UI Components")]
    [SerializeField] private RectTransform healthBar;
    [SerializeField] private CanvasGroup damageFlash;
    
    private Vector2 originalHealthBarSize;
    private int lastHealth;
    
    private void Start()
    {
        originalHealthBarSize = healthBar.sizeDelta;
        lastHealth = currentHealth.Value;
    }
    
    private void OnEnable()
    {
        currentHealth.OnValueChanged += AnimateHealthChange;
        maxHealth.OnValueChanged += UpdateMaxHealth;
    }
    
    private void OnDisable()
    {
        currentHealth.OnValueChanged -= AnimateHealthChange;
        maxHealth.OnValueChanged -= UpdateMaxHealth;
    }
    
    private void AnimateHealthChange(int newHealth)
    {
        float healthPercentage = (float)newHealth / maxHealth.Value;
        Vector2 targetSize = new Vector2(originalHealthBarSize.x * healthPercentage, originalHealthBarSize.y);
        
        // Animate health bar
        healthBar.DOSizeDelta(targetSize, 0.5f)
            .SetEase(Ease.OutQuart);
        
        // Flash effect on damage
        if (newHealth < lastHealth)
        {
            damageFlash.DOFade(0.5f, 0.1f)
                .OnComplete(() => damageFlash.DOFade(0f, 0.3f));
        }
        
        lastHealth = newHealth;
    }
    
    private void UpdateMaxHealth(int newMaxHealth)
    {
        AnimateHealthChange(currentHealth.Value);
    }
}
```

## Best Practices

### Clean UI Architecture

1. **Separation of Concerns**: Keep UI logic separate from game logic
2. **Event-Driven Updates**: Use events for UI updates, not polling
3. **Consistent Binding**: Always pair OnEnable/OnDisable for event subscriptions
4. **Null Safety**: Check for null references in UI callbacks
5. **Performance**: Minimize UI updates and use efficient data binding

### Common Patterns

```csharp
// Good: Event-driven UI update
private void OnEnable()
{
    playerScore.OnValueChanged += UpdateScoreDisplay;
}

private void OnDisable()  
{
    playerScore.OnValueChanged -= UpdateScoreDisplay;
}

// Bad: Polling in Update
private void Update()
{
    if (scoreText.text != playerScore.Value.ToString())
    {
        scoreText.text = playerScore.Value.ToString();
    }
}
```

## Integration Examples

This UI integration approach works seamlessly with:

- [Health System](./health-system) - For player status displays
- [Inventory System](./inventory-system) - For item management UI
- [State Management](./state-management) - For persistent UI settings

## Next Steps

- Learn about [State Management](./state-management) for UI persistence
- Explore [Health System](./health-system) integration
- Check out [Inventory System](./inventory-system) UI patterns
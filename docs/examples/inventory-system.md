# Inventory System Example

A complete inventory system implementation using SoapKit's event-driven architecture.

## Overview

This example demonstrates how to build a flexible inventory system that manages items, handles pickup/drop events, and provides UI integration using SoapKit variables and events.

## Core Components

### Item Data Structure

```csharp
[System.Serializable]
public class Item
{
    public int id;
    public string name;
    public string description;
    public Sprite icon;
    public int maxStackSize = 1;
    public ItemType type;
}

public enum ItemType
{
    Consumable,
    Equipment,
    Quest,
    Material
}
```

### Inventory Variables

Create these ScriptableObject assets in your project:

```csharp
// Create via: Create > SoapKit > Variables > Int Variable
[SerializeField] private IntVariable inventoryCapacity;
[SerializeField] private IntVariable currentItemCount;

// Create via: Create > SoapKit > Variables > String Variable  
[SerializeField] private StringVariable lastPickedUpItem;
```

### Inventory Events

Create these event assets:

```csharp
// Create via: Create > SoapKit > Events > Custom Events
[CreateAssetMenu(menuName = "SoapKit/Events/Item Event")]
public class ItemEvent : GameEvent<Item> { }

[CreateAssetMenu(menuName = "SoapKit/Events/Inventory Event")]
public class InventoryEvent : GameEvent<InventoryEventArgs> { }

[System.Serializable]
public class InventoryEventArgs
{
    public Item item;
    public int quantity;
    public int slotIndex;
}
```

## Inventory System Implementation

### Core Inventory Manager

```csharp
using FarmGrowthToolkit.Soap;
using System.Collections.Generic;
using UnityEngine;

public class InventoryManager : MonoBehaviour
{
    [Header("Variables")]
    [SerializeField] private IntVariable inventoryCapacity;
    [SerializeField] private IntVariable currentItemCount;
    [SerializeField] private StringVariable lastPickedUpItem;
    
    [Header("Events")]
    [SerializeField] private ItemEvent onItemAdded;
    [SerializeField] private ItemEvent onItemRemoved;
    [SerializeField] private InventoryEvent onInventoryChanged;
    [SerializeField] private GameEvent onInventoryFull;
    
    private Dictionary<int, InventorySlot> inventory = new Dictionary<int, InventorySlot>();
    
    private void Start()
    {
        InitializeInventory();
    }
    
    private void InitializeInventory()
    {
        // Initialize empty inventory slots
        for (int i = 0; i < inventoryCapacity.Value; i++)
        {
            inventory[i] = new InventorySlot();
        }
        
        UpdateItemCount();
    }
    
    public bool TryAddItem(Item item, int quantity = 1)
    {
        // Try to stack with existing items first
        if (TryStackItem(item, quantity))
        {
            return true;
        }
        
        // Find empty slot
        int emptySlot = FindEmptySlot();
        if (emptySlot == -1)
        {
            onInventoryFull.Raise();
            return false;
        }
        
        // Add to empty slot
        inventory[emptySlot].item = item;
        inventory[emptySlot].quantity = quantity;
        
        // Update tracking variables
        lastPickedUpItem.SetValue(item.name);
        UpdateItemCount();
        
        // Raise events
        onItemAdded.Raise(item);
        RaiseInventoryChangedEvent(item, quantity, emptySlot);
        
        return true;
    }
    
    public bool TryRemoveItem(int slotIndex, int quantity = 1)
    {
        if (!inventory.ContainsKey(slotIndex) || inventory[slotIndex].IsEmpty)
        {
            return false;
        }
        
        var slot = inventory[slotIndex];
        Item removedItem = slot.item;
        
        slot.quantity -= quantity;
        
        if (slot.quantity <= 0)
        {
            slot.Clear();
        }
        
        UpdateItemCount();
        onItemRemoved.Raise(removedItem);
        RaiseInventoryChangedEvent(removedItem, -quantity, slotIndex);
        
        return true;
    }
    
    private bool TryStackItem(Item item, int quantity)
    {
        foreach (var kvp in inventory)
        {
            var slot = kvp.Value;
            if (slot.item != null && slot.item.id == item.id)
            {
                int spaceAvailable = item.maxStackSize - slot.quantity;
                if (spaceAvailable > 0)
                {
                    int amountToAdd = Mathf.Min(quantity, spaceAvailable);
                    slot.quantity += amountToAdd;
                    
                    UpdateItemCount();
                    RaiseInventoryChangedEvent(item, amountToAdd, kvp.Key);
                    
                    return amountToAdd == quantity;
                }
            }
        }
        return false;
    }
    
    private int FindEmptySlot()
    {
        foreach (var kvp in inventory)
        {
            if (kvp.Value.IsEmpty)
            {
                return kvp.Key;
            }
        }
        return -1;
    }
    
    private void UpdateItemCount()
    {
        int totalItems = 0;
        foreach (var slot in inventory.Values)
        {
            if (!slot.IsEmpty)
            {
                totalItems += slot.quantity;
            }
        }
        currentItemCount.SetValue(totalItems);
    }
    
    private void RaiseInventoryChangedEvent(Item item, int quantity, int slotIndex)
    {
        var args = new InventoryEventArgs
        {
            item = item,
            quantity = quantity,
            slotIndex = slotIndex
        };
        onInventoryChanged.Raise(args);
    }
    
    public InventorySlot GetSlot(int index)
    {
        return inventory.TryGetValue(index, out var slot) ? slot : null;
    }
}

[System.Serializable]
public class InventorySlot
{
    public Item item;
    public int quantity;
    
    public bool IsEmpty => item == null || quantity <= 0;
    
    public void Clear()
    {
        item = null;
        quantity = 0;
    }
}
```

### Item Pickup System

```csharp
public class ItemPickup : MonoBehaviour
{
    [SerializeField] private Item itemData;
    [SerializeField] private int quantity = 1;
    [SerializeField] private ItemEvent onItemPickedUp;
    
    private void OnTriggerEnter(Collider other)
    {
        if (other.CompareTag("Player"))
        {
            var inventory = FindObjectOfType<InventoryManager>();
            if (inventory != null && inventory.TryAddItem(itemData, quantity))
            {
                onItemPickedUp?.Raise(itemData);
                Destroy(gameObject);
            }
        }
    }
}
```

## UI Integration

### Inventory UI Manager

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class InventoryUI : MonoBehaviour
{
    [Header("Variables")]
    [SerializeField] private IntVariable currentItemCount;
    [SerializeField] private IntVariable inventoryCapacity;
    [SerializeField] private StringVariable lastPickedUpItem;
    
    [Header("Events")]
    [SerializeField] private InventoryEvent onInventoryChanged;
    [SerializeField] private GameEvent onInventoryFull;
    
    [Header("UI Elements")]
    [SerializeField] private TextMeshProUGUI itemCountText;
    [SerializeField] private TextMeshProUGUI lastPickupText;
    [SerializeField] private GameObject fullInventoryWarning;
    [SerializeField] private InventorySlotUI[] slotUIs;
    
    private InventoryManager inventoryManager;
    
    private void Start()
    {
        inventoryManager = FindObjectOfType<InventoryManager>();
        InitializeUI();
    }
    
    private void OnEnable()
    {
        // Subscribe to variable changes
        currentItemCount.OnValueChanged += UpdateItemCountDisplay;
        lastPickedUpItem.OnValueChanged += UpdateLastPickupDisplay;
        
        // Subscribe to events
        onInventoryChanged.AddListener(UpdateSlotDisplay);
        onInventoryFull.AddListener(ShowInventoryFullWarning);
    }
    
    private void OnDisable()
    {
        // Unsubscribe from variable changes
        currentItemCount.OnValueChanged -= UpdateItemCountDisplay;
        lastPickedUpItem.OnValueChanged -= UpdateLastPickupDisplay;
        
        // Unsubscribe from events
        onInventoryChanged.RemoveListener(UpdateSlotDisplay);
        onInventoryFull.RemoveListener(ShowInventoryFullWarning);
    }
    
    private void InitializeUI()
    {
        UpdateItemCountDisplay(currentItemCount.Value);
        UpdateLastPickupDisplay(lastPickedUpItem.Value);
        
        // Initialize all slots
        for (int i = 0; i < slotUIs.Length; i++)
        {
            UpdateSlotUI(i);
        }
    }
    
    private void UpdateItemCountDisplay(int newCount)
    {
        itemCountText.text = $"{newCount}/{inventoryCapacity.Value}";
    }
    
    private void UpdateLastPickupDisplay(string itemName)
    {
        if (!string.IsNullOrEmpty(itemName))
        {
            lastPickupText.text = $"Picked up: {itemName}";
            // Hide after a few seconds
            Invoke(nameof(ClearLastPickupText), 3f);
        }
    }
    
    private void ClearLastPickupText()
    {
        lastPickupText.text = "";
    }
    
    private void UpdateSlotDisplay(InventoryEventArgs args)
    {
        UpdateSlotUI(args.slotIndex);
    }
    
    private void UpdateSlotUI(int slotIndex)
    {
        if (slotIndex < 0 || slotIndex >= slotUIs.Length) return;
        
        var slot = inventoryManager.GetSlot(slotIndex);
        var slotUI = slotUIs[slotIndex];
        
        if (slot.IsEmpty)
        {
            slotUI.ClearSlot();
        }
        else
        {
            slotUI.SetSlot(slot.item, slot.quantity);
        }
    }
    
    private void ShowInventoryFullWarning()
    {
        fullInventoryWarning.SetActive(true);
        Invoke(nameof(HideInventoryFullWarning), 2f);
    }
    
    private void HideInventoryFullWarning()
    {
        fullInventoryWarning.SetActive(false);
    }
}
```

### Individual Slot UI

```csharp
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class InventorySlotUI : MonoBehaviour
{
    [SerializeField] private Image itemIcon;
    [SerializeField] private TextMeshProUGUI quantityText;
    [SerializeField] private Button slotButton;
    
    private Item currentItem;
    private int currentQuantity;
    
    private void Start()
    {
        slotButton.onClick.AddListener(OnSlotClicked);
    }
    
    public void SetSlot(Item item, int quantity)
    {
        currentItem = item;
        currentQuantity = quantity;
        
        itemIcon.sprite = item.icon;
        itemIcon.enabled = true;
        
        quantityText.text = quantity > 1 ? quantity.ToString() : "";
        quantityText.enabled = quantity > 1;
    }
    
    public void ClearSlot()
    {
        currentItem = null;
        currentQuantity = 0;
        
        itemIcon.sprite = null;
        itemIcon.enabled = false;
        
        quantityText.text = "";
        quantityText.enabled = false;
    }
    
    private void OnSlotClicked()
    {
        if (currentItem != null)
        {
            // Handle slot interaction (use item, move item, etc.)
            Debug.Log($"Clicked on {currentItem.name} (x{currentQuantity})");
        }
    }
}
```

## Usage Examples

### Setting Up the System

1. **Create Variables**:
   - Create > SoapKit > Variables > Int Variable (name: "InventoryCapacity", set to 20)
   - Create > SoapKit > Variables > Int Variable (name: "CurrentItemCount", set to 0)
   - Create > SoapKit > Variables > String Variable (name: "LastPickedUpItem")

2. **Create Events**:
   - Create > SoapKit > Events > Custom > Item Event (name: "OnItemAdded")
   - Create > SoapKit > Events > Custom > Item Event (name: "OnItemRemoved")
   - Create > SoapKit > Events > Custom > Inventory Event (name: "OnInventoryChanged")
   - Create > SoapKit > Events > Unit Event (name: "OnInventoryFull")

3. **Assign References**: Wire up the InventoryManager and InventoryUI components with the created assets.

### Integration with Other Systems

The inventory system integrates seamlessly with:

- [Health System](./health-system) - For consumable items
- [UI Integration](./ui-integration) - For display components  
- [State Management](./state-management) - For save/load functionality

## Benefits of This Approach

1. **Decoupled Design**: UI updates automatically when inventory changes
2. **Event-Driven**: Systems communicate through events, not direct references
3. **Debuggable**: Use SoapKit Debug Window to monitor inventory state
4. **Extensible**: Easy to add new item types and behaviors
5. **Reusable**: Components can be used across different scenes

## Next Steps

- Explore [UI Integration](./ui-integration) patterns
- Learn about [State Management](./state-management) for persistence
- Check out advanced [Health System](./health-system) integration
# Variables API Reference

Complete API reference for SoapKit's variable system.

## Base Classes

### BaseVariable&lt;T&gt;

The foundation class for all variables in SoapKit.

```csharp
[System.Serializable]
public abstract class BaseVariable<T> : ScriptableObject, IReadOnlyVariable<T>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `Value` | `T` | Current value of the variable |
| `EnableChangeNotification` | `bool` | Whether to trigger change events (default: true) |

#### Events

| Event | Type | Description |
|-------|------|-------------|
| `OnValueChanged` | `System.Action<T>` | Triggered when value changes |

#### Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `SetValue(T newValue)` | `void` | Sets the variable value and triggers change events |
| `NotifyValueChanged()` | `void` | Manually triggers change notification |
| `TriggerChangeNotification()` | `void` | Context menu method for testing |

#### Protected Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `AreValuesEqual(T a, T b)` | `bool` | Override for custom equality comparison |

#### Editor Integration

- **Context Menu**: "Trigger Change Notification" for testing
- **Custom Inspector**: Enhanced property drawer with debug tools
- **Real-time Monitoring**: Live value display in SoapKit Debug Window

---

## Primitive Variable Types

### BoolVariable

Boolean variable with logical operations.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Bool Variable")]
public class BoolVariable : BaseVariable<bool>
```

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Toggle()` | - | Toggles the boolean value |
| `SetTrue()` | - | Sets value to true |
| `SetFalse()` | - | Sets value to false |
| `And(bool other)` | `bool other` | Logical AND operation |
| `Or(bool other)` | `bool other` | Logical OR operation |
| `Xor(bool other)` | `bool other` | Logical XOR operation |

#### Usage Example

```csharp
[SerializeField] private BoolVariable isGamePaused;

private void TogglePause()
{
    isGamePaused.Toggle();
}

private void OnEnable()
{
    isGamePaused.OnValueChanged += OnPauseStateChanged;
}
```

### IntVariable

Integer variable with mathematical operations and constraints.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Int Variable")]
public class IntVariable : BaseVariable<int>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `MinValue` | `int` | Minimum allowed value (optional) |
| `MaxValue` | `int` | Maximum allowed value (optional) |
| `HasMinValue` | `bool` | Whether minimum constraint is active |
| `HasMaxValue` | `bool` | Whether maximum constraint is active |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Add(int amount)` | `int amount` | Adds to current value |
| `Subtract(int amount)` | `int amount` | Subtracts from current value |
| `Multiply(int factor)` | `int factor` | Multiplies current value |
| `Divide(int divisor)` | `int divisor` | Divides current value |
| `Increment()` | - | Adds 1 to current value |
| `Decrement()` | - | Subtracts 1 from current value |
| `SetMin(int min)` | `int min` | Sets minimum constraint |
| `SetMax(int max)` | `int max` | Sets maximum constraint |
| `Clamp()` | - | Applies min/max constraints |

#### Usage Example

```csharp
[SerializeField] private IntVariable playerHealth;

private void Start()
{
    playerHealth.SetMax(100);
    playerHealth.SetValue(100);
}

private void TakeDamage(int damage)
{
    playerHealth.Subtract(damage);
    if (playerHealth.Value <= 0)
    {
        // Player died
    }
}
```

### FloatVariable

Float variable with mathematical operations, constraints, and precision control.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Float Variable")]
public class FloatVariable : BaseVariable<float>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `MinValue` | `float` | Minimum allowed value |
| `MaxValue` | `float` | Maximum allowed value |
| `DecimalPlaces` | `int` | Rounding precision (default: 2) |
| `HasMinValue` | `bool` | Whether minimum constraint is active |
| `HasMaxValue` | `bool` | Whether maximum constraint is active |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Add(float amount)` | `float amount` | Adds to current value |
| `Subtract(float amount)` | `float amount` | Subtracts from current value |
| `Multiply(float factor)` | `float factor` | Multiplies current value |
| `Divide(float divisor)` | `float divisor` | Divides current value |
| `AddPercentage(float percentage)` | `float percentage` | Adds percentage of current value |
| `SubtractPercentage(float percentage)` | `float percentage` | Subtracts percentage of current value |
| `Round()` | - | Rounds to specified decimal places |
| `SetMin(float min)` | `float min` | Sets minimum constraint |
| `SetMax(float max)` | `float max` | Sets maximum constraint |
| `Lerp(float target, float t)` | `float target, float t` | Linear interpolation |

#### Usage Example

```csharp
[SerializeField] private FloatVariable playerSpeed;

private void Start()
{
    playerSpeed.SetMin(0f);
    playerSpeed.SetMax(10f);
    playerSpeed.SetValue(5f);
}

private void ApplySpeedBoost()
{
    playerSpeed.AddPercentage(0.5f); // 50% speed boost
}
```

### StringVariable

String variable with text manipulation operations and constraints.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/String Variable")]
public class StringVariable : BaseVariable<string>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `MaxLength` | `int` | Maximum string length (0 = unlimited) |
| `MinLength` | `int` | Minimum string length |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Append(string text)` | `string text` | Appends text to current value |
| `Prepend(string text)` | `string text` | Prepends text to current value |
| `Replace(string oldValue, string newValue)` | `string oldValue, string newValue` | Replaces text |
| `Trim()` | - | Removes leading/trailing whitespace |
| `ToUpper()` | - | Converts to uppercase |
| `ToLower()` | - | Converts to lowercase |
| `Clear()` | - | Sets value to empty string |
| `IsEmpty()` | - | Returns true if string is null or empty |

#### Usage Example

```csharp
[SerializeField] private StringVariable playerName;

private void SetPlayerName(string name)
{
    playerName.SetValue(name.Trim());
}

private void AddTitle(string title)
{
    playerName.Prepend($"{title} ");
}
```

---

## Unity Type Variables

### Vector2Variable

2D vector variable with vector operations and constraints.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Vector2 Variable")]
public class Vector2Variable : BaseVariable<Vector2>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `MaxMagnitude` | `float` | Maximum vector magnitude |
| `HasMagnitudeLimit` | `bool` | Whether magnitude constraint is active |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Add(Vector2 vector)` | `Vector2 vector` | Vector addition |
| `Subtract(Vector2 vector)` | `Vector2 vector` | Vector subtraction |
| `Scale(float factor)` | `float factor` | Scales vector by factor |
| `Normalize()` | - | Normalizes the vector |
| `ClampMagnitude()` | - | Clamps to max magnitude |
| `Lerp(Vector2 target, float t)` | `Vector2 target, float t` | Linear interpolation |
| `MoveTowards(Vector2 target, float maxDistance)` | `Vector2 target, float maxDistance` | Moves towards target |
| `SetX(float x)` | `float x` | Sets X component |
| `SetY(float y)` | `float y` | Sets Y component |

### Vector3Variable

3D vector variable with comprehensive vector operations.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Vector3 Variable")]
public class Vector3Variable : BaseVariable<Vector3>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `MaxMagnitude` | `float` | Maximum vector magnitude |
| `HasMagnitudeLimit` | `bool` | Whether magnitude constraint is active |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `Add(Vector3 vector)` | `Vector3 vector` | Vector addition |
| `Subtract(Vector3 vector)` | `Vector3 vector` | Vector subtraction |
| `Scale(float factor)` | `float factor` | Scales vector uniformly |
| `Scale(Vector3 scale)` | `Vector3 scale` | Scales vector per-component |
| `Normalize()` | - | Normalizes the vector |
| `ClampMagnitude()` | - | Clamps to max magnitude |
| `Lerp(Vector3 target, float t)` | `Vector3 target, float t` | Linear interpolation |
| `Slerp(Vector3 target, float t)` | `Vector3 target, float t` | Spherical interpolation |
| `MoveTowards(Vector3 target, float maxDistance)` | `Vector3 target, float maxDistance` | Moves towards target |
| `SetX(float x)` | `float x` | Sets X component |
| `SetY(float y)` | `float y` | Sets Y component |
| `SetZ(float z)` | `float z` | Sets Z component |

### ColorVariable

Color variable with color manipulation operations.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Color Variable")]
public class ColorVariable : BaseVariable<Color>
```

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `SetRed(float r)` | `float r` | Sets red component (0-1) |
| `SetGreen(float g)` | `float g` | Sets green component (0-1) |
| `SetBlue(float b)` | `float b` | Sets blue component (0-1) |
| `SetAlpha(float a)` | `float a` | Sets alpha component (0-1) |
| `Lerp(Color target, float t)` | `Color target, float t` | Color interpolation |
| `ToGrayscale()` | - | Converts to grayscale |
| `Invert()` | - | Inverts RGB components |
| `Brighten(float amount)` | `float amount` | Increases brightness |
| `Darken(float amount)` | `float amount` | Decreases brightness |

### GameObjectVariable

GameObject reference variable with component access and validation.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/GameObject Variable")]
public class GameObjectVariable : BaseVariable<GameObject>
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `RequiredTag` | `string` | Required tag for validation |
| `ValidateTag` | `bool` | Whether to enforce tag validation |

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `GetComponent<T>()` | - | Gets component of type T |
| `HasComponent<T>()` | - | Checks if component exists |
| `IsActive()` | - | Returns active state |
| `SetActive(bool active)` | `bool active` | Sets active state |
| `DestroyGameObject()` | - | Destroys the GameObject |
| `ValidateTagRequirement()` | - | Checks tag validation |

### TransformVariable

Transform reference variable with position and rotation access.

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Transform Variable")]
public class TransformVariable : BaseVariable<Transform>
```

#### Specialized Methods

| Method | Parameters | Description |
|--------|------------|-------------|
| `GetPosition()` | - | Returns world position |
| `SetPosition(Vector3 position)` | `Vector3 position` | Sets world position |
| `GetLocalPosition()` | - | Returns local position |
| `SetLocalPosition(Vector3 position)` | `Vector3 position` | Sets local position |
| `GetRotation()` | - | Returns world rotation |
| `SetRotation(Quaternion rotation)` | `Quaternion rotation` | Sets world rotation |
| `GetParent()` | - | Returns parent Transform |
| `GetChildCount()` | - | Returns number of children |

---

## Best Practices

### Variable Creation
1. Use descriptive names for ScriptableObject assets
2. Organize variables in folders by type or system
3. Set appropriate constraints during asset creation
4. Add tooltips and descriptions for clarity

### Value Management
1. Always check for null references before use
2. Use SetValue() method instead of direct Value assignment
3. Subscribe to OnValueChanged for reactive behavior
4. Unsubscribe from events in OnDisable/OnDestroy

### Performance Optimization
1. Disable change notifications during bulk operations
2. Use appropriate variable types (Int vs Float)
3. Implement custom equality comparison for complex types
4. Monitor listener counts in debug tools

### Debugging
1. Use SoapKit Debug Window for real-time monitoring
2. Enable event history for development builds
3. Use context menu actions for testing
4. Implement validation in custom variables

---

## See Also

- [Events API Reference](./events) - Event system documentation
- [Editor Tools API](./editor-tools) - Development tools reference
- [Custom Variables Guide](../advanced/custom-variables) - Creating custom variable types
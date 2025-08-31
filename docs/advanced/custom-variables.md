# Custom Variables

Learn how to create your own custom variable types in SoapKit.

## Creating Custom Variable Types

SoapKit's architecture allows you to extend the system with your own custom variable types. This is useful when you need to work with data types not covered by the built-in variables.

### Basic Custom Variable

To create a custom variable type, inherit from `BaseVariable<T>`:

```csharp
using FarmGrowthToolkit.Soap;
using UnityEngine;

[CreateAssetMenu(menuName = "SoapKit/Variables/Custom/MyData Variable")]
public class MyDataVariable : BaseVariable<MyData>
{
    // Your custom implementation here
}
```

### Custom Operations

Add specialized operations for your data type:

```csharp
[CreateAssetMenu(menuName = "SoapKit/Variables/Custom/MyData Variable")]
public class MyDataVariable : BaseVariable<MyData>
{
    [ContextMenu("Reset Data")]
    public void ResetData()
    {
        SetValue(new MyData());
    }
    
    public void ModifyProperty(float newValue)
    {
        MyData current = Value;
        current.someProperty = newValue;
        SetValue(current);
    }
}
```

### Validation and Constraints

Implement custom validation logic:

```csharp
public class MyDataVariable : BaseVariable<MyData>
{
    [SerializeField] private float minValue;
    [SerializeField] private float maxValue;
    
    public override void SetValue(MyData newValue)
    {
        if (newValue.someProperty < minValue || newValue.someProperty > maxValue)
        {
            Debug.LogWarning($"Value {newValue.someProperty} is outside valid range [{minValue}, {maxValue}]");
            return;
        }
        
        base.SetValue(newValue);
    }
}
```

## Advanced Features

### Custom Equality Comparison

Override equality comparison for complex types:

```csharp
public class MyDataVariable : BaseVariable<MyData>
{
    protected override bool AreValuesEqual(MyData a, MyData b)
    {
        if (a == null && b == null) return true;
        if (a == null || b == null) return false;
        
        return Mathf.Approximately(a.someProperty, b.someProperty);
    }
}
```

### Editor Integration

Create custom property drawers for enhanced editor experience:

```csharp
#if UNITY_EDITOR
using UnityEditor;

[CustomPropertyDrawer(typeof(MyDataVariable))]
public class MyDataVariableDrawer : BaseVariablePropertyDrawer
{
    // Custom inspector implementation
}
#endif
```

## Best Practices

1. **Consistent Naming**: Follow the pattern `[TypeName]Variable`
2. **Menu Organization**: Use descriptive menu paths in `CreateAssetMenu`
3. **Validation**: Always validate input values
4. **Documentation**: Add tooltips and help text
5. **Testing**: Create test cases for your custom variables

## Next Steps

- Explore [Performance Optimization](./performance) techniques
- Learn about [Design Patterns](./patterns) with custom variables
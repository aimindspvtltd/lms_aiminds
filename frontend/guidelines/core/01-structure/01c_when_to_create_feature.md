# When to Create a Feature

## Create New Feature When

✅ Has 5+ components
✅ Has own routes (/users, /courses)
✅ Has own domain logic
✅ Has own API endpoints
✅ Independent functionality

## Examples

```
features/users/           ✅ Yes - user management
features/courses/         ✅ Yes - course system
features/dashboard/       ✅ Yes - dashboard with widgets
```

## Don't Create Feature When

❌ Single component
❌ Just UI (no logic)
❌ Shared across many features

**Use components/common/ instead**

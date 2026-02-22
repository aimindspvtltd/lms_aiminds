# Form Components Reference

**For:** EXECUTOR  
**Purpose:** Form component patterns with React Hook Form

---

## FormInput

```typescript
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input type="email" placeholder="email@example.com" {...field} />
      </FormControl>
      <FormDescription>We'll never share your email.</FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

## FormSelect

```typescript
<FormField
  control={form.control}
  name="role"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Role</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## FormCheckbox

```typescript
<FormField
  control={form.control}
  name="terms"
  render={({ field }) => (
    <FormItem className="flex items-center space-x-2">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
      <FormLabel className="!mt-0">Accept terms</FormLabel>
      <FormMessage />
    </FormItem>
  )}
/>
```

## FormTextarea

```typescript
<FormField
  control={form.control}
  name="bio"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Bio</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Tell us about yourself" 
          rows={4}
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## FormSwitch

```typescript
<FormField
  control={form.control}
  name="notifications"
  render={({ field }) => (
    <FormItem className="flex items-center justify-between">
      <div>
        <FormLabel>Notifications</FormLabel>
        <FormDescription>Receive email notifications</FormDescription>
      </div>
      <FormControl>
        <Switch
          checked={field.value}
          onCheckedChange={field.onChange}
        />
      </FormControl>
    </FormItem>
  )}
/>
```

**See 07a_react_hook_form.md for complete patterns!**

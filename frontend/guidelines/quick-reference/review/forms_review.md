# Forms Review

**For:** REVIEWER  
**Purpose:** Review form implementation

---

## 📋 Forms Review

### ✅ 1. Form Library

**Check:**
- [ ] React Hook Form used (for 4+ fields)
- [ ] Zod for validation
- [ ] Form component from Shadcn

```typescript
// ✅ Good
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: { ... },
});

// ❌ Bad
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
// Manual validation...
```

---

### ✅ 2. Validation Schema

**Check:**
- [ ] Zod schema defined
- [ ] All fields validated
- [ ] Error messages clear

```typescript
// ✅ Good
const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Must be 8+ characters'),
  name: z.string().min(2, 'Required'),
});

// ❌ Bad
// No schema, manual validation
```

---

### ✅ 3. Form Structure

**Check:**
- [ ] FormField for each input
- [ ] FormLabel present
- [ ] FormMessage for errors
- [ ] FormDescription if needed

```typescript
// ✅ Good
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Email</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>

// ❌ Bad
<Input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

### ✅ 4. Submit Handling

**Check:**
- [ ] form.handleSubmit used
- [ ] Button disabled during submission
- [ ] Success/error feedback shown

```typescript
// ✅ Good
<form onSubmit={form.handleSubmit(onSubmit)}>
  <Button 
    type="submit" 
    disabled={form.formState.isSubmitting}
  >
    {form.formState.isSubmitting ? 'Saving...' : 'Save'}
  </Button>
</form>

// ❌ Bad
<form onSubmit={handleSubmit}>
  <Button type="submit">Save</Button>
</form>
```

---

### ✅ 5. Error Display

**Check:**
- [ ] Field errors shown below inputs
- [ ] Error styling applied
- [ ] Clear error messages

```typescript
// ✅ Good
<FormField
  control={form.control}
  name="email"
  render={({ field }) => (
    <FormItem>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />  // Shows error
    </FormItem>
  )}
/>

// ❌ Bad
<Input name="email" />
// No error display
```

---

### ✅ 6. Default Values

**Check:**
- [ ] Default values provided
- [ ] Edit forms pre-filled
- [ ] Types match schema

```typescript
// ✅ Good
const form = useForm<FormValues>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    email: user?.email ?? '',
    name: user?.name ?? '',
  },
});

// ❌ Bad
const form = useForm();  // No defaults
```

---

### ✅ 7. Form Reset

**Check:**
- [ ] Form reset after successful submit
- [ ] Reset button if needed

```typescript
// ✅ Good
const onSubmit = async (values: FormValues) => {
  await createUser(values);
  form.reset();
  toast({ title: 'Success' });
};

<Button 
  type="button" 
  onClick={() => form.reset()}
>
  Reset
</Button>
```

---

### ✅ 8. Accessibility

**Check:**
- [ ] Labels associated with inputs
- [ ] Error messages linked (aria-describedby)
- [ ] Required fields marked

```typescript
// ✅ Good
<FormLabel htmlFor="email">Email *</FormLabel>
<Input 
  id="email"
  aria-required="true"
  aria-invalid={!!errors.email}
/>

// ❌ Bad
<label>Email</label>
<input />  // No association
```

---

## 🚨 Red Flags

- ❌ No form library (manual state)
- ❌ No validation
- ❌ No error display
- ❌ Submit not disabled
- ❌ No loading state
- ❌ No success feedback

---

## ✅ Pass Criteria

- ✅ React Hook Form used
- ✅ Zod validation present
- ✅ All fields validated
- ✅ Errors displayed
- ✅ Submit handling correct
- ✅ Accessible
- ✅ Success/error feedback

---

**Verdict:** PASS / FAIL / NEEDS WORK

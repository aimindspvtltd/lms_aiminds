# Form Patterns

## Multi-Step Form
```typescript
const steps = ['personal', 'address', 'review'];
const [currentStep, setCurrentStep] = useState(0);

<form>
  {currentStep === 0 && <PersonalInfoStep />}
  {currentStep === 1 && <AddressStep />}
  {currentStep === 2 && <ReviewStep />}
  
  <Button onClick={() => setCurrentStep(prev => prev - 1)}>
    Back
  </Button>
  <Button onClick={() => setCurrentStep(prev => prev + 1)}>
    Next
  </Button>
</form>
```

## Dynamic Fields
```typescript
const { fields, append, remove } = useFieldArray({
  control: form.control,
  name: "items",
});

<div>
  {fields.map((field, index) => (
    <div key={field.id}>
      <Input {...form.register(`items.${index}.name`)} />
      <Button onClick={() => remove(index)}>Remove</Button>
    </div>
  ))}
  <Button onClick={() => append({ name: '' })}>Add</Button>
</div>
```

## Conditional Fields
```typescript
const type = form.watch('type');

<form>
  <FormField name="type" />
  
  {type === 'company' && (
    <FormField name="companyName" />
  )}
  
  {type === 'individual' && (
    <FormField name="firstName" />
  )}
</form>
```

# File Upload

## Basic File Input
```typescript
<FormField
  control={form.control}
  name="file"
  render={({ field: { value, onChange, ...field } }) => (
    <FormItem>
      <FormLabel>File</FormLabel>
      <FormControl>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0])}
          {...field}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## With Preview
```typescript
const [preview, setPreview] = useState<string>();

const handleFileChange = (file: File) => {
  form.setValue('file', file);
  const reader = new FileReader();
  reader.onloadend = () => setPreview(reader.result as string);
  reader.readAsDataURL(file);
};

<div>
  <Input
    type="file"
    accept="image/*"
    onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
  />
  {preview && <img src={preview} alt="Preview" className="mt-4 h-32" />}
</div>
```

## Drag and Drop
```typescript
const onDrop = useCallback((acceptedFiles: File[]) => {
  const file = acceptedFiles[0];
  form.setValue('file', file);
}, [form]);

const { getRootProps, getInputProps, isDragActive } = useDropzone({
  onDrop,
  accept: { 'image/*': [] },
  maxFiles: 1,
});

<div {...getRootProps()} className={cn(
  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
  isDragActive && "border-primary bg-primary/10"
)}>
  <input {...getInputProps()} />
  <p>Drag file here or click to select</p>
</div>
```

# Import Aliases

## Configuration

```typescript
// vite.config.ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},

// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Usage

```typescript
// ✅ Good
import { Button } from '@/components/ui/button';
import { useUsers } from '@/features/users';
import { cn } from '@/lib/utils/cn';

// ❌ Bad
import { Button } from '../../../components/ui/button';
```

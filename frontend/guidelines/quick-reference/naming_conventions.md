# Naming Conventions

**For:** ALL ROLES  
**Purpose:** Consistent naming across the codebase

---

## 📁 File Naming

### Components
```
✅ PascalCase
UserCard.tsx
DataTable.tsx
LoadingSpinner.tsx

❌ Not
userCard.tsx
user-card.tsx
user_card.tsx
```

### Hooks
```
✅ camelCase with 'use' prefix
useUsers.ts
useDebounce.ts
useLocalStorage.ts

❌ Not
Users.ts
get-users.ts
fetchUsers.ts
```

### Services
```
✅ camelCase with '.service.ts' suffix
user.service.ts
auth.service.ts
course.service.ts

❌ Not
userService.ts
user-service.ts
users.ts
```

### Types
```
✅ camelCase with '.types.ts' suffix
user.types.ts
api.types.ts
common.types.ts

❌ Not
userTypes.ts
user-types.ts
types.ts
```

### Utilities
```
✅ camelCase with '.utils.ts' or specific suffix
date.utils.ts
format.utils.ts
cn.ts (class names)

❌ Not
dateUtils.ts
date-utils.ts
utils.ts (too generic)
```

### Stores
```
✅ camelCase with 'Store' suffix
authStore.ts
themeStore.ts
uiStore.ts

❌ Not
AuthStore.ts
auth-store.ts
auth.ts
```

---

## 🎯 Component Naming

### Components
```
✅ PascalCase, noun-based
UserCard
DataTable
LoadingSpinner
SearchBar

❌ Not
usercard (lowercase)
User_Card (underscore)
user-card (kebab)
```

### Component with Action
```
✅ Verb + noun
CreateUserForm
EditProfileModal
DeleteConfirmDialog

❌ Not
UserFormCreate
ProfileModalEdit
ConfirmDialogDelete
```

### Layout Components
```
✅ Descriptive + type
MainLayout
DashboardLayout
AuthLayout
Header
Sidebar
Footer

❌ Not
Layout1
Layout2
MainPage
```

---

## 🎣 Hook Naming

### Custom Hooks
```
✅ use + descriptive name
useUsers()
useDebounce()
useLocalStorage()
useMediaQuery()

❌ Not
getUsers() (not a hook)
Users() (missing use prefix)
fetchUsers() (not a hook)
```

### Query Hooks
```
✅ use + resource name (plural for lists)
useUsers()    // List
useUser(id)   // Single
useCourses()
useCourse(id)

❌ Not
useUserList()
useGetUsers()
useFetchUser()
```

### Mutation Hooks
```
✅ use + action + resource
useCreateUser()
useUpdateUser()
useDeleteUser()
useUploadFile()

❌ Not
useUserCreate()
useAddUser()
useRemoveUser()
```

---

## 🔌 Service Naming

### Service Objects
```
✅ resourceName + Service
export const userService = { ... }
export const authService = { ... }
export const courseService = { ... }

❌ Not
export const UserService = { ... } (PascalCase)
export const users = { ... } (no service suffix)
```

### Service Methods
```
✅ verb + resource (CRUD pattern)
userService.getUsers()
userService.getUser(id)
userService.createUser(data)
userService.updateUser(id, data)
userService.deleteUser(id)

❌ Not
userService.fetchUsers()
userService.add()
userService.remove()
```

---

## 💾 State Naming

### useState
```
✅ is/has + adjective OR noun + set + noun
const [isOpen, setIsOpen] = useState(false);
const [hasError, setHasError] = useState(false);
const [user, setUser] = useState<User | null>(null);
const [users, setUsers] = useState<User[]>([]);

❌ Not
const [open, setOpen] = useState(false); // Not clear if boolean
const [error, setError] = useState(false); // Confusing type
const [data, setData] = useState([]); // Too generic
```

### Boolean States
```
✅ is/has/should/can + adjective
isOpen
isLoading
isDisabled
hasError
hasData
shouldFetch
canEdit

❌ Not
open
loading
disabled
error
```

### Array/List States
```
✅ Plural noun
users
courses
items
selectedIds

❌ Not
userList
userArray
userData
```

---

## 🎨 Props Naming

### Component Props
```
✅ Descriptive, clear purpose
interface UserCardProps {
  user: User;
  onEdit?: (user: User) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
  className?: string;
}

❌ Not
interface Props { ... }  // Too generic
interface IUserCardProps { ... }  // No I prefix
```

### Event Handler Props
```
✅ on + event name
onClick
onChange
onSubmit
onDelete
onEdit
onClose

❌ Not
handleClick (that's for internal handlers)
clickHandler
click
```

### Boolean Props
```
✅ is/has/should/can + adjective
isOpen
isDisabled
hasError
showActions
canEdit

❌ Not
open
disabled
error
actions
```

---

## 🔑 Variable Naming

### Constants
```
✅ SCREAMING_SNAKE_CASE for true constants
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_PAGE_SIZE = 10;

✅ camelCase for config objects
const apiConfig = { ... };
const themeConfig = { ... };

❌ Not
const maxFileSize = 5000000; (not constant-like)
const api_base_url = '...'; (not constant style)
```

### Variables
```
✅ camelCase, descriptive
const userId = '123';
const currentUser = getUser();
const filteredUsers = users.filter(...);
const isAuthenticated = checkAuth();

❌ Not
const UserID = '123'; (PascalCase)
const user_id = '123'; (snake_case)
const u = getUser(); (too short)
const tempVar = users.filter(...); (not descriptive)
```

---

## 📊 Type Naming

### Interfaces
```
✅ PascalCase, descriptive
interface User { ... }
interface UserCardProps { ... }
interface ApiResponse<T> { ... }
interface CreateUserDto { ... }

❌ Not
interface IUser { ... } (no I prefix)
interface user { ... } (camelCase)
interface UserInterface { ... } (redundant suffix)
```

### Types
```
✅ PascalCase, descriptive
type Status = 'active' | 'inactive';
type Role = 'admin' | 'user';
type UserId = string;

❌ Not
type status = '...'; (camelCase)
type USER_STATUS = '...'; (SCREAMING_SNAKE_CASE)
```

### Generic Types
```
✅ Single uppercase letter or descriptive
type ApiResponse<T> = { ... };
type Nullable<T> = T | null;
type DeepPartial<T> = { ... };

❌ Not
type ApiResponse<data> = { ... }; (lowercase)
type ApiResponse<TYPE> = { ... }; (all caps)
```

---

## 🗂️ Folder Naming

### Feature Folders
```
✅ kebab-case, singular
features/user-management/
features/course-enrollment/
features/auth/

❌ Not
features/UserManagement/
features/users/
features/user_management/
```

### Component Folders
```
✅ kebab-case
components/ui/
components/layout/
components/common/

❌ Not
components/UI/
components/Layout/
```

---

## 🎯 Function Naming

### Regular Functions
```
✅ camelCase, verb-based
function getUser(id: string) { }
function formatDate(date: Date) { }
function calculateTotal(items: Item[]) { }

❌ Not
function GetUser() { } (PascalCase)
function user() { } (no verb)
function get_user() { } (snake_case)
```

### Event Handlers
```
✅ handle + event name
const handleClick = () => { };
const handleSubmit = () => { };
const handleChange = (e) => { };
const handleDelete = (id: string) => { };

❌ Not
const onClick = () => { }; (that's for props)
const click = () => { };
const onClickHandler = () => { };
```

### Utility Functions
```
✅ Descriptive, clear purpose
function formatCurrency(amount: number): string { }
function validateEmail(email: string): boolean { }
function debounce<T>(fn: T, delay: number): T { }

❌ Not
function format() { } (too generic)
function check() { } (not clear)
function util1() { } (meaningless)
```

---

## 📝 Naming Patterns by Use Case

### API Calls
```
Service methods:
- getUsers()
- createUser()
- updateUser()
- deleteUser()

Hooks:
- useUsers()
- useCreateUser()
- useUpdateUser()
- useDeleteUser()
```

### Forms
```
Components:
- CreateUserForm
- EditProfileForm
- LoginForm

Handlers:
- handleSubmit
- handleChange
- handleReset

Validation:
- validateEmail()
- validatePassword()
- validateForm()
```

### Modals/Dialogs
```
Components:
- DeleteConfirmDialog
- EditUserModal
- InfoDialog

State:
- isOpen, setIsOpen
- isDialogOpen, setIsDialogOpen

Handlers:
- handleOpen, handleClose
- handleConfirm, handleCancel
```

---

## ✅ Quick Reference

| Type | Convention | Example |
|------|-----------|---------|
| **Files** |
| Component | PascalCase.tsx | `UserCard.tsx` |
| Hook | camelCase.ts | `useUsers.ts` |
| Service | camelCase.service.ts | `user.service.ts` |
| Type | camelCase.types.ts | `user.types.ts` |
| Utility | camelCase.utils.ts | `date.utils.ts` |
| Store | camelCase Store.ts | `authStore.ts` |
| **Code** |
| Component | PascalCase | `UserCard` |
| Hook | use + PascalCase | `useUsers` |
| Function | camelCase | `formatDate` |
| Variable | camelCase | `userId` |
| Constant | SCREAMING_SNAKE_CASE | `MAX_SIZE` |
| Type/Interface | PascalCase | `User` |
| Boolean | is/has + camelCase | `isOpen` |
| Handler | handle + PascalCase | `handleClick` |
| **Props** |
| Event callback | on + PascalCase | `onClick` |
| Boolean | is/has + camelCase | `isDisabled` |

---

## 🚫 Common Mistakes

### ❌ Inconsistent Casing
```typescript
// ❌ Bad
const UserID = '123';
const user_name = 'John';
const UserEmail = 'john@example.com';

// ✅ Good
const userId = '123';
const userName = 'John';
const userEmail = 'john@example.com';
```

### ❌ Generic Names
```typescript
// ❌ Bad
const data = fetchUsers();
const item = users[0];
const temp = calculateTotal();

// ✅ Good
const users = fetchUsers();
const firstUser = users[0];
const totalAmount = calculateTotal();
```

### ❌ Abbreviations
```typescript
// ❌ Bad
const usr = getUser();
const btn = document.querySelector('button');
const msg = 'Hello';

// ✅ Good
const user = getUser();
const button = document.querySelector('button');
const message = 'Hello';
```

### ❌ Wrong Prefix
```typescript
// ❌ Bad - hooks
const getUsers = () => { }; // Not a hook
const Users = () => { };    // Not a hook

// ✅ Good
const useUsers = () => { }; // Hook

// ❌ Bad - handlers
const onClick = () => { };  // That's for props

// ✅ Good
const handleClick = () => { }; // Handler
```

---

## 🎯 Naming Decision Tree

```
Is it a React component?
├─ YES → PascalCase (UserCard)
└─ NO ↓

Is it a custom hook?
├─ YES → use + PascalCase (useUsers)
└─ NO ↓

Is it a function?
├─ YES → camelCase + verb (getUser, formatDate)
└─ NO ↓

Is it a constant?
├─ YES → SCREAMING_SNAKE_CASE (MAX_SIZE)
└─ NO ↓

Is it a variable?
└─ YES → camelCase (userId, userName)
```

---

## 📚 Resources

**Official naming guides:**
- TypeScript: camelCase for variables, PascalCase for types
- React: PascalCase for components, camelCase for everything else
- Tailwind: kebab-case for classes

**These conventions ensure:**
- ✅ Consistent codebase
- ✅ Easy to read
- ✅ Clear purpose
- ✅ Team alignment

**Follow these conventions for maintainable code!**

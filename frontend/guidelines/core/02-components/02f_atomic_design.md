# Atomic Design

## Atoms
Smallest units: Button, Input, Label

## Molecules
Groups of atoms: FormInput (Label + Input + Error)

## Organisms
Complex components: UserForm, DataTable

## Templates
Page layouts: MainLayout, DashboardLayout

## Pages
Actual pages: UserListPage, UserDetailPage

## Folder Structure
```
components/
├── ui/           # Atoms (Button, Input)
├── form/         # Molecules (FormInput)
├── common/       # Organisms (DataTable)
└── layout/       # Templates (MainLayout)

pages/            # Pages
```

# Frontend Guidelines - Complete File-to-Role Mapping

**Exact file paths organized by role**

---

## 📁 Complete Directory Structure

```
frontend-guidelines/
│
├── README.md                                          [Start Here]
├── ROLE_MAPPING.md                                    [Role Definitions]
│
├── core/
│   │
│   ├── 01-structure/
│   │   ├── 01a_folder_layout.md                      ARCHITECT
│   │   ├── 01b_feature_modules.md                    ARCHITECT
│   │   ├── 01c_when_to_create_feature.md             ARCHITECT
│   │   └── 01d_import_aliases.md                     ARCHITECT
│   │
│   ├── 02-components/
│   │   ├── 02a_component_basics.md                   ARCHITECT, EXECUTOR, UX_DESIGNER, REVIEWER
│   │   ├── 02b_composition_patterns.md               ARCHITECT, EXECUTOR
│   │   ├── 02c_compound_components.md                ARCHITECT, EXECUTOR
│   │   ├── 02d_props_patterns.md                     EXECUTOR, UX_DESIGNER
│   │   ├── 02e_component_rules.md                    REVIEWER, EXECUTOR
│   │   └── 02f_atomic_design.md                      ARCHITECT, UX_DESIGNER
│   │
│   ├── 03-state/
│   │   ├── 03a_state_decision_tree.md                ARCHITECT
│   │   ├── 03b_tanstack_query.md                     EXECUTOR
│   │   ├── 03c_zustand_patterns.md                   EXECUTOR
│   │   ├── 03d_query_keys.md                         EXECUTOR
│   │   └── 03e_optimistic_updates.md                 EXECUTOR
│   │
│   ├── 04-styling/
│   │   ├── 04a_tailwind_config.md                    ARCHITECT, UX_DESIGNER
│   │   ├── 04b_theme_system.md                       UX_DESIGNER
│   │   ├── 04c_dark_mode.md                          UX_DESIGNER, EXECUTOR
│   │   ├── 04d_responsive_design.md                  UX_DESIGNER, EXECUTOR
│   │   ├── 04e_styling_patterns.md                   UX_DESIGNER, EXECUTOR, REVIEWER
│   │   └── 04f_component_variants.md                 UX_DESIGNER
│   │
│   ├── 05-routing/
│   │   ├── 05a_router_setup.md                       ARCHITECT
│   │   ├── 05b_protected_routes.md                   EXECUTOR
│   │   ├── 05c_lazy_loading.md                       EXECUTOR
│   │   └── 05d_route_constants.md                    EXECUTOR
│   │
│   ├── 06-api/
│   │   ├── 06a_service_pattern.md                    ARCHITECT, EXECUTOR
│   │   ├── 06b_custom_hooks.md                       EXECUTOR
│   │   ├── 06c_error_handling.md                     EXECUTOR
│   │   ├── 06d_axios_setup.md                        EXECUTOR
│   │   └── 06e_query_client_config.md                EXECUTOR
│   │
│   ├── 07-forms/
│   │   ├── 07a_react_hook_form.md                    EXECUTOR
│   │   ├── 07b_zod_validation.md                     EXECUTOR
│   │   ├── 07c_form_patterns.md                      EXECUTOR
│   │   └── 07d_file_upload.md                        EXECUTOR
│   │
│   └── 08-auth/
│       ├── 08a_auth_flow.md                          ARCHITECT, EXECUTOR
│       ├── 08b_token_management.md                   EXECUTOR
│       ├── 08c_protected_routes.md                   EXECUTOR
│       └── 08d_role_based_access.md                  EXECUTOR
│
├── components/
│   ├── COMPONENT_LIBRARY.md                          UX_DESIGNER, EXECUTOR, REVIEWER
│   ├── ui-components.md                              EXECUTOR
│   ├── layout-components.md                          EXECUTOR
│   ├── form-components.md                            EXECUTOR
│   └── common-components.md                          EXECUTOR
│
└── quick-reference/
    │
    ├── review/                                       [REVIEWER Primary]
    │   ├── quick_review.md                           REVIEWER
    │   ├── component_review.md                       REVIEWER
    │   ├── typescript_review.md                      REVIEWER
    │   ├── state_review.md                           REVIEWER
    │   ├── styling_review.md                         REVIEWER
    │   ├── accessibility_review.md                   REVIEWER
    │   ├── performance_review.md                     REVIEWER
    │   ├── api_review.md                             REVIEWER
    │   └── forms_review.md                           REVIEWER
    │
    ├── role_lookup.md                       ALL (Master Map)
    ├── architecture_decisions.md                     ARCHITECT
    ├── component_catalog.md                          UX_DESIGNER
    ├── component_library_workflow.md                 EXECUTOR, REVIEWER
    ├── component_entry_template.md                   EXECUTOR
    ├── code_snippets.md                              EXECUTOR, REVIEWER
    ├── styling_patterns.md                           UX_DESIGNER, EXECUTOR
    ├── naming_conventions.md                         ALL
    └── common_mistakes.md                            EXECUTOR, REVIEWER
```

---

## 🏗️ ARCHITECT - Files List

**Total:** 11 files across 6 folders

```
core/01-structure/
├── 01a_folder_layout.md                              ⭐ PRIMARY
├── 01b_feature_modules.md
├── 01c_when_to_create_feature.md
└── 01d_import_aliases.md

core/02-components/
├── 02a_component_basics.md
├── 02b_composition_patterns.md
└── 02f_atomic_design.md

core/03-state/
└── 03a_state_decision_tree.md                        ⭐ PRIMARY

core/04-styling/
└── 04a_tailwind_config.md

core/05-routing/
└── 05a_router_setup.md

core/06-api/
└── 06a_service_pattern.md

core/08-auth/
└── 08a_auth_flow.md

quick-reference/
├── architecture_decisions.md
└── naming_conventions.md
```

---

## 🎨 UX_DESIGNER - Files List

**Total:** 12 files across 3 folders

```
components/
└── COMPONENT_LIBRARY.md                              ⭐ PRIMARY (CHECK FIRST!)

core/02-components/
├── 02a_component_basics.md
├── 02d_props_patterns.md
└── 02f_atomic_design.md

core/04-styling/
├── 04a_tailwind_config.md
├── 04b_theme_system.md                               ⭐ PRIMARY
├── 04c_dark_mode.md
├── 04d_responsive_design.md
├── 04e_styling_patterns.md                           ⭐ PRIMARY
└── 04f_component_variants.md

quick-reference/
├── component_catalog.md
├── styling_patterns.md
└── naming_conventions.md
```

---

## 👨‍💻 EXECUTOR - Files List

**Total:** 23 files across 8 folders

```
components/
├── COMPONENT_LIBRARY.md                              ⭐ PRIMARY (CHECK BEFORE CREATING!)
├── ui-components.md
├── layout-components.md
├── form-components.md
└── common-components.md

core/02-components/
├── 02a_component_basics.md                           ⭐ PRIMARY
├── 02b_composition_patterns.md
├── 02c_compound_components.md
├── 02d_props_patterns.md
└── 02e_component_rules.md

core/03-state/
├── 03b_tanstack_query.md                             ⭐ PRIMARY
├── 03c_zustand_patterns.md
├── 03d_query_keys.md
└── 03e_optimistic_updates.md

core/04-styling/
├── 04c_dark_mode.md
├── 04d_responsive_design.md
└── 04e_styling_patterns.md                           ⭐ PRIMARY

core/05-routing/
├── 05b_protected_routes.md
├── 05c_lazy_loading.md
└── 05d_route_constants.md

core/06-api/
├── 06a_service_pattern.md                            ⭐ PRIMARY
├── 06b_custom_hooks.md                               ⭐ PRIMARY
├── 06c_error_handling.md
├── 06d_axios_setup.md
└── 06e_query_client_config.md

core/07-forms/
├── 07a_react_hook_form.md                            ⭐ PRIMARY
├── 07b_zod_validation.md                             ⭐ PRIMARY
├── 07c_form_patterns.md
└── 07d_file_upload.md

core/08-auth/
├── 08a_auth_flow.md
├── 08b_token_management.md
├── 08c_protected_routes.md
└── 08d_role_based_access.md

quick-reference/
├── component_library_workflow.md                     ⭐ PRIMARY (MUST READ!)
├── component_entry_template.md
├── code_snippets.md
├── styling_patterns.md
├── naming_conventions.md
└── common_mistakes.md
```

---

## 🔍 REVIEWER - Files List

**Total:** 16 files across 4 folders

```
quick-reference/review/
├── quick_review.md                                   ⭐ PRIMARY (START HERE!)
├── component_review.md                               ⭐ PRIMARY
├── typescript_review.md
├── state_review.md
├── styling_review.md
├── accessibility_review.md
├── performance_review.md
├── api_review.md
└── forms_review.md

components/
└── COMPONENT_LIBRARY.md                              ⭐ PRIMARY (VERIFY UPDATES!)

core/02-components/
├── 02a_component_basics.md
└── 02e_component_rules.md

core/04-styling/
└── 04e_styling_patterns.md

quick-reference/
├── component_library_workflow.md                     ⭐ PRIMARY (VERIFY FOLLOWED!)
├── code_snippets.md
├── naming_conventions.md                             ⭐ PRIMARY
└── common_mistakes.md                                ⭐ PRIMARY
```

---

## 📊 File Distribution by Role

| Role | Core Files | Component Files | Review Files | Quick Ref | Total |
|------|-----------|----------------|--------------|-----------|-------|
| **ARCHITECT** | 9 | 0 | 0 | 2 | **11** |
| **UX_DESIGNER** | 8 | 1 | 0 | 3 | **12** |
| **EXECUTOR** | 13 | 5 | 0 | 5 | **23** |
| **REVIEWER** | 2 | 1 | 9 | 4 | **16** |

---

## 🎯 Files by Folder - Who Uses What

### core/01-structure/ (4 files)
```
01a_folder_layout.md              → ARCHITECT
01b_feature_modules.md            → ARCHITECT
01c_when_to_create_feature.md     → ARCHITECT
01d_import_aliases.md             → ARCHITECT
```

### core/02-components/ (6 files)
```
02a_component_basics.md           → ARCHITECT, EXECUTOR, UX_DESIGNER, REVIEWER
02b_composition_patterns.md       → ARCHITECT, EXECUTOR
02c_compound_components.md        → ARCHITECT, EXECUTOR
02d_props_patterns.md             → EXECUTOR, UX_DESIGNER
02e_component_rules.md            → REVIEWER, EXECUTOR
02f_atomic_design.md              → ARCHITECT, UX_DESIGNER
```

### core/03-state/ (5 files)
```
03a_state_decision_tree.md        → ARCHITECT
03b_tanstack_query.md             → EXECUTOR
03c_zustand_patterns.md           → EXECUTOR
03d_query_keys.md                 → EXECUTOR
03e_optimistic_updates.md         → EXECUTOR
```

### core/04-styling/ (6 files)
```
04a_tailwind_config.md            → ARCHITECT, UX_DESIGNER
04b_theme_system.md               → UX_DESIGNER
04c_dark_mode.md                  → UX_DESIGNER, EXECUTOR
04d_responsive_design.md          → UX_DESIGNER, EXECUTOR
04e_styling_patterns.md           → UX_DESIGNER, EXECUTOR, REVIEWER
04f_component_variants.md         → UX_DESIGNER
```

### core/05-routing/ (4 files)
```
05a_router_setup.md               → ARCHITECT
05b_protected_routes.md           → EXECUTOR
05c_lazy_loading.md               → EXECUTOR
05d_route_constants.md            → EXECUTOR
```

### core/06-api/ (5 files)
```
06a_service_pattern.md            → ARCHITECT, EXECUTOR
06b_custom_hooks.md               → EXECUTOR
06c_error_handling.md             → EXECUTOR
06d_axios_setup.md                → EXECUTOR
06e_query_client_config.md        → EXECUTOR
```

### core/07-forms/ (4 files)
```
07a_react_hook_form.md            → EXECUTOR
07b_zod_validation.md             → EXECUTOR
07c_form_patterns.md              → EXECUTOR
07d_file_upload.md                → EXECUTOR
```

### core/08-auth/ (4 files)
```
08a_auth_flow.md                  → ARCHITECT, EXECUTOR
08b_token_management.md           → EXECUTOR
08c_protected_routes.md           → EXECUTOR
08d_role_based_access.md          → EXECUTOR
```

### components/ (5 files)
```
COMPONENT_LIBRARY.md              → UX_DESIGNER, EXECUTOR, REVIEWER
ui-components.md                  → EXECUTOR
layout-components.md              → EXECUTOR
form-components.md                → EXECUTOR
common-components.md              → EXECUTOR
```

### quick-reference/review/ (9 files - REVIEWER Primary)
```
quick_review.md                   → REVIEWER
component_review.md               → REVIEWER
typescript_review.md              → REVIEWER
state_review.md                   → REVIEWER
styling_review.md                 → REVIEWER
accessibility_review.md           → REVIEWER
performance_review.md             → REVIEWER
api_review.md                     → REVIEWER
forms_review.md                   → REVIEWER
```

### quick-reference/ (9 files)
```
role_lookup.md           → ALL ROLES (Master Map)
architecture_decisions.md         → ARCHITECT
component_catalog.md              → UX_DESIGNER
component_library_workflow.md     → EXECUTOR, REVIEWER
component_entry_template.md       → EXECUTOR
code_snippets.md                  → EXECUTOR, REVIEWER
styling_patterns.md               → UX_DESIGNER, EXECUTOR
naming_conventions.md             → ALL ROLES
common_mistakes.md                → EXECUTOR, REVIEWER
```

---

## 🔄 Shared Files Across Roles

### Used by ALL Roles:
```
quick-reference/role_lookup.md
quick-reference/naming_conventions.md
```

### Used by 4 Roles:
```
core/02-components/02a_component_basics.md    → ARCHITECT, EXECUTOR, UX_DESIGNER, REVIEWER
```

### Used by 3 Roles:
```
components/COMPONENT_LIBRARY.md               → UX_DESIGNER, EXECUTOR, REVIEWER
core/04-styling/04e_styling_patterns.md       → UX_DESIGNER, EXECUTOR, REVIEWER
quick-reference/component_library_workflow.md → EXECUTOR, REVIEWER (verify)
quick-reference/code_snippets.md              → EXECUTOR, REVIEWER
quick-reference/common_mistakes.md            → EXECUTOR, REVIEWER
```

### Used by 2 Roles:
```
core/02-components/02b_composition_patterns.md     → ARCHITECT, EXECUTOR
core/02-components/02c_compound_components.md      → ARCHITECT, EXECUTOR
core/02-components/02d_props_patterns.md           → EXECUTOR, UX_DESIGNER
core/02-components/02e_component_rules.md          → REVIEWER, EXECUTOR
core/02-components/02f_atomic_design.md            → ARCHITECT, UX_DESIGNER
core/04-styling/04a_tailwind_config.md             → ARCHITECT, UX_DESIGNER
core/04-styling/04c_dark_mode.md                   → UX_DESIGNER, EXECUTOR
core/04-styling/04d_responsive_design.md           → UX_DESIGNER, EXECUTOR
core/06-api/06a_service_pattern.md                 → ARCHITECT, EXECUTOR
core/08-auth/08a_auth_flow.md                      → ARCHITECT, EXECUTOR
quick-reference/styling_patterns.md                → UX_DESIGNER, EXECUTOR
```

---

## 💡 How to Use This Mapping

### For Claude AI:

**When user says:**
```
You are a REVIEWER. Review this UserCard component.
```

**Claude should load:**
```
quick-reference/review/quick_review.md
quick-reference/review/component_review.md
components/COMPONENT_LIBRARY.md
core/02-components/02a_component_basics.md
core/02-components/02e_component_rules.md
quick-reference/component_library_workflow.md
quick-reference/naming_conventions.md
quick-reference/common_mistakes.md
+ more as needed
```

---

### For Developers:

**Find your role:**
1. Look at your role section above
2. See exact file paths
3. Load those files in your editor/context

**Example - EXECUTOR creating component:**
```
Load these files:
✓ components/COMPONENT_LIBRARY.md (check first!)
✓ core/02-components/02a_component_basics.md
✓ core/04-styling/04e_styling_patterns.md
✓ quick-reference/component_library_workflow.md
✓ quick-reference/code_snippets.md
```

---

## 🎯 Quick Lookup Table

| Need to... | You are... | Load these folders... |
|-----------|-----------|----------------------|
| Design structure | ARCHITECT | core/01-structure/, core/03-state/ |
| Check reusability | UX_DESIGNER | components/, core/04-styling/ |
| Implement code | EXECUTOR | core/02-components/, core/06-api/, core/07-forms/ |
| Review code | REVIEWER | quick-reference/review/, components/ |

---

## 📋 File Loading Priority

### ARCHITECT Priority:
1. ⭐ core/01-structure/01a_folder_layout.md
2. ⭐ core/03-state/03a_state_decision_tree.md
3. core/06-api/06a_service_pattern.md
4. Others as needed

### UX_DESIGNER Priority:
1. ⭐ components/COMPONENT_LIBRARY.md
2. ⭐ core/04-styling/04b_theme_system.md
3. ⭐ core/04-styling/04e_styling_patterns.md
4. Others as needed

### EXECUTOR Priority:
1. ⭐ components/COMPONENT_LIBRARY.md (check first!)
2. ⭐ quick-reference/component_library_workflow.md (must read!)
3. ⭐ core/02-components/02a_component_basics.md
4. ⭐ core/03-state/03b_tanstack_query.md
5. ⭐ core/06-api/06a_service_pattern.md
6. ⭐ core/07-forms/07a_react_hook_form.md
7. ⭐ core/07-forms/07b_zod_validation.md
8. Others as needed

### REVIEWER Priority:
1. ⭐ quick-reference/review/quick_review.md (start here!)
2. ⭐ components/COMPONENT_LIBRARY.md (verify updates!)
3. ⭐ quick-reference/component_library_workflow.md (verify followed!)
4. ⭐ quick-reference/naming_conventions.md
5. ⭐ quick-reference/common_mistakes.md
6. Specific review files as needed

---

## 🎯 Total File Count

```
Total Guideline Files: 45+ files

By Category:
- Core (01-08): 38 files
- Components: 5 files
- Quick Reference: 9 files (+ 9 review files)

By Size:
- Small (100-200 lines): 15 files
- Medium (200-400 lines): 25 files
- Large (400-1000 lines): 5 files

By Role (unique files):
- ARCHITECT only: 4 files
- UX_DESIGNER only: 3 files
- EXECUTOR only: 14 files
- REVIEWER only: 9 files
- Shared: 15 files
```

---

## ✅ Summary

**Every role has:**
- ✅ Clear list of files to load
- ✅ Exact folder paths
- ✅ Priority files marked with ⭐
- ✅ Shared files identified
- ✅ 27-91% token savings vs loading all

**REVIEWER specifically gets:**
- ✅ 9 specialized review checklists
- ✅ Component library verification
- ✅ Naming conventions
- ✅ Common mistakes
- ✅ Workflow verification
- ✅ Total: 16 files optimized for reviewing

**Use this document to know exactly which files to load for each role!**

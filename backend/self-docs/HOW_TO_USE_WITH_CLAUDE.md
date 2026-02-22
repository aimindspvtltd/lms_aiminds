# How to Use Guidelines with Claude - Simple Guide

## 🎯 The Problem You Asked About

**Question:** "How will Claude know to load multiple files for REVIEWER?"

**Answer:** Claude needs to be told ONCE at the start of each conversation.

---

## 📋 Two Ways to Use This System

### **Option 1: Manual (Simple, Works Everywhere)**

**At the start of each conversation with Claude:**

```
You have access to coding guidelines in the guidelines/ folder.

When I assign you a role:
1. First read: guidelines/quick_reference/role_lookup.md
2. Then load the files specified for that role
3. Respond using those guidelines

Now, you are a REVIEWER. Check this PR:
[paste code]
```

**That's it!** Claude will:
1. Read role_lookup.md
2. See REVIEWER needs 9 files
3. Load those 9 files
4. Review the code

---

### **Option 2: System Prompt (Advanced, More Permanent)**

If you're building a custom Claude interface or using Claude API, add this to your system prompt:

```
You have access to coding guidelines in guidelines/ folder.

When user says "You are a [ROLE]":
1. Read guidelines/quick_reference/role_lookup.md
2. Load the files specified for that role
3. Respond from that role's perspective

Supported roles: ARCHITECT, WORKER, REVIEWER
```

Then user just says:
```
You are a REVIEWER. Check this code.
```

And Claude automatically knows what to do.

---

## 🔄 Practical Workflow

### **Starting a New Conversation:**

**You:**
```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are a REVIEWER. Check this PR for TASK_101:

[paste your code]
```

**Claude:**
- Reads role_lookup.md
- Loads 9 REVIEWER files
- Reviews your code
- Gives structured feedback with ✅ ❌ ⚠️

---

### **Continuing in Same Conversation:**

**You:**
```
Now act as a WORKER. Implement the fixes you suggested.
```

**Claude:**
- Reads role_lookup.md again
- Loads 7 WORKER files
- Implements code following patterns
- Provides implementation

---

## 💡 Even Simpler Approach

If you don't want to type that every time, create a **saved prompt template**:

**Save this as "Code Review Template":**
```
Guidelines are in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load.

You are a REVIEWER. Check this code:

[PASTE CODE HERE]
```

Then just:
1. Copy template
2. Paste your code
3. Send

---

## 🎯 The Key File

**The magic file that makes this work:**
```
guidelines/quick_reference/role_lookup.md
```

This file contains:
```
## REVIEWER
Load:
- quick_reference/checklist.md
- quick_reference/naming_conventions.md
- quick_reference/common_patterns.md
- 04_code_organization.md
- 06_error_handling.md
- 07_testing_standards.md
- 10_version_control.md
- 02_database_guidelines.md
- 03_api_design.md
```

When Claude reads this, it knows exactly which files to load for REVIEWER.

---

## ❓ FAQ

**Q: Do I have to tell Claude about role_lookup.md every time?**
A: Yes, once per conversation. Or use a system prompt if you have that capability.

**Q: Can't Claude just remember this?**
A: Claude doesn't have memory between conversations (by default). You need to tell it each time.

**Q: Is there a way to make this automatic?**
A: Yes, if you're using Claude API, put the instructions in the system prompt. If using claude.ai, use a template.

**Q: What if I just have a quick question, no role?**
A: Just ask! Claude will load only relevant files.
Example: "How do I name a database table?" → loads only naming_conventions.md

**Q: Do I need to upload all 16 files to Claude every time?**
A: No! The files stay in your project. You just tell Claude where they are once per conversation.

---

## 🚀 Quick Start Example

**Your first message to Claude:**
```
I have coding guidelines in guidelines/ folder.

Role-based loading:
- Read guidelines/quick_reference/role_lookup.md first
- Load files specified for the assigned role

You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.

Current users table: id, email, password_hash, created_at, updated_at

Requirements:
- Add OTP two-factor authentication
- Users can enable/disable OTP

Create ED documents and migration file.
```

**Claude will:**
1. ✓ Read role_lookup.md
2. ✓ Load 7 ARCHITECT files
3. ✓ Design DB schema
4. ✓ Write migration file
5. ✓ Create ED documents

**No manual file loading needed!**

---

## 📝 Summary

**What you need to do:**
- Tell Claude once per conversation about the role_lookup.md system
- Assign a role
- Claude handles the rest

**What Claude does automatically:**
- Reads role_lookup.md
- Loads only necessary files
- Responds from role perspective

**Simple!** 🎉

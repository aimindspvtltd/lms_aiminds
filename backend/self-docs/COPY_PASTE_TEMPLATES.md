# Copy-Paste Templates for Claude

**Use these templates to quickly start conversations with role-based guidelines.**

---

## 📋 Template 1: ARCHITECT

**Copy and paste this:**

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are an ARCHITECT. Design TASK_[ID]_[Description].

Current state from SOT:
[paste current database schema or system state]

Requirements from PRD:
[paste requirements]

Create ED documents and migration file.
```

---

## 📋 Template 2: WORKER

**Copy and paste this:**

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are a WORKER. Implement TASK_[ID]_[Description].

ARCHITECT provided:
[paste ED_DB.md content]
[paste ED_OTHER.md content]

Migration status: [Applied ✓ / Not applied ✗]

Implement the feature as designed.
```

---

## 📋 Template 3: REVIEWER

**Copy and paste this:**

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are a REVIEWER. Check this PR for TASK_[ID]_[Description].

Files changed:
[list files]

Code:
[paste code]

Review for:
- Code organization
- Error handling
- Naming conventions
- Test coverage
- Security issues
```

---

## 📋 Template 4: Quick Question (No Role)

**Copy and paste this:**

```
I have coding guidelines in guidelines/ folder.

Quick question: [your question]

Load only relevant guideline files to answer.
```

---

## 📋 Template 5: Combined Roles

**Copy and paste this:**

```
I have coding guidelines in guidelines/ folder.

When I assign roles, first read guidelines/quick_reference/role_lookup.md 
to see which files to load.

You are an ARCHITECT and REVIEWER. 

Task: [describe task]

[provide context]
```

---

## 🎯 Example Usage

### Example 1: ARCHITECT Session

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are an ARCHITECT. Design TASK_101_Add_OTP_Verification.

Current state from SOT:
users table:
- id BIGSERIAL PRIMARY KEY
- email VARCHAR(255) NOT NULL
- password_hash VARCHAR(255) NOT NULL
- created_at TIMESTAMP NOT NULL
- updated_at TIMESTAMP NOT NULL

Requirements from PRD:
- Add OTP-based two-factor authentication
- Users can enable/disable OTP
- Store OTP secret securely
- Generate QR codes for OTP setup

Create ED documents and migration file.
```

---

### Example 2: WORKER Session

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are a WORKER. Implement TASK_101_Add_OTP_Verification.

ARCHITECT provided:
ED_DB.md:
- Added otp_secret VARCHAR(32)
- Added otp_enabled BOOLEAN DEFAULT FALSE
- Added otp_verified_at TIMESTAMP
- Migration: 20250210104500_add_otp_columns_to_users.sql

ED_OTHER.md:
API Endpoints:
- POST /api/v1/auth/otp/enable - Enable OTP for current user
- POST /api/v1/auth/otp/verify - Verify OTP code and enable 2FA

Migration status: Applied ✓

Implement the feature as designed.
```

---

### Example 3: REVIEWER Session

```
I have coding guidelines in guidelines/ folder.

When I assign a role, first read guidelines/quick_reference/role_lookup.md 
to see which files to load for that role.

You are a REVIEWER. Check this PR for TASK_101_Add_OTP_Verification.

Files changed:
- services/user-service.js (added enableOTP, verifyOTP methods)
- controllers/auth-controller.js (added 2 endpoints)
- validators/otp-validator.js (new file)
- tests/unit/services/user-service.test.js (new tests)
- tests/integration/api/auth.test.js (new tests)

Code:

// services/user-service.js
class UserService {
  async enableOTP(userId) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    
    const secret = speakeasy.generateSecret();
    await this.userRepo.update(userId, {
      otp_secret: secret.base32,
      otp_enabled: false
    });
    
    const qrCode = await QRCode.toDataURL(secret.otpauth_url);
    return { secret: secret.base32, qrCode };
  }
  
  async verifyOTP(userId, token) {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    
    const verified = speakeasy.totp.verify({
      secret: user.otp_secret,
      encoding: 'base32',
      token: token
    });
    
    if (!verified) throw new ValidationError('Invalid OTP code');
    
    await this.userRepo.update(userId, {
      otp_enabled: true,
      otp_verified_at: new Date()
    });
    
    return { success: true };
  }
}

// [paste more code...]

Review for:
- Code organization
- Error handling
- Naming conventions
- Test coverage
- Security issues
```

---

## 💾 Save These Templates

**Recommended:** Save these in a text file for quick access:

1. Create `claude-templates.txt` on your desktop
2. Copy all templates above
3. When needed: Open file → Copy template → Paste in Claude → Add your content

---

## ⚡ Ultra-Quick Template (Minimum)

**Absolute minimum to make it work:**

```
Guidelines in guidelines/ folder. Read role_lookup.md for role files.

You are a [ROLE]. [Your request]
```

**Example:**
```
Guidelines in guidelines/ folder. Read role_lookup.md for role files.

You are a REVIEWER. Check this code:
[paste code]
```

That's it! Claude will handle the rest.

---

## 🎯 Remember

**You only need to tell Claude about the guidelines ONCE per conversation.**

After that first message, you can just say:
```
Now act as a WORKER and implement the fixes.
```

Claude will remember the guidelines system for that conversation.

---

**Pro Tip:** Bookmark this file for easy copy-paste access! 📌

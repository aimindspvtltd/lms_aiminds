# Version Control Guidelines

**Focus:** Git workflow, commit messages, pull requests

---

## Branch Naming

```bash
# Feature branches
feature/TASK_101_add_otp_verification
feature/TASK_102_user_profile_page

# Bug fixes
bugfix/TASK_103_fix_email_validation
bugfix/fix_login_error

# Hotfixes
hotfix/fix_critical_security_issue
hotfix/TASK_104_fix_payment_bug

# Examples
feature/TASK_101_add_otp_verification
bugfix/TASK_102_fix_email_validation
hotfix/fix_production_error
```

---

## Commit Messages

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance

### Examples

```bash
# Good commits
feat(auth): add OTP verification support

- Add otp_secret, otp_enabled columns to users table
- Create /auth/otp/enable endpoint
- Add QR code generation utility
- Update user service with OTP methods

Related: TASK_101

fix(users): correct email validation regex

The previous regex didn't handle plus signs in email addresses.
Updated to RFC 5322 compliant regex.

Fixes: TASK_102

# Bad commits
git commit -m "changes"
git commit -m "fix bug"
git commit -m "work in progress"
```

---

## Pull Request Template

```markdown
## Description
Add OTP verification feature alongside existing email verification

## Related Task
TASK_101_Add_OTP_Verification

## Changes
- [ ] Database migration for OTP columns
- [ ] New API endpoints for OTP enable/verify
- [ ] QR code generation utility
- [ ] Unit tests
- [ ] Integration tests
- [ ] Updated API documentation

## Database Changes
- Added columns: otp_secret, otp_enabled, otp_verified_at
- Migration file: 20250210104500_add_otp_columns_to_users.sql

## Testing
- Unit tests: ✓ Passed (87% coverage)
- Integration tests: ✓ Passed
- Manual testing: ✓ Verified on staging

## Checklist
- [x] Code follows style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] Tests added/updated
- [x] No new warnings
- [x] Migration tested (up and down)
- [x] Source of Truth docs updated
```

---

## Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/TASK_101_add_otp

# 2. Make changes and commit
git add .
git commit -m "feat(auth): add OTP verification"

# 3. Push to remote
git push origin feature/TASK_101_add_otp

# 4. Create pull request

# 5. After review, merge to main
git checkout main
git pull
git merge feature/TASK_101_add_otp

# 6. Delete branch
git branch -d feature/TASK_101_add_otp
```

---

**Related Guidelines:**
- [Migration Management](05_migration_management.md) - Committing migrations
- [Documentation](09_documentation.md) - Code comments

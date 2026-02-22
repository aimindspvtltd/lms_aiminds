# Development Checklists

## Pre-Commit Checklist

- [ ] Code follows naming conventions
- [ ] No console.log or debug code
- [ ] Error handling implemented
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No hardcoded values (use env vars)
- [ ] Sensitive data removed
- [ ] Code formatted (prettier/eslint)

## Database Migration Checklist

- [ ] Migration file has timestamp name
- [ ] UP migration included
- [ ] DOWN migration included
- [ ] Uses BEGIN/COMMIT transaction
- [ ] References TASK_ID in comments
- [ ] Tested locally (up and down)
- [ ] Doesn't modify existing migrations
- [ ] Indexes added for foreign keys
- [ ] Constraints are named
- [ ] Source of Truth will be updated

## API Endpoint Checklist

- [ ] RESTful convention followed
- [ ] Validation schema implemented
- [ ] Error handling added
- [ ] Success response formatted
- [ ] HTTP status codes correct
- [ ] Authentication/authorization checked
- [ ] Tests written (unit + integration)
- [ ] API documentation updated

## Pull Request Checklist

- [ ] Branch name follows convention
- [ ] Commit messages are descriptive
- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Code reviewed by self first
- [ ] Related TASK_ID referenced
- [ ] Database migrations included (if needed)
- [ ] Environment variables documented
- [ ] Breaking changes noted

## Code Review Checklist

- [ ] Logic is correct
- [ ] Error handling is appropriate
- [ ] Security concerns addressed
- [ ] Performance considerations made
- [ ] Code is readable/maintainable
- [ ] Tests cover edge cases
- [ ] Documentation is clear
- [ ] No code duplication

## Deployment Checklist

- [ ] All tests pass
- [ ] Migrations run successfully
- [ ] Environment variables set
- [ ] Database backup taken
- [ ] Rollback plan ready
- [ ] Monitoring in place
- [ ] Team notified
- [ ] Documentation updated

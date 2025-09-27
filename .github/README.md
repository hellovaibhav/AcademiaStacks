# GitHub CI/CD Setup

This directory contains GitHub Actions workflows and configuration files for automated testing, linting, and security checks.

## Workflows

### 1. API CI/CD Pipeline (`api-ci.yml`)
- **Triggers**: Push/PR to main/development with API changes
- **Checks**:
  - ESLint code quality
  - Security audit
  - Dependency check
  - Hardcoded secrets scan
  - Syntax validation

### 2. Client CI/CD Pipeline (`client-ci.yml`)
- **Triggers**: Push/PR to main/development with client changes
- **Checks**:
  - ESLint code quality
  - Prettier formatting
  - Security audit
  - Hardcoded secrets scan
  - React component validation
  - Build verification

### 3. Full CI/CD Pipeline (`full-ci.yml`)
- **Triggers**: All pushes/PRs to main/development
- **Checks**:
  - API checks (if API files changed)
  - Client checks (if client files changed)
  - Security scanning (Trivy + CodeQL)
  - Dependency review
  - Branch protection enforcement

## Configuration Files

### Branch Protection (`BRANCH_PROTECTION.md`)
- Rules for protecting main and development branches
- Required status checks
- Review requirements
- Setup instructions

### Code Owners (`.github/CODEOWNERS`)
- Defines who can review specific file types
- Ensures proper code review coverage
- Prevents unauthorized changes

### Dependabot (`.github/dependabot.yml`)
- Automated dependency updates
- Security vulnerability alerts
- Weekly update schedule

## Security Features

### Automated Scanning
- **ESLint**: Code quality and security rules
- **npm audit**: Dependency vulnerability scanning
- **Trivy**: Container and filesystem scanning
- **CodeQL**: Static analysis for security vulnerabilities

### Branch Protection
- No direct pushes to main/development
- Required pull request reviews
- Status checks must pass
- Code owner approval required

### Pre-commit Hooks
- Local linting and security checks
- Prevents committing problematic code
- Hardcoded secrets detection

## Setup Instructions

### 1. Enable GitHub Actions
1. Go to repository Settings
2. Navigate to "Actions" → "General"
3. Enable "Allow all actions and reusable workflows"

### 2. Configure Branch Protection
1. Go to repository Settings
2. Navigate to "Branches"
3. Add rules for `main` and `development` branches
4. Follow the configuration in `BRANCH_PROTECTION.md`

### 3. Set Up Code Owners
1. Update `.github/CODEOWNERS` with actual usernames
2. Ensure code owners have write access to the repository

### 4. Configure Dependabot
1. Go to repository Settings
2. Navigate to "Security" → "Code security and analysis"
3. Enable "Dependabot alerts" and "Dependabot security updates"

### 5. Set Up Pre-commit Hooks (Optional)
```bash
# Install husky
npm install --save-dev husky

# Install husky hooks
npx husky install

# Make pre-commit hook executable
chmod +x .husky/pre-commit
```

## Required Status Checks

### For Main Branch
- `api-checks` (if API changes)
- `client-checks` (if client changes)
- `security-scan`
- `dependency-review`

### For Development Branch
- `api-checks` (if API changes)
- `client-checks` (if client changes)
- `security-scan`

## Troubleshooting

### Common Issues

1. **ESLint Errors**
   - Fix code style issues
   - Update ESLint configuration if needed
   - Check for unused variables/imports

2. **Security Audit Failures**
   - Update vulnerable dependencies
   - Review security advisories
   - Consider alternative packages

3. **Build Failures**
   - Check for syntax errors
   - Verify all dependencies are installed
   - Review build logs for specific errors

4. **Branch Protection Issues**
   - Ensure all required checks pass
   - Get required number of approvals
   - Resolve merge conflicts

### Getting Help

- Check workflow logs in GitHub Actions tab
- Review ESLint and security audit reports
- Consult the security policy in `SECURITY.md`
- Create an issue for persistent problems

## Best Practices

1. **Keep Dependencies Updated**
   - Review Dependabot PRs regularly
   - Test updates in development first
   - Monitor security advisories

2. **Code Quality**
   - Follow ESLint rules
   - Write meaningful commit messages
   - Keep functions small and focused

3. **Security**
   - Never commit secrets
   - Use environment variables
   - Regular security audits
   - Keep dependencies updated

4. **Pull Requests**
   - Write descriptive titles and descriptions
   - Link related issues
   - Request appropriate reviewers
   - Ensure all checks pass before merging

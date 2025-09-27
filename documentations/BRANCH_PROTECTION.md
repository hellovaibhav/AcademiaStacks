# Branch Protection Rules

This document outlines the branch protection rules that should be configured in GitHub for the AcademiaStacks repository.

## Protected Branches

### Main Branch (`main`)
- **Require pull request reviews**: 2 reviewers required
- **Dismiss stale reviews**: Yes
- **Require review from code owners**: Yes
- **Restrict pushes that create files**: Yes
- **Require status checks to pass before merging**: Yes
- **Required status checks**:
  - `commit-validation`
  - `api-checks` (if API changes)
  - `client-checks` (if client changes)
  - `security-scan`
  - `dependency-review`
- **Require branches to be up to date before merging**: Yes
- **Require conversation resolution before merging**: Yes
- **Require signed commits**: Recommended
- **Require linear history**: Yes
- **Include administrators**: No
- **Allow force pushes**: No
- **Allow deletions**: No

### Development Branch (`development`)
- **Require pull request reviews**: 1 reviewer required
- **Dismiss stale reviews**: Yes
- **Require review from code owners**: Yes
- **Restrict pushes that create files**: Yes
- **Require status checks to pass before merging**: Yes
- **Required status checks**:
  - `commit-validation`
  - `api-checks` (if API changes)
  - `client-checks` (if client changes)
  - `security-scan`
- **Require branches to be up to date before merging**: Yes
- **Require conversation resolution before merging**: Yes
- **Require signed commits**: Recommended
- **Include administrators**: No
- **Allow force pushes**: No
- **Allow deletions**: No
- **Require commit message format**: Conventional Commits format

## Code Owners

Create a `.github/CODEOWNERS` file with the following structure:

```
# Global owners
* @hellovaibhav

# API specific
/api/ @hellovaibhav

# Client specific
/client/ @hellovaibhav @Saquib1973

# GitHub workflows
/.github/ @hellovaibhav @Saquib1973
```

## Required Status Checks

### For Main Branch
1. **API Checks** (if API files changed)
   - ESLint passes
   - Security audit passes
   - Syntax validation passes

2. **Client Checks** (if client files changed)
   - ESLint passes
   - Security audit passes
   - Build succeeds

3. **Security Scan**
   - Trivy vulnerability scan
   - CodeQL analysis

4. **Dependency Review**
   - New dependencies reviewed
   - No high-severity vulnerabilities

### For Development Branch
1. **API Checks** (if API files changed)
   - ESLint passes
   - Security audit passes
   - Syntax validation passes

2. **Client Checks** (if client files changed)
   - ESLint passes
   - Security audit passes
   - Build succeeds

3. **Security Scan**
   - Trivy vulnerability scan
   - CodeQL analysis

## Setup Instructions

1. Go to your repository settings
2. Navigate to "Branches" section
3. Click "Add rule" for each protected branch
4. Configure the rules as specified above
5. Save the protection rules

## Enforcement

- All pushes to protected branches will be blocked
- Only pull requests can be merged after passing all checks
- Administrators are also subject to these rules
- Force pushes are completely disabled

## Commit Message Validation

### Required Format
All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>
```

### Valid Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `ci`: CI/CD changes
- `perf`: Performance improvements
- `build`: Build system changes

### Examples
```bash
feat(auth): add email validation for registration
fix(upload): resolve PDF thumbnail generation issue
docs(readme): update installation instructions
chore(deps): update axios to latest version
```

### Validation
- Pre-commit hooks validate message format
- CI/CD pipeline checks commit messages
- Pull request titles must follow the same format
- Invalid messages will be rejected

## Security Benefits

- Prevents direct pushes to main/development
- Ensures code review for all changes
- Validates security before merging
- Maintains code quality standards
- Prevents accidental commits to protected branches
- Enforces consistent commit message format

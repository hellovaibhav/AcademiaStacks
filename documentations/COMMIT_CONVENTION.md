# Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages and Pull Request titles.

## 📝 Commit Message Format

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type (Required)

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(auth): add email validation` |
| `fix` | Bug fix | `fix(upload): resolve PDF thumbnail issue` |
| `docs` | Documentation changes | `docs(readme): update installation guide` |
| `style` | Code style changes | `style(api): fix indentation` |
| `refactor` | Code refactoring | `refactor(utils): simplify email validation` |
| `test` | Adding or updating tests | `test(auth): add unit tests for login` |
| `chore` | Maintenance tasks | `chore(deps): update dependencies` |
| `ci` | CI/CD changes | `ci(workflows): add security scanning` |
| `perf` | Performance improvements | `perf(api): optimize database queries` |
| `build` | Build system changes | `build(webpack): update configuration` |

### Scope (Optional)

The scope should be the name of the package or component affected:

- `auth` - Authentication related
- `upload` - File upload functionality
- `api` - Backend API
- `client` - Frontend client
- `ui` - User interface components
- `utils` - Utility functions
- `docs` - Documentation
- `deps` - Dependencies

### Description (Required)

- Use lowercase
- No period at the end
- Use imperative mood ("add" not "added")
- Keep it concise but descriptive

### Body (Optional)

- Explain what and why, not how
- Wrap at 72 characters
- Use blank line to separate from header

### Footer (Optional)

- Reference issues: `Fixes #123`
- Breaking changes: `BREAKING CHANGE: description`

## ✅ Good Examples

```bash
feat(auth): add email validation for registration

Add temporary email domain validation to prevent users from
registering with disposable email addresses.

Fixes #45

fix(upload): resolve PDF thumbnail generation issue

The thumbnail generation was failing for certain PDF files due to
incorrect file path handling.

docs(readme): update installation instructions

Add missing steps for environment variable setup and database
configuration.

chore(deps): update axios to latest version

Update axios from 0.21.1 to 0.27.2 to resolve security
vulnerabilities.

refactor(api): simplify user authentication logic

Extract authentication logic into separate utility functions
for better maintainability and testability.

test(auth): add unit tests for login functionality

Add comprehensive test coverage for user login including
success and failure scenarios.

ci(workflows): add security scanning to API pipeline

Integrate Trivy vulnerability scanner into the API CI/CD
pipeline for enhanced security.

perf(api): optimize database queries in material controller

Reduce query execution time by 40% through better indexing
and query optimization.

build(webpack): update configuration for production builds

Optimize bundle size and improve build performance for
production deployments.
```

## ❌ Bad Examples

```bash
# Too vague
fix: bug fix

# Wrong type
update: add new feature

# Missing scope
feat: add validation

# Wrong mood
feat: added email validation

# Too long description
feat(auth): add email validation for registration process to prevent users from using temporary email addresses

# No type
add email validation

# Wrong format
FEAT: Add email validation
```

## 🔄 Pull Request Title Format

Pull Request titles should follow the same convention as commit messages:

```
<type>(<scope>): <description>
```

### Examples

- `feat(auth): add email validation for registration`
- `fix(upload): resolve PDF thumbnail generation issue`
- `docs(readme): update installation instructions`
- `chore(deps): update axios to latest version`

## 🚫 What Not to Do

1. **Don't use generic types**:
   - ❌ `update: fix stuff`
   - ✅ `fix(upload): resolve file upload issue`

2. **Don't be vague**:
   - ❌ `fix: bug`
   - ✅ `fix(auth): resolve login validation error`

3. **Don't use past tense**:
   - ❌ `feat: added new feature`
   - ✅ `feat: add new feature`

4. **Don't make it too long**:
   - ❌ `feat(auth): add email validation for registration process to prevent users from using temporary email addresses`
   - ✅ `feat(auth): add email validation for registration`

5. **Don't forget the scope**:
   - ❌ `feat: add validation`
   - ✅ `feat(auth): add email validation`

## 🛠️ Tools and Automation

### Pre-commit Hooks
Husky will automatically check your commit messages before allowing commits.

### GitHub Actions
The CI/CD pipeline will validate commit message format and fail if it doesn't follow the convention.

### VS Code Extension
Consider using the "Conventional Commits" extension for VS Code to help format your commit messages.

## 📚 Additional Resources

- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [Angular Commit Guidelines](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)
- [Commitizen](https://github.com/commitizen/cz-cli) - Tool to help write conventional commits
- [Commitlint](https://github.com/conventional-changelog/commitlint) - Lint commit messages

## 🎯 Benefits

Following this convention provides:

- **Clear History**: Easy to understand what changed and why
- **Automated Changelog**: Can generate changelogs automatically
- **Better Collaboration**: Team members understand changes quickly
- **Release Management**: Easy to determine version bumps
- **Code Review**: Reviewers can focus on the right areas
- **Debugging**: Easier to find when bugs were introduced

---

**Remember**: Good commit messages are a gift to your future self and your team! 🎁

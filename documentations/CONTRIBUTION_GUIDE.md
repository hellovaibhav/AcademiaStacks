# Contribution Guide 🚀

## 📋 Quick Start

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/AcademiaStacks.git
cd AcademiaStacks
```

### 2. Setup Development Environment
```bash
# Install dependencies
cd api && npm install
cd ../client && npm install && cd ..

# Setup Git hooks (from root directory)
# This installs husky and sets up the hooks
npx husky install
```

### 3. Create Feature Branch
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/issue-description
# or
git checkout -b chore/task-description
```

### 4. Make Changes & Test
```bash
# Run linting
cd api && npx eslint . --ext .js --max-warnings 0
cd ../client && npx eslint src/ --ext .js,.jsx --max-warnings 0

# Run security audit
npm audit --audit-level=high
```

### 5. Commit with Proper Format
```bash
git commit -m "feat(auth): add email validation for registration"
# or
git commit -m "fix(upload): resolve PDF thumbnail generation issue"
```

### 6. Push & Create PR
```bash
git push origin feat/your-feature-name
# Create Pull Request on GitHub
```

## 📝 Commit Message Format

### Required Format
```
<type>(<scope>): <description>
```

### Valid Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks
- `ci` - CI/CD changes
- `perf` - Performance improvements
- `build` - Build system changes

### Examples
```bash
feat(auth): add email validation for registration
fix(upload): resolve PDF thumbnail generation issue
docs(readme): update installation instructions
chore(deps): update axios to latest version
refactor(api): simplify user authentication logic
test(auth): add unit tests for login functionality
ci(workflows): add security scanning to API pipeline
perf(api): optimize database queries in material controller
build(webpack): update configuration for production builds
```

## 🔄 Pull Request Process

### 1. PR Title Format
Use the same format as commit messages:
```
<type>(<scope>): <description>
```

### 2. Required Checks
- ✅ Commit message validation
- ✅ ESLint passes
- ✅ Security audit passes
- ✅ Build succeeds
- ✅ Tests pass (if applicable)

### 3. Review Process
- Code owners will be automatically requested
- Address all feedback
- Squash commits if requested
- Merge after approval

## 🛠️ Local Development

### Linting Setup
```bash
# Install Husky
npm install --save-dev husky

# Install hooks
npx husky install

# Make hooks executable
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

### Running Checks
```bash
# API linting
cd api
npx eslint . --ext .js --max-warnings 0

# Client linting
cd client
npx eslint src/ --ext .js,.jsx --max-warnings 0

# Security audit
npm audit --audit-level=high
```

### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚫 What Not to Do

### Commit Messages
- ❌ `fix: bug fix`
- ❌ `update: add new feature`
- ❌ `feat: added validation`
- ❌ `FEAT: Add validation`

### Pull Requests
- ❌ Generic titles like "Update" or "Fix"
- ❌ Missing description
- ❌ Not following commit format

### Code
- ❌ Hardcoded secrets
- ❌ Console.log statements in production
- ❌ Unused imports
- ❌ Missing error handling

## ✅ Best Practices

### Code Quality
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Use meaningful variable names
- Handle errors properly

### Git Workflow
- Create feature branches
- Make small, focused commits
- Write descriptive commit messages
- Keep PRs small and focused
- Test before committing

### Security
- Never commit secrets
- Use environment variables
- Validate all inputs
- Run security audits
- Follow security guidelines

## 🎯 Code Review Guidelines

### For Contributors
- Respond to feedback promptly
- Be open to suggestions
- Ask questions if unclear
- Test changes thoroughly
- Update documentation

### For Reviewers
- Be constructive and helpful
- Focus on code quality
- Check for security issues
- Verify tests and documentation
- Approve when ready

## 🚀 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Code Review**: Ask questions in PR comments
- **Documentation**: Check README and other docs

## 📚 Additional Resources

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [React Best Practices](https://react.dev/learn)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Happy Contributing! 🎉**

Remember: Good contributions make the project better for everyone!

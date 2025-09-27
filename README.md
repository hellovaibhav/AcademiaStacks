# AcademiaStacks 📚

A comprehensive academic resource management platform that allows students to upload, organize, and share educational materials including notes, assignments, previous year questions (PYQs), and handouts.

## 🌟 Features

- **Material Management**: Upload and organize academic materials by category
- **User Authentication**: Secure registration and login system
- **Admin Dashboard**: Comprehensive admin panel for content management
- **Material Categories**: Notes, Assignments, PYQs, Handouts
- **Search & Filter**: Advanced filtering and search capabilities
- **PDF Support**: Full PDF viewing and thumbnail generation
- **Responsive Design**: Mobile-friendly interface
- **Security**: Email validation, temporary email prevention, and security scanning

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Multer** - File upload handling
- **Express Validator** - Input validation

### DevOps & Quality
- **GitHub Actions** - CI/CD pipeline
- **ESLint** - Code linting
- **Husky** - Git hooks
- **Trivy** - Security scanning
- **CodeQL** - Code analysis

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud)
- Git
- React

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hellovaibhav/AcademiaStacks.git
   cd AcademiaStacks
   ```

2. **Install dependencies**
   ```bash
   # Install API dependencies
   cd api
   npm install
   
   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment files
   cp api/.env.example api/.env
   cp client/.env.example client/.env.local
   
   # Update the environment variables in both files.
   ```
   
   📖 **For a detailed setup guide, see our Developer Guide.**

4. **Start the development servers**
   ```bash
   # Terminal 1 - Start API server
   cd api
   npm run dev
   
   # Terminal 2 - Start client server
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:8800

## 🤝 Contributing

We welcome contributions from the community! We have a detailed guide to help you get started.

📖 **Please read our Contribution Guide to learn how to contribute.**

## 📋 Code Standards

### JavaScript/React Standards
- Use ES6+ features
- Prefer `const` and `let` over `var`
- Use arrow functions for callbacks
- Destructure objects and arrays
- Use template literals for strings
- Follow React best practices

### Code Style
- 2 spaces for indentation
- Single quotes for strings
- Semicolons at end of statements
- Trailing commas in objects/arrays
- Maximum line length: 120 characters

### File Naming
- Components: `PascalCase.jsx`
- Utilities: `camelCase.js`
- Constants: `UPPER_SNAKE_CASE.js`
- CSS: `kebab-case.css`

## 🔒 Security Guidelines

### Before Committing
- No hardcoded secrets or credentials
- Use environment variables for sensitive data
- Validate all user inputs
- Sanitize data before database operations

### Security Checks
- Run `npm audit` before committing
- Check for console.log statements
- Verify no secrets in code
- Ensure proper error handling

## 🧪 Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Writing Tests
- Write unit tests for utilities
- Write integration tests for API endpoints
- Write component tests for React components
- Aim for >80% code coverage

## 📁 Project Structure

```
AcademiaStacks/
├── api/                    # Backend API
│   ├── controllers/        # Route controllers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   └── index.js           # Server entry point
├── client/                # Frontend React app
│   ├── public/            # Static assets
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main app component
│   └── package.json       # Client dependencies
├── .github/               # GitHub workflows and configs
│   ├── workflows/         # CI/CD pipelines
│   ├── CODEOWNERS         # Code ownership
│   └── dependabot.yml     # Dependency updates
├── .husky/                # Git hooks
└── README.md              # This file
```

## 🚦 CI/CD Pipeline

### Automated Checks
- **ESLint**: Code quality and style
- **Security Audit**: Vulnerability scanning
- **Build Verification**: Ensures code compiles
- **Test Execution**: Runs test suite
- **Dependency Review**: Checks for security issues

### Branch Protection
- No direct pushes to `main` or `development`
- All changes must go through Pull Requests
- Required reviews from code owners
- All checks must pass before merging

## 🐛 Reporting Issues

### Bug Reports
1. Check existing issues first
2. Use the bug report template
3. Include steps to reproduce
4. Provide environment details
5. Add screenshots if applicable

### Feature Requests
1. Check existing feature requests
2. Use the feature request template
3. Describe the use case
4. Explain the expected behavior
5. Consider implementation complexity

## 📞 Support

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: [Your contact email]
- **Discord**: [Your Discord server]

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Contributors who have helped build this project
- Open source libraries and tools used
- Community feedback and suggestions

## 📊 Project Status

- **Version**: 2.0.0
- **Status**: Active Development
- **Last Updated**: [Current Date]
- **Contributors**: [Number of contributors]

---

**Happy Coding! 🚀**

If you have any questions or need help getting started, feel free to reach out to the maintainers or open an issue.

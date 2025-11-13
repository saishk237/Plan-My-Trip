# Contributing to PlanMyTrip

First off, thank you for considering contributing to PlanMyTrip! It's people like you that make PlanMyTrip such a great tool for travelers worldwide.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this code.

### Our Standards

**Examples of behavior that contributes to a positive environment:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Examples of unacceptable behavior:**
- The use of sexualized language or imagery
- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

---

## 🤝 How Can I Contribute?

### 1. Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/saishk237/Plan-My-Trip/issues) to avoid duplicates.

**When submitting a bug report, include:**
- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)
- Any relevant logs or error messages

### 2. Suggesting Features

Feature suggestions are welcome! Before suggesting:
- Check if the feature has already been suggested
- Ensure it aligns with the project's goals
- Provide a clear use case

**When suggesting a feature, include:**
- A clear and descriptive title
- Detailed description of the proposed feature
- Why this feature would be useful
- Possible implementation approach (optional)
- Mockups or examples (if applicable)

### 3. Code Contributions

We love code contributions! Here's how you can help:
- Fix bugs
- Implement new features
- Improve documentation
- Add tests
- Optimize performance
- Enhance UI/UX

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** (comes with Node.js)
- **Git**

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/Plan-My-Trip.git
   cd Plan-My-Trip
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/saishk237/Plan-My-Trip.git
   ```

### Setup Development Environment

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Create `.env` file**:
   ```bash
   cp .env.example .env
   ```
   
   Then edit `.env` with your credentials:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   POSTGRES_PASSWORD=your_postgres_password
   JWT_SECRET=your-super-secret-jwt-key
   PORT=5000
   ```

3. **Setup database**:
   ```bash
   npm run db:setup
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Verify setup**:
   - Open `http://localhost:5000`
   - Create a test account
   - Generate a sample itinerary

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### 3. Test Your Changes

```bash
# Run TypeScript type checking
npm run check

# Test the application manually
npm run dev

# Build for production (ensure no errors)
npm run build
```

### 4. Commit Your Changes

Follow our [commit guidelines](#commit-guidelines):

```bash
git add .
git commit -m "feat: add user profile export feature"
```

### 5. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 6. Create Pull Request

Go to GitHub and create a pull request from your fork to the main repository.

---

## 💻 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid using `any` type
- Use type inference where appropriate

**Example:**
```typescript
// Good
interface User {
  id: string;
  email: string;
  name: string;
}

function getUser(id: string): User | null {
  // implementation
}

// Bad
function getUser(id: any): any {
  // implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Extract reusable logic into custom hooks

**Example:**
```typescript
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Bad
export function Button(props: any) {
  return <button onClick={props.onClick}>{props.label}</button>;
}
```

### File Organization

```
client/src/
├── components/       # Reusable UI components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utility functions
└── types/           # TypeScript type definitions

server/
├── routes.ts        # API routes
├── auth.ts          # Authentication logic
├── database.ts      # Database connection
└── openai.ts        # AI integration
```

### Naming Conventions

- **Files**: `kebab-case.tsx`, `PascalCase.tsx` for components
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Components**: `PascalCase`
- **Functions**: `camelCase`
- **Types/Interfaces**: `PascalCase`

### Code Style

- Use 2 spaces for indentation
- Use semicolons
- Use double quotes for strings
- Use trailing commas in objects/arrays
- Max line length: 100 characters (flexible)

**Example:**
```typescript
const user = {
  id: "123",
  name: "John Doe",
  email: "john@example.com",
};
```

---

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, missing semicolons, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, build, etc.)

### Examples

```bash
# Feature
git commit -m "feat(auth): add password reset functionality"

# Bug fix
git commit -m "fix(itinerary): resolve PDF generation error for long trips"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(database): optimize query performance"

# Multiple changes
git commit -m "feat(profile): add user avatar upload

- Add file upload component
- Integrate with storage service
- Update user profile page
- Add image validation"
```

### Commit Message Rules

- Use present tense ("add feature" not "added feature")
- Use imperative mood ("move cursor to..." not "moves cursor to...")
- Keep subject line under 72 characters
- Capitalize the subject line
- Don't end the subject line with a period
- Separate subject from body with a blank line
- Wrap body at 72 characters
- Use body to explain what and why, not how

---

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Ensure your code follows the coding standards
2. ✅ Run `npm run check` and fix any TypeScript errors
3. ✅ Test your changes thoroughly
4. ✅ Update documentation if needed
5. ✅ Rebase your branch on the latest main:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### PR Title Format

Follow the same format as commit messages:

```
feat(auth): add OAuth login support
fix(ui): resolve mobile menu overflow issue
docs(api): add API endpoint documentation
```

### PR Description Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Changes Made
- List of specific changes
- Another change
- Yet another change

## Testing
How has this been tested?
- [ ] Manual testing
- [ ] Unit tests
- [ ] Integration tests

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's coding standards
- [ ] I have performed a self-review of my code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have tested my changes thoroughly

## Related Issues
Closes #(issue number)
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, a maintainer will merge your PR
4. Your contribution will be included in the next release!

### After Your PR is Merged

1. Delete your feature branch:
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. Update your main branch:
   ```bash
   git checkout main
   git pull upstream main
   ```

---

## 🐛 Reporting Bugs

### Before Reporting

- Check the [existing issues](https://github.com/saishk237/Plan-My-Trip/issues)
- Try to reproduce the bug
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
 - OS: [e.g. Ubuntu 22.04]
 - Browser: [e.g. Chrome 120]
 - Node Version: [e.g. 18.17.0]
 - PostgreSQL Version: [e.g. 14.9]

**Additional context**
Add any other context about the problem here.

**Logs**
```
Paste relevant logs here
```
```

---

## 💡 Suggesting Features

### Before Suggesting

- Check if the feature already exists
- Check if it's already been suggested
- Ensure it aligns with project goals

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Use Case**
Explain how this feature would be used and who would benefit from it.

**Additional context**
Add any other context, mockups, or screenshots about the feature request here.
```

---

## 🌟 Community

### Get Help

- **GitHub Issues**: [Report bugs or ask questions](https://github.com/saishk237/Plan-My-Trip/issues)
- **GitHub Discussions**: [Community discussions](https://github.com/saishk237/Plan-My-Trip/discussions)
- **Email**: saish237@gmail.com

### Stay Updated

- Watch the repository for updates
- Star the project if you find it useful
- Follow the project on GitHub

### Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Our contributors page (coming soon!)

---

## 📚 Additional Resources

### Documentation

- [README.md](README.md) - Project overview and setup
- [CHANGELOG.md](CHANGELOG.md) - Version history
- [RELEASE_NOTES.md](RELEASE_NOTES.md) - Release information

### Useful Links

- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Groq API Documentation](https://console.groq.com/docs)

### Development Tools

- [VS Code](https://code.visualstudio.com/) - Recommended IDE
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - PostgreSQL management

---

## 🎯 Project Goals

Understanding our goals helps you contribute effectively:

1. **User Experience**: Create intuitive, delightful travel planning experiences
2. **AI Quality**: Provide accurate, helpful, and personalized itineraries
3. **Performance**: Keep the application fast and responsive
4. **Reliability**: Ensure data persistence and system stability
5. **Accessibility**: Make travel planning accessible to everyone
6. **Privacy**: Protect user data and respect privacy

---

## ❓ Questions?

If you have questions that aren't covered in this guide:

1. Check the [documentation](README.md)
2. Search [existing issues](https://github.com/saishk237/Plan-My-Trip/issues)
3. Ask in [GitHub Discussions](https://github.com/saishk237/Plan-My-Trip/discussions)
4. Email us at saish237@gmail.com

---

## 🙏 Thank You!

Thank you for taking the time to contribute to PlanMyTrip! Every contribution, no matter how small, helps make travel planning better for everyone.

**Happy coding and happy travels! ✈️🌍**

---

*This contributing guide is inspired by open source best practices and will evolve with the project.*


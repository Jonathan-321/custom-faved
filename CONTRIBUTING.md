# Contributing to Custom Faved

Thank you for your interest in contributing to Custom Faved! This guide will help you get started.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/custom-faved.git`
3. **Start development**: `docker compose -f docker-compose.dev.yml up`
4. **Make your changes**
5. **Test your changes**
6. **Submit a pull request**

## 📁 Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed information about the codebase organization.

## 🛠️ Development Setup

### Prerequisites
- Docker Desktop
- Node.js 18+ (optional, for running scripts locally)
- Git

### Setup Steps
1. Fork and clone the repository
2. Run `docker compose -f docker-compose.dev.yml up`
3. Visit http://localhost:5173 to access the frontend
4. Backend API is available at http://localhost:8000

## 🎯 Areas for Contribution

### High Priority
- **Bookmark Import/Export**: Enhance existing import scripts
- **UI/UX Improvements**: Better mobile experience, accessibility
- **Performance**: Frontend optimization, database queries
- **Documentation**: Code comments, user guides

### Medium Priority  
- **Search Features**: Advanced filtering, full-text search
- **Tag Management**: Bulk operations, tag analytics
- **Browser Extensions**: Chrome/Firefox extensions
- **API Enhancements**: Rate limiting, authentication

### Low Priority
- **Themes**: Custom color schemes, layouts
- **Integrations**: Third-party services, webhooks
- **Analytics**: Usage statistics, insights

## 📝 Code Style

### Frontend (TypeScript/React)
- Use functional components with hooks
- Follow existing component patterns
- Add TypeScript types for all new code
- Use Prettier for formatting (runs automatically)

### Backend (PHP)
- Follow PSR-12 coding standards
- Use type hints for all parameters and returns
- Add PHPDoc comments for public methods
- Use dependency injection where applicable

### Database
- Use snake_case for table and column names
- Include migration scripts for schema changes
- Add proper indexes for performance

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run lint
npm run build
```

### Backend Tests
```bash
# Syntax check
find . -name "*.php" -exec php -l {} \;

# Style check (if available)
php-cs-fixer fix --dry-run --diff
```

### Manual Testing
1. **Import bookmarks** from Chrome/Safari
2. **Create/edit/delete** bookmarks
3. **Tag management** operations
4. **Search and filtering**
5. **Mobile responsiveness**

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the existing style
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] PR description explains the changes

### PR Description Template
```markdown
## What does this PR do?
Brief description of changes

## Type of change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] Automated tests pass
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

Use the GitHub issue template and include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots/error messages
- Database state (if relevant)

## 💡 Feature Requests

Before requesting features:
1. Check existing issues
2. Consider the scope and complexity
3. Explain the use case
4. Suggest implementation approach

## 🔒 Security

For security vulnerabilities:
- **DO NOT** create public issues
- Email maintainers directly
- Include detailed reproduction steps
- Allow time for fix before disclosure

## 📚 Resources

- [React Documentation](https://react.dev/)
- [PHP Manual](https://www.php.net/manual/)
- [Docker Compose](https://docs.docker.com/compose/)
- [SQLite Documentation](https://sqlite.org/docs.html)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Follow GitHub community guidelines

## ❓ Questions?

- Check [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)
- Open a GitHub discussion
- Join our community chat (if available)

Thank you for contributing! 🎉
# Contributing to RevCoding

Thank you for considering contributing to RevCoding! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Chrome or Edge browser for testing

### Setting Up Development Environment

1. **Fork and clone the repository**

   ```bash
   git clone https://github.com/ankitkumargupta001/chrome-extension-revcoding.git
   cd chrome-extension-revcoding
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development mode**

   ```bash
   npm run dev
   ```

4. **Load the extension in browser**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

## 📝 Code Style

This project uses:

- **TypeScript** for type safety
- **Prettier** for code formatting
- **ESLint** for code linting

Before submitting:

```bash
npm run lint    # Check for linting errors
npm run format  # Format code with Prettier
```

## 🏗️ Project Structure

```
src/
├── background/     # Service worker scripts
├── content/        # Content scripts for web page interaction
├── popup/          # Extension popup UI
├── platforms/      # Platform adapters (LeetCode, etc.)
├── components/     # Reusable React components
└── types.ts        # TypeScript definitions
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Extension version**
2. **Browser version**
3. **Steps to reproduce**
4. **Expected vs actual behavior**
5. **Screenshots** (if applicable)
6. **Console errors** (if any)

## ✨ Suggesting Features

Feature requests are welcome! Please:

1. Check existing issues first
2. Describe the feature clearly
3. Explain the use case
4. Consider the impact on existing functionality

## 🔧 Development Guidelines

### Adding New Features

1. **Create an issue** first to discuss the feature
2. **Fork the repository**
3. **Create a feature branch**: `git checkout -b feature/your-feature-name`
4. **Write clean, documented code**
5. **Test thoroughly**
6. **Submit a pull request**

### Code Quality

- Write TypeScript with proper types
- Add JSDoc comments for complex functions
- Follow existing code patterns
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Test the extension in multiple scenarios
- Verify functionality on different LeetCode pages
- Check that existing features still work
- Test edge cases

### Commit Messages

Use clear, descriptive commit messages:

```
feat: add dark mode support
fix: resolve button positioning on mobile
docs: update installation instructions
refactor: simplify problem data structure
```

## 🎯 Areas for Contribution

### High Priority

- Platform support (Codeforces, AtCoder, etc.)
- Performance optimizations
- Bug fixes
- UI/UX improvements

### Medium Priority

- Advanced filtering options
- Data visualization features
- Keyboard shortcuts
- Accessibility improvements

### Low Priority

- Code refactoring
- Documentation improvements
- Additional themes
- Mobile responsiveness

## 🔍 Platform Adapters

To add support for a new coding platform:

1. **Create adapter class** in `src/platforms/`
2. **Implement required methods**:
   - `normalizeUrl()`
   - `extractProblemId()`
   - `extractTitle()`
   - `extractDifficulty()`
   - `extractTags()`
3. **Update factory** to recognize the new platform
4. **Add manifest permissions** if needed
5. **Test thoroughly**

## 📋 Pull Request Process

1. **Update documentation** if needed
2. **Test your changes** thoroughly
3. **Write clear PR description**:
   - What does this change?
   - Why is it needed?
   - How to test it?
4. **Link related issues**
5. **Be responsive** to review feedback

### PR Checklist

- [ ] Code follows project style guidelines
- [ ] Changes are tested and working
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] Commit messages are clear
- [ ] PR description is comprehensive

## 🤝 Code Review

All contributions go through code review:

- **Be patient** - reviews take time
- **Be responsive** to feedback
- **Explain your decisions** when asked
- **Learn from feedback** - it makes everyone better

## 📚 Resources

- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🎉 Recognition

Contributors will be:

- Added to the README contributors section
- Credited in release notes
- Invited to be maintainers (for significant contributions)

## 📞 Questions?

- Open an issue for technical questions
- Join discussions in existing issues
- Reach out to maintainers directly

Thank you for contributing to RevCoding! 🚀

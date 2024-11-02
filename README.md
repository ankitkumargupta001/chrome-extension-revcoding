# RevCoding - LeetCode Revision Extension

A powerful browser extension that helps you track, organize, and review your coding practice on LeetCode. Save problems, add notes, tag them, and schedule reviews to improve your problem-solving skills systematically.

![RevCoding Extension](https://img.shields.io/badge/Version-0.1.0--alpha-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![Platform](https://img.shields.io/badge/Platform-Chrome%20%7C%20Edge-orange)

## ✨ Features

- **📚 Problem Management**: Save LeetCode problems with one click directly from problem pages
- **🏷️ Smart Tagging**: Automatic tag extraction from LeetCode + custom tags for better organization
- **📝 Notes & Insights**: Add detailed notes, solution approaches, and key insights for each problem
- **📅 Review Scheduling**: Schedule specific review dates and track your revision progress
- **🎯 Revision Queue**: Quick flagging system for problems you want to revisit soon
- **🔍 Advanced Filtering**: Filter by difficulty, tags, search terms, and revision status
- **📊 Progress Statistics**: Track your problem count by difficulty level
- **💾 Data Management**: Export/import your data for backup and sharing
- **🎨 Modern UI**: Clean, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend

- **React 18** - Component-based UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icons

### Build Tools

- **Vite** - Fast build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### Browser APIs

- **Chrome Extension Manifest V3** - Modern extension platform
- **Chrome Storage API** - Local data persistence
- **Chrome Runtime API** - Message passing between scripts
- **Content Scripts** - DOM interaction on LeetCode pages

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript Compiler** - Type checking

## 🚀 Installation

### From Source (Development)

1. **Clone the repository**

   ```bash
   git clone https://github.com/ankitkumargupta001/chrome-extension-revcoding.git
   cd chrome-extension-revcoding
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the extension**

   ```bash
   npm run build
   ```

4. **Load in Chrome/Edge**
   - Open `chrome://extensions/` (or `edge://extensions/`)
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist` folder

### Development Mode

For active development with hot reload:

```bash
npm run dev
```

This will build the extension in development mode and watch for changes.

## 📖 Usage

### Getting Started

1. **Install the extension** and navigate to any LeetCode problem page
2. **Click the "Add to revision" button** that appears in the bottom-right corner
3. **Fill in your notes**, custom tags, and set a review date
4. **Click "Save"** to add the problem to your collection

### Managing Problems

- **Access your dashboard** by clicking the extension icon in the toolbar
- **Switch between tabs**:
  - **Review by Date**: See problems scheduled for specific dates
  - **All Problems**: Browse your entire collection with advanced filters

### Features in Detail

#### Filtering & Search

- **Text Search**: Search by problem title, notes, or tags
- **Difficulty Filter**: Filter by Easy, Medium, Hard, or Unknown
- **Tag Filter**: Filter by any scraped or custom tags
- **Revision Queue**: Show only problems marked for quick revision

#### Review System

- **Scheduled Reviews**: Set specific dates for reviewing problems
- **Revision Queue**: Quick flag system for problems needing attention
- **Progress Tracking**: Visual statistics of your problem count by difficulty

#### Data Management

- **Export**: Download your data as JSON for backup
- **Import**: Upload previously exported data to restore your collection
- **Clear All**: Reset your data (with confirmation)

## 🔧 Development

### Project Structure

```
revcoding/
├── src/
│   ├── background/          # Service worker scripts
│   │   └── background.ts    # Main background script
│   ├── content/             # Content scripts
│   │   └── content.ts       # LeetCode page interaction
│   ├── popup/               # Extension popup
│   │   ├── App.tsx          # Main popup component
│   │   ├── api.ts           # Background script communication
│   │   └── main.tsx         # React app entry point
│   ├── platforms/           # Platform adapters
│   │   └── factory.ts       # Platform detection and adapters
│   ├── components/          # Reusable UI components
│   └── types.ts             # TypeScript type definitions
├── public/
│   ├── manifest.json        # Extension manifest
│   └── icons/               # Extension icons
└── dist/                    # Built extension files
```

### Key Components

- **Background Script**: Handles data storage, message passing, and business logic
- **Content Script**: Injects UI elements into LeetCode pages and extracts problem data
- **Popup**: Main dashboard interface for managing problems and reviews
- **Platform Adapters**: Extensible system for supporting different coding platforms

### API Reference

The extension uses Chrome's message passing API for communication:

```typescript
// Get all problems
chrome.runtime.sendMessage({ type: "GET_ALL" });

// Save/update a problem
chrome.runtime.sendMessage({
  type: "UPSERT_PROBLEM",
  payload: {
    /* UpsertPayload */
  },
});

// Update existing problem
chrome.runtime.sendMessage({
  type: "UPDATE_PROBLEM",
  id: "problem-id",
  updates: {
    /* Partial<ProblemEntry> */
  },
});
```

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and add tests if applicable
4. Commit your changes: `git commit -am 'Add feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## 📋 Roadmap

- [ ] Support for additional platforms (Codeforces, AtCoder, etc.)
- [ ] Advanced review algorithms (spaced repetition)
- [ ] Problem difficulty prediction
- [ ] Performance analytics and insights
- [ ] Team/group sharing features
- [ ] Mobile companion app
- [ ] Sync across devices

## 🐛 Known Issues

- Dark mode support is limited on some LeetCode themes
- Large datasets (1000+ problems) may experience slight performance delays
- Import/export doesn't include extension settings

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- LeetCode for providing an excellent platform for coding practice
- The open-source community for the amazing tools and libraries used in this project
- All contributors who help improve this extension

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/ankitkumargupta001/chrome-extension-revcoding/issues) page
2. Create a new issue with detailed information about the problem
3. Include your browser version, extension version, and steps to reproduce

---

**Happy Coding! 🚀**

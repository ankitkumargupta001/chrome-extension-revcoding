# RevCoding

A browser extension for tracking and reviewing LeetCode problems with smart scheduling and progress analytics.

![Version](https://img.shields.io/badge/Version-0.1.0--alpha-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Problem Management**: Save LeetCode problems with one click
- **Smart Tagging**: Automatic tag extraction + custom tags
- **Review Scheduling**: Set specific review dates and track progress
- **Advanced Filtering**: Search by difficulty, tags, and revision status
- **Data Export/Import**: Backup and restore your problem collection
- **Progress Analytics**: Statistics by difficulty level

## Tech Stack

### Frontend

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Browser Extension

- **Chrome Extension Manifest V3** - Modern extension platform
- **Chrome Storage API** - Local data persistence
- **Content Scripts** - DOM interaction
- **Service Worker** - Background processing

### Build & Development

- **Vite** - Build tool and dev server
- **PostCSS** - CSS processing
- **Autoprefixer** - Cross-browser compatibility

## Installation

### Development Setup

```bash
git clone https://github.com/ankitkumargupta001/chrome-extension-revcoding.git
cd chrome-extension-revcoding
npm install
npm run build
```

### Load Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist` folder

## Usage

1. Navigate to any LeetCode problem page
2. Click the "Add to revision" button in the bottom-right corner
3. Add notes, custom tags, and set review dates
4. Access your dashboard via the extension popup

## Development

```bash
npm run dev    # Development build with watch mode
npm run build  # Production build
```

## Project Structure

```
src/
├── background/     # Service worker scripts
├── content/        # LeetCode page integration
├── popup/          # Extension dashboard UI
├── platforms/      # Platform adapters
├── components/     # Reusable UI components
└── types.ts        # TypeScript definitions
```

## License

MIT © [Ankit Kumar Gupta](https://github.com/ankitkumargupta001)

## Support

Report issues: [GitHub Issues](https://github.com/ankitkumargupta001/chrome-extension-revcoding/issues)

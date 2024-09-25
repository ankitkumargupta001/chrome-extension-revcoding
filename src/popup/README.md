Install deps, build, and load the extension:

1. npm install
2. npm run build
3. In Chrome, open chrome://extensions → Enable Developer Mode → Load unpacked → select the dist folder.

During development, you can run `npm run dev`, but remember to reload the extension after each build output change. The background and content scripts come from `dist/background.js` and `dist/content.js`, and the popup is `dist/popup.html` + `dist/popup.js`.

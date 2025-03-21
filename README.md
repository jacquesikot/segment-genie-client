# SegmentGenie Client

SegmentGenie is a powerful market segmentation and customer analysis tool built with React, TypeScript, and Vite. This application helps businesses identify and analyze customer segments to optimize their marketing and product strategies.

## Features

- Segment creation and analysis
- Customer demographics visualization
- Market size estimation
- Detailed segment reports
- User authentication via Supabase

## Development Setup

This project uses Vite for fast development and optimized production builds.

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Analytics

SegmentGenie uses Mixpanel to track user interactions and application performance. For implementation details and best practices, see the [Analytics Guide](./src/docs/analytics-guide.md).

## Documentation

- [Analytics Guide](./src/docs/analytics-guide.md) - How to implement and use analytics tracking

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```

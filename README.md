# micropen

[![npm version](https://badge.fury.io/js/micropen.svg)](https://badge.fury.io/js/micropen)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/micropen)](https://bundlephobia.com/package/micropen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A feather-light (< 1KB) rich text editor with SSR compatibility and dynamic feature generation. Perfect for applications where every byte counts.

## Features

- 🪶 **Ultra Lightweight**: Less than 1KB in size
- 🚀 **SSR Compatible**: Works seamlessly in server-side rendered applications
- ⚡ **Dynamic Features**: Load editing features on-demand
- 🧩 **Framework Agnostic**: Use with React, Vue, Angular, or vanilla JavaScript
- 📱 **Mobile Ready**: Touch-friendly and responsive
- 🔧 **Customizable**: Enable only the features you need

## Installation

```bash
npm install micropen
# or
yarn add micropen
# or
pnpm add micropen
```

## Quick Start

### Vanilla JavaScript

```javascript
import { Editor } from 'micropen';

const editor = new Editor({
  element: document.getElementById('editor'),
  onChange: (html) => console.log('Content changed:', html)
});
```

### React

```jsx
import { Editor } from 'micropen/react';

function MyEditor() {
  const handleChange = (content) => {
    console.log('Content changed:', content);
  };

  return <Editor onChange={handleChange} />;
}
```

### Vue

```vue
<template>
  <Editor @change="handleChange" />
</template>

<script>
import { Editor } from 'micropen/vue';

export default {
  components: { Editor },
  methods: {
    handleChange(content) {
      console.log('Content changed:', content);
    }
  }
};
</script>
```

## API Reference

### Editor Options

```typescript
interface EditorOptions {
  element?: HTMLElement;        // Target element (required for vanilla JS)
  placeholder?: string;         // Placeholder text
  onChange?: (html: string) => void;  // Change callback
  features?: string[];         // Features to enable
}
```

### Methods

```typescript
editor.getContent(): string    // Get current HTML content
editor.setContent(html: string) // Set HTML content
editor.focus()                 // Focus the editor
```

## Dynamic Features

micropen loads features dynamically to maintain its tiny footprint. Enable only what you need:

```javascript
const editor = new Editor({
  features: ['bold', 'italic', 'link']  // Enable specific features
});
```

Available features:
- `bold`: Bold text formatting
- `italic`: Italic text formatting
- `underline`: Underline text
- `link`: Add hyperlinks
- `list`: Bullet and numbered lists
- `heading`: Heading styles
- `code`: Code formatting

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE 11 (basic support)

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT 

## Size Comparison

| Editor | Size (min+gzip) |
|--------|----------------|
| micropen | < 1KB |
| TinyMCE | ~200KB |
| CKEditor 5 | ~230KB |
| Quill | ~43KB |

## Why micropen?

- **Size Matters**: When every kilobyte counts, micropen delivers essential editing capabilities in less than 1KB
- **SSR First**: Built with modern frameworks in mind, works perfectly with Next.js, Nuxt, etc.
- **Dynamic Loading**: Pay only for what you use with feature-level code splitting
- **Framework Agnostic**: Use it anywhere, with any framework
- **Modern Architecture**: Built with TypeScript, zero dependencies

## Support

- [Documentation](https://github.com/yourusername/micropen/wiki)
- [Issue Tracker](https://github.com/yourusername/micropen/issues)
- [Discussions](https://github.com/yourusername/micropen/discussions)

# micropen

[![npm version](https://badge.fury.io/js/micropen.svg)](https://badge.fury.io/js/micropen)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/micropen)](https://bundlephobia.com/package/micropen)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A feather-light (< 1KB) rich text editor with SSR compatibility and dynamic feature generation. Perfect for applications where every byte counts.

## Features

- **Ultra Lightweight**: Less than 1KB in size
- **SSR Compatible**: Works seamlessly in server-side rendered applications
- **Dynamic Features**: Load editing features on-demand
- **Framework Agnostic**: Use with React, Vue, or vanilla JavaScript
- **Mobile Ready**: Touch-friendly and responsive
- **Customizable**: Enable only the features you need

## Installation

```bash
# npm
npm install micropen

# yarn
yarn add micropen

# pnpm
pnpm add micropen
```

## Quick Start

### Vanilla JavaScript (ESM)
```javascript
import { Editor } from 'micropen';
import 'micropen/style.css';

const editor = new Editor({
  element: document.getElementById('editor'),
  placeholder: 'Start typing...',
  onChange: (html) => console.log('Content changed:', html)
});
```

### React
```jsx
import { Editor } from 'micropen/react';
import 'micropen/style.css';

function MyEditor() {
  const [content, setContent] = useState('');

  return (
    <Editor
      value={content}
      onChange={setContent}
      placeholder="Start typing..."
      features={['bold', 'italic', 'link']}
    />
  );
}
```

### Vue 3
```vue
<template>
  <Editor
    v-model="content"
    :features="['bold', 'italic', 'link']"
    placeholder="Start typing..."
    @change="handleChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import { Editor } from 'micropen/vue';

const content = ref('');
const handleChange = (html) => {
  console.log('Content changed:', html);
};
</script>
```

### Next.js (App Router)
```tsx
'use client';

import { Editor } from 'micropen/react';
import 'micropen/style.css';

export default function EditorPage() {
  return (
    <Editor
      placeholder="Start typing..."
      features={['bold', 'italic', 'link']}
    />
  );
}
```

### Nuxt 3
```vue
<template>
  <ClientOnly>
    <Editor
      v-model="content"
      placeholder="Start typing..."
      :features="['bold', 'italic', 'link']"
    />
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
const content = ref('');
</script>
```

## API Reference

### Editor Options

```typescript
interface EditorOptions {
  element: HTMLElement;              // Target element (required for vanilla JS)
  placeholder?: string;             // Placeholder text
  onChange?: (html: string) => void; // Change callback
  features?: string[];              // Features to enable
  initialContent?: string;          // Initial HTML content
}
```

### Available Features
- `bold`: Bold text formatting
- `italic`: Italic text formatting
- `underline`: Underline text
- `link`: Add hyperlinks
- `list`: Bullet and numbered lists
- `heading`: Heading styles
- `code`: Code formatting

### React Props
```typescript
interface EditorProps {
  value?: string;                   // Controlled content value
  defaultValue?: string;            // Uncontrolled initial content
  placeholder?: string;             // Placeholder text
  onChange?: (html: string) => void; // Change callback
  features?: string[];              // Features to enable
  className?: string;               // Additional CSS class
  style?: React.CSSProperties;      // Inline styles
}
```

### Vue Props
```typescript
interface EditorProps {
  modelValue?: string;              // v-model content
  placeholder?: string;             // Placeholder text
  features?: string[];              // Features to enable
  class?: string | object;          // Additional CSS class
  style?: object;                   // Inline styles
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT 

## Support

- [Documentation](https://github.com/yourusername/micropen/wiki)
- [Issue Tracker](https://github.com/yourusername/micropen/issues)
- [Discussions](https://github.com/yourusername/micropen/discussions)

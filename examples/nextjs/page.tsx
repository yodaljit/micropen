'use client';

import { useState } from 'react';
import { Editor } from '@codeium/lightweight-editor/react';

export default function EditorPage() {
  const [content, setContent] = useState('Start typing...');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lightweight Editor - Next.js Example</h1>
      
      <Editor
        value={content}
        placeholder="Enter your content"
        onChange={setContent}
      />

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Preview:</h2>
        <div 
          className="p-4 border rounded mt-2"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
}

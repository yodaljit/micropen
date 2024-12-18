import { useState } from 'react';
import { Editor } from '../editor';
import { ClientOnly } from 'remix-utils/client-only';
import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [
    { title: 'Lightweight Editor - Remix Example' },
    { name: 'description', content: 'Example of using Lightweight Editor in Remix' },
  ];
};

export default function EditorRoute() {
  const [content, setContent] = useState('Start typing...');

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lightweight Editor - Remix Example</h1>
      
      <ClientOnly fallback={<div>Loading editor...</div>}>
        {() => (
          <Editor
            value={content}
            placeholder="Enter your content"
            onChange={setContent}
          />
        )}
      </ClientOnly>

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

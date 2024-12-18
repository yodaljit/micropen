import React, { useState } from 'react';
import { Editor } from '../components/editor';
import { Script } from 'gatsby';

export default function EditorPage() {
  const [content, setContent] = useState('Start typing...');
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      
      <h1 className="text-2xl font-bold mb-4">Lightweight Editor - Gatsby Example</h1>
      
      {isClient && (
        <Editor
          value={content}
          placeholder="Enter your content"
          onChange={setContent}
        />
      )}

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

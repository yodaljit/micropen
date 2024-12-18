import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { Editor as BaseEditor } from '../editor';
import type { EditorOptions } from '../types';

export interface EditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface EditorRef {
  getContent: () => string;
  setContent: (html: string) => void;
  focus: () => void;
}

const defaultStyles: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '1rem',
  minHeight: '200px',
  outline: 'none',
};

export const Editor = forwardRef<EditorRef, EditorProps>(({
  value,
  placeholder,
  onChange,
  className,
  style
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<BaseEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current || editorRef.current) return;

    // Add placeholder styles
    const style = document.createElement('style');
    style.textContent = `
      [data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #aaa;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Initialize editor
    const options: EditorOptions = {
      element: containerRef.current,
      onChange: (html) => onChange?.(html)
    };

    editorRef.current = new BaseEditor(options);

    // Set initial content
    if (value) {
      editorRef.current.setContent(value);
    }

    return () => {
      // Cleanup
      editorRef.current = null;
      style.remove();
    };
  }, []);

  // Update content when value prop changes
  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      editorRef.current.setContent(value);
    }
  }, [value]);

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    getContent: () => editorRef.current?.getContent() || '',
    setContent: (html: string) => editorRef.current?.setContent(html),
    focus: () => containerRef.current?.focus()
  }));

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...defaultStyles, ...style }}
      contentEditable
      data-placeholder={placeholder}
      suppressContentEditableWarning
    />
  );
});

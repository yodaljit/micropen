import { useEffect, useRef } from 'react';
import '@codeium/lightweight-editor/components';

interface EditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'lightweight-editor': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & EditorProps,
        HTMLElement
      >;
    }
  }
}

export const Editor = ({ value, placeholder, onChange }: EditorProps) => {
  const editorRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const editor = editorRef.current;
    if (!editor) return;

    const handleChange = (e: CustomEvent<{ value: string }>) => {
      onChange?.(e.detail.value);
    };

    editor.addEventListener('change', handleChange as EventListener);
    return () => editor.removeEventListener('change', handleChange as EventListener);
  }, [onChange]);

  return (
    <lightweight-editor
      ref={editorRef}
      value={value}
      placeholder={placeholder}
    />
  );
};

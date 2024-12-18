import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { Editor as MicropenEditor } from '../editor';
import { Toolbar } from '../components/Toolbar';
import type { IconType } from '../components/vue-icons';

export interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  features?: IconType[];
}

export interface EditorRef {
  getContent: () => string;
  setContent: (html: string) => void;
  focus: () => void;
}

const defaultFeatures: IconType[] = [
  'bold',
  'italic',
  'underline',
  'link',
  'heading',
  'list',
  'code'
];

export const Editor = forwardRef<EditorRef, EditorProps>(({
  value = '',
  onChange,
  placeholder = '',
  features = defaultFeatures
}, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<MicropenEditor | null>(null);
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set());

  const updateActiveFeatures = () => {
    if (!editorInstance.current) return;
    
    const newActiveFeatures = new Set<string>();
    features.forEach(feature => {
      if (editorInstance.current?.isActive(feature)) {
        newActiveFeatures.add(feature);
      }
    });
    setActiveFeatures(newActiveFeatures);
  };

  const handleFeatureClick = (feature: string) => {
    if (!editorInstance.current) return;
    editorInstance.current.execute(feature);
    updateActiveFeatures();
  };

  useImperativeHandle(ref, () => ({
    getContent: () => editorInstance.current?.getContent() || '',
    setContent: (html: string) => {
      editorInstance.current?.setContent(html);
      updateActiveFeatures();
    },
    focus: () => editorRef.current?.focus()
  }));

  useEffect(() => {
    if (!editorRef.current || editorInstance.current) return;

    const options = {
      element: editorRef.current,
      placeholder,
      features,
      initialContent: value,
      onChange: (html: string) => {
        onChange?.(html);
        updateActiveFeatures();
      }
    };

    editorInstance.current = new MicropenEditor(options);
    // Initial state update
    setTimeout(updateActiveFeatures, 0);

    return () => {
      editorInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (editorInstance.current && value !== editorInstance.current.getContent()) {
      editorInstance.current.setContent(value);
      updateActiveFeatures();
    }
  }, [value]);

  return (
    <div className="micropen-container">
      <Toolbar
        features={features}
        activeFeatures={activeFeatures}
        onFeatureClick={handleFeatureClick}
      />
      <div
        ref={editorRef}
        className="micropen-editor"
        data-placeholder={placeholder}
        onKeyDown={updateActiveFeatures}
        onMouseUp={updateActiveFeatures}
        onBlur={updateActiveFeatures}
        onFocus={updateActiveFeatures}
      />
    </div>
  );
});

Editor.displayName = 'Editor';

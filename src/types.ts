export interface EditorOptions {
  element: HTMLElement;
  onChange?: (html: string) => void;
  placeholder?: string;
  features?: string[];
  initialContent?: string;
};

export type FeatureBlueprint = {
  type: 'inline' | 'block' | 'void';
  requirements: string[];
  domImpact: string[];
  cleanupSteps: string[];
  generate: string;  // The actual code to be generated
};

export type GeneratedFeature = {
  exec: (...args: any[]) => void;
  cleanup: () => void;
  handlers?: Record<string, EventListener>;
};

export type StateUpdate = {
  type: string;
  payload: any;
  timestamp: number;
};

export type EditorState = {
  content: string;
  selection: Selection | null;
  activeFeatures: Set<string>;
  history: StateUpdate[];
};

export interface Editor {
  enable(feature: string): Promise<void>;
  disable(feature: string): void;
  getContent(): string;
  setContent(html: string): void;
  getBundleSize(): number;
}

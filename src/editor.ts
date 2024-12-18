import './styles.css';
import type { EditorOptions, GeneratedFeature } from './types';
import { StateManager } from './core/state';
import { FeatureGenerator } from './core/generator';
import { browserAPIs, isBrowser } from './utils/ssr';
import { measureBundleSize } from './utils/size';

export class Editor {
  #element: HTMLElement;
  #state: StateManager;
  #generator: FeatureGenerator;
  #features: Map<string, GeneratedFeature>;
  #activeFeatures: Set<string>;
  #onChange?: (html: string) => void;

  constructor(options: EditorOptions) {
    if (!isBrowser()) {
      throw new Error('Editor can only be initialized in browser environment');
    }

    if (!options.element) {
      throw new Error('Editor element is required');
    }

    if (!(options.element instanceof HTMLElement)) {
      throw new Error('Editor element must be a valid HTMLElement');
    }

    this.#element = options.element;
    this.#onChange = options.onChange;

    if (options.placeholder) {
      this.#element.setAttribute('data-placeholder', options.placeholder);
    }
    
    if (options.initialContent) {
      this.setContent(options.initialContent);
    }

    this.#features = new Map();
    this.#activeFeatures = new Set();

    // Initialize core components
    this.#state = new StateManager({ content: this.#element.innerHTML });
    this.#generator = new FeatureGenerator();

    // Make element editable
    this.#element.contentEditable = 'true';
    this.#element.spellcheck = false;

    // Setup base editor
    this.#initializeEditor();

    if (options.features) {
      options.features.forEach(feature => this.enable(feature));
    }
  }

  async enable(feature: string): Promise<void> {
    if (!isBrowser()) return;
    if (this.#features.has(feature)) return;

    try {
      // Generate feature code
      const generatedFeature = await this.#generator.generateFeature(feature);

      // Store feature
      this.#features.set(feature, generatedFeature);

      this.#state.update({
        type: 'FEATURE_ENABLE',
        payload: feature,
        timestamp: Date.now()
      });
    } catch (error) {
      throw error;
    }
  }

  execute(feature: string): void {
    if (!isBrowser()) return;

    const featureInstance = this.#features.get(feature);
    if (!featureInstance) {
      throw new Error(`Feature ${feature} not found`);
    }

    try {
      // Execute the feature
      featureInstance.exec();

      // Notify change
      this.#handleInput();
    } catch (error) {
      console.error(`Error executing feature ${feature}:`, error);
    }
  }

  disable(feature: string): void {
    if (!isBrowser()) return;

    const featureInstance = this.#features.get(feature);
    if (!featureInstance) return;

    try {
      // Cleanup and remove
      featureInstance.cleanup();
      this.#features.delete(feature);
      this.#activeFeatures.delete(feature);

      this.#state.update({
        type: 'FEATURE_DISABLE',
        payload: feature,
        timestamp: Date.now()
      });
    } catch (error) {
      throw error;
    }
  }

  hasFeature(feature: string): boolean {
    return this.#features.has(feature);
  }

  isActive(feature: string): boolean {
    return this.#activeFeatures.has(feature);
  }

  getContent(): string {
    return this.#element.innerHTML;
  }

  setContent(html: string): void {
    if (!isBrowser()) return;
    this.#element.innerHTML = html;
    this.#state.update({
      type: 'SET_CONTENT',
      payload: html,
      timestamp: Date.now()
    });
    this.#onChange?.(html);
  }

  #initializeEditor(): void {
    if (!isBrowser()) return;

    // Setup basic handlers
    this.#element.addEventListener('input', this.#handleInput);
    document.addEventListener('selectionchange', this.#handleSelection);

    // Prevent default behaviors we don't want
    this.#element.addEventListener('paste', this.#handlePaste);
  }

  #handleInput = (): void => {
    const content = this.#element.innerHTML;
    this.#state.update({
      type: 'CONTENT_UPDATE',
      payload: content,
      timestamp: Date.now()
    });

    this.#onChange?.(content);
  };

  #handleSelection = (): void => {
    const sel = browserAPIs.getSelection();
    if (!sel?.rangeCount) {
      this.#activeFeatures.clear();
      return;
    }

    // Check each feature's state
    for (const [name] of this.#features) {
      const state = document.queryCommandState(this.#getCommand(name));
      if (state) {
        this.#activeFeatures.add(name);
      } else {
        this.#activeFeatures.delete(name);
      }
    }
  };

  #handlePaste = (event: ClipboardEvent): void => {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain') ?? '';
    browserAPIs.execCommand('insertText', false, text);
  };

  #getCommand(feature: string): string {
    switch (feature) {
      case 'bold': return 'bold';
      case 'italic': return 'italic';
      case 'underline': return 'underline';
      case 'link': return 'createLink';
      case 'heading': return 'formatBlock';
      case 'list': return 'insertUnorderedList';
      case 'code': return 'formatBlock';
      default: return feature;
    }
  }

  destroy(): void {
    if (!isBrowser()) return;

    // Remove event listeners
    this.#element.removeEventListener('input', this.#handleInput);
    document.removeEventListener('selectionchange', this.#handleSelection);
    this.#element.removeEventListener('paste', this.#handlePaste);

    // Clean up features
    for (const [name] of this.#features) {
      this.disable(name);
    }

    // Reset state
    this.#state.update({
      type: 'SET_CONTENT',
      payload: '',
      timestamp: Date.now()
    });

    // Clear features and active features
    this.#features.clear();
    this.#activeFeatures.clear();
  }

  getBundleSize(): number {
    return measureBundleSize(this.#features);
  }

  toString(): string {
    return `Editor(size=${this.getBundleSize()}B, features=[${Array.from(this.#features.keys()).join(', ')}])`;
  }
}

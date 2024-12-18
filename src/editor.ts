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

    const element = browserAPIs.getElement(options.element.id);
    if (!element) {
      throw new Error('Editor element not found');
    }

    this.#element = element;
    this.#onChange = options.onChange;
    this.#features = new Map();
    this.#activeFeatures = new Set();

    // Initialize core components
    this.#state = new StateManager({ content: this.#element.innerHTML });
    this.#generator = new FeatureGenerator();

    // Setup base editor
    this.#initializeEditor();

    // Enable initial features
    if (options.features) {
      options.features.forEach(feature => this.enable(feature));
    }

    // Log initial bundle size
    console.log(`Initial bundle size: ${this.getBundleSize()}B`);
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

      // Log updated bundle size
      console.log(`Bundle size after enabling ${feature}: ${this.getBundleSize()}B`);

      console.log(`Feature ${feature} enabled successfully`);
    } catch (error) {
      console.error(`Failed to enable feature: ${feature}`, error);
      throw error;
    }
  }

  execute(feature: string): void {
    if (!isBrowser()) return;

    console.log(`Executing feature: ${feature}`);
    const featureInstance = this.#features.get(feature);

    if (!featureInstance) {
      console.error(`Feature ${feature} not found`);
      return;
    }

    try {
      // Execute the feature
      featureInstance.exec();

      // Notify change
      this.#handleInput();

      console.log(`Feature ${feature} executed successfully`);
    } catch (error) {
      console.error(`Error executing feature ${feature}:`, error);
      throw error;
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

      console.log(`Feature ${feature} disabled successfully`);
    } catch (error) {
      console.error(`Error disabling feature ${feature}:`, error);
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

    // Make element editable
    this.#element.contentEditable = 'true';
    this.#element.spellcheck = false;

    // Setup basic handlers
    this.#element.addEventListener('input', this.#handleInput.bind(this));
    document.addEventListener('selectionchange', this.#handleSelection.bind(this));

    // Prevent default behaviors we don't want
    this.#element.addEventListener('paste', this.#handlePaste.bind(this));
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

  destroy(): void {
    if (!isBrowser()) return;

    // Cleanup all features
    Array.from(this.#features.keys()).forEach(feature => {
      this.disable(feature);
    });

    // Remove event listeners
    this.#element.removeEventListener('input', this.#handleInput);
    document.removeEventListener('selectionchange', this.#handleSelection);
    this.#element.removeEventListener('paste', this.#handlePaste);

    // Reset element
    this.#element.contentEditable = 'false';
  }

  getBundleSize(): number {
    return measureBundleSize(this.#features);
  }

  toString(): string {
    return `Editor(size=${this.getBundleSize()}B, features=[${Array.from(this.#features.keys()).join(', ')}])`;
  }

  #getCommand(featureName: string): string {
    switch (featureName) {
      case 'bold': return 'bold';
      case 'italic': return 'italic';
      case 'underline': return 'underline';
      case 'link': return 'createLink';
      case 'heading': return 'formatBlock';
      case 'list': return 'insertUnorderedList';
      default: return '';
    }
  }
}

import { LightweightEditor } from './editor-component';

// Register web component
if (!customElements.get('lightweight-editor')) {
  customElements.define('lightweight-editor', LightweightEditor);
}

export { LightweightEditor };

import { Editor } from '../editor';
import type { EditorOptions } from '../types';

export class LightweightEditor extends HTMLElement {
  private editor: Editor | null = null;
  private editorContainer: HTMLDivElement | null = null;
  private toolbarContainer: HTMLDivElement | null = null;

  static get observedAttributes() {
    return ['value', 'placeholder'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.setupEditor();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (!this.editor) return;
    
    switch (name) {
      case 'value':
        if (oldValue !== newValue) {
          this.editor.setContent(newValue);
        }
        break;
      case 'placeholder':
        this.editorContainer?.setAttribute('placeholder', newValue);
        break;
    }
  }

  private setupEditor() {
    if (!this.shadowRoot) return;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: system-ui, -apple-system, sans-serif;
      }
      #toolbar {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        flex-wrap: wrap;
      }
      #toolbar > div {
        display: flex;
        gap: 0.5rem;
        padding-right: 0.5rem;
        border-right: 1px solid #eee;
      }
      #toolbar > div:last-child {
        border-right: none;
      }
      button {
        padding: 0.5rem;
        min-width: 2.5rem;
        border: 1px solid #ddd;
        background: #fff;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      button:hover {
        background: #f5f5f5;
      }
      button.active {
        background: #e0e0e0;
        border-color: #ccc;
      }
      #editor {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 1rem;
        min-height: 200px;
      }
      #editor:focus {
        outline: none;
        border-color: #aaa;
      }
    `;

    // Create toolbar
    this.toolbarContainer = document.createElement('div');
    this.toolbarContainer.id = 'toolbar';
    this.setupToolbar();

    // Create editor container
    this.editorContainer = document.createElement('div');
    this.editorContainer.id = 'editor';
    this.editorContainer.contentEditable = 'true';
    this.editorContainer.innerHTML = this.getAttribute('value') || '';

    // Add to shadow DOM
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(this.toolbarContainer);
    this.shadowRoot.appendChild(this.editorContainer);

    // Initialize editor
    const options: EditorOptions = {
      element: this.editorContainer,
      onChange: (html: string) => {
        this.dispatchEvent(new CustomEvent('change', { detail: { value: html } }));
      }
    };

    this.editor = new Editor(options);
  }

  private setupToolbar() {
    if (!this.toolbarContainer) return;

    const buttonGroups = [
      {
        group: 'Text formatting',
        buttons: [
          { id: 'bold', icon: 'bold', title: 'Bold (Ctrl+B)' },
          { id: 'italic', icon: 'italic', title: 'Italic (Ctrl+I)' },
          { id: 'underline', icon: 'underline', title: 'Underline (Ctrl+U)' },
          { id: 'color', icon: 'palette', title: 'Text Color' }
        ]
      },
      {
        group: 'Links and media',
        buttons: [
          { id: 'link', icon: 'link', title: 'Link (Ctrl+K)' },
          { id: 'image', icon: 'image', title: 'Insert Image' }
        ]
      },
      {
        group: 'Block formatting',
        buttons: [
          { id: 'heading', icon: 'heading', title: 'Heading' },
          { id: 'list', icon: 'list-ul', title: 'List' },
          { id: 'code', icon: 'code', title: 'Code Block' },
          { id: 'blockquote', icon: 'quote-right', title: 'Blockquote' }
        ]
      },
      {
        group: 'Alignment',
        buttons: [
          { id: 'align-left', icon: 'align-left', title: 'Align Left' },
          { id: 'align-center', icon: 'align-center', title: 'Align Center' },
          { id: 'align-right', icon: 'align-right', title: 'Align Right' }
        ]
      },
      {
        group: 'History',
        buttons: [
          { id: 'undo', icon: 'undo', title: 'Undo (Ctrl+Z)' },
          { id: 'redo', icon: 'redo', title: 'Redo (Ctrl+Shift+Z)' }
        ]
      }
    ];

    buttonGroups.forEach(group => {
      const div = document.createElement('div');
      
      group.buttons.forEach(button => {
        const btn = document.createElement('button');
        btn.id = button.id;
        btn.title = button.title;
        btn.innerHTML = `<i class="fas fa-${button.icon}"></i>`;
        btn.addEventListener('click', () => this.executeFeature(button.id));
        div.appendChild(btn);
      });

      this.toolbarContainer?.appendChild(div);
    });
  }

  private async executeFeature(feature: string) {
    if (!this.editor) return;

    try {
      if (!this.editor.hasFeature(feature)) {
        await this.editor.enable(feature);
      }
      this.editor.execute(feature);
    } catch (error) {
      throw new Error(`Error executing feature ${feature}`);
    }
  }

  // Public API
  public getValue(): string {
    return this.editorContainer?.innerHTML || '';
  }

  public setValue(value: string) {
    if (this.editor) {
      this.editor.setContent(value);
    }
  }

  set value(newValue: string) {
    if (this.editor) {
      this.editor.setContent(newValue);
    } else {
      this.setAttribute('value', newValue);
    }
  }
}

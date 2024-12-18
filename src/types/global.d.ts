declare global {
  // Browser APIs
  interface Window {
    customElements: CustomElementRegistry;
    HTMLElement: typeof HTMLElement;
    requestAnimationFrame: (callback: FrameRequestCallback) => number;
    cancelAnimationFrame: (handle: number) => void;
    getComputedStyle: (elt: Element) => CSSStyleDeclaration;
  }

  // Custom Elements
  interface HTMLElementTagNameMap {
    'lean-editor': HTMLElement;
  }

  // Custom Events
  interface EditorChangeEvent extends CustomEvent<{ value: string }> {
    type: 'change';
  }

  interface EditorStateEvent extends CustomEvent<{ state: Record<string, any> }> {
    type: 'statechange';
  }

  // Node Environment
  namespace NodeJS {
    interface Global {
      window: Window | undefined;
      document: Document | undefined;
      navigator: Navigator | undefined;
      requestAnimationFrame: ((callback: FrameRequestCallback) => number) | undefined;
      cancelAnimationFrame: ((handle: number) => void) | undefined;
      getComputedStyle: ((elt: Element) => CSSStyleDeclaration) | undefined;
    }
  }
}

/**
 * Check if code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof document !== 'undefined' && 
         typeof window.getSelection === 'function';
};

/**
 * Safely access browser APIs with SSR fallbacks
 */
export const browserAPIs = {
  getSelection: (): Selection | null => {
    return isBrowser() ? window.getSelection() : null;
  },

  execCommand: (command: string, showUI: boolean = false, value: string = ''): boolean => {
    if (!isBrowser()) return false;
    try {
      return document.execCommand(command, showUI, value);
    } catch (e) {
      console.error(`Error executing command: ${command}`, e);
      return false;
    }
  },

  queryCommandState: (command: string): boolean => {
    if (!isBrowser()) return false;
    try {
      return document.queryCommandState(command);
    } catch (e) {
      console.error(`Error querying command state: ${command}`, e);
      return false;
    }
  },

  createElement: (tag: string): HTMLElement | null => {
    return isBrowser() ? document.createElement(tag) : null;
  },

  getElement: (id: string): HTMLElement | null => {
    return isBrowser() ? document.getElementById(id) : null;
  }
};

import type { EditorState, StateUpdate } from '../types';

export class StateManager {
  #state: EditorState;
  #history: StateUpdate[];
  #maxHistory: number;

  constructor(initialState: Partial<EditorState> = {}) {
    this.#state = {
      content: initialState.content || '',
      selection: null,
      activeFeatures: new Set(),
      history: []
    };
    this.#history = [];
    this.#maxHistory = 100;
  }

  update(update: StateUpdate): void {
    switch (update.type) {
      case 'SET_CONTENT':
        this.#state.content = update.payload;
        break;
      case 'SET_SELECTION':
        this.#state.selection = update.payload;
        break;
      case 'ENABLE_FEATURE':
        this.#state.activeFeatures.add(update.payload);
        break;
      case 'DISABLE_FEATURE':
        this.#state.activeFeatures.delete(update.payload);
        break;
    }

    this.#history.push(update);
    if (this.#history.length > this.#maxHistory) {
      this.#history.shift();
    }
  }

  getState(): EditorState {
    return { ...this.#state };
  }

  getHistory(): StateUpdate[] {
    return [...this.#history];
  }

  undo(): void {
    const lastUpdate = this.#history.pop();
    if (!lastUpdate) return;

    switch (lastUpdate.type) {
      case 'SET_CONTENT':
        // Find the previous content update
        const prevContent = this.#history
          .slice()
          .reverse()
          .find(u => u.type === 'SET_CONTENT');
        this.#state.content = prevContent?.payload || '';
        break;
      case 'ENABLE_FEATURE':
        this.#state.activeFeatures.delete(lastUpdate.payload);
        break;
      case 'DISABLE_FEATURE':
        this.#state.activeFeatures.add(lastUpdate.payload);
        break;
    }
  }
}

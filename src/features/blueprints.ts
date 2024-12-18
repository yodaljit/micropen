import type { FeatureBlueprint } from '../types';

export const basicBlueprints: Record<string, FeatureBlueprint> = {
  bold: {
    type: 'inline',
    requirements: ['selection', 'range'],
    domImpact: ['wrap'],
    cleanupSteps: ['removeHandlers'],
    generate: `return browserAPIs.execCommand('bold',0)`
  },

  italic: {
    type: 'inline',
    requirements: ['selection', 'range'],
    domImpact: ['wrap'],
    cleanupSteps: ['removeHandlers'],
    generate: `return browserAPIs.execCommand('italic',0)`
  },

  underline: {
    type: 'inline',
    requirements: ['selection', 'range'],
    domImpact: ['wrap'],
    cleanupSteps: ['removeHandlers'],
    generate: `return browserAPIs.execCommand('underline',0)`
  },

  link: {
    type: 'inline',
    requirements: ['selection', 'range'],
    domImpact: ['wrap', 'insert'],
    cleanupSteps: ['removeHandlers', 'removeInput'],
    generate: `var u=prompt('URL:');return browserAPIs.execCommand('createLink',0,u||0)`
  },

  heading: {
    type: 'block',
    requirements: ['selection', 'range', 'block'],
    domImpact: ['wrap', 'transform'],
    cleanupSteps: ['removeHandlers'],
    generate: `var n=(browserAPIs.getSelection()||0).getRangeAt(0).startContainer;var e=n.nodeType>2?n.parentElement:n;return browserAPIs.execCommand('formatBlock',0,e?.closest('h2')?'p':'h2')`
  },

  list: {
    type: 'block',
    requirements: ['selection', 'range', 'block'],
    domImpact: ['wrap', 'transform'],
    cleanupSteps: ['removeHandlers'],
    generate: `var s=browserAPIs.getSelection();return browserAPIs.execCommand('insertUnorderedList',0,s?.rangeCount||0)`
  },

  image: {
    type: 'inline',
    requirements: ['range'],
    domImpact: ['insert'],
    cleanupSteps: ['removeInput'],
    generate: `var u=prompt('Image URL:');return u&&browserAPIs.execCommand('insertImage',0,u)`
  },

  undo: {
    type: 'void',
    requirements: [],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `return browserAPIs.execCommand('undo',0)`
  },

  redo: {
    type: 'void',
    requirements: [],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `return browserAPIs.execCommand('redo',0)`
  },

  color: {
    type: 'inline',
    requirements: ['selection', 'range'],
    domImpact: ['transform'],
    cleanupSteps: ['removeInput'],
    generate: `var c=prompt('Color (hex/name):');return c&&browserAPIs.execCommand('foreColor',0,c)`
  },

  alignLeft: {
    type: 'block',
    requirements: ['block'],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `return browserAPIs.execCommand('justifyLeft',0)`
  },

  alignCenter: {
    type: 'block',
    requirements: ['block'],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `return browserAPIs.execCommand('justifyCenter',0)`
  },

  alignRight: {
    type: 'block',
    requirements: ['block'],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `return browserAPIs.execCommand('justifyRight',0)`
  },

  code: {
    type: 'block',
    requirements: ['block'],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `var s=browserAPIs.getSelection(),e=s?.getRangeAt(0).startContainer.parentElement;return browserAPIs.execCommand('formatBlock',0,e?.closest('pre')?'p':'pre')`
  },

  blockquote: {
    type: 'block',
    requirements: ['block'],
    domImpact: ['transform'],
    cleanupSteps: [],
    generate: `var s=browserAPIs.getSelection(),e=s?.getRangeAt(0).startContainer.parentElement;return browserAPIs.execCommand('formatBlock',0,e?.closest('blockquote')?'p':'blockquote')`
  }
};

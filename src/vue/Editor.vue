<template>
  <div class="micropen-container">
    <div class="micropen-toolbar">
      <button
        v-for="feature in features"
        :key="feature"
        class="micropen-button"
        :class="{ active: isFeatureActive(feature) }"
        @click="toggleFeature(feature)"
        :title="feature.charAt(0).toUpperCase() + feature.slice(1)"
      >
        <component :is="Icons[feature as IconType] || null" />
      </button>
    </div>
    <div 
      ref="editorRef" 
      class="micropen-editor" 
      :data-placeholder="placeholder"
      @keydown="updateActiveFeatures"
      @mouseup="updateActiveFeatures"
      @blur="updateActiveFeatures"
      @focus="updateActiveFeatures"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, onBeforeUnmount } from 'vue';
import { Editor as MicropenEditor } from '../editor';
import { Icons, type IconType } from '../components/vue-icons';
import type { EditorOptions } from '../types';

export default defineComponent({
  name: 'Editor',
  components: Icons,
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    features: {
      type: Array as () => IconType[],
      default: () => ['bold', 'italic', 'underline', 'link', 'heading', 'list', 'code']
    }
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const editorRef = ref<HTMLElement | null>(null);
    const editor = ref<MicropenEditor | null>(null);
    const activeFeatures = ref<Set<string>>(new Set());

    const updateActiveFeatures = () => {
      if (!editor.value) return;
      
      activeFeatures.value.clear();
      props.features.forEach(feature => {
        if (editor.value?.isActive(feature)) {
          activeFeatures.value.add(feature);
        }
      });
    };

    const isFeatureActive = (feature: IconType): boolean => {
      return editor.value?.isActive(feature) || false;
    };

    const toggleFeature = (feature: IconType) => {
      if (!editor.value) return;

      editor.value.execute(feature);
      updateActiveFeatures();
    };

    const initializeEditor = () => {
      if (!editorRef.value || editor.value) return;

      try {
        const options: EditorOptions = {
          element: editorRef.value,
          placeholder: props.placeholder,
          features: props.features,
          initialContent: props.modelValue,
          onChange: (html: string) => {
            emit('update:modelValue', html);
            emit('change', html);
            updateActiveFeatures();
          }
        };

        editor.value = new MicropenEditor(options);
      } catch (error) {
        console.error('Failed to initialize editor:', error);
      }
    };

    onMounted(() => {
      initializeEditor();
      // Initial state update
      setTimeout(updateActiveFeatures, 0);
    });

    onBeforeUnmount(() => {
      editor.value = null;
    });

    watch(() => props.modelValue, (newValue) => {
      if (editor.value && newValue !== editor.value.getContent()) {
        editor.value.setContent(newValue);
        updateActiveFeatures();
      }
    });

    return {
      editorRef,
      activeFeatures,
      toggleFeature,
      isFeatureActive,
      updateActiveFeatures,
      Icons
    };
  }
});
</script>

<style>
.micropen-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.micropen-toolbar {
  display: flex;
  padding: 8px;
  background: white;
  border-bottom: 1px solid #eee;
  gap: 8px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.micropen-button {
  padding: 8px;
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
  color: #333;
}

.micropen-button:hover {
  background: #f5f5f5;
}

.micropen-button.active {
  background: #e0e0e0;
  border-color: #ccc;
  box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.micropen-editor {
  min-height: 150px;
  padding: 16px;
  outline: none;
  line-height: 1.5;
}

.micropen-editor:empty::before {
  content: attr(data-placeholder);
  color: #999;
  pointer-events: none;
}

.micropen-editor:focus {
  outline: none;
}

/* Formatted content styles */
.micropen-editor strong { font-weight: bold; }
.micropen-editor em { font-style: italic; }
.micropen-editor u { text-decoration: underline; }
.micropen-editor a { color: #0066cc; text-decoration: underline; }
.micropen-editor h2 { font-size: 1.5em; margin: 1em 0; }
.micropen-editor ul { margin: 1em 0; padding-left: 2em; }
.micropen-editor li { list-style: disc; }
.micropen-editor img { max-width: 100%; height: auto; }
.micropen-editor pre {
  background: #f5f5f5;
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
}
</style>

<template>
  <lightweight-editor
    :value="modelValue"
    :placeholder="placeholder"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import '@codeium/lightweight-editor/components';
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const handleChange = (e: CustomEvent<{ value: string }>) => {
  emit('update:modelValue', e.detail.value);
};
</script>

<!-- Example usage:
<template>
  <Editor
    v-model="content"
    placeholder="Enter your content"
  />
</template>

<script setup>
import { ref } from 'vue';
import Editor from './Editor.vue';

const content = ref('Start typing...');
</script>
-->

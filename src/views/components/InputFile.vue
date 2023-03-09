<template>
  <div>
    <input type="file" ref="fileInputRef" @change="onFileSelected" :multiple="multiple" />
  </div>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, ref } from "vue";

const emits = defineEmits(["update:modelValue"]);

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  }
});

const fileInputRef = ref(null);

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files);
  emits("update:modelValue", files);
}
</script>

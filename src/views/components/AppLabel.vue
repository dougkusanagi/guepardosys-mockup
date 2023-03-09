<template>
  <label class="block text-xs uppercase" :for="props.for"><slot /></label>
</template>

<script setup lang="ts">
const props = defineProps<{
  for: string;
}>();
</script>

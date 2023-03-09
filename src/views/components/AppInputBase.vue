<template>
  <AppLabel v-if="props.label" :for="props.id">{{ props.label }}</AppLabel>
  <input
    class="input input-sm input-bordered w-full"
    :id="props.id"
    :value="modelValue"
    @input="emitUpdateModelValue"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import AppLabel from "./AppLabel.vue";

export interface Props {
  label?: string;
  id?: string;
  buttonText?: string;
  modelValue?: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  label: "",
  id: uuidv4(),
  buttonText: "Escolher Mockups"
});

const emit = defineEmits(["update:modelValue"]);

function emitUpdateModelValue(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

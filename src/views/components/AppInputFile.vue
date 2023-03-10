<template>
  <div>
    <AppLabel v-if="props.label" :for="props.id">{{ props.label }}</AppLabel>
    <input
      class="hidden"
      type="file"
      :id="props.id"
      multiple
      @change="onFileSelected"
      :accept="allowed"
    />
    <label ref="button_ref" class="btn w-full" :for="props.id">{{ props.buttonText }}</label>
  </div>
</template>

<script setup lang="ts">
import { v4 as uuidv4 } from "uuid";
import AppLabel from "./AppLabel.vue";

export interface Props {
  label?: string;
  id?: string;
  buttonText?: string;
  modelValue?: FileList | null;
  allowed?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: uuidv4(),
  buttonText: "Escolher Imagens",
  allowed: "image/png, image/gif, image/jpeg, image/webp"
});

const emit = defineEmits(["update:modelValue"]);

function onFileSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.files);
  // console.log(target.files);
}
</script>

<template>
  <div class="nav-left flex-1 w-1/4 bg-base-300 px-3">
    <div class="flex gap-3 py-3 border-b border-base-100">
      <AppInputFile v-model="form_file.input_image_list" class="basis-1/2" id="input_images" />

      <AppInputFile
        v-model="form_file.input_mockup_list"
        class="basis-1/2"
        id="input_mockups"
        button-text="Escolher Mockups"
      />
    </div>

    <div class="flex gap-6 py-3">
      <div class="w-1/2">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <AppInputBase
              v-model="form_text.input_width"
              label="L"
              id="input_width"
              type="number"
              min="0"
            />
          </div>

          <div class="flex items-center gap-3">
            <AppInputBase
              v-model="form_text.input_height"
              label="A"
              id="input_height"
              type="number"
              min="0"
            />
          </div>
        </div>
      </div>

      <div class="w-1/2">
        <div class="flex flex-col gap-3">
          <div class="flex items-center gap-3">
            <AppInputBase
              v-model="form_text.input_left"
              label="X"
              id="input_left"
              type="number"
              min="0"
            />
          </div>

          <div class="flex items-center gap-3">
            <AppInputBase
              v-model="form_text.input_top"
              label="Y"
              id="input_top"
              type="number"
              min="0"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex gap-6 py-3"></div>
  </div>

  <main class="bg-base-200">
    <canvas ref="screen" class="screen bg-slate-600"></canvas>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, type Ref } from "vue";
import AppInputFile from "./components/AppInputFile.vue";
import AppInputBase from "./components/AppInputBase.vue";
import { getImageListBlob } from "@/composables/useImage";

interface IFormText {
  input_width: number;
  input_height: number;
  input_left: number;
  input_top: number;
}
interface IFormFile {
  input_image_list: FileList | null;
  input_mockup_list: FileList | null;
}

const form_text = reactive<IFormText>({
  input_width: 0,
  input_height: 0,
  input_left: 0,
  input_top: 0
});

const form_file = reactive<IFormFile>({
  input_image_list: null,
  input_mockup_list: null
});

const screen: Ref = ref<HTMLCanvasElement>();
const context: Ref = ref<CanvasRenderingContext2D>();
const image_list: Ref = ref<HTMLImageElement>();
const index_list = ref(0);

onMounted(() => {
  screen.value.width = 1200;
  screen.value.height = 1200;
  context.value = screen.value.getContext("2d") as CanvasRenderingContext2D;
});

function renderCurrentImage() {
  const image = image_list.value[index_list.value] as HTMLImageElement;

  if (image) {
    context.value.clearRect(0, 0, screen.value.width, screen.value.height);
    context.value.drawImage(
      image,
      form_text.input_left,
      form_text.input_top,
      image.width,
      image.height
    );
  }
}

function isValidIndex(index: number): boolean {
  return index >= 0 && index < image_list.value.length;
}

function setCurrentImage(index: number) {
  console.log(index_list.value);

  if (isValidIndex(index)) {
    index_list.value = index;
  }

  renderCurrentImage();
}

/** Implement Debounce */
watch(
  () => form_file.input_image_list,
  async (input_image_list) => {
    if (input_image_list && input_image_list.length > 0) {
      const arr = Array.from(input_image_list);
      const image_loaded_list = await getImageListBlob(arr);

      image_list.value = image_loaded_list;
      renderCurrentImage();
    }
  }
);

watch(form_text, renderCurrentImage);
</script>

<style scoped>
.collapse-title,
:where(.collapse > input[type="checkbox"]) {
  min-height: unset;
}

.nav-left,
.screen {
  height: calc(100vh - 64px);
}
</style>

<template>
  <div class="flex">
    <div class="w-40 flex flex-col">
      <button
        class="btn btn-block text-xs rounded-none hover:bg-base-100"
        :class="{ 'bg-base-300 border-none': openTab === 1 }"
        @click="toggleTabs(1)"
      >
        Configurações
      </button>

      <button
        class="btn btn-block text-xs rounded-none hover:bg-base-100"
        :class="{ 'bg-base-300 border-none': openTab === 2 }"
        @click="toggleTabs(2)"
      >
        Imagens
      </button>

      <button
        class="btn btn-block text-xs rounded-none hover:bg-base-100"
        :class="{ 'bg-base-300 border-none': openTab === 3 }"
        @click="toggleTabs(3)"
      >
        Mockups
      </button>
    </div>
  </div>

  <div class="nav-left flex-col flex-1 w-1/4 bg-base-300 px-3">
    <div class="flex gap-3 py-3 border-b border-base-100">
      <AppInputFile v-model="form_file.input_image_list" class="basis-1/2" id="input_images" />

      <AppInputFile
        v-model="form_file.input_mockup_list"
        class="basis-1/2"
        id="input_mockups"
        button-text="Escolher Mockups"
      />
    </div>

    <div class="bg-base-300 px-3" :class="{ hidden: openTab !== 1, block: openTab === 1 }">
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

    <div class="flex-1 h-full" :class="{ hidden: openTab !== 2, block: openTab === 2 }">
      <div class="max-w-full overflow-y-auto p-1" ref="ref_image_tab"></div>
    </div>
  </div>

  <main class="bg-base-200">
    <canvas ref="screen" class="screen bg-slate-600"></canvas>
  </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch, type Ref } from "vue";
import AppInputFile from "./components/AppInputFile.vue";
import AppInputBase from "./components/AppInputBase.vue";
import { createImagelist } from "@/composables/useImage";

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
  input_width: 1200,
  input_height: 1200,
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
const mockup_list: Ref = ref<HTMLImageElement>();
const image_index = ref(0);
const mockup_index = ref(0);
const ref_image_tab = ref<HTMLDivElement>();
const ref_mockup_tab = ref<HTMLDivElement>();
const openTab = ref(2);

const imageStyle = ["w-[calc(33.333333%-8px)]", "m-1", "inline-flex", "cursor-pointer"];
const imageActiveStyle = ["outline", "outline-offset-4", "outline-blue-500", "image-active"];

function toggleTabs(tabNumber: number) {
  openTab.value = tabNumber;
}

onMounted(() => {
  screen.value.width = form_text.input_width;
  screen.value.height = form_text.input_height;
  context.value = screen.value.getContext("2d") as CanvasRenderingContext2D;
});

function renderImage(image: HTMLImageElement) {
  context.value.drawImage(
    image,
    form_text.input_left,
    form_text.input_top,
    form_text.input_width,
    form_text.input_height
  );
}

function clearCanvas() {
  context.value.clearRect(0, 0, screen.value.width, screen.value.height);
}

function haveImages(): boolean {
  return (
    image_list.value &&
    image_list.value.length > 0 &&
    image_list.value.length >= 0 &&
    image_index.value >= 0 &&
    image_index.value < image_list.value.length
  );
}

function haveMockups(): boolean {
  return (
    mockup_list.value &&
    mockup_list.value.length > 0 &&
    mockup_list.value.length >= 0 &&
    mockup_index.value >= 0 &&
    mockup_index.value < mockup_list.value.length
  );
}

function processCurrentRender() {
  clearCanvas();

  if (haveImages()) {
    const image = image_list.value[image_index.value] as HTMLImageElement;
    renderImage(image);
  }

  if (haveMockups()) {
    const mockup = mockup_list.value[mockup_index.value] as HTMLImageElement;
    renderImage(mockup);
  }
}

function setImageListIndex(index: number) {
  if (index >= 0 && index < image_list.value.length) {
    image_index.value = index;
  }

  processCurrentRender();
}

async function getImageListCreated(file_list: FileList): Promise<HTMLImageElement[] | void> {
  if (file_list.length > 0) {
    const arr = Array.from(file_list);
    return await createImagelist(arr);
  }
}

function styleImageFromList(image: HTMLImageElement) {
  imageStyle.forEach((style) => image.classList.add(style));
}

function styleImageActiveFromList(image: HTMLImageElement) {
  imageActiveStyle.forEach((style) => image.classList.add(style));
}

function setCurrentImage(event: Event) {
  const target = event.target as HTMLImageElement;
  if (target.dataset.index) {
    const index = parseInt(target.dataset.index);
    setImageListIndex(index);
  }
}

function clearImageListTab(ref_image_tab: Ref<HTMLDivElement | undefined>) {
  ref_image_tab.value!.innerHTML = "";
}

function renderThumbs() {
  if (haveImages() && ref_image_tab.value) {
    clearImageListTab(ref_image_tab);

    image_list.value.forEach((image: HTMLImageElement, index: number) => {
      image.dataset.index = index.toString();
      image.onclick = setCurrentImage;

      styleImageFromList(image);

      if (index === image_index.value) {
        styleImageActiveFromList(image);
      }

      ref_image_tab.value!.appendChild(image);
    });
  }

  if (haveMockups() && ref_mockup_tab.value) {
    clearImageListTab(ref_mockup_tab);

    image_list.value.forEach((image: HTMLImageElement, index: number) => {
      image.dataset.index = index.toString();
      image.onclick = setCurrentImage;

      styleImageFromList(image);

      if (index === image_index.value) {
        styleImageActiveFromList(image);
      }

      ref_mockup_tab.value!.appendChild(image);
    });
  }
}

/** Implement Debounce */
watch(form_file, async (form_file) => {
  if (form_file.input_image_list) {
    image_list.value = await getImageListCreated(form_file.input_image_list);
  }

  if (form_file.input_mockup_list) {
    mockup_list.value = await getImageListCreated(form_file.input_mockup_list);
  }

  renderThumbs();

  processCurrentRender();
});

watch(form_text, processCurrentRender);

// const imageActiveStyle = ["outline", "outline-offset-4", "outline-blue-500", "image-active"];
watch(image_index, (new_index, old_index) => {
  const old_image_active = document.querySelector(`[data-index="${old_index}"]`);
  imageActiveStyle.forEach((style) => old_image_active?.classList.remove(style));

  const new_image_active = document.querySelector(`[data-index="${new_index}"]`);
  imageActiveStyle.forEach((style) => new_image_active?.classList.add(style));
});
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

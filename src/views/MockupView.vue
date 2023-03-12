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
        Imagens ({{ image_list ? image_list.length : 0 }})
      </button>

      <button
        class="btn btn-block text-xs rounded-none hover:bg-base-100"
        :class="{ 'bg-base-300 border-none': openTab === 3 }"
        @click="toggleTabs(3)"
      >
        Mockups ({{ mockup_list ? mockup_list.length : 0 }})
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
          <h3 class="mb-3 text-lg text-center">Posição</h3>
          <div class="flex flex-row gap-3">
            <div class="w-1/2 flex items-center gap-2">
              <AppInputBase
                v-model="config_image.left"
                label="X"
                id="input_left"
                type="number"
                min="0"
              />
            </div>

            <div class="w-1/2 flex items-center gap-2">
              <AppInputBase
                v-model="config_image.top"
                label="Y"
                id="input_top"
                type="number"
                min="0"
              />
            </div>
          </div>
        </div>

        <div class="w-1/2">
          <h3 class="mb-4 text-lg text-center">Tamanho</h3>

          <div class="divide-y-2 divide-base-100 space-y-2">
            <div>
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    class="radio radio-xs checked:bg-red-500"
                    value="cover"
                    v-model="size_selected"
                  />
                  <span class="label-text ml-2">Esticar e Cobrir</span>
                </label>
              </div>
            </div>

            <div>
              <div class="form-control">
                <label class="label cursor-pointer justify-start">
                  <input
                    type="radio"
                    class="radio radio-xs checked:bg-red-500"
                    value="manual"
                    v-model="size_selected"
                  />
                  <span class="label-text ml-2">Manual</span>
                </label>
              </div>

              <div class="flex flex-row gap-3">
                <div class="w-1/2 flex items-center gap-2">
                  <AppInputBase
                    v-model="config_image.width"
                    label="L"
                    type="number"
                    min="0"
                    ref="input_width"
                  />
                </div>

                <div class="w-1/2 flex items-center gap-2">
                  <AppInputBase v-model="config_image.height" label="A" type="number" min="0" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 max-h-full" :class="{ hidden: openTab !== 2, block: openTab === 2 }">
      <div class="max-w-full overflow-y-auto p-1" ref="image_tab"></div>
    </div>
  </div>

  <main class="bg-base-200">
    <canvas ref="screen" class="screen bg-gray-200"></canvas>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref, watch, type Ref } from "vue";
import AppInputFile from "./components/AppInputFile.vue";
import AppInputBase from "./components/AppInputBase.vue";
import { createImagelist } from "@/composables/useImage";
import useCanvas from "@/composables/useCanvas";

const form_file = reactive<{
  input_image_list: FileList | null;
  input_mockup_list: FileList | null;
}>({
  input_image_list: null,
  input_mockup_list: null
});

const screen: Ref = ref<HTMLCanvasElement>();
const image_tab = ref<HTMLDivElement>();
const mockup_tab = ref<HTMLDivElement>();
const input_width = ref();
const input_height = ref();
const size_selected = ref("manual");

const openTab = ref(1);
function toggleTabs(tabNumber: number) {
  openTab.value = tabNumber;
}

const { config_image, config_mockup, image_list, mockup_list } = useCanvas(screen);

async function getImageListCreated(file_list: FileList): Promise<HTMLImageElement[] | void> {
  if (file_list.length > 0) {
    const arr = Array.from(file_list);
    return await createImagelist(arr);
  }
}

watch(form_file, async (form_file) => {
  if (form_file.input_image_list) {
    image_list.value = await getImageListCreated(form_file.input_image_list);
  }

  if (form_file.input_mockup_list) {
    mockup_list.value = await getImageListCreated(form_file.input_mockup_list);
  }
});

watch(size_selected, (new_size_selected) => {
  console.log(input_width.value.classList);

  if (new_size_selected === "cover") {
    config_image.width = screen.value.width;
    config_image.height = screen.value.height;
  } else if (new_size_selected === "manual") {
    config_image.width = 0;
    config_image.height = 0;
  }
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

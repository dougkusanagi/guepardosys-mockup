import { onMounted, reactive, ref, watch, type Ref } from "vue";

export default function useCanvas(canvas: Ref<HTMLCanvasElement>) {
  const image_index = ref(0);
  const mockup_index = ref(0);
  const image_list: Ref = ref<HTMLImageElement>();
  const mockup_list: Ref = ref<HTMLImageElement>();
  const context: Ref = ref<CanvasRenderingContext2D>();

  const default_canvas = { width: 1200, height: 1200 };
  const config_image = reactive({
    width: 1200,
    height: 1200,
    left: 0,
    top: 0
  });
  const config_mockup = reactive({
    width: 1200,
    height: 1200,
    left: 0,
    top: 0
  });

  onMounted(() => {
    canvas.value.width = default_canvas.width;
    canvas.value.height = default_canvas.height;
    context.value = canvas.value.getContext("2d");
  });

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

  function renderImage() {
    if (!haveImages()) return;
    context.value.drawImage(
      image_list.value[image_index.value],
      config_image.left,
      config_image.top,
      config_image.width,
      config_image.height
    );
  }

  function renderMockup() {
    if (!haveMockups()) return;

    context.value.drawImage(
      mockup_list.value[mockup_index.value],
      config_mockup.left,
      config_mockup.top,
      config_mockup.width,
      config_mockup.height
    );
  }

  function clearCanvas() {
    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
  }

  function processCurrentRender() {
    clearCanvas();
    renderImage();
    renderMockup();
  }

  watch(image_list, processCurrentRender);
  watch(mockup_list, processCurrentRender);
  watch(config_image, processCurrentRender);

  return {
    config_image,
    config_mockup,
    image_index,
    mockup_index,
    image_list,
    mockup_list,
    renderImage,
    renderMockup,
    processCurrentRender
  };
}

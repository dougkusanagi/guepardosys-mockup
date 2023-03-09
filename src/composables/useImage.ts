export function getImageFromFileInput(url: File): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(url);
    img.onload = () => resolve(img);
  });
}

export async function getImageListBlob(image_list: File[]): Promise<HTMLImageElement[]> {
  const new_image_list: HTMLImageElement[] = [];

  await Promise.all(
    image_list.map(async (image: File) => {
      const img = await getImageFromFileInput(image);
      new_image_list.push(img);
    })
  );

  return new_image_list;
}

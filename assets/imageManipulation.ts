// eslint-disable-next-line import/no-named-as-default
import Pica from "pica";
const pica = new Pica();

export const resizeImage = async (imageFiles: File[], maxHeight = 700) => {
  const resultPromises = imageFiles.map(async (imageFile) => {
    if (["image/svg+xml", "application/pdf"].includes(imageFile.type)) {
      return imageFile;
    }
    const dataUrl = await new Promise<string>((resolve) => {
      const fr = new FileReader();
      fr.onload = (e) =>
        resolve(typeof e.target?.result === "string" ? e.target.result : "");
      fr.readAsDataURL(imageFile);
    });

    const img = new Image();
    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = dataUrl;
    });

    const to = document.createElement("canvas");
    to.height = maxHeight;
    to.width = (img.width * maxHeight) / img.height;

    return await pica
      .resize(img, to)
      .then((result) => pica.toBlob(result, imageFile.type))
      .then(
        (blob) =>
          new File([blob], imageFile.name, {
            type: imageFile.type,
            lastModified: imageFile.lastModified,
          }),
      );
  });

  return await Promise.all(resultPromises);
};

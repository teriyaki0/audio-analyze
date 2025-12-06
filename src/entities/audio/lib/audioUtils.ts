export const blobToAudioBuffer = async (blob: Blob, audioCtx: AudioContext) => {
  const arrayBuffer = await blob.arrayBuffer();
  return await audioCtx.decodeAudioData(arrayBuffer);
};

export const getBlobDuration = async (blob: Blob): Promise<number> => {
  return new Promise((resolve) => {
    const audio = document.createElement("audio");
    audio.src = URL.createObjectURL(blob);
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
    });
  });
};

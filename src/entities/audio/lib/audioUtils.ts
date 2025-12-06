import { Mp3Encoder } from "@breezystack/lamejs";

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

export const blobToMp3 = async (blob: Blob): Promise<Blob> => {
  const arrayBuffer = await blob.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  const samples = audioBuffer.getChannelData(0); // Float32Array
  const int16Samples = floatTo16BitPCM(samples); // конвертируем

  const mp3Encoder = new Mp3Encoder(1, audioBuffer.sampleRate, 128);
  const chunkSize = 1152;
  const mp3Data: Uint8Array[] = [];

  for (let i = 0; i < int16Samples.length; i += chunkSize) {
    const chunk = int16Samples.subarray(i, i + chunkSize);
    const mp3buf = mp3Encoder.encodeBuffer(chunk);
    if (mp3buf.length > 0) mp3Data.push(mp3buf);
  }

  const mp3buf = mp3Encoder.flush();
  if (mp3buf.length > 0) mp3Data.push(mp3buf);

  const mp3Blob = new Blob(mp3Data as BlobPart[], { type: "audio/mp3" });

  return mp3Blob;
};

function floatTo16BitPCM(float32Array: Float32Array): Int16Array {
  const int16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return int16;
}

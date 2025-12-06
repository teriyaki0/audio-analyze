import http from "../../../shared/api/http";
import type { UploadResponse } from "../model/useAudioUpload";

export const uploadAudioApi = (file: Blob) => {
  const formData = new FormData();

  const mp3File = new File([file], "recording.mp3", {
    type: "audio/mpeg",
  });

  formData.append("file", mp3File);
  return http
    .post<UploadResponse>("/audio/analyze", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => res.data);
};

import { useMutation } from "@tanstack/react-query";
import { uploadAudioApi } from "../api/uploadAudioApi";
import type { Transcript } from "../../../entities/transcript/model.ts/Transcript";
import type { File } from "../../../entities/file/model/File";
import type { Report } from "../../../entities/report/model/Report";

export type UploadResponse = {
  transcript: Transcript;
  file: File;
  report: Report;
};

export const useAudioUpload = () => {
  const mutation = useMutation<UploadResponse, Error, Blob>({
    mutationFn: (file: Blob) => uploadAudioApi(file),
  });

  const uploadAudio = async (file: Blob) => {
    return mutation.mutateAsync(file);
  };

  return {
    uploadAudio,
    status: mutation.status,
    data: mutation.data,
    error: mutation.error,
  };
};

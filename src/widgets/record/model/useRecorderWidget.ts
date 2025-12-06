import { useState } from "react";
import { useAudioRecorder } from "../../../features/audio-recorder/model/useAudioRecorder";
import { useAudioUpload } from "../../../features/upload-audio/model/useAudioUpload";
import { blobToMp3 } from "../../../entities/audio/lib/audioUtils";

export const useRecorderWidget = () => {
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [showReport, setShowReport] = useState(false);

  const { start, stop } = useAudioRecorder();
  const { uploadAudio, status, data: analysisResult } = useAudioUpload();

  const startRecording = async () => {
    try {
      const startedStream = await start();
      setStream(startedStream);
      setRecording(true);
      setShowReport(false);
    } catch (error) {
      console.error("Ошибка начала записи:", error);
      throw error;
    }
  };

  const stopRecording = async () => {
    try {
      const blob = await stop();
      setRecording(false);
      setStream(null);

      const mp3Blob = await blobToMp3(blob);
      await uploadAudio(mp3Blob);
    } catch (error) {
      console.error("Ошибка остановки записи:", error);
      throw error;
    }
  };

  useState(() => {
    if (status === "success" && analysisResult) {
      setShowReport(true);
    }
  });

  return {
    recording,
    stream,
    showReport,
    startRecording,
    stopRecording,
    uploadStatus: status,
    analysisResult,
  };
};

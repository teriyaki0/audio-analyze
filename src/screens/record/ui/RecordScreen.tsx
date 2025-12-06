import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./RecordScreen.module.scss";
import { RecorderWidget } from "../../../widgets/record";
import { useRecorderWidget } from "../../../widgets/record/model/useRecorderWidget";
import { Spinner } from "../../../shared/ui/loader/ui/Spinner";

export const RecordScreen: React.FC = () => {
  const navigate = useNavigate();
  const {
    recording,
    stream,
    uploadStatus,
    analysisResult,
    startRecording,
    stopRecording,
  } = useRecorderWidget();

  const hasReport = uploadStatus === "success" && analysisResult !== undefined;

  React.useEffect(() => {
    if (hasReport && analysisResult) {
      navigate("/report", {
        state: {
          report: analysisResult.report,
          transcript: analysisResult.transcript,
        },
      });
    }
  }, [hasReport, analysisResult, navigate]);

  return (
    <div className={styles.recordScreen}>
      {!hasReport && uploadStatus !== "pending" && (
        <RecorderWidget
          recording={recording}
          stream={stream}
          startRecording={startRecording}
          stopRecording={stopRecording}
          error={uploadStatus === "error" ? "Ошибка обработки" : ""}
        />
      )}

      {uploadStatus === "pending" && <Spinner size={100} />}
    </div>
  );
};

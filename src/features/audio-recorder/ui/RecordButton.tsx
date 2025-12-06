import React from "react";
import styles from "./RecordButton.module.scss";
import { Mic, MicOff } from "lucide-react";

interface RecordButtonProps {
  recording: boolean;
  onStart: () => void;
  onStop: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({
  recording,
  onStart,
  onStop,
}) => {
  return (
    <button
      className={`${styles.recordButton} ${recording ? styles.recording : ""}`}
      onMouseDown={onStart}
      onMouseUp={onStop}
      onTouchStart={onStart}
      onTouchEnd={onStop}
    >
      <span className={styles.buttonContent}>
        <span className={styles.buttonInner}>
          {recording ? (
            <Mic size={38} color="#fff" />
          ) : (
            <MicOff size={38} color="#fff" />
          )}
        </span>
      </span>
    </button>
  );
};

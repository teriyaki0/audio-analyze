import { RecordButton } from "../../../features/audio-recorder/ui/RecordButton";
import { WaveVisualization } from "../../../features/audio-vizualizer";
import { useAudioVisualization } from "../../../features/audio-vizualizer/model/useAudioVisualization";
import styles from "./RecorderWidget.module.scss";

interface RecorderWidgetProps {
  recording: boolean;
  stream: MediaStream | null;
  startRecording: () => void;
  stopRecording: () => void;
  error?: string;
}

export const RecorderWidget: React.FC<RecorderWidgetProps> = ({
  recording,
  stream,
  startRecording,
  stopRecording,
  error,
}) => {
  const { volume, frequencyData } = useAudioVisualization(
    recording ? stream : null
  );

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.visualizationWrapper}>
        <RecordButton
          recording={recording}
          onStart={startRecording}
          onStop={stopRecording}
        />

        {recording && (
          <WaveVisualization
            volume={volume}
            frequencyData={frequencyData}
            isActive={recording}
            size={400}
          />
        )}
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

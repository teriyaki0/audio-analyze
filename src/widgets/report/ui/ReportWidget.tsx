import type { Report } from "../../../entities/report/model/Report";
import type { Transcript } from "../../../entities/transcript/model.ts/Transcript";
import styles from "./ReportWidget.module.scss";

interface ReportWidgetProps {
  report: Report;
  transcript: Transcript;
}

export const ReportWidget = ({ report, transcript }: ReportWidgetProps) => {
  if (!report) {
    return (
      <div className={styles.empty}>Запишите голос, чтобы увидеть анализ</div>
    );
  }

  return (
    <div className={styles.reportCard}>
      <div className={styles.block}>
        <h4>Транскрипт</h4>
        <p>{transcript.transcript}</p>
      </div>

      <div className={styles.block}>
        <h4>Симптомы</h4>
        <p>{report.symptoms.join(", ") || "Нет"}</p>
      </div>

      <div className={styles.block}>
        <h4>Предположительный диагноз</h4>
        <p>{report.diagnosis.join(", ") || "Нет"}</p>
      </div>

      <div className={styles.block}>
        <h4>Рекомендации</h4>
        <p>{report.recommendations.join(", ") || "Нет"}</p>
      </div>

      <div className={styles.block}>
        <h4>Наблюдения</h4>
        <p>{report.observations.join(", ") || "Нет"}</p>
      </div>
    </div>
  );
};

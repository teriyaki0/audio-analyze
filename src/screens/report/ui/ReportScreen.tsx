import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Transcript } from "../../../entities/transcript/model.ts/Transcript";
import type { Report } from "../../../entities/report/model/Report";

import { ReportWidget } from "../../../widgets/report";
import styles from "./ReportScreen.module.scss";

interface ReportScreenLocationState {
  report: Report;
  transcript: Transcript;
}

export const ReportScreen: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as ReportScreenLocationState | null;
  const hasData = state?.report && state?.transcript;

  const handleBack = () => {
    navigate("/");
  };

  if (!hasData) {
    return (
      <div className={styles.emptyPage}>
        <button className={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={24} />
        </button>
        <p>Нет данных анализа</p>
      </div>
    );
  }

  return (
    <div className={styles.reportScreen}>
      <button className={styles.backButton} onClick={handleBack}>
        <ArrowLeft size={24} />
      </button>
      <ReportWidget report={state.report} transcript={state.transcript} />
    </div>
  );
};

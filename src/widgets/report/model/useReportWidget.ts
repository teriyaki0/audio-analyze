import type { Report } from "../../../entities/report/model/Report";

export const useReportWidget = (
  analysisResult: Report | null,
  status: string
) => {
  const loading = status === "pending";
  const report = status === "success" ? analysisResult : null;

  return { loading, report };
};

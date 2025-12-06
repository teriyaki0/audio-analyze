import type { RouteObject } from "react-router-dom";
import { RecordScreen } from "../../screens/record";
import { ReportScreen } from "../../screens/report";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RecordScreen />,
  },
  {
    path: "/report",
    element: <ReportScreen />,
  },
];

export default routes;

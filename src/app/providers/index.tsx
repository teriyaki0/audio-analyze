import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useRoutes } from "react-router-dom";
import routes from "../routes"; // путь к твоим роутам

const queryClient = new QueryClient();

const RoutesWrapper = () => {
  const element = useRoutes(routes);
  return <>{element}</>;
};

export const AppProviders: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Suspense fallback={<div>Загрузка…</div>}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
          <RoutesWrapper /> {/* useRoutes вызывается внутри BrowserRouter */}
        </BrowserRouter>
      </QueryClientProvider>
    </Suspense>
  );
};

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route } from "./routes/index"; // Directly imports your dashboard structure
import "@/styles.css";

const queryClient = new QueryClient();

// Safely pull the main layout function out of the TanStack Route container
const DashboardComponent = Route.options.component;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {DashboardComponent ? (
        <DashboardComponent />
      ) : (
        <div className="flex h-screen w-screen items-center justify-center bg-[#e8edf3] text-xl font-semibold text-[#0f1b3d]">
          Building Layout...
        </div>
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
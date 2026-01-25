import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastProvider } from "./components/Notification/common/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        {" "}
        <App />
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);

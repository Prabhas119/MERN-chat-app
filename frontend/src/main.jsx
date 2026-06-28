
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "./utils/notifications";

// Register service worker + ask permission on app load
registerServiceWorker();
requestNotificationPermission();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
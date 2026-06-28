
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  registerServiceWorker,
  requestNotificationPermission,
} from "./utils/notifications";

const init = async () => {
  await registerServiceWorker();
  await requestNotificationPermission();
};

init();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
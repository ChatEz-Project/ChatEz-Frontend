import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Use a type assertion to ensure that the element is not null
const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

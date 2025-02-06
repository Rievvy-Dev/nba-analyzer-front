import { createRoot } from "react-dom/client";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import App from "./App.jsx"; 

const root = document.getElementById("root");

if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <Router>
        <App />
      </Router>
    </React.StrictMode>
  );
}

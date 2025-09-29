// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { ToastProvider } from "./context/ToastProvider";
import FriendsProvider from "./context/FriendsProvider.jsx";


const container = document.getElementById("root");
if (!container) {
  throw new Error("Root container not found. Make sure index.html has <div id='root'></div>");
}

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <ToastProvider>
      <FriendsProvider>
          <App />      
      </FriendsProvider>
    </ToastProvider>
  </React.StrictMode>
);

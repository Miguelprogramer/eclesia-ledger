
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Defensive logging for deployment issues
console.log("🚀 Eclesia Ledger starting...");
window.onerror = (msg, url, lineNo, columnNo, error) => {
  console.error("🔥 Global Error:", { msg, url, lineNo, columnNo, error });
  return false;
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

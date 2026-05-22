import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Suppress React's dev overlay for errors that are already caught and
// handled inside components (e.g. API 422 validation errors).
// This has NO effect in production builds.
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('unhandledrejection', (e) => {
    e.preventDefault();
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
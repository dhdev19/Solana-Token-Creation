import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Polyfill for Buffer in browser environment
import { Buffer } from 'buffer';
import process from 'process';

// Ensure process is available globally
if (typeof window !== 'undefined') {
  window.process = process;
}
if (typeof global !== 'undefined') {
  global.process = process;
}

// Ensure Buffer is available globally
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}
if (typeof global !== 'undefined') {
  global.Buffer = Buffer;
}

// Ensure BigInt is available
if (typeof window !== 'undefined' && !window.BigInt) {
  console.warn('BigInt not available in this environment');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

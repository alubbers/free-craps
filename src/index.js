import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Profile from './Profile';
import Solo from './Solo';
import SoloStore from './SoloStore';
import { initSecurity } from './utils/security';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />
  },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/solo",
    element: <Solo store={SoloStore}/>
  }
]);

// Initialize security features
initSecurity();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossOrigin="anonymous"
/>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
//reportWebVitals();

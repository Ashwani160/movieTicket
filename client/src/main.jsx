import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

const root = document.getElementById("root");

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}


ReactDOM.createRoot(root).render(
  <BrowserRouter>
       <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
  </BrowserRouter>,
);

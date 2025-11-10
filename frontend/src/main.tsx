import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // estilos Tailwind

import { BrowserRouter } from 'react-router-dom'; // Router
import { AuthProvider } from './context/AuthContext'; // Provider
import { ProjectProvider } from './context/ProjectContext'; // ProjectProvider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider> {}
          <App />
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
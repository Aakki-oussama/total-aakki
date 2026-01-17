import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { ResourceTitleProvider } from './context/ResourceTitleContext'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ResourceTitleProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </ResourceTitleProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)

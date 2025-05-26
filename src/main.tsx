import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DepartmentProvider } from '@/contexts/departmentContext'
import { ThemeProvider } from './components/theme-provider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DepartmentProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>      
    </DepartmentProvider>
  </StrictMode>,
)
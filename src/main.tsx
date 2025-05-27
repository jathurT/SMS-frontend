import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { DepartmentProvider } from '@/contexts/departmentContext'
import { ThemeProvider } from './components/theme-provider.tsx'
import { LecturerProvider } from './contexts/lecturerContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DepartmentProvider>
      <LecturerProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider> 
      </LecturerProvider>     
    </DepartmentProvider>
  </StrictMode>,
)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MenuProvider } from './MenuContext'
import './firebase'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuProvider>
      <App />
    </MenuProvider>
  </StrictMode>,
)

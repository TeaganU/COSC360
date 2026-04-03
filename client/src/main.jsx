import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './app/App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Providers from './app/Providers.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Providers>
        <App /> 
      </Providers>
    </BrowserRouter>
  </StrictMode>,
)

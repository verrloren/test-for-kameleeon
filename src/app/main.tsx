import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Providers } from '../shared'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<Providers>
			<App />
		</Providers>
  </StrictMode>,
)

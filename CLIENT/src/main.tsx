import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import { AuthProvider } from './pages/AuthContext.tsx'

<script
  src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&libraries=places"
  async
  defer
></script>


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)

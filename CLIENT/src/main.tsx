import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.tsx'
import { AuthProvider } from './pages/AuthContext.tsx'
import { LanguageProvider } from './pages/LanguageContext.tsx'
import { NavBarMessageContext } from './pages/componentes/NavBar';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';




function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState("");
  return (
    <NavBarMessageContext.Provider value={{ message, setMessage }}>
      {children}
    </NavBarMessageContext.Provider>
  );
}


const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <LanguageProvider>
          <ProvidersWrapper>
            <App />
          </ProvidersWrapper>
        </LanguageProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);

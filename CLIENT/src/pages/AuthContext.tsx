import { createContext, useContext, useEffect, useState } from "react";

interface OrganizadorType {
  nome_organizador: string;
  foto_url?: string | null;
  email?: string;
  id?: number;
}

interface AuthContextType {
  organizador: OrganizadorType | null;
  login: (data: OrganizadorType) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [organizador, setOrganizador] = useState<OrganizadorType | null>(null);

  useEffect(() => {
    const organizadorRaw = localStorage.getItem("organizador");
    if (organizadorRaw) {
      setOrganizador(JSON.parse(organizadorRaw));
    }
  }, []);

  const login = (data: OrganizadorType) => {
    localStorage.setItem("organizador", JSON.stringify(data));
    setOrganizador(data);
  };

  const logout = () => {
    localStorage.removeItem("organizador");
    setOrganizador(null);
  };

  return (
    <AuthContext.Provider value={{ organizador, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
import { createContext, useEffect, useReducer, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { post } from '../Axios/AxiosService';
import { AuthActionTypes, ContextAuthType, GlobalData, User } from '../Interfaces.ts/AuthInterface';
import { authReducer } from '../Login/AuthReducer';

export const AuthContext = createContext({} as ContextAuthType);

export const AuthProvider = ({ children }: { children: any }) => {
  const [authState, dispatch] = useReducer(authReducer, { logged: false });
  const [globalData, setGlobalData] = useState<GlobalData | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken) as GlobalData;

        // Agregar aquí la verificación de expiración del token
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // El token ha expirado, realiza la acción correspondiente (por ejemplo, cerrar la sesión)
          logout();
        } else {
          // El token aún es válido, establece el globalData
          setGlobalData(decodedToken);
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        logout(); // Manejar el error aquí
      }
    } else {
      logout();
    }
  }, []);


  const login = async (body: User): Promise<boolean> => {
    try {
      const resp = await post('/auth/login', body);
      if (resp.data) {
        const token = resp.data.token;
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token) as GlobalData;
        setGlobalData(decodedToken);
        dispatch({ type: AuthActionTypes.LOGIN });
        return true; // Devuelve true para indicar un inicio de sesión exitoso
      }
    } catch (error) {
      throw error; // Maneja el error apropiadamente
    }
    return false; // Devuelve false si no se pudo iniciar sesión
  };

  const logout = () => {
    localStorage.removeItem('token');
    setGlobalData(null);
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  return (
    <AuthContext.Provider value={{ globalData, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


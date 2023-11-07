import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ContextAuthType } from '../Interfaces.ts/AuthInterface';
import { AuthContext } from '../Context/AuthContext';



export const PublicRoute = ({ children }: { children: any }) => {
    const { globalData }: ContextAuthType = useContext(AuthContext);
    console.log('Rutas Publicas')
    console.log(globalData)
    // Verifica si el usuario está autenticado según globalData
    const isUserAuthenticated = globalData !== null;

    return isUserAuthenticated ? <Navigate to="/" /> : children;
}
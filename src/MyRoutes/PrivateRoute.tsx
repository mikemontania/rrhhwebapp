import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ContextAuthType } from '../Interfaces.ts/AuthInterface';
import { AuthContext } from '../Context/AuthContext';



export const PrivateRoute = ({ children }: { children: any }) => {
    const { globalData }: ContextAuthType = useContext(AuthContext);
    console.log('ruta privada');
    console.log(globalData);
    const isUserAuthenticated = globalData !== null;

    return isUserAuthenticated ? children : <Navigate to="/login" />;
}

export interface LayoutObjectType {
    sidebarState: boolean,
    setSidebarState: (value: boolean) => void;
}

export interface User {
    name?: string,
    username: string,
    password: string,
    repeatPassword?: string
}

export interface login {
    login: string;
}
export interface logout {
    logout: string;
}

export enum AuthActionTypes {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
}

export interface AuthAction {
    type: AuthActionTypes;
}


export interface AuthState {
    logged: boolean;
}

export interface UserData {
    id: number;
    usuario: string;
    rol: string;
    admin: string;
    empresaId: number;
    rolesId: number;
    sucursalesId: number;
    intentos: number;
    role: {
        id: number;
        descripcion: string;
    };
    name?: string; // Marcar como opcional
}
export interface GlobalData {
    user: UserData;
    iat: number;
    exp: number;
}
export interface ContextAuthType {
    globalData: GlobalData | null;
    login: (body: User) => Promise<boolean>;
    logout: any;
}
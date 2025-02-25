import { createContext, useContext, useState, ReactNode } from "react";

// Define types for the context
interface AuthContextType {
    accessToken: string | null;
    saveAccessToken: (token: string) => void;
}

// Create the AuthContext with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(
        localStorage.getItem("spotify_access_token") || null
    );

    const saveAccessToken = (token: string) => {
        setAccessToken(token);
        localStorage.setItem("spotify_access_token", token);
    };

    return (
        <AuthContext.Provider value={{ accessToken, saveAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

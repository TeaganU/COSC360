/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "authToken";
const USER_KEY = "authUser";

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem(USER_KEY);
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (token) {
            localStorage.setItem(TOKEN_KEY, token);
        } else {
            localStorage.removeItem(TOKEN_KEY);
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(USER_KEY);
        }
    }, [user]);

    function login(nextToken, nextUser) {
        setToken(nextToken);
        setUser(nextUser);
    }

    function logout() {
        setToken("");
        setUser(null);
    }

    function updateUser(nextUser) {
        setUser(nextUser);
    }

    const value = useMemo(
        () => ({
            token,
            user,
            isLoggedIn: Boolean(token && user),
            login,
            logout,
            updateUser,
        }),
        [token, user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
}
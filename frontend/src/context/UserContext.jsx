import React, { createContext, useContext, useState } from 'react';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        id: '123', // Ejemplo de ID del profesor
        subject: 'Matemáticas', // Ejemplo de asignatura
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook para usar el contexto
export const useUser = () => useContext(UserContext);

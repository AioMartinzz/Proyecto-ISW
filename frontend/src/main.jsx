import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '@pages/Login';
import Home from '@pages/Home';
import Users from '@pages/Users';
import Register from '@pages/Register';
import Error404 from '@pages/Error404';
import Root from '@pages/Root';
import ProtectedRoute from '@components/ProtectedRoute';
import Annotations from '@pages/Annotations'; // Ruta existente para Anotaciones
import ParentAnnotations from '@pages/ParentAnnotations'; // Importar el componente para apoderados
import { UserProvider } from '@context/UserContext'; // Importar el contexto de usuario
import '@styles/styles.css';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        errorElement: <Error404 />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/users',
                element: (
                    <ProtectedRoute allowedRoles={['administrador']}>
                        <Users />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/annotations', // Ruta para Anotaciones generales
                element: (
                    <ProtectedRoute allowedRoles={['profesor']}>
                        <Annotations />
                    </ProtectedRoute>
                ),
            },
            {
                path: '/annotations-apoderado', // Nueva ruta para Anotaciones de Apoderados
                element: (
                    <ProtectedRoute allowedRoles={['apoderado']}>
                        <ParentAnnotations />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: '/auth',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '*', // Manejar rutas no existentes
        element: <Error404 />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <UserProvider>
        <RouterProvider router={router} />
    </UserProvider>
);

import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '@pages/Login'
import Home from '@pages/Home'
import Users from '@pages/Users'
import Register from '@pages/Register'
import Error404 from '@pages/Error404'
import Root from '@pages/Root'
import Asistencias from '@pages/Asistencias'
import ProtectedRoute from '@components/ProtectedRoute'
import '@styles/styles.css'

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
                path: '/asistencias',
                element: (
                    <ProtectedRoute
                        allowedRoles={['administrador', 'profesor']}
                    >
                        <Asistencias />
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
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router} />
)

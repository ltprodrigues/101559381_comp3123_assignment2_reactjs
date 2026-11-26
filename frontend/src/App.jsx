import { useContext } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AuthContext } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Employees from './pages/Employees';
import NotFound from './pages/NotFound';

export default function App() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <Navigate
                        to={isAuthenticated ? '/employees' : '/login'}
                        replace
                    />
                }
            />

            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/employees" replace />
                        : <Login />
                }
            />

            <Route
                path="/signup"
                element={
                    isAuthenticated
                        ? <Navigate to="/employees" replace />
                        : <Signup />
                }
            />

            <Route element={<ProtectedRoute />}>
                <Route path="/employees" element={<Employees />} />
            </Route>

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
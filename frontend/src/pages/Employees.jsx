import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../context/AuthContext';

export default function Employees() {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login', { replace: true });
    };

    return (
        <main>
            <header>
                <h1>Employees</h1>

                <button type="button" onClick={handleLogout}>
                    Logout
                </button>
            </header>
        </main>
    );
}
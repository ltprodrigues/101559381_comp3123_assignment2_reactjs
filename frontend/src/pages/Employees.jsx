import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;

        const loadEmployees = async () => {
            try {
                const response = await api.get('/emp/employees');

                if (active) {
                    setEmployees(response.data.employees);
                }
            } catch (error) {
                if (active && error.response?.status !== 401) {
                    setError(
                        error.response
                            ? 'Unable to load employees. Please try again.'
                            : 'Cannot connect to the server.'
                    );
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadEmployees();

        return () => {
            active = false;
        };
    }, []);

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

            {isLoading && <p role="status">Loading employees...</p>}

            {error && <p role="alert">{error}</p>}

            {!isLoading && !error && employees.length === 0 && (
                <p>No employees yet.</p>
            )}

            {!isLoading && !error && employees.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">Position</th>
                            <th scope="col">Department</th>
                        </tr>
                    </thead>

                    <tbody>
                        {employees.map((employee) => (
                            <tr key={employee._id}>
                                <td>
                                    {employee.first_name}{' '}
                                    {employee.last_name}
                                </td>
                                <td>{employee.position}</td>
                                <td>{employee.department}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}
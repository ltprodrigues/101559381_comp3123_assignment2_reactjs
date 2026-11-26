import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Employees() {
    const [employees, setEmployees] = useState([]);
    const [department, setDepartment] = useState('');
    const [position, setPosition] = useState('');
    const [searchFilters, setSearchFilters] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let active = true;
        const controller = new AbortController();

        const loadEmployees = async () => {
            setIsLoading(true);
            setError('');

            try {
                const endpoint = searchFilters
                    ? '/emp/employees/search'
                    : '/emp/employees';

                const response = await api.get(endpoint, {
                    params: searchFilters || {},
                    signal: controller.signal
                });

                if (active) {
                    setEmployees(response.data.employees);
                }
            } catch (error) {
                if (!active || error.code === 'ERR_CANCELED') {
                    return;
                }

                if (error.response?.status === 401) {
                    return;
                }

                const data = error.response?.data;

                if (data?.errors?.length) {
                    setError(
                        data.errors.map((item) => item.message).join(' ')
                    );
                } else if (error.response?.status === 429) {
                    setError('Too many requests. Please try again later.');
                } else {
                    setError(
                        error.response
                            ? data?.message || 'Unable to load employees.'
                            : 'Cannot connect to the server. Please try again.'
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
            controller.abort();
        };
    }, [searchFilters]);

    const handleSearch = (event) => {
        event.preventDefault();

        const filters = {};

        if (department.trim()) {
            filters.department = department.trim();
        }

        if (position.trim()) {
            filters.position = position.trim();
        }

        setSearchFilters(
            Object.keys(filters).length > 0 ? filters : null
        );
    };

    const handleClear = () => {
        setDepartment('');
        setPosition('');
        setSearchFilters(null);
    };

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

            <form onSubmit={handleSearch}>
                <div>
                    <label htmlFor="search-department">
                        Department
                    </label>
                    <input
                        id="search-department"
                        name="department"
                        type="text"
                        maxLength={100}
                        value={department}
                        onChange={(event) =>
                            setDepartment(event.target.value)
                        }
                    />
                </div>

                <div>
                    <label htmlFor="search-position">
                        Position
                    </label>
                    <input
                        id="search-position"
                        name="position"
                        type="text"
                        maxLength={100}
                        value={position}
                        onChange={(event) =>
                            setPosition(event.target.value)
                        }
                    />
                </div>

                <button type="submit" disabled={isLoading}>
                    Search
                </button>

                <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                >
                    Clear
                </button>
            </form>

            {isLoading && (
                <p role="status">Loading employees...</p>
            )}

            {error && <p role="alert">{error}</p>}

            {!isLoading && !error && employees.length === 0 && (
                <p role="status">
                    {searchFilters
                        ? 'No employees match your search.'
                        : 'No employees yet.'}
                </p>
            )}

            {!isLoading && !error && employees.length > 0 && (
                <>
                    <p role="status">
                        {employees.length}{' '}
                        {employees.length === 1 ? 'employee' : 'employees'}
                        {' found.'}
                    </p>

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
                </>
            )}
        </main>
    );
}
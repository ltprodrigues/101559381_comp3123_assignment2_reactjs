import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        const value = identifier.trim();

        if (!value || !password) {
            setError('Enter your username or email and password.');
            return;
        }

        if (
            value.includes('@') &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ) {
            setError('Enter a valid email address.');
            return;
        }

        setIsSubmitting(true);

        try {
            const credentials = value.includes('@')
                ? { email: value, password }
                : { username: value, password };

            const response = await api.post('/user/login', credentials);

            login(response.data.token);
            navigate('/employees', { replace: true });
        } catch (error) {
            const data = error.response?.data;

            if (error.response?.status === 429) {
                setError('Too many login attempts. Please try again later.');
            } else if (data?.errors?.length) {
                setError(
                    data.errors.map((item) => item.message).join(' ')
                );
            } else if (error.response) {
                setError(data?.message || 'Unable to log in.');
            } else {
                setError(
                    'Cannot connect to the server. Please try again.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="identifier">Username or email</label>
                    <input
                        id="identifier"
                        name="identifier"
                        type="text"
                        autoComplete="username"
                        value={identifier}
                        onChange={(event) =>
                            setIdentifier(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p>
                Don’t have an account? <Link to="/signup">Sign up</Link>
            </p>
        </main>
    );
}
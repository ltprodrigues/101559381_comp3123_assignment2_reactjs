import { useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios';

export default function Signup() {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const username = form.username.trim();
        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (username.length < 3 || username.length > 50) {
            setError('Username must contain between 3 and 50 characters.');
            return;
        }

        if (
            email.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {
            setError('Enter a valid email address.');
            return;
        }

        if (
            password.length < 8 ||
            !/[a-z]/.test(password) ||
            !/[A-Z]/.test(password) ||
            !/[0-9]/.test(password)
        ) {
            setError(
                'Password must contain at least 8 characters, ' +
                'an uppercase letter, a lowercase letter, and a number.'
            );
            return;
        }

        if (new TextEncoder().encode(password).length > 72) {
            setError('Password must not exceed 72 bytes.');
            return;
        }

        setIsSubmitting(true);

        try {
            await api.post('/user/signup', {
                username,
                email,
                password
            });

            setForm({
                username: '',
                email: '',
                password: ''
            });

            setSuccess('Account created successfully. You can now log in.');
        } catch (error) {
            const data = error.response?.data;

            if (error.response?.status === 429) {
                setError('Too many requests. Please try again later.');
            } else if (data?.errors?.length) {
                setError(
                    data.errors.map((item) => item.message).join(' ')
                );
            } else if (error.response) {
                setError(data?.message || 'Unable to create your account.');
            } else {
                setError('Cannot connect to the server. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main>
            <h1>Sign up</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="signup-username">Username</label>
                    <input
                        id="signup-username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="signup-email">Email</label>
                    <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="signup-password">Password</label>
                    <input
                        id="signup-password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        aria-describedby="password-help"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <p id="password-help">
                        At least 8 characters, including an uppercase
                        letter, a lowercase letter, and a number.
                    </p>
                </div>

                {error && <p role="alert">{error}</p>}
                {success && <p role="status">{success}</p>}

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
            </form>

            <p>
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </main>
    );
}
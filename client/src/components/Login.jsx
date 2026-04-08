import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

const defaultUser = {
  email: '',
  password: '',
};

const Login = () => {
  const [email, setEmail] = useState(defaultUser.email);
  const [password, setPassword] = useState(defaultUser.password);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser, setProjectId } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', {
        email: email,
        password: password,
      });
      const data = response.data;

      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      setProjectId(null);

      navigate('/profile');
    } catch (error) {
      console.error('Login failed', error);
      setError(
        'Incorrect email or password, please try again or sign up for a new account',
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-3xl font-bold text-gray-800'>Login</h2>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <p className="font-semibold py-2">
        Need an account?{' '}
        <Link
          className="text-blue-600 hover:text-blue-900 hover:underline
        "
          to="/signup"
        >
          Create one
        </Link>
      </p>
      <button type="submit">Login</button>
      {error && (
        <p className="my-4 text-sm text-red-800">
          {error}
        </p>
      )}
    </form>
  );
};

export default Login;

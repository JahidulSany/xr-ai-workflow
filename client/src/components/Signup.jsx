import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const displayError = (message) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const validatePassword = () => {
    if (password !== password2) {
      displayError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await api.post('/api/users', {
        username: userName,
        email,
        password,
      });

      setSuccess(response.data.message || 'Account created successfully');

      // make sure signup does NOT leave any logged-in session behind
      localStorage.removeItem('authToken');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Signup failed', error);
      displayError(error.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className='text-3xl font-bold text-gray-800'>Signup</h2>

      <input
        type="text"
        placeholder="Username"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        required
      />

      <input
        type="email"
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

      <input
        type="password"
        placeholder="Confirm Password"
        value={password2}
        onChange={(e) => setPassword2(e.target.value)}
        required
      />

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <p className="font-semibold py-2">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-900 hover:underline"
        >
          Login
        </Link>
      </p>

      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;

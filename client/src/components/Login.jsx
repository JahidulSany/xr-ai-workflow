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
  const navigate = useNavigate();

  const { setUser } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/users/login', { email: email, password: password });
      const data = response.data;

      localStorage.setItem('authToken', data.token);
      setUser(data.user);

      navigate('/profile');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
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
      <p>Need an account? <Link to="/signup">Create one</Link></p>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;



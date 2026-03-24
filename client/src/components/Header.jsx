import { Link, useNavigate } from 'react-router-dom';

import { useSession } from '../contexts/SessionContext';

const  Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('authToken');

  const { user } = useSession();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  const wordCase = (word) => {
    if (word === undefined) {
      return '';
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <header>
      <h1>XR AI Workflow Tool</h1>
      <nav>
        {token ? (
          <>
            <Link to="/profile">{wordCase(user.username)}&apos;s Projects</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;

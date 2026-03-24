import { Link, useNavigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

const Header = () => {
  const navigate = useNavigate();
  const { user, logout, loading } = useSession();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const wordCase = (word) => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  return (
    <header>
      <Link to={user ? '/profile' : '/'} className="brand-link">
        <h1>XR AI Workflow Tool</h1>
      </Link>

      <nav>
        {loading ? null : user ? (
          <>
            <Link to="/">Home</Link>
            <Link to="/project">Create Project</Link>
            <Link to="/profile">
              {wordCase(user.username)}&apos;s Projects
            </Link>
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
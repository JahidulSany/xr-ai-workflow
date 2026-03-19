import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <>
      <h2>Welcome to the XR AI Workflow Tool</h2>
      <p>To create a project hit the create button.</p>
      <button>
        <Link to="/project">Create Project</Link>
      </button>
    </>
  );
};

export default Home;

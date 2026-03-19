import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './components/Login';
import Signup from './components/Signup';

import { SessionProvider } from './contexts/SessionContext';
import Project from './pages/Project';
import Profile from './pages/Profile';
import Home from './pages/Home';

const App = () => {
  return (
    <div>
      <SessionProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project" element={<Project />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </SessionProvider>
    </div>
  );
};

export default App;

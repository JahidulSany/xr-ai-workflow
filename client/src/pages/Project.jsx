import { useState } from 'react';

import questions from '../data/questions.json';
import Question from '../components/Question';
import { Navigate } from 'react-router-dom';
import api from '../api';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [xrType, setXrType] = useState('');
  const [objectMethod, setObjectMethod] = useState('');
  const [environmentMethod, setEnvironmentMethod] = useState('');
  const [platform, setPlatform] = useState('');
  const [message, setMessage] = useState('');
  const navigate = Navigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post('/api/projects', {
        projectName,
        xrType,
        objectMethod,
        environmentMethod,
        platform,
      });

      setMessage('Project saved successfully');

      setTimeout(() => {
        navigate('/profile');
      }, 1000);
    } catch (error) {
      console.error('Error saving project:', error);
      setMessage('Failed to save project');
    }
  };

  return (
    <div>
      <div>
        <h2>XR Project Workflow</h2>
        <p>
          This form will help you create a project by selecting the XR type,
          object creation method, environment creation method, and platform.
          Fill out the form and submit to see your selections in the console.
        </p>
      </div>

      <div>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </div>

      <Question q={questions[0]} onSetAnswer={setXrType} />
      {xrType && <Question q={questions[1]} onSetAnswer={setObjectMethod} />}
      {xrType && objectMethod && (
        <Question q={questions[2]} onSetAnswer={setEnvironmentMethod} />
      )}
      {xrType && objectMethod && platform && (
        <Question q={questions[3]} onSetAnswer={setPlatform} />
      )}

      <div>
        <button
          onClick={handleSubmit}
          type="submit"
          disabled={
            !projectName ||
            !xrType ||
            !objectMethod ||
            !environmentMethod ||
            !platform
          }
        >
          Save Project
        </button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Project;

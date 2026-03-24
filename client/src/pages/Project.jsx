import { useState } from 'react';

import questions from '../data/questions.json';
import Question from '../components/Question';

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [xrType, setXrType] = useState('');
  const [objectMethod, setObjectMethod] = useState('');
  const [environmentMethod, setEnvironmentMethod] = useState('');
  const [platform, setPlatform] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      projectName,
      xrType,
      objectMethod,
      environmentMethod,
      platform,
    };

    // Send the data to the backend or process it as needed
    fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        response.json();
        console.log(response);
      })
      .then((result) => {
        console.log('Project created:', result);
      })
      .catch((error) => {
        console.error('Error creating project:', error);
      });
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
      <Question q={questions[1]} onSetAnswer={setObjectMethod} />
      <Question q={questions[2]} onSetAnswer={setEnvironmentMethod} />
      <Question q={questions[3]} onSetAnswer={setPlatform} />

      <div>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Project;

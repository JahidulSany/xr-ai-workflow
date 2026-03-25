import { useState } from 'react';

import questions from '../data/questions.json';
import Question from '../components/Question';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useSession } from '../contexts/SessionContext';

function findSelection(questionKey, title) {
  const q = questions.find((x) => x.key === questionKey);
  if (!q) return null;
  const a = q.answers.find((x) => x.title === title);
  if (!a) return null;
  return {
    key: questionKey,
    title: a.title,
    description: a.description,
    image: a.image || '',
  };
}

const Project = () => {
  const [projectName, setProjectName] = useState('');
  const [xrType, setXrType] = useState('');
  const [objectMethod, setObjectMethod] = useState('');
  const [environmentMethod, setEnvironmentMethod] = useState('');
  const [platform, setPlatform] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [working, setWorking] = useState(false);
  const navigate = useNavigate();

  const { setProjectId } = useSession();

  const selections = [
    findSelection('xr-type', xrType),
    findSelection('object-creation', objectMethod),
    findSelection('environment-creation', environmentMethod),
    findSelection('platform-creation', platform),
  ];

  const answersComplete =
    xrType &&
    objectMethod &&
    environmentMethod &&
    platform &&
    selections.every(Boolean);

  const canSave = answersComplete && projectName.trim().length > 0;

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!canSave) {
      setError('Enter a project name and complete all steps.');
      return;
    }
    setWorking(true);
    try {
      await api.post('/api/projects', {
        name: projectName.trim(),
        projectName: projectName.trim(),
        xrType,
        objectMethod,
        environmentMethod,
        platform,
      });
      setMessage('Project saved successfully.');
      setTimeout(() => navigate('/profile'), 900);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save project');
    } finally {
      setWorking(false);
    }
  };

  const handleRecommendation = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!answersComplete) {
      setError(
        'Complete all questionnaire steps before running a recommendation.',
      );
      return;
    }
    setWorking(true);
    try {
      const payload = {
        name: projectName.trim() || undefined,
        projectName: projectName.trim() || undefined,
        xrType,
        objectMethod,
        environmentMethod,
        platform,
        selections,
      };
      const { data } = await api.post('/api/projects/recommendation', payload);
      if (data?.project?.id != null) {
        setProjectId(data.project.id);
      }
      setMessage(
        'Recommendation report generated. Open your profile to download the PDF.',
      );
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.message ||
          'Recommendation failed. Ensure the API server is running and Ollama is available (ollama serve).',
      );
    } finally {
      setWorking(false);
    }
  };

  return (
    <div>
      <div>
        <h2>AI XR Project Workflow</h2>
        <p>
          Choose your XR modality, how you will create objects and environments,
          and your target platform. Save the project, or run{' '}
          <strong>Recommendation</strong> to generate an AI report (Ollama) and
          PDF stored on your profile.
        </p>
      </div>

      <div>
        <label htmlFor="projectName">Project Name:</label>
        <input
          type="text"
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="e.g. Museum AR prototype"
        />
      </div>

      <Question q={questions[0]} onSetAnswer={setXrType} />
      {xrType ? (
        <Question q={questions[1]} onSetAnswer={setObjectMethod} />
      ) : null}
      {xrType && objectMethod ? (
        <Question q={questions[2]} onSetAnswer={setEnvironmentMethod} />
      ) : null}
      {xrType && objectMethod && environmentMethod ? (
        <Question q={questions[3]} onSetAnswer={setPlatform} />
      ) : null}

      <div className="project-actions">
        <button
          type="button"
          className="button-secondary"
          onClick={handleSave}
          disabled={working || !canSave}
        >
          Save project
        </button>
        <button
          type="button"
          className="button"
          onClick={handleRecommendation}
          disabled={working || !answersComplete}
        >
          Recommendation
        </button>
      </div>
      {message ? <p className="form-success">{message}</p> : null}
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
};

export default Project;

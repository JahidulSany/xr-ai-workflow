import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api';
import { useSession } from '../contexts/SessionContext';

const initialSelections = () => ({
  'xr-type': null,
  'object-ceration': null,
});

const Dashboard = () => {
  const token = localStorage.getItem('authToken');
  const { user, setProjectId, projectId } = useSession();
  const [questions, setQuestions] = useState([]);
  const [selections, setSelections] = useState(initialSelections);
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/data/questions.json')
      .then((r) => r.json())
      .then(setQuestions)
      .catch(() => setError('Could not load form questions.'));
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoadingList(true);
    api
      .get('/api/projects')
      .then((res) => setProjects(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingList(false));
  }, [token, submitting]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const setAnswer = (key, index) => {
    setSelections((prev) => ({ ...prev, [key]: index }));
  };

  const xrQ = questions.find((q) => q.key === 'xr-type');
  const objQ = questions.find((q) => q.key === 'object-ceration');

  const xrIdx = selections['xr-type'];
  const objIdx = selections['object-ceration'];

  const formComplete =
    xrQ &&
    objQ &&
    typeof xrIdx === 'number' &&
    typeof objIdx === 'number';

  const handleRecommendation = async (e) => {
    e.preventDefault();
    setError('');
    if (!formComplete) {
      setError('Please select an answer for each question.');
      return;
    }

    const xrAns = xrQ.answers[xrIdx];
    const objAns = objQ.answers[objIdx];

    setSubmitting(true);
    try {
      const { data } = await api.post('/api/projects/recommendation', {
        projectName: projectName.trim(),
        xrTypeTitle: xrAns.title,
        xrTypeDescription: xrAns.description,
        objectCreationTitle: objAns.title,
        objectCreationDescription: objAns.description,
        xrImagePath: xrAns.image,
        objectImagePath: objAns.image,
      });
      setProjectId(data.project.id);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.message ||
        'Recommendation request failed. Is the API server running and Ollama available?';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const downloadPdf = async (id, filename) => {
    setError('');
    try {
      const res = await api.get(`/api/projects/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `${user.id}-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err)
      setError('Download failed. Try again when logged in.');
    }
  };

  return (
    <main className="dashboard">
      <h2>Dashboard</h2>
      <p>
        Signed in as <strong>{user.username || 'user'}</strong>
        {user.id != null ? ` (user id ${user.id})` : ''}
      </p>

      <section className="dashboard-section">
        <h3>Your projects and reports</h3>
        {loadingList ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No saved projects yet. Complete the form below and run a recommendation.</p>
        ) : (
          <ul className="project-report-list">
            {projects.map((p) => (
              <li key={p.id} className="project-report-item">
                <div>
                  <strong>{p.name}</strong>
                  <span className="muted"> #{p.id}</span>
                  {p.filename ? (
                    <span className="muted"> &mdash; {p.filename}</span>
                  ) : (
                    <span className="muted"> &mdash; no PDF yet</span>
                  )}
                </div>
                {p.filename ? (
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => downloadPdf(p.id, p.filename)}
                  >
                    Download PDF
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      {projectId != null && (
        <p className="success-msg">
          Latest report saved as project #{projectId}. You can download it from the list
          above.
        </p>
      )}

      <form className="dashboard-form" onSubmit={handleRecommendation}>
        <h3>Project questionnaire</h3>

        {xrQ && (
          <fieldset className="question-block">
            <legend>Question 1</legend>
            <p className="question-text">{xrQ.question}</p>
            <div className="answers">
              {xrQ.answers.map((ans, i) => (
                <label key={ans.title} className="answer-option">
                  <input
                    type="radio"
                    name="xr-type"
                    checked={selections['xr-type'] === i}
                    onChange={() => setAnswer('xr-type', i)}
                  />
                  <span className="answer-title">{ans.title}</span>
                  <span className="answer-desc">{ans.description}</span>
                  {ans.image ? (
                    <img
                      src={`/${ans.image}`}
                      alt=""
                      className="answer-thumb"
                    />
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {objQ && (
          <fieldset className="question-block">
            <legend>Question 2</legend>
            <p className="question-text">{objQ.question}</p>
            <div className="answers">
              {objQ.answers.map((ans, i) => (
                <label key={`${ans.title}-${i}`} className="answer-option">
                  <input
                    type="radio"
                    name="object-ceration"
                    checked={selections['object-ceration'] === i}
                    onChange={() => setAnswer('object-ceration', i)}
                  />
                  <span className="answer-title">{ans.title}</span>
                  <span className="answer-desc">{ans.description}</span>
                  {ans.image ? (
                    <img
                      src={`/${ans.image}`}
                      alt=""
                      className="answer-thumb"
                    />
                  ) : null}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <label className="project-name-label">
          Project name (optional)
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="e.g. Retail AR prototype"
          />
        </label>

        {error ? <p className="error-msg">{error}</p> : null}

        <button type="submit" className="button" disabled={submitting || !formComplete}>
          {submitting ? 'Generating...' : 'Recommendation'}
        </button>
      </form>
    </main>
  );
};

export default Dashboard;

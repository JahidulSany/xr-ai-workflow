import { useEffect, useState } from 'react';
import api from '../api';
import { useSession } from '../contexts/SessionContext';

const Profile = () => {
  const { user } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/api/projects')
      .then((res) => setProjects(res.data || []))
      .catch(() => setError('Could not load projects.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const downloadPdf = async (id, filename) => {
    setError('');
    try {
      const res = await api.get(`/api/projects/${id}/pdf`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `project-${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setError('Download failed.');
    }
  };

  return (
    <div className="profile-page">
      <h2>Profile</h2>
      <p>
        Signed in as <strong>{user?.username}</strong>
        {user?.id != null ? ` (user id ${user.id})` : ''}
      </p>

      <h3>Your projects</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : projects.length === 0 ? (
        <p>No projects yet. Create one from the home page.</p>
      ) : (
        <ul className="project-report-list">
          {projects.map((p) => (
            <li key={p.id} className="project-report-item">
              <div>
                <strong>{p.name}</strong>
                <span className="muted"> #{p.id}</span>
                <div className="muted small">
                  {p.xrType} | {p.objectMethod} | {p.environmentMethod} | {p.platform}
                </div>
                {p.filename ? (
                  <div className="muted small">PDF: {p.filename}</div>
                ) : (
                  <div className="muted small">No PDF report yet</div>
                )}
              </div>
              {p.filename ? (
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => downloadPdf(p.id, p.filename)}
                >
                  Download PDF
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;

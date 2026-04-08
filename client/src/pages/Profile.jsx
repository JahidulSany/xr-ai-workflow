import { useEffect, useState } from 'react';
import api from '../api';
import { useSession } from '../contexts/SessionContext';
import DeleteModal from '../components/DeleteModal';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const load = () => {
    setLoading(true);
    setError('');
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

  const openDeleteModal = (project) => {
    setSelectedProject(project);
    setModalOpen(true);
  };

  const closeDeleteModal = () => {
    setModalOpen(false);
    setSelectedProject(null);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;

    setError('');
    try {
      await api.delete(`/api/projects/${selectedProject.id}`);
      closeDeleteModal();
      load();
    } catch {
      setError('Delete failed.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
          <p className="mt-2 text-gray-600">
            <span className='font-semibold'>Welcome back, <strong>{user?.username}</strong>!</span> <br />
            Here you can view and manage all your projects. <br />
            Click on a project to see details, download the PDF report, or
            delete it if you no longer need it.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">
          <h3 className="mb-6 text-2xl font-semibold text-gray-800">
            Your Projects
          </h3>

          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : projects.length === 0 ? (
            <p className="text-gray-500">
              No projects yet.{' '}
              <Link className="text-blue-600 hover:underline" to="/">
                Click here
              </Link>{' '}
              to create one.
            </p>
          ) : (
            <ul className="space-y-4">
              {projects.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:flex-row md:items-center"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="text-lg text-gray-800">
                        {p.name}
                      </strong>
                      <span className="text-sm text-gray-400">#{p.id}</span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      {p.xrType} | {p.objectMethod} | {p.environmentMethod} |{' '}
                      {p.platform}
                    </div>

                    {p.filename ? (
                      <div className="mt-1 text-sm text-gray-500">
                        PDF: {p.filename}
                      </div>
                    ) : (
                      <div className="mt-1 text-sm text-gray-400">
                        No PDF report yet
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {p.filename ? (
                      <button
                        type="button"
                        onClick={() => downloadPdf(p.id, p.filename)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                      >
                        Download PDF
                      </button>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => openDeleteModal(p)}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DeleteModal
        isOpen={modalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        projectName={selectedProject?.name}
      />
    </div>
  );
};

export default Profile;

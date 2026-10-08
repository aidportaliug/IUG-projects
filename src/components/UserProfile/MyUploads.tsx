import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserResponse } from '../../services/auth';
import { getPlasticProjects, PlasticProjectResponse } from '../../services/plasticService';

// The plastic projects the logged-in user has uploaded, with links to view and edit them.
const MyUploads: React.FC<{ user: UserResponse }> = ({ user }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PlasticProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const response = await getPlasticProjects();
        setProjects(response.projects.filter((project) => project.createdBy === user.id));
      } catch (err: any) {
        setError(err.message || 'Could not load your uploads');
      } finally {
        setLoading(false);
      }
    };
    loadUploads();
  }, [user.id]);

  let content: React.ReactNode;
  if (loading) {
    content = <CircularProgress size={24} />;
  } else if (error) {
    content = <p className="myUploadsEmpty">{error}</p>;
  } else if (projects.length === 0) {
    content = <p className="myUploadsEmpty">You have not uploaded any projects yet.</p>;
  } else {
    content = (
      <ul className="myUploadsList">
        {projects.map((project) => (
          <li key={project.id} className="myUploadsItem">
            <div className="myUploadsInfo">
              <strong>{project.name}</strong>
              <span className="myUploadsMeta">
                {project.country} · {project.product} · {project.documents.length}{' '}
                {project.documents.length === 1 ? 'report/link' : 'reports/links'}
              </span>
            </div>
            <div className="myUploadsActions">
              <Button
                size="small"
                onClick={() => navigate(`/plastic-project/${project.id}`)}
                sx={{ color: '#3D7844', textTransform: 'none' }}
              >
                View
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/plastic-project/${project.id}/edit`)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none' }}
              >
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="profileCard">
      <div className="profileCardHeader">
        <h2>My uploads{!loading && !error ? ` (${projects.length})` : ''}</h2>
        <Button
          variant="contained"
          onClick={() => navigate('/UploadPlasticProject')}
          sx={{ backgroundColor: '#3D7844', textTransform: 'none', '&:hover': { backgroundColor: '#2f5f35' } }}
        >
          Upload a new project
        </Button>
      </div>
      {content}
    </section>
  );
};

export default MyUploads;

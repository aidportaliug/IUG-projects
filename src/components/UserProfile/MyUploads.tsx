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
    content = <p>{error}</p>;
  } else if (projects.length === 0) {
    content = <p>You have not uploaded any projects yet.</p>;
  } else {
    content = (
      <ul className="myUploadsList">
        {projects.map((project) => (
          <li key={project.id} className="myUploadsItem">
            <div className="myUploadsInfo">
              <strong>{project.name}</strong>
              <span>
                {project.country} · {project.product} · {project.documents.length} reports/links
              </span>
            </div>
            <div>
              <Button size="small" onClick={() => navigate(`/plastic-project/${project.id}`)}>
                View
              </Button>
              <Button size="small" onClick={() => navigate(`/plastic-project/${project.id}/edit`)}>
                Edit
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="myUploads">
      <h3>My uploads:</h3>
      {content}
      <Button
        variant="contained"
        onClick={() => navigate('/UploadPlasticProject')}
        style={{ backgroundColor: '#3D7844', textTransform: 'none' }}
      >
        Upload a new project
      </Button>
    </div>
  );
};

export default MyUploads;

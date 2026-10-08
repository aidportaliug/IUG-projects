import React from 'react';
import './uploadPlasticProject.css';
import UploadPlasticProjectForm from '../../components/UploadPlasticProjectForm/uploadPlasticProjectForm';
import { useAuth } from '../../services/AuthContext';
import { canUploadProjects } from '../../services/auth';
import Meta from '../../components/Meta';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, CircularProgress } from '@mui/material';
import { Footer } from '../../components/Footer/Footer';

const NOT_A_CONTRIBUTOR =
  'Only students, professors and the administrator can upload projects. ' +
  'Contact the administrator if your user type should be changed.';

// Upload a new plastic project (/UploadPlasticProject) or edit one (/plastic-project/:id/edit).
// Students, professors and the admin may upload; editing is checked again by the backend (creator or admin).
const UploadPlasticProject: React.FC = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const projectId = id ? Number(id) : undefined;
  const isEdit = projectId !== undefined && !isNaN(projectId);
  const navigate = useNavigate();
  const title = isEdit ? 'Edit project' : 'Upload Your Project';

  let content: React.ReactNode;
  if (loading) {
    content = <CircularProgress />;
  } else if (!user) {
    content = (
      <Box textAlign="center">
        <p>Log in as a student or professor to upload a project.</p>
        <Button variant="contained" onClick={() => navigate('/login')} style={{ backgroundColor: '#3D7844' }}>
          Login
        </Button>
      </Box>
    );
  } else if (!canUploadProjects(user)) {
    content = <p style={{ textAlign: 'center' }}>{NOT_A_CONTRIBUTOR}</p>;
  } else {
    content = <UploadPlasticProjectForm projectId={isEdit ? projectId : undefined} />;
  }

  return (
    <>
      <Meta title={title}></Meta>
      <div className="outline">
        <Box display="flex" justifyContent="space-evenly" alignItems="center" marginTop="30px">
          <Button
            size="large"
            onClick={() => navigate(-1)}
            variant="outlined"
            style={{
              color: 'black',
              textTransform: 'none',
              border: '1px solid grey',
              backgroundColor: '#e0e0e0',
              marginBottom: 20,
            }}
          >
            Back
          </Button>
          <div className="title">{title}</div>
          <span style={{ width: 90 }} />
        </Box>

        {content}
      </div>
      <Footer />
    </>
  );
};

export default UploadPlasticProject;

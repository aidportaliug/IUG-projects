import React from 'react';
import './uploadPlasticProject.css';
import UploadPlasticProjectForm from '../../components/UploadPlasticProjectForm/uploadPlasticProjectForm';
import { useAuth } from '../../services/AuthContext';
import { canUploadProjects } from '../../services/auth';
import Meta from '../../components/Meta';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, CircularProgress } from '@mui/material';
import { Footer } from '../../components/Footer/Footer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useI18n } from '../../i18n/I18nContext';

// Upload a new plastic project (/UploadPlasticProject) or edit one (/plastic-project/:id/edit).
// Students, professors and the admin may upload; editing is checked again by the backend (creator or admin).
const UploadPlasticProject: React.FC = () => {
  const { user, loading } = useAuth();
  const { id } = useParams();
  const projectId = id ? Number(id) : undefined;
  const isEdit = projectId !== undefined && !isNaN(projectId);
  const navigate = useNavigate();
  const { t } = useI18n();
  const title = isEdit ? t.uploadPage.editTitle : t.uploadPage.uploadTitle;

  let content: React.ReactNode;
  if (loading) {
    content = <CircularProgress />;
  } else if (!user) {
    content = (
      <Box textAlign="center">
        <p>{t.uploadPage.loginToUpload}</p>
        <Button variant="contained" onClick={() => navigate('/login')} style={{ backgroundColor: '#3D7844' }}>
          {t.uploadPage.login}
        </Button>
      </Box>
    );
  } else if (!canUploadProjects(user)) {
    content = <p style={{ textAlign: 'center' }}>{t.uploadPage.notContributor}</p>;
  } else {
    content = <UploadPlasticProjectForm projectId={isEdit ? projectId : undefined} />;
  }

  return (
    <>
      <Meta title={title}></Meta>
      <div className="outline">
        <Box display="flex" justifyContent="space-evenly" alignItems="center" marginTop="30px" marginBottom="20px">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', borderRadius: '8px' }}
          >
            {t.common.back}
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

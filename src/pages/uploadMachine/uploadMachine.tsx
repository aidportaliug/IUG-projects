import React from 'react';
import './uploadMachine.css';
import UploadMachineForm from '../../components/UploadMachineForm/uploadMachineForm';
import { useAuth } from '../../services/AuthContext';
import Meta from '../../components/Meta';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Box, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Footer } from '../../components/Footer/Footer';
import { useI18n } from '../../i18n/I18nContext';

// Add a machine (/uploadMachine) or edit one (/machine/:id/edit). Admin only; the backend checks this again.
const UploadMachine: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { id } = useParams();
  const machineId = id !== undefined && !isNaN(Number(id)) ? Number(id) : undefined;
  const title = machineId !== undefined ? t.machineForm.editHeading : t.machineForm.heading;

  let content: React.ReactNode;
  if (loading) {
    content = <CircularProgress />;
  } else if (!user?.isAdmin) {
    content = <p style={{ textAlign: 'center' }}>{t.machineForm.onlyAdmin}</p>;
  } else {
    content = <UploadMachineForm machineId={machineId} />;
  }

  return (
    <>
      <Meta title={machineId !== undefined ? title : t.machineForm.pageTitle}></Meta>
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

export default UploadMachine;

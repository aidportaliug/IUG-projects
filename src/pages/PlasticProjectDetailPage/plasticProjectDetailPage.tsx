import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deletePlasticProject,
  documentHref,
  getPlasticProject,
  PlasticProjectResponse,
} from '../../services/plasticService';
import { useAuth } from '../../services/AuthContext';
import { canDeleteProjects, canEditProject } from '../../services/auth';
import { Box, Button, Typography } from '@mui/material';
import './plasticProjectDetailPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useI18n } from '../../i18n/I18nContext';

const PlasticProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<PlasticProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'invalidId' | 'loadFailed' | null>(null);
  const imageIcon = Trax_Ghana;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t, formatDate } = useI18n();
  const [actionError, setActionError] = useState('');
  // Set by the upload form when some PDFs could not be uploaded.
  const uploadWarning = (useLocation().state as { uploadWarning?: string } | null)?.uploadWarning;

  // Only the admin can delete; the backend checks this again.
  const handleDelete = async () => {
    if (!project || !window.confirm(t.projectDetail.confirmDelete(project.name))) {
      return;
    }
    setActionError('');
    try {
      await deletePlasticProject(project.id);
      navigate('/plasticProjects');
    } catch (err: any) {
      setActionError(err.message || t.projectDetail.deleteFailed);
    }
  };

  async function getProjectData(projectId: string) {
    setLoading(true);
    setError(null);
    try {
      const projectIdNumber = parseInt(projectId, 10);
      if (isNaN(projectIdNumber)) {
        setError('invalidId');
        return;
      }
      const fetchedProject = await getPlasticProject(projectIdNumber);
      setProject(fetchedProject);
    } catch (err) {
      setError('loadFailed');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getProjectData(id);
    }
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t.projectDetail[error]}</h2>
        </div>
      </Layout>
    );
  }

  if (project != null) {
    return (
      <>
        <Meta title={project.name}></Meta>
        <Layout>
          <div className="projectDetailoutline">
            <div className="Title">{project.name}</div>
            {(canEditProject(user, project) || canDeleteProjects(user)) && (
              <Box display="flex" justifyContent="center" gap={2} marginBottom={2}>
                {canEditProject(user, project) && (
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/plastic-project/${project.id}/edit`)}
                    style={{ backgroundColor: '#3D7844', textTransform: 'none' }}
                  >
                    {t.projectDetail.edit}
                  </Button>
                )}
                {canDeleteProjects(user) && (
                  <Button variant="outlined" color="error" onClick={handleDelete} style={{ textTransform: 'none' }}>
                    {t.projectDetail.delete}
                  </Button>
                )}
              </Box>
            )}
            {(actionError || uploadWarning) && (
              <Typography color="error" textAlign="center" sx={{ mb: 2 }}>
                {actionError || uploadWarning}
              </Typography>
            )}
            <ProjectImageBox source={imageIcon} altText={t.projectDetail.imageAlt} />
            <hr />
            <div className="projectInformation">
              <div className="infoRow">
                <b>{t.projectDetail.country}</b> {project.country}
              </div>
              <div className="infoRow">
                <b>{t.projectDetail.startDate}</b> {formatDate(project.startDate)}
              </div>
              {project.endDate && (
                <div className="infoRow">
                  <b>{t.projectDetail.endDate}</b> {formatDate(project.endDate)}
                </div>
              )}
              {project.durationDays && (
                <div className="infoRow">
                  <b>{t.projectDetail.duration}</b> {t.projectDetail.days(project.durationDays)}
                </div>
              )}
              <div className="infoRow">
                <b>{t.projectDetail.product}</b> {project.product}
              </div>
              <div className="infoRow">
                <b>{t.projectDetail.financing}</b> {project.financing}
              </div>
              <div className="infoRow">
                <b>{t.projectDetail.businessModel}</b> {project.businessModel}
              </div>
              <div className="infoRow">
                <b>{t.projectDetail.wasteCollected}</b>{' '}
                {project.wasteCollected > 0 ? t.common.tons(project.wasteCollected) : t.common.notReported}
              </div>
              {project.plastics && project.plastics.length > 0 && (
                <div className="infoRow">
                  <b>{t.projectDetail.plasticsUsed}</b>{' '}
                  {project.plastics.map((p, index) => (
                    <span key={index}>
                      {index > 0 && ' '}
                      <span className="plasticTag">{p.name}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <hr />
            {project.summary && (
              <div className="projectDetails" style={{ fontSize: '15px' }}>
                <b>{t.projectDetail.summary} </b>
                <p>{project.summary}</p>
              </div>
            )}
            {project.documents && project.documents.length > 0 && (
              <>
                <hr />
                <div className="projectDocuments">
                  <b>{t.projectDetail.documents}</b>
                  <ul>
                    {project.documents.map((document) => (
                      <li key={document.id}>
                        <a href={documentHref(document)} target="_blank" rel="noopener noreferrer">
                          {document.title}
                        </a>
                        {document.kind === 'FILE' ? (
                          <span className="documentMeta">
                            {' '}
                            (PDF{document.sizeBytes ? `, ${(document.sizeBytes / 1024 / 1024).toFixed(1)} MB` : ''})
                          </span>
                        ) : (
                          <span className="documentMeta"> ({t.projectDetail.link})</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{t.projectDetail.notFound}</h2>
      </div>
    </Layout>
  );
};

export default PlasticProjectDetailsPage;

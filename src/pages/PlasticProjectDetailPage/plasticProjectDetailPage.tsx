import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  deletePlasticProject,
  documentHref,
  getPlasticProject,
  PlasticProjectResponse,
  projectImageHref,
} from '../../services/plasticService';
import { useAuth } from '../../services/AuthContext';
import { canDeleteProjects, canEditProject } from '../../services/auth';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import LinkIcon from '@mui/icons-material/Link';
import './plasticProjectDetailPage.css';
import { defaultProjectImage, formatYears } from '../../components/PlasticProjectCards/PlasticProjectCard';
import Footer from '../../components/Footer/Footer';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useI18n } from '../../i18n/I18nContext';

const PlasticProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<PlasticProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'invalidId' | 'loadFailed' | null>(null);
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
    const facts: [string, React.ReactNode][] = [
      [t.projectDetail.country, project.country],
      [t.projectDetail.startDate, formatDate(project.startDate)],
      ...(project.endDate ? [[t.projectDetail.endDate, formatDate(project.endDate)] as [string, string]] : []),
      ...(project.durationDays
        ? [[t.projectDetail.duration, t.projectDetail.days(project.durationDays)] as [string, string]]
        : []),
      [t.projectDetail.product, project.product],
      [t.projectDetail.financing, project.financing],
      [t.projectDetail.businessModel, project.businessModel],
      [
        t.projectDetail.wasteCollected,
        project.wasteCollected > 0 ? t.common.tons(project.wasteCollected) : t.common.notReported,
      ],
    ];

    return (
      <>
        <Meta title={project.name}></Meta>
        <Layout>
          <div className="projectPage">
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/plasticProjects')}
              sx={{ color: '#3D7844', borderColor: '#9fc4a3', textTransform: 'none', borderRadius: '8px', mb: 3 }}
            >
              {t.projectDetail.backToList}
            </Button>

            <header className="projectPageHeader">
              <div>
                <h1 className="projectPageTitle">{project.name}</h1>
                <p className="projectPageSubtitle">
                  {project.country} · {formatYears(project.startDate, project.endDate ?? undefined, t.plastic.ongoing)}
                </p>
              </div>
              {(canEditProject(user, project) || canDeleteProjects(user)) && (
                <div className="projectPageActions">
                  {canEditProject(user, project) && (
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/plastic-project/${project.id}/edit`)}
                      sx={{
                        backgroundColor: '#3D7844',
                        textTransform: 'none',
                        '&:hover': { backgroundColor: '#2f5f35' },
                      }}
                    >
                      {t.projectDetail.edit}
                    </Button>
                  )}
                  {canDeleteProjects(user) && (
                    <Button variant="outlined" color="error" onClick={handleDelete} sx={{ textTransform: 'none' }}>
                      {t.projectDetail.delete}
                    </Button>
                  )}
                </div>
              )}
            </header>

            {(actionError || uploadWarning) && (
              <Typography color="error" sx={{ mb: 2 }}>
                {actionError || uploadWarning}
              </Typography>
            )}

            {/* Same picture as on the project card */}
            <img
              className="projectPageImage"
              src={projectImageHref(project) ?? defaultProjectImage}
              alt={t.projectDetail.imageAlt}
            />

            <section className="projectPageCard">
              <h2>{t.projectDetail.facts}</h2>
              <dl className="projectFacts">
                {facts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
                {project.plastics && project.plastics.length > 0 && (
                  <div className="projectFactsWide">
                    <dt>{t.projectDetail.plasticsUsed}</dt>
                    <dd className="projectPlastics">
                      {project.plastics.map((plastic) => (
                        <span key={plastic.id} className="plasticTag">
                          {plastic.name}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </section>

            {project.summary && (
              <section className="projectPageCard">
                <h2>{t.projectDetail.summary}</h2>
                <p className="projectSummary">{project.summary}</p>
              </section>
            )}

            {project.documents && project.documents.length > 0 && (
              <section className="projectPageCard">
                <h2>{t.projectDetail.documents}</h2>
                <ul className="projectDocumentList">
                  {project.documents.map((document) => (
                    <li key={document.id} className="projectDocumentRow">
                      {document.kind === 'FILE' ? (
                        <PictureAsPdfIcon className="projectDocumentIcon" />
                      ) : (
                        <LinkIcon className="projectDocumentIcon" />
                      )}
                      <a href={documentHref(document)} target="_blank" rel="noopener noreferrer">
                        {document.title}
                      </a>
                      <span className="documentMeta">
                        {document.kind === 'FILE'
                          ? `PDF${document.sizeBytes ? `, ${(document.sizeBytes / 1024 / 1024).toFixed(1)} MB` : ''}`
                          : t.projectDetail.link}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <Footer />
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

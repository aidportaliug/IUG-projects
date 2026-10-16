import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EditIcon from '@mui/icons-material/Edit';
import {
  getPlastic,
  getPlastics,
  getPlasticProjects,
  PlasticProjectResponse,
  PlasticResponse,
  plasticImageHref,
  projectImageHref,
} from '../../services/plasticService';
import { useAuth } from '../../services/AuthContext';
import { useI18n } from '../../i18n/I18nContext';
import Layout from '../../components/Navbar/Layout';
import Footer from '../../components/Footer/Footer';
import Meta from '../../components/Meta';
import PlasticProjectCard from '../../components/PlasticProjectCards/PlasticProjectCard';
import PlasticEditDialog from '../../components/PlasticsGuide/PlasticEditDialog';
// Same page layout as the project and machine pages.
import '../PlasticProjectDetailPage/plasticProjectDetailPage.css';
import '../plasticPage/plasticPage.css';
import '../../components/PlasticsGuide/plasticsGuide.css';
import './plasticDetailPage.css';

// One plastic: what it is, its picture, and every project that uses it.
const PlasticDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  const [plastic, setPlastic] = useState<PlasticResponse | null>(null);
  const [projects, setProjects] = useState<PlasticProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'notFound' | 'loadFailed' | null>(null);
  const [editing, setEditing] = useState(false);
  // All plastics in resin-code order, for moving between them.
  const [allPlastics, setAllPlastics] = useState<PlasticResponse[]>([]);

  const load = useCallback(async () => {
    const plasticId = Number(id);
    if (!id || isNaN(plasticId)) {
      setError('notFound');
      setLoading(false);
      return;
    }
    try {
      const [loadedPlastic, projectList, plasticList] = await Promise.all([
        getPlastic(plasticId),
        getPlasticProjects(),
        getPlastics(undefined, 1, 100),
      ]);
      setPlastic(loadedPlastic);
      setAllPlastics(plasticList.plastics);
      setProjects(projectList.projects.filter((project) => project.plastics.some((p) => p.id === plasticId)));
      setError(null);
    } catch (err: any) {
      setError(/404|not found/i.test(err.message ?? '') ? 'notFound' : 'loadFailed');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    window.scrollTo(0, 0);
  }, [load]);

  // Keep showing the current plastic while the next one loads.
  if (loading && !plastic) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  if (error || !plastic) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{error === 'loadFailed' ? t.plasticPage.loadFailed : t.plasticPage.notFound}</h2>
        </div>
      </Layout>
    );
  }

  const picture = plasticImageHref(plastic);
  // Neighbours in resin-code order, wrapping around at the ends.
  const position = allPlastics.findIndex((other) => other.id === plastic.id);
  const previous =
    position >= 0 && allPlastics.length > 1
      ? allPlastics[(position - 1 + allPlastics.length) % allPlastics.length]
      : undefined;
  const next = position >= 0 && allPlastics.length > 1 ? allPlastics[(position + 1) % allPlastics.length] : undefined;
  const subtitle = [
    plastic.resinCode ? t.plasticsGuide.resinCodeValue(plastic.resinCode) : null,
    t.plasticPage.usedIn(projects.length),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <>
      <Meta title={plastic.name} />
      <Layout>
        <div className="projectPage">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/plasticProjects', { state: { tab: 'plastics' } })}
            sx={{ color: '#3D7844', borderColor: '#9fc4a3', textTransform: 'none', borderRadius: '8px', mb: 3 }}
          >
            {t.plasticPage.backToList}
          </Button>

          {/* Move between plastics */}
          <nav className="plasticSwitcher" aria-label={t.plasticPage.switcher}>
            {allPlastics.map((other) => (
              <Button
                key={other.id}
                size="small"
                variant={other.id === plastic.id ? 'contained' : 'outlined'}
                onClick={() => navigate(`/plastic/${other.id}`)}
                sx={{ textTransform: 'none', borderRadius: '999px', minWidth: 64, fontWeight: 600 }}
              >
                {other.resinCode ? <span className="plasticsGuideCode">{other.resinCode}</span> : null}
                {other.name}
              </Button>
            ))}
          </nav>

          <header className="projectPageHeader">
            <div>
              <h1 className="projectPageTitle">{plastic.name}</h1>
              <p className="projectPageSubtitle">{subtitle}</p>
            </div>
            {user?.isAdmin && (
              <div className="projectPageActions">
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => setEditing(true)}
                  sx={{ backgroundColor: '#3D7844', textTransform: 'none', '&:hover': { backgroundColor: '#2f5f35' } }}
                >
                  {t.plasticPage.edit}
                </Button>
              </div>
            )}
          </header>

          {picture && <img className="projectPageImage" src={picture} alt={plastic.name} />}

          <section className="projectPageCard">
            <h2>{t.plasticPage.about}</h2>
            <p className={plastic.description ? 'projectSummary' : 'projectSummary plasticPageEmpty'}>
              {plastic.description || t.plasticsGuide.noDescription}
            </p>
          </section>

          <section className="projectPageCard">
            <h2>{t.plasticPage.projectsUsing(plastic.name)}</h2>
            {projects.length === 0 ? (
              <p className="plasticPageEmpty">{t.plasticPage.noProjects}</p>
            ) : (
              <div className="plasticCardGrid plasticPageProjects">
                {projects.map((project) => (
                  <PlasticProjectCard
                    key={project.id}
                    variant="small"
                    name={project.name}
                    summary={project.summary ?? undefined}
                    startDate={project.startDate}
                    endDate={project.endDate ?? undefined}
                    country={project.country}
                    plastics={project.plastics.map((p) => p.name)}
                    product={project.product}
                    financing={project.financing}
                    businessModel={project.businessModel}
                    wasteCollected={project.wasteCollected}
                    image={projectImageHref(project)}
                    onClick={() => navigate(`/plastic-project/${project.id}`)}
                  />
                ))}
              </div>
            )}
          </section>

          {previous && next && (
            <nav className="plasticPrevNext" aria-label={t.plasticPage.switcher}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(`/plastic/${previous.id}`)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', borderRadius: '8px' }}
              >
                {t.plasticPage.previous}: {previous.resinCode ? `${previous.resinCode} ` : ''}
                {previous.name}
              </Button>
              <Button
                variant="outlined"
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate(`/plastic/${next.id}`)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none', borderRadius: '8px' }}
              >
                {t.plasticPage.next}: {next.resinCode ? `${next.resinCode} ` : ''}
                {next.name}
              </Button>
            </nav>
          )}
        </div>
        <Footer />
      </Layout>

      <PlasticEditDialog
        open={editing}
        plastic={plastic}
        onClose={() => setEditing(false)}
        onSaved={() => {
          setEditing(false);
          load();
        }}
      />
    </>
  );
};

export default PlasticDetailPage;

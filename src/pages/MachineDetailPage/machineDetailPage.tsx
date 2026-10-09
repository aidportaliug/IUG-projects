import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMachine, MachineResponse } from '../../services/machineService';
import './machineDetailPage.css';
// Same page layout as the project page.
import '../PlasticProjectDetailPage/plasticProjectDetailPage.css';
import { defaultProjectImage } from '../../components/PlasticProjectCards/PlasticProjectCard';
import Footer from '../../components/Footer/Footer';
import { machinePicture } from '../../models/machineImages';
import { useAuth } from '../../services/AuthContext';
import { Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RecyclingIcon from '@mui/icons-material/Recycling';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import { useI18n } from '../../i18n/I18nContext';

const MachineDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [machine, setMachine] = useState<MachineResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<'invalidId' | 'loadFailed' | null>(null);
  const navigate = useNavigate();
  const { t } = useI18n();
  const { user } = useAuth();
  // Set by the upload form when the new machine's picture could not be uploaded.
  const uploadWarning = (useLocation().state as { uploadWarning?: string } | null)?.uploadWarning;

  async function getMachineData(machineId: string) {
    setLoading(true);
    setError(null);
    try {
      const machineIdNumber = parseInt(machineId, 10);
      if (isNaN(machineIdNumber)) {
        setError('invalidId');
        return;
      }
      const fetchedMachine = await getMachine(machineIdNumber);
      setMachine(fetchedMachine);
    } catch (err) {
      setError('loadFailed');
      console.error('Error fetching machine:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      getMachineData(id);
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
          <h2>{t.machineDetail[error]}</h2>
        </div>
      </Layout>
    );
  }

  if (!machine) {
    return (
      <Layout>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>{t.machineDetail.notFound}</h2>
        </div>
      </Layout>
    );
  }

  const facts: [string, React.ReactNode][] = [
    [t.machineDetail.whatItDoes, machine.whatItDoes],
    [t.machineDetail.howItWorks, machine.howItWorksAndAcquired],
    [t.machineDetail.lessons, machine.operationComplicationsAndLessons.trim() || t.machineDetail.noLessons],
  ];
  const projectsInUse = machine.plasticProjectsInUse ?? [];

  return (
    <>
      <Meta title={machine.name}></Meta>
      <Layout>
        <div className="projectPage">
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/plasticProjects', { state: { tab: 'machines' } })}
            sx={{ color: '#3D7844', borderColor: '#9fc4a3', textTransform: 'none', borderRadius: '8px', mb: 3 }}
          >
            {t.machineDetail.backToList}
          </Button>

          <header className="projectPageHeader">
            <div>
              <h1 className="projectPageTitle">{machine.name}</h1>
              {projectsInUse.length > 0 && (
                <p className="projectPageSubtitle">{t.machineDetail.usedIn(projectsInUse.length)}</p>
              )}
            </div>
            {user?.isAdmin && (
              <div className="projectPageActions">
                <Button
                  variant="contained"
                  onClick={() => navigate(`/machine/${machine.id}/edit`)}
                  sx={{ backgroundColor: '#3D7844', textTransform: 'none', '&:hover': { backgroundColor: '#2f5f35' } }}
                >
                  {t.machineDetail.edit}
                </Button>
              </div>
            )}
          </header>

          {uploadWarning && (
            <Typography color="error" sx={{ mb: 2 }}>
              {uploadWarning}
            </Typography>
          )}

          {/* Same picture as on the machine card */}
          <img
            className="projectPageImage"
            src={machinePicture(machine) ?? defaultProjectImage}
            alt={t.machineDetail.imageAlt}
          />

          <section className="projectPageCard">
            <h2>{t.machineDetail.about}</h2>
            <dl className="projectFacts machineFacts">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
              {machine.plastics && machine.plastics.length > 0 && (
                <div>
                  <dt>{t.machineDetail.plasticTypes}</dt>
                  <dd className="projectPlastics">
                    {machine.plastics.map((plastic) => (
                      <span key={plastic.id} className="plasticTag">
                        {plastic.name}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {projectsInUse.length > 0 && (
            <section className="projectPageCard">
              <h2>{t.machineDetail.inUse}</h2>
              <ul className="projectDocumentList machineProjectList">
                {projectsInUse.map((project) => (
                  <li key={project.id} className="projectDocumentRow">
                    <RecyclingIcon className="projectDocumentIcon" />
                    <Link to={`/plastic-project/${project.id}`}>{project.name}</Link>
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
};

export default MachineDetailsPage;

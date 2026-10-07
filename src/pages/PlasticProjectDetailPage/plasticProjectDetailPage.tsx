import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPlasticProject, PlasticProjectResponse } from '../../services/plasticService';
import './plasticProjectDetailPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';

const PlasticProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<PlasticProjectResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imageIcon = Trax_Ghana;

  async function getProjectData(projectId: string) {
    setLoading(true);
    setError(null);
    try {
      const projectIdNumber = parseInt(projectId, 10);
      if (isNaN(projectIdNumber)) {
        setError('Invalid project ID');
        return;
      }
      const fetchedProject = await getPlasticProject(projectIdNumber);
      setProject(fetchedProject);
    } catch (err) {
      setError('Failed to load project');
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
          <h2>{error}</h2>
        </div>
      </Layout>
    );
  }

  if (project != null) {
    const startDate = new Date(project.startDate);
    const endDate = project.endDate ? new Date(project.endDate) : null;

    return (
      <>
        <Meta title={project.name}></Meta>
        <Layout>
          <div className="projectDetailoutline">
            <div className="Title">{project.name}</div>
            <ProjectImageBox source={imageIcon} altText={'Project Image'} />
            <hr />
            <div className="projectInformation">
              <div className="infoRow">
                <b>Country:</b> {project.country}
              </div>
              <div className="infoRow">
                <b>Start Date:</b> {startDate.toLocaleDateString()}
              </div>
              {endDate && (
                <div className="infoRow">
                  <b>End Date:</b> {endDate.toLocaleDateString()}
                </div>
              )}
              {project.durationDays && (
                <div className="infoRow">
                  <b>Duration:</b> {project.durationDays} days
                </div>
              )}
              <div className="infoRow">
                <b>Product:</b> {project.product}
              </div>
              <div className="infoRow">
                <b>Financing:</b> {project.financing}
              </div>
              <div className="infoRow">
                <b>Business Model:</b> {project.businessModel}
              </div>
              <div className="infoRow">
                <b>Waste Collected:</b> {project.wasteCollected} tons
              </div>
              {project.plastics && project.plastics.length > 0 && (
                <div className="infoRow" style={{ marginTop: '5px', marginBottom: '10px' }}>
                  <b>Plastics Used:</b>{' '}
                  {project.plastics.map((p, index) => (
                    <span key={p.id ?? `${p.name}-${index}`}>
                      {index > 0 && ' '}
                      <span className="plasticTag">{p.name}</span>
                    </span>
                  ))}
                </div>
              )}
              {project.machines && project.machines.length > 0 && (
                <div className="infoRow" style={{ marginTop: '10px', marginBottom: '5px' }}>
                  <b>Machines Used:</b>{' '}
                  {project.machines.map((machine, index) => (
                    <span key={machine.id ?? `${machine.name}-${index}`}>
                      {index > 0 && ' '}
                      <button
                        type="button"
                        className="plasticTag"
                        onClick={() => navigate(`/machine/${machine.id}`)}
                        style={{
                          cursor: 'pointer',
                          border: 'none',
                          background: 'var(--secondaryGreen)',
                          color: 'var(--mainBackground)',
                          fontFamily: 'var(--mainFontFamily), serif',
                          fontStyle: 'normal',
                          fontWeight: 400,
                          fontSize: '15px',
                          borderRadius: '8px',
                          padding: '4px 12px',
                          textAlign: 'center',
                          display: 'inline-block',
                          margin: '2px 0',
                        }}
                      >
                        {machine.name}
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
            <hr />
            {project.summary && (
              <div className="infoRow" style={{ fontSize: '15px', marginTop: '15px' }}>
                <b>Summary: </b>
                <b></b>
                <p>{project.summary}</p>
              </div>
            )}
          </div>
        </Layout>
      </>
    );
  }

  return (
    <Layout>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>404: Project not found</h2>
      </div>
    </Layout>
  );
};

export default PlasticProjectDetailsPage;

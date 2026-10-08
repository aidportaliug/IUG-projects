import React, { useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { UserResponse } from '../../services/auth';
import { getPlasticProjects, PlasticProjectResponse, projectImageHref } from '../../services/plasticService';
import defaultPicture from '../../images/plasticProject.png';
import { useI18n } from '../../i18n/I18nContext';
import { uploadButtonSx } from '../PlasticProjectCards/PlasticProjectCard';

// The plastic projects the logged-in user has uploaded, with links to view and edit them.
const MyUploads: React.FC<{ user: UserResponse }> = ({ user }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<PlasticProjectResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const loadUploads = async () => {
      try {
        const response = await getPlasticProjects();
        setProjects(response.projects.filter((project) => project.createdBy === user.id));
      } catch (err: any) {
        setError(err.message || '');
      } finally {
        setLoading(false);
      }
    };
    loadUploads();
  }, [user.id]);

  let content: React.ReactNode;
  if (loading) {
    content = <CircularProgress size={24} />;
  } else if (error !== null) {
    content = <p className="myUploadsEmpty">{error || t.profile.uploadsFailed}</p>;
  } else if (projects.length === 0) {
    content = <p className="myUploadsEmpty">{t.profile.noUploads}</p>;
  } else {
    content = (
      <ul className="myUploadsList">
        {projects.map((project) => (
          <li key={project.id} className="myUploadsItem">
            <img className="myUploadsThumb" src={projectImageHref(project) ?? defaultPicture} alt="" />
            <div className="myUploadsInfo">
              <strong>{project.name}</strong>
              <span className="myUploadsMeta">
                {project.country} · {project.product} · {t.profile.documentsCount(project.documents.length)}
              </span>
            </div>
            <div className="myUploadsActions">
              <Button
                size="small"
                onClick={() => navigate(`/plastic-project/${project.id}`)}
                sx={{ color: '#3D7844', textTransform: 'none' }}
              >
                {t.profile.view}
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(`/plastic-project/${project.id}/edit`)}
                sx={{ color: '#3D7844', borderColor: '#3D7844', textTransform: 'none' }}
              >
                {t.profile.edit}
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
        <h2>{!loading && error === null ? t.profile.myUploadsCount(projects.length) : t.profile.myUploads}</h2>
        <Button onClick={() => navigate('/UploadPlasticProject')} sx={uploadButtonSx}>
          {t.profile.uploadNew}
        </Button>
      </div>
      {content}
    </section>
  );
};

export default MyUploads;

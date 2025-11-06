import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Project } from '../../models/project';
import { getProject } from '../../services/getProject';
import InformationBox from '../../components/ProjectDetail/InformationBox';
import './projectDetailPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';

const ProjectDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const imageIcon = Trax_Ghana;

  async function getProjectData(projectId: string) {
    setLoading(true);
    const fetchedProject = await getProject(projectId);
    setProject(fetchedProject);
    setLoading(false);
  }

  useEffect(() => {
    if (id) {
      getProjectData(id);
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (project != null) {
    const deadline = project.deadline?.toDate
      ? project.deadline.toDate()
      : project.deadline instanceof Date
      ? project.deadline
      : new Date();

    return (
      <>
        <Meta title={project?.title}></Meta>
        <Layout>
          <div className="projectDetailoutline">
            <div className="Title">{project?.title}</div>
            <ProjectImageBox source={imageIcon} altText={'Project Image'} />
            <hr />
            <InformationBox
              deadline={deadline}
              location={project.location}
              duration={project.duration}
              studyField={project.studyField}
            />
            <hr />
            <div className="projectDetails" style={{ fontSize: '15px' }}>
              {project.description}
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return <div>404: Project not found</div>;
};

export default ProjectDetailsPage;

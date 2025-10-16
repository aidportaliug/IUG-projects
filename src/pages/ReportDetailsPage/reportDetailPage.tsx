import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { experienceReport } from '../../models/experienceReport';
import { getProject } from '../../services/getProject';
import ReportInformationBox from '../../components/ExperienceReportDetail/ReportInformationBox';
import './projectDetailPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [experienceReport, setProject] = useState<experienceReport | null>();
  const imageIcon = Trax_Ghana;

  async function getProjectData(projectId: string) {
    const project = await getProject(projectId);
    setProject(experienceReport);
  }
  useEffect(() => {
    if (id) {
      getProjectData(id);
    }
  }, [id]);
  if (experienceReport != null) {
    return (
      <>
        <Meta title={experienceReport?.title}></Meta>
        <Layout>
          <div className="projectDetailoutline">
            <div className="Title">{experienceReport?.title}</div>
            <ProjectImageBox source={imageIcon} altText={'Project Image'} />
            <hr />
            <ReportInformationBox
              deadline={experienceReport.deadline.toDate()}
              studyField={experienceReport.studyField}
            />
            <hr />
            <div className="projectDetails" style={{ fontSize: '15px' }}>
              {experienceReport.description}
            </div>
          </div>
        </Layout>
      </>
    );
  }
  return <div>404: page not found</div>;
};

export default ReportDetailsPage;
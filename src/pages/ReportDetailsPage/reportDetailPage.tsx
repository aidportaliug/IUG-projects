import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { experienceReport } from '../../models/experienceReport';
import { getReport } from '../../services/getReport';
import ReportInformationBox from '../../components/ExperienceReportDetail/ReportInformationBox';
import './reportDetailsPage.css';
import Trax_Ghana from '../../images/Trax_Ghana.png';
import ProjectImageBox from '../../components/ProjectImageBox/ProjectImageBox';
import Meta from '../../components/Meta';
import Layout from '../../components/Navbar/Layout';

const ReportDetailsPage: React.FC = () => {
  const { id } = useParams();
  const [report, setReport] = useState<experienceReport | null>(null);
  const imageIcon = Trax_Ghana;

  async function getReportData(reportId: string) {
    const fetchedReport = await getReport(reportId);
    setReport(fetchedReport);
  }

  useEffect(() => {
    if (id) {
      getReportData(id);
    }
  }, [id]);

  if (report != null) {
    return (
      <>
        <Meta title={report?.title}></Meta>
        <Layout>
          <div className="projectDetailoutline">
            <div className="Title">{report?.title}</div>
            <ProjectImageBox source={imageIcon} altText={'Report Image'} />
            <hr />
            <ReportInformationBox deadline={report.deadline.toDate()} studyField={report.studyField} />
            <hr />
            <div className="projectDetails" style={{ fontSize: '15px' }}>
              {report.description}
            </div>
            {report.thesisLink && (
              <>
                <hr />
                <div style={{ marginTop: '20px' }}>
                  <strong>Thesis Link:</strong>{' '}
                  <a href={report.thesisLink} target="_blank" rel="noopener noreferrer">
                    {report.thesisLink}
                  </a>
                </div>
              </>
            )}
          </div>
        </Layout>
      </>
    );
  }

  return <div>404: Report not found</div>;
};

export default ReportDetailsPage;

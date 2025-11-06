import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './experienceReports.css';
import { getReports } from '../../services/reportService';
import { studyFields, locations } from '../../models/allowedValues';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../components/Footer/Footer';
import Meta from '../../components/Meta';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const ExperienceReports: React.FC = () => {
  const imagePath = './../../images/Trax_Ghana.png';
  const [reports, setReports] = useState<any[]>([]);
  const [orderBy, setOrderBy] = useState<string>('deadline');
  const [filterLocation, setFilterLocation] = useState<string>('location');
  const [filterStudyField, setFilterStudyField] = useState<string>('study_field');
  const [loading, setLoading] = useState(false);
  const [noReport, setNoReport] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedReports = await getReports(
        undefined,
        orderBy,
        filterLocation,
        filterStudyField
      );
      if (fetchedReports.length === 0) {
        setNoReport(true);
      } else {
        setNoReport(false);
      }
      setReports(fetchedReports);
      setLoading(false);
    }
    fetchData();
  }, [filterLocation, filterStudyField, orderBy]);

  return (
    <>
      <Meta title="Experience Reports"></Meta>
      <div className="reportBackground">
        <Layout>
          <div className="reportOutline">
            <div className="reportTitle"> Experience reports</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <FilterDropdown value={orderBy} setValue={setOrderBy} sortBy={true} />
              <FilterDropdown value={filterLocation} setValue={setFilterLocation} location={true} />
              <FilterDropdown value={filterStudyField} setValue={setFilterStudyField} studyField={true} />
              <Button 
                onClick={() => navigate('/uploadexperienceReport')} 
                style={{
                  marginLeft: 'auto', 
                  color: 'black', 
                  textTransform: "none", 
                  border: '1px solid grey',
                  backgroundColor: '#e0e0e0'
                }}
              >
                Upload your report
              </Button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
              </div>
            ) : (
              <div className="rowReport">
                {noReport ? (
                  <h4>No reports found</h4>
                ) : (
                  reports.map((report) => (
                    <ProjectCard
                      key={report.id}
                      id={report.id}
                      title={report.shortTitle ?? report.title}
                      description={report.summaryDescription ?? report.description}
                      date={report.deadline?.toDate ? report.deadline.toDate() : new Date()}
                      topics={[
                        studyFields[report.studyField as keyof typeof studyFields] || 'General',
                        locations[report.location as keyof typeof locations] || 'Global',
                      ]}
                      imagePath={imagePath}
                    />
                  ))
                )}
              </div>
            )}
          </div>
          <Footer
            nameLink1="Demo_1"
            nameLink1URL="demo.com"
            nameLink2="Demo_1"
            nameLink2URL="demo.com"
            nameLink3="Demo_1"
            nameLink3URL="demo.com"
            nameLink4="Demo_1"
            nameLink4URL="demo.com"
            category1="category1"
            category2="category2"
          />
        </Layout>
      </div>
    </>
  );
};

export default ExperienceReports;
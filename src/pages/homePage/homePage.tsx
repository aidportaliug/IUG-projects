import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './homePage.css';
import { getProjects } from '../../services/getProjects';
import { Project } from '../../models/project';
import { studyFields, locations } from '../../models/allowedValues';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../components/Footer/Footer';
import Meta from '../../components/Meta';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const Home: React.FC = () => {
  const imagePath = './../../images/Trax_Ghana.png';
  const [projects, setProjects] = useState<Project[]>([]);
  const [orderBy, setOrderBy] = useState<string>('deadline');
  const [filterLocation, setFilterLocation] = useState<string>('location');
  const [filterStudyField, setFilterStudyField] = useState<string>('study_field');
  const [loading, setLoading] = useState(false);
  const [noProject, setNoProject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const fetchedProjects = await getProjects(
        orderBy,
        filterLocation,
        filterStudyField
      );
      if (fetchedProjects.length === 0) {
        setNoProject(true);
      } else {
        setNoProject(false);
      }
      setProjects(fetchedProjects);
      setLoading(false);
    }
    fetchData();
  }, [filterLocation, filterStudyField, orderBy]);

  return (
    <>
      <Meta title="Home"></Meta>
      <div className="homeBackground">
        <Layout>
          <div className="homeOutline">
            <div className="homeTitle"> Projects</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <FilterDropdown value={orderBy} setValue={setOrderBy} sortBy={true} />
              <FilterDropdown value={filterLocation} setValue={setFilterLocation} location={true} />
              <FilterDropdown value={filterStudyField} setValue={setFilterStudyField} studyField={true} />
              <Button 
                onClick={() => navigate('/uploadProject')} 
                style={{
                  marginLeft: 'auto', 
                  color: 'black', 
                  textTransform: "none", 
                  border: '1px solid grey',
                  backgroundColor: '#e0e0e0'
                }}
              >
                Upload your project
              </Button>
            </div>
            
            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
              </div>
            ) : (
              <div className="rowHome">
                {noProject ? (
                  <h4>No projects found</h4>
                ) : (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      id={project.id}
                      title={project.shortTitle ?? project.title}
                      description={project.summaryDescription ?? project.description}
                      date={project.deadline?.toDate ? project.deadline.toDate() : new Date()}
                      topics={[
                        studyFields[project.studyField as keyof typeof studyFields] || 'General',
                        locations[project.location as keyof typeof locations] || 'Global',
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

export default Home;
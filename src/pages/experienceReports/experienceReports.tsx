import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './experienceReports.css';
import { getProjects } from '../../services/getProjects';
import { Project } from '../../models/project';
import { studyFields, locations } from '../../models/allowedValues';
import FilterDropdown from '../../components/FilterDropdown/FilterDropdown';
import { DocumentData } from 'firebase/firestore';
import InfiniteScroll from 'react-infinite-scroll-component';
import Layout from '../../components/Navbar/Layout';
import CircularProgress from '@mui/material/CircularProgress';
import Footer from '../../components/Footer/Footer';
import Meta from '../../components/Meta';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const ExperienceReports: React.FC = () => {
  const imagePath = './../../images/Trax_Ghana.png';
  const [projects, setProjects] = useState<Project[]>([]);
  const [orderBy, setOrderBy] = useState<string>('deadline');
  const [filterLocation, setFilterLocation] = useState<string>('location');
  const [filterStudyField, setFilterStudyField] = useState<string>('study_field');
  const [lastVisible, setLastVisible] = useState<DocumentData | null>(null);
  const [, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [noProject, setNoProject] = useState(false);
  const limit = 6;
  const navigate = useNavigate();

  async function fetchMoreData() {
    setLoading(true);
    const newProjects = await getProjects(
      orderBy,
      filterLocation,
      filterStudyField,
      setLastVisible,
      lastVisible,
      limit
    );
    if (newProjects.length === 0) {
      setHasMore(false);
      setLoading(false);
    } else {
      setProjects([...projects, ...newProjects]);
    }
    setLoading(false);
  }

  useEffect(() => {
    async function fetchData() {
      const projects = await getProjects(orderBy, filterLocation, filterStudyField, setLastVisible, null, limit);
      if (projects.length === 0) {
        setHasMore(false);
        setLoading(false);
        setNoProject(true);
      }
      setProjects(projects);
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
              <Button onClick={() => navigate('/uploadProject')} 
              style={{marginLeft: 'auto', color: 'black', textTransform: "none", border: '1px solid grey',
               backgroundColor: '#e0e0e0'}}>Upload your report</Button>
            </div>
            <InfiniteScroll
              dataLength={projects.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={
                <div style={{ textAlign: 'center' }}>
                  <h4>
                    <CircularProgress />
                  </h4>
                </div>
              }
              scrollableTarget="scrollableDiv"
              endMessage={<h4>{noProject}</h4>}
            >
              <div className="rowReport">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    id={project.id}
                    title={project.shortTitle ?? project.title}
                    description={project.summaryDescription ?? project.description}
                    date={project.deadline.toDate()}
                    topics={[
                      studyFields[project.studyField as keyof typeof studyFields],
                      locations[project.location as keyof typeof locations],
                    ]}
                    imagePath={imagePath}
                  />
                ))}
              </div>
            </InfiniteScroll>
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

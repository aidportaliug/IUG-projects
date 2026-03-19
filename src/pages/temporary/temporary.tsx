import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import './temporary.css';
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
import SmallMachineCard from '../../components/MachineCards/machineSmallCard';
import DetailedMachineCard from '../../components/MachineCards/machineDetailCard';
import SmallPlasticProjectCard from '../../components/PlasticProjectCards/smallPlasticProjectCard';
import DetailPlasticProjectCard from '../../components/PlasticProjectCards/detailPlasticProjectCard';
// import {PlasticProject} from '../../models/plastic';

const machineTemporary: React.FC = () => {
  const imagePath = './../../images/machineEx.png';
  const imagePath2 = './../../images/plasticProject.png';

  // demo projects for design preview
  const demoMachines: Project[] = [
    {
      id: 'demo-1',
      title: 'Plastic Recycler 3000',
      description: 'A compact machine that sorts and compresses plastic waste into reusable pellets.',
    } as unknown as Project,
    {
      id: 'demo-2',
      title: 'Ocean Cleanup Drone',
      description: 'Autonomous drone that collects surface plastic and returns to base for emptying.',
    } as unknown as Project,
    {
      id: 'demo-3',
      title: 'Bioplastic Research',
      description: 'Research project exploring biodegradable alternatives to common plastics.',
    } as unknown as Project,
    {
      id: 'demo-1',
      title: 'Plastic Recycler 3000',
      description: 'A compact machine that sorts and compresses plastic waste into reusable pellets.',
    } as unknown as Project,
    {
      id: 'demo-2',
      title: 'Ocean Cleanup Drone',
      description: 'Autonomous drone that collects surface plastic and returns to base for emptying.',
    } as unknown as Project,
    {
      id: 'demo-3',
      title: 'Bioplastic Research',
      description: 'Research project exploring biodegradable alternatives to common plastics.',
    } as unknown as Project,
  ];

  const demoProjects: Project[] = [
    {
      id: 'demo-1',
      title: 'project 1',
      country: 'Hellas',
      year: 23,
      plasticType: 'type2',
      product: 'Renser',
      processing: 'addada',
      financing: 'geka',
      businessModel: 'subscription',
      partnershipOwnership: 'dadadadda',
      wasteCollected: 45,
    } as unknown as Project,
    {
      id: 'demo-2',
      title: 'project 1',
      country: 'Hellas',
      year: 23,
      plasticType: 'type2',
      product: 'Renser',
      processing: 'addada',
      financing: 'geka',
      businessModel: 'subscription',
      partnershipOwnership: 'dadadadda',
      wasteCollected: 45,
    } as unknown as Project,
    {
      id: 'demo-3',
      title: 'project 1',
      country: 'Hellas',
      year: 23,
      plasticType: 'type2',
      product: 'Renser',
      processing: 'addada',
      financing: 'geka',
      businessModel: 'subscription',
      partnershipOwnership: 'dadadadda',
      wasteCollected: 45,
    } as unknown as Project,
    {
      id: 'demo-4',
      title: 'project 1',
      country: 'Hellas',
      year: 23,
      plasticType: 'type2',
      product: 'Renser',
      processing: 'addada',
      financing: 'geka',
      businessModel: 'subscription',
      partnershipOwnership: 'dadadadda',
      wasteCollected: 45,
    } as unknown as Project,
    {
      id: 'demo-5',
      title: 'project 1',
      country: 'Hellas',
      year: 23,
      plasticType: 'type2',
      product: 'Renser',
      processing: 'addada',
      financing: 'geka',
      businessModel: 'subscription',
      partnershipOwnership: 'dadadadda',
      wasteCollected: 45,
    } as unknown as Project,
  ];

  // local state for both lists
  const [machineItems, setMachineItems] = useState<Project[]>(demoMachines);
  const [projectItems, setProjectItems] = useState<Project[]>(demoProjects);

  const [orderBy, setOrderBy] = useState<string>('deadline');
  const [filterLocation, setFilterLocation] = useState<string>('location');
  const [filterStudyField, setFilterStudyField] = useState<string>('study_field');

  // view control
  const [activeTab, setActiveTab] = useState<'machines' | 'projects'>('machines'); // top tabs
  const [machineViewMode, setMachineViewMode] = useState<'small' | 'detailed'>('small');
  const [projectViewMode, setProjectViewMode] = useState<'small' | 'detailed'>('small');

  const [loading, setLoading] = useState(false);
  const [noProject, setNoProject] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // try to fetch real projects -> use for the "projects" tab
    async function fetchData() {
      setLoading(true);
      try {
        const fetchedProjects = await getProjects(orderBy, filterLocation, filterStudyField);
        if (!fetchedProjects || fetchedProjects.length === 0) {
          // keep demo projects2
          setProjectItems(demoProjects);
          setNoProject(false);
        } else {
          setProjectItems(fetchedProjects);
          setNoProject(false);
        }
      } catch (err) {
        console.error('Failed to fetch projects, using demo data', err);
        setProjectItems(demoProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // machines are demo-only for now; you can extend to fetch real machines later
    setMachineItems(demoMachines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLocation, filterStudyField, orderBy]);

  return (
    <>
      <Meta title="machineTemporary"></Meta>
      <div className="homeBackground">
        <Layout>
          <div className="homeOutline">
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <Button
                variant={activeTab === 'projects' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('projects')}
              >
                Projects
              </Button>
              <Button
                variant={activeTab === 'machines' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('machines')}
              >
                Machines
              </Button>
            </div>

            <div className="homeTitle">
              {activeTab === 'machines' ? 'Machines (TEMPORARY)' : 'Projects (TEMPORARY)'}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <FilterDropdown value={orderBy} setValue={setOrderBy} sortBy={true} />
              <FilterDropdown value={filterLocation} setValue={setFilterLocation} location={true} />
              <FilterDropdown value={filterStudyField} setValue={setFilterStudyField} studyField={true} />
              <Button
                onClick={() => navigate('/uploadProject')}
                style={{
                  marginLeft: 'auto',
                  color: 'black',
                  textTransform: 'none',
                  border: '1px solid grey',
                  backgroundColor: '#e0e0e0',
                }}
              >
                Upload your project
              </Button>
            </div>

            {/* view toggle buttons for the active tab*/}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 16, marginBottom: 8 }}>
              {activeTab === 'machines' ? (
                <>
                  <Button
                    variant={machineViewMode === 'small' ? 'contained' : 'outlined'}
                    onClick={() => setMachineViewMode('small')}
                    size="small"
                  >
                    Small
                  </Button>
                  <Button
                    variant={machineViewMode === 'detailed' ? 'contained' : 'outlined'}
                    onClick={() => setMachineViewMode('detailed')}
                    size="small"
                  >
                    Detailed
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={projectViewMode === 'small' ? 'contained' : 'outlined'}
                    onClick={() => setProjectViewMode('small')}
                    size="small"
                  >
                    Small
                  </Button>
                  <Button
                    variant={projectViewMode === 'detailed' ? 'contained' : 'outlined'}
                    onClick={() => setProjectViewMode('detailed')}
                    size="small"
                  >
                    Detailed
                  </Button>
                </>
              )}
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
                  // render the selected tab's items
                  (activeTab === 'machines' ? machineItems : projectItems).map((item) =>
                    activeTab === 'machines' ? (
                      machineViewMode === 'small' ? (
                        <SmallMachineCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          picturePath={imagePath}
                          whatDoes={item.description}
                          howWork={item.description}
                        />
                      ) : (
                        <DetailedMachineCard
                          key={item.id}
                          id={item.id}
                          title={item.title}
                          plasticType={item.description}
                          picturePath={imagePath}
                          whatDoes={item.description}
                          howWork={item.description}
                          howDoes={item.description}
                          complicLesson={item.description}
                          inUseEWB={item.description}
                        />
                      )
                    ) : projectViewMode === 'small' ? (
                      <SmallPlasticProjectCard
                        key={item.id}
                        id={item.id}
                        picturePath={imagePath2}
                        title={item.title}
                        country={item.description}
                        year={item.duration}
                        plasticType={item.description}
                        product={item.description}
                        // adjust props below to match your small project card props
                      />
                    ) : (
                      <DetailPlasticProjectCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        country={item.description}
                        year={item.duration}
                        plasticType={item.description}
                        product={item.description}
                        processing={item.description}
                        financing={item.description}
                        businessModel={item.description}
                        partnershipOwnership={item.description}
                        wasteCollected={item.duration}
                      />
                    )
                  )
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

export default machineTemporary;

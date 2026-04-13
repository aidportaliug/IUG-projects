import React, { useEffect, useState } from 'react';
import './plasticPage.css'
import Layout from '../../components/Navbar/Layout';
import Footer from '../../components/Footer/Footer';
import CircularProgress from '@mui/material/CircularProgress';
import PlasticFilterDropdown from '../../components/PlasticFilterDropdown/PlasticFilterDropdown';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import imageProjectCard from '../../images/plasticProject.png';
import polyfloss from '../../images/polyfloss.png';
import melter from '../../images/melter.png';
import shredder from '../../images/shredder.png';
import ventilation from '../../images/ventilation.jpg';
import { getMachines, MachineResponse } from '../../services/machineService';
import { getPlasticProjects, PlasticProjectResponse } from '../../services/plasticService';
import { useNavigate } from 'react-router-dom';

interface PlasticProjectData {
  project_id: string;
  project_name: string;
  start_date: string;
  end_date?: string;
  country: string;
  project_use: string;
  electricity: boolean;
  product: string;
  summary?: string;
  plastics?: string[];
  machines?: string[];
  financing: string;
  businessModel: string;
  partnershipOwnership: string;
  wasteCollected: number;
}

interface MachineData {
  id: string;
  title: string;
  image?: string;
  whatDoes: string;
  howWork: string;
  plastics: string[];
  howDoes: string;
  complicLesson: string;
  inUseEWB: string;
}

const machineImageByName: Record<string, string> = {
  polyfloss,
  'oven/melter': melter,
  'grinder/shredder': shredder,
  ventilation,
};

const getMachineImage = (name: string): string | undefined => {
  const key = name.trim().toLowerCase();
  return machineImageByName[key];
};

const PlasticProjects: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'machines'>('projects');
  const [projectViewMode, setProjectViewMode] = useState<'small' | 'detailed'>('small');
  const [machineViewMode, setMachineViewMode] = useState<'small' | 'detailed'>('small');

  const [machines, setMachines] = useState<MachineData[]>([]);
  const [projects, setProjects] = useState<PlasticProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PlasticProjectData[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('country');
  const [filterPlastic, setFilterPlastic] = useState('plastic');
  const [filterMachine, setFilterMachine] = useState('machine');

  const [loading, setLoading] = useState(false);
  const [noProject, setNoProject] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const uploadButtonLabel = activeTab === 'machines' ? 'Upload machine' : 'Upload your project';
  const uploadButtonRoute = activeTab === 'machines' ? '/uploadMachine' : '/UploadPlasticProject';

  useEffect(() => {
    const fetchPlasticDatabase = async () => {
      setLoading(true);
      try {
        const [machineResponse, projectResponse] = await Promise.all([
          getMachines(undefined, 1, 200),
          getPlasticProjects(),
        ]);

        const machineByProjectId = machineResponse.machines.reduce<Record<number, string[]>>((acc, machine) => {
          machine.plasticProjectsInUse.forEach((project) => {
            if (!acc[project.id]) {
              acc[project.id] = [];
            }
            acc[project.id].push(machine.name);
          });
          return acc;
        }, {});

        const mappedMachines: MachineData[] = machineResponse.machines.map((machine: MachineResponse) => ({
          id: machine.id.toString(),
          title: machine.name,
          image: getMachineImage(machine.name),
          whatDoes: machine.whatItDoes,
          howWork: machine.howItWorksAndAcquired,
          plastics: machine.plastics.map((plastic) => plastic.name),
          howDoes: machine.howItWorksAndAcquired,
          complicLesson: machine.operationComplicationsAndLessons,
          inUseEWB: machine.plasticProjectsInUse.map((project) => project.name).join(', '),
        }));

        const mappedProjects: PlasticProjectData[] = projectResponse.projects.map(
          (project: PlasticProjectResponse) => ({
            project_id: project.id.toString(),
            project_name: project.name,
            start_date: project.startDate,
            end_date: project.endDate || undefined,
            country: project.country,
            project_use: '',
            electricity: false,
            product: project.product,
            summary: project.summary || '',
            plastics: project.plastics.map((plastic) => plastic.name),
            machines: machineByProjectId[project.id] || [],
            financing: project.financing,
            businessModel: project.businessModel,
            partnershipOwnership: '',
            wasteCollected: project.wasteCollected,
          })
        );

        setMachines(mappedMachines);
        setProjects(mappedProjects);
        setFilteredProjects(mappedProjects);
        setNoProject(mappedProjects.length === 0);
      } catch (error) {
        console.error('Failed to fetch plastic database data:', error);
        setMachines([]);
        setProjects([]);
        setFilteredProjects([]);
        setNoProject(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPlasticDatabase();
  }, []);

  useEffect(() => {
    let filtered = [...projects];

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (project) =>
          project.project_name.toLowerCase().includes(searchLower) ||
          project.project_use?.toLowerCase().includes(searchLower) ||
          project.summary?.toLowerCase().includes(searchLower)
      );
    }

    if (filterCountry !== 'country') {
      filtered = filtered.filter((project) => project.country === filterCountry);
    }

    if (filterPlastic !== 'plastic') {
      filtered = filtered.filter((project) => project.plastics?.includes(filterPlastic));
    }

    if (filterMachine !== 'machine') {
      filtered = filtered.filter((project) => project.machines?.some((m) => m.includes(filterMachine)));
    }

    setFilteredProjects(filtered);
    setNoProject(filtered.length === 0);
  }, [searchTerm, filterCountry, filterPlastic, filterMachine, projects]);

  return (
    <>
      <div className="plasticProjectBackground">
        <Layout>
          <div className="plasticProjectContainer">
            <div className="plasticProjectTitle">PLASTIC DATABASE</div>

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

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
              {activeTab === 'projects' ? (
                <>
                  <Button
                    variant={projectViewMode === 'small' ? 'contained' : 'outlined'}
                    onClick={() => setProjectViewMode('small')}
                    size="small"
                    style={{
                      color: projectViewMode === 'small' ? 'white' : '#3d7844',
                      borderColor: '#3d7844',
                      backgroundColor: projectViewMode === 'small' ? '#3d7844' : 'transparent',
                      textTransform: 'none',
                    }}
                  >
                    Small
                  </Button>

                  <Button
                    variant={projectViewMode === 'detailed' ? 'contained' : 'outlined'}
                    onClick={() => setProjectViewMode('detailed')}
                    size="small"
                    style={{
                      color: projectViewMode === 'detailed' ? 'white' : '#3d7844',
                      borderColor: '#3d7844',
                      backgroundColor: projectViewMode === 'detailed' ? '#3d7844' : 'transparent',
                      textTransform: 'none',
                    }}
                  >
                    Detailed
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant={machineViewMode === 'small' ? 'contained' : 'outlined'}
                    onClick={() => setMachineViewMode('small')}
                    size="small"
                    style={{
                      color: machineViewMode === 'small' ? 'white' : '#3d7844',
                      borderColor: '#3d7844',
                      backgroundColor: machineViewMode === 'small' ? '#3d7844' : 'transparent',
                      textTransform: 'none',
                    }}
                  >
                    Small
                  </Button>

                  <Button
                    variant={machineViewMode === 'detailed' ? 'contained' : 'outlined'}
                    onClick={() => setMachineViewMode('detailed')}
                    size="small"
                    style={{
                      color: machineViewMode === 'detailed' ? 'white' : '#3d7844',
                      borderColor: '#3d7844',
                      backgroundColor: machineViewMode === 'detailed' ? '#3d7844' : 'transparent',
                      textTransform: 'none',
                    }}
                  >
                    Detailed
                  </Button>
                </>
              )}
            </div>

            <div className="plasticSearchContainer">
              <div className="plasticSearchRow">
              <TextField
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="plasticSearchField"
              />
              
              <Button
                variant="outlined"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  color: '#3d7844',
                  borderColor: '#3d7844',
                  textTransform: 'none',
                }}
              >
                Filters
              </Button>
              </div>

              <div className="plasticUploadRow">
                <Button
                  onClick={() => navigate(uploadButtonRoute)}
                  style={{
                    color: 'black',
                    textTransform: 'none',
                    border: '1px solid grey',
                    backgroundColor: '#e0e0e0',
                  }}
                >
                  {uploadButtonLabel}
                </Button>
              </div>
            </div>

            {showFilters && (
              <div className="plasticFilterPanel">
                <PlasticFilterDropdown value={filterCountry} setValue={setFilterCountry} country={true} />
                <PlasticFilterDropdown value={filterPlastic} setValue={setFilterPlastic} plastic={true} />
                <PlasticFilterDropdown value={filterMachine} setValue={setFilterMachine} machine={true} />
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
              </div>
            ) : noProject ? (
              <div className="no-projects-message">
                <h4>No projects found</h4>
              </div>
            ) : (
              <div className="plasticCardGrid">
                {activeTab === 'projects'
                  ? filteredProjects.map((project) =>
                      projectViewMode === 'small' ? (
                        <div  key={project.project_id} 
                          className="plasticCard"
                          onClick={() => navigate(`/plastic-project/${project.project_id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="plasticCardOutline">
                            <img className="plasticCardImage" src={imageProjectCard} alt={project.project_name} />
                            <div className="plasticCardBody">
                              <div className="plasticCardTitle">{project.project_name}</div>
                              <div className="plasticCardDescription">{project.summary}</div>
                              <div className="plasticCardTags">
                                <b>Year(s): </b>
                                {project.start_date}
                                {project.end_date && ` to ${project.end_date}`}
                                {!project.end_date && ' (ongoing)'}
                              </div>
                              <div className="plasticCardTags">
                                <b>Country: </b>
                                {project.country}
                              </div>
                              <div className="plasticCardTags">
                                <b>Plastics: </b>
                                {project.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>Product: </b>
                                {project.product}
                              </div>
                              <div className="plasticCardLink">View project &rarr;</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={project.project_id} 
                          className="plasticCard"
                          onClick={() => navigate(`/plastic-project/${project.project_id}`)}
                          style={{ cursor: 'pointer' }}
                        >
                          <div className="plasticCardOutline">
                            <img className="plasticCardImage" src={imageProjectCard} alt={project.project_name} />
                            <div className="plasticCardBody">
                              <div className="plasticCardTitle">{project.project_name}</div>
                              <div className="plasticCardDescription">{project.summary}</div>

                              <div className="plasticCardTags">
                                <b>Year(s): </b>
                                {project.start_date} {project.end_date ? ` to ${project.end_date}` : ' (ongoing)'}
                              </div>

                              <div className="plasticCardTags">
                                <b>Country: </b>
                                {project.country}
                              </div>
                              <div className="plasticCardTags">
                                <b>Plastics: </b>
                                {project.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>Product:</b> {project.product}
                              </div>
                              <div className="plasticCardTags">
                                <b>Financing:</b> {project.financing}
                              </div>
                              <div className="plasticCardTags">
                                <b>Business Model:</b> {project.businessModel}
                              </div>
                              <div className="plasticCardTags">
                                <b>Waste Collected:</b> {project.wasteCollected} tons
                              </div>

                              <div className="plasticCardLink">View project →</div>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  : machines.map((machine) =>
                      machineViewMode === 'small' ? (
                        <div key={machine.id} 
                            className="plasticCard"
                            onClick={() => navigate(`/machine/${machine.id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                          <div className="plasticCardOutline">
                            <div className="plasticCardBody">
                              <div className="machineCardTitle">{machine.title}</div>
                              <img
                                className="machineCardImage"
                                src={machine.image || imageProjectCard}
                                alt={machine.title}
                              />
                              <div className="plasticCardTags">
                                <b>Plastic types: </b>
                                {machine.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>What it does: </b>
                                {machine.whatDoes}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={machine.id} className="plasticCard">
                          <div className="plasticCardOutline">
                            <div className="plasticCardBody">
                              <div className="machineCardTitle">{machine.title}</div>
                              <img
                                className="machineCardImage"
                                src={machine.image || imageProjectCard}
                                alt={machine.title}
                              />
                              <div className="plasticCardTags">
                                <b>Plastic types: </b>
                                {machine.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>How does it work and how is it aquired? </b>
                                {machine.howDoes}
                              </div>
                              <div className="plasticCardTags">
                                <b>Operation complications and important lessons from projects: </b>
                                {machine.complicLesson}
                              </div>
                              <div className="plasticCardTags">
                                <b>In use in EWB projects: </b>
                                {machine.inUseEWB}
                              </div>
                            </div>
                          </div>
                        </div>
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
            category1="EWB Norway"
            category2="Legal"
          />
        </Layout>
      </div>
    </>
  );
};

export default PlasticProjects;

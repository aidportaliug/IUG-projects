import React, { useEffect, useState } from 'react';
import './plasticPage.css';
import Layout from '../../components/Navbar/Layout';
import Footer from '../../components/Footer/Footer';
import CircularProgress from '@mui/material/CircularProgress';
import PlasticFilterDropdown from '../../components/PlasticFilterDropdown/PlasticFilterDropdown';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import imageProjectCard from '../../images/plasticProject.png';
import { machinePicture } from '../../models/machineImages';
import { getMachines, MachineResponse } from '../../services/machineService';
import { getPlasticProjects, PlasticProjectResponse, projectImageHref } from '../../services/plasticService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { canUploadProjects } from '../../services/auth';
import { useI18n } from '../../i18n/I18nContext';
import PlasticProjectCard, { uploadButtonSx } from '../../components/PlasticProjectCards/PlasticProjectCard';

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
  image?: string;
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

// Sorted, de-duplicated filter values taken from the loaded data.
const uniqueSorted = (values: string[]): string[] =>
  Array.from(new Set(values.filter((value) => value.trim() !== ''))).sort((a, b) => a.localeCompare(b));

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
  const { t } = useI18n();
  const uploadButtonLabel = activeTab === 'machines' ? t.plastic.uploadMachine : t.plastic.uploadProject;
  const uploadButtonRoute = activeTab === 'machines' ? '/uploadMachine' : '/UploadPlasticProject';
  // Machines are added by the admin; projects by students, professors and the admin.
  const { user } = useAuth();
  const showUploadButton = activeTab === 'machines' ? !!user?.isAdmin : canUploadProjects(user);

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
          image: machinePicture(machine),
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
            image: projectImageHref(project),
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
      filtered = filtered.filter((project) => project.machines?.includes(filterMachine));
    }

    setFilteredProjects(filtered);
    setNoProject(filtered.length === 0);
  }, [searchTerm, filterCountry, filterPlastic, filterMachine, projects]);

  return (
    <>
      <div className="plasticProjectBackground">
        <Layout>
          <div className="plasticProjectContainer">
            <div className="plasticProjectTitle">{t.plastic.title}</div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
              <Button
                variant={activeTab === 'projects' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('projects')}
              >
                {t.plastic.projectsTab}
              </Button>

              <Button
                variant={activeTab === 'machines' ? 'contained' : 'outlined'}
                onClick={() => setActiveTab('machines')}
              >
                {t.plastic.machinesTab}
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
                    {t.plastic.small}
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
                    {t.plastic.detailed}
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
                    {t.plastic.small}
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
                    {t.plastic.detailed}
                  </Button>
                </>
              )}
            </div>

            <div className="plasticSearchContainer">
              <div className="plasticSearchRow">
                <TextField
                  placeholder={t.plastic.search}
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
                  {t.plastic.filters}
                </Button>
              </div>

              {showUploadButton && (
                <div className="plasticUploadRow">
                  <Button onClick={() => navigate(uploadButtonRoute)} sx={uploadButtonSx}>
                    {uploadButtonLabel}
                  </Button>
                </div>
              )}
            </div>

            {showFilters && (
              <div className="plasticFilterPanel">
                <PlasticFilterDropdown
                  value={filterCountry}
                  setValue={setFilterCountry}
                  country={true}
                  label={t.filters.country}
                  allLabel={t.filters.allCountries}
                  options={uniqueSorted(projects.map((project) => project.country))}
                />
                <PlasticFilterDropdown
                  value={filterPlastic}
                  setValue={setFilterPlastic}
                  plastic={true}
                  label={t.filters.plastic}
                  allLabel={t.filters.allPlastics}
                  options={uniqueSorted(projects.flatMap((project) => project.plastics ?? []))}
                />
                <PlasticFilterDropdown
                  value={filterMachine}
                  setValue={setFilterMachine}
                  machine={true}
                  label={t.filters.machine}
                  allLabel={t.filters.allMachines}
                  options={uniqueSorted(machines.map((machine) => machine.title))}
                />
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <CircularProgress />
              </div>
            ) : noProject ? (
              <div className="no-projects-message">
                <h4>{t.plastic.noProjects}</h4>
              </div>
            ) : (
              <div className="plasticCardGrid">
                {activeTab === 'projects'
                  ? filteredProjects.map((project) => (
                      <PlasticProjectCard
                        key={project.project_id}
                        variant={projectViewMode}
                        name={project.project_name}
                        summary={project.summary}
                        startDate={project.start_date}
                        endDate={project.end_date}
                        country={project.country}
                        plastics={project.plastics ?? []}
                        product={project.product}
                        financing={project.financing}
                        businessModel={project.businessModel}
                        wasteCollected={project.wasteCollected}
                        image={project.image}
                        onClick={() => navigate(`/plastic-project/${project.project_id}`)}
                      />
                    ))
                  : machines.map((machine) =>
                      machineViewMode === 'small' ? (
                        <div
                          key={machine.id}
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
                                <b>{t.plastic.plasticTypes} </b>
                                {machine.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>{t.plastic.whatItDoes} </b>
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
                                <b>{t.plastic.plasticTypes} </b>
                                {machine.plastics?.map((p) => (
                                  <span key={p} className="plasticTag">
                                    {p}
                                  </span>
                                ))}
                              </div>
                              <div className="plasticCardTags">
                                <b>{t.plastic.howItWorks} </b>
                                {machine.howDoes}
                              </div>
                              <div className="plasticCardTags">
                                <b>{t.plastic.lessons} </b>
                                {machine.complicLesson}
                              </div>
                              <div className="plasticCardTags">
                                <b>{t.plastic.inUse} </b>
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
          <Footer />
        </Layout>
      </div>
    </>
  );
};

export default PlasticProjects;

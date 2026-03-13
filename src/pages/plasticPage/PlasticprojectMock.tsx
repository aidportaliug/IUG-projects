import React, { useState, useEffect } from 'react';
import './plasticPage.css';
import Layout from '../../components/Navbar/Layout';
import Footer from '../../components/Footer/Footer';
import CircularProgress from '@mui/material/CircularProgress';
// import PlasticFilterDropdown from '../../components/PlasticFilterDropdown/PlasticFilterDropdown';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import imageProjectCard from '../../images/plasticProject.png';
import { title } from 'process';
import polyfloss from '../../images/polyfloss.png';
import melter from '../../images/melter.png';
import shredder from '../../images/shredder.png';
import ventilation from '../../images/ventilation.jpg';

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

//MOCK DATA needs to be replaced with gradle r something later
const MOCK_PROJECTS: PlasticProjectData[] = [
  {
    project_id: '1',
    project_name: 'Community Recycling Initiative',
    start_date: '2023-01-15',
    end_date: '2023-12-31',
    country: 'Kenya',
    project_use: 'Waste management and product creation',
    electricity: true,
    summary: 'Transforming plastic waste into useful products for local communities',
    plastics: ['HDPE', 'PP'],
    machines: ['Shredder', 'Compression Press'],
    product: 'product 1',
    financing: 'Money',
    businessModel: 'Niche',
    partnershipOwnership: 'adadaddad',
    wasteCollected: 43,
  },
  {
    project_id: '2',
    project_name: 'School Building Blocks',
    start_date: '2023-03-20',
    country: 'Tanzania',
    project_use: 'Educational infrastructure',
    electricity: false,
    summary: 'Creating building materials for schools from recycled plastic',
    plastics: ['PET', 'LDPE'],
    machines: ['Shredder', 'Extruder'],
    product: 'product 1',
    financing: 'Money',
    businessModel: 'Niche',
    partnershipOwnership: 'adadaddad',
    wasteCollected: 43,
  },
  {
    project_id: '3',
    project_name: 'Roof Tile Production',
    start_date: '2023-05-10',
    end_date: '2024-05-10',
    country: 'Uganda',
    project_use: 'Housing improvement',
    electricity: true,
    summary: 'Producing durable roof tiles from plastic waste',
    plastics: ['HDPE', 'PP', 'PS'],
    machines: ['Shredder', 'Compression Press', 'Molder'],
    product: 'product 1',
    financing: 'Money',
    businessModel: 'Niche',
    partnershipOwnership: 'adadaddad',
    wasteCollected: 43,
  },
  {
    project_id: '4',
    project_name: 'Furniture Workshop',
    start_date: '2023-07-01',
    country: 'Rwanda',
    project_use: 'Furniture production',
    electricity: true,
    summary: 'Making chairs and tables from recycled plastic',
    plastics: ['PP', 'HDPE'],
    machines: ['Shredder', 'Extruder'],
    product: 'product 1',
    financing: 'Money',
    businessModel: 'Niche',
    partnershipOwnership: 'adadaddad',
    wasteCollected: 43,
  },
  {
    project_id: '5',
    project_name: 'Paving Stones',
    start_date: '2023-09-15',
    country: 'Kenya',
    project_use: 'Construction materials',
    electricity: false,
    summary: 'Creating paving stones for pathways',
    plastics: ['LDPE', 'PET'],
    machines: ['Shredder', 'Compression Press'],
    product: 'product 1',
    financing: 'Money',
    businessModel: 'Niche',
    partnershipOwnership: 'adadaddad',
    wasteCollected: 43,
  },
];

const MOCK_MACHINES: MachineData[] = [
  {
    id: '1',
    title: 'Polyfloss',
    image: polyfloss,
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '2',
    title: 'Oven/melter',
    image: melter,
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '3',
    title: 'Grinder/shredder',
    image: shredder,
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '4',
    title: 'Ventilation',
    image: ventilation,
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '5',
    title: 'Extruder',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '6',
    title: 'Injection mold',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '7',
    title: 'Baler',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '8',
    title: 'Bottle preparation tool',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '9',
    title: 'Heat gun',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '10',
    title: 'NIR (Near infrared detection)',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '11',
    title: 'Washing',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
  {
    id: '12',
    title: 'Other',
    whatDoes: 'Goes around and around',
    howWork: 'pull the switch to make it work',
    plastics: ['LDPE', 'PET'],
    howDoes: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    complicLesson: 'oanefnofiaffnafnoindnoisNFPSinfoanurwknvryceNQISRGNBVENUMRBTDNBVE',
    inUseEWB: 'Waste for warmth',
  },
];

const PlasticProject: React.FC = () => {
  // Top tab state
  const [activeTab, setActiveTab] = useState<'projects' | 'machines'>('projects');

  // View mode state
  const [projectViewMode, setProjectViewMode] = useState<'small' | 'detailed'>('small');
  const [machineViewMode, setMachineViewMode] = useState<'small' | 'detailed'>('small');

  const [machines, setMachines] = useState<MachineData[]>(MOCK_MACHINES);

  const [projects, setProjects] = useState<PlasticProjectData[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PlasticProjectData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('country');
  const [filterPlastic, setFilterPlastic] = useState('plastic');
  const [filterMachine, setFilterMachine] = useState('machine');
  const [loading, setLoading] = useState(false);
  const [noProject, setNoProject] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setProjects(MOCK_PROJECTS);
      setFilteredProjects(MOCK_PROJECTS);
      setNoProject(MOCK_PROJECTS.length === 0);
      setLoading(false);
    }, 500);
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

            {/* Small / Detailed toggle */}
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

            {/*showFilters && (
              <div className="plasticFilterPanel">
                <PlasticFilterDropdown value={filterCountry} setValue={setFilterCountry} country={true} />
                <PlasticFilterDropdown value={filterPlastic} setValue={setFilterPlastic} plastic={true} />
                <PlasticFilterDropdown value={filterMachine} setValue={setFilterMachine} machine={true} />
              </div>
            )*/}

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
                        // SMALL PROJECT CARD
                        <div key={project.project_id} className="plasticCard">
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
                        // DETAILED PROJECT CARD
                        <div key={project.project_id} className="plasticCard">
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
                        // SMALL MACHINE CARD
                        <div key={machine.id} className="plasticCard">
                          <div className="plasticCardOutline">
                            <div className="plasticCardBody">
                              <div className="machineCardTitle">{machine.title}</div>
                              <img className="machineCardImage" src={machine.image} />
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
                        // DETAILED MACHINE CARD
                        <div key={machine.id} className="plasticCard">
                          <div className="plasticCardOutline">
                            <div className="plasticCardBody">
                              <div className="machineCardTitle">{machine.title}</div>
                              <img className="machineCardImage" src={machine.image} />
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

export default PlasticProject;

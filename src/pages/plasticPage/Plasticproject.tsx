import React, { useState, useEffect } from 'react';
import './plasticPage.css';
import Layout from '../../components/Navbar/Layout';
import Footer from '../../components/Footer/Footer';
import CircularProgress from '@mui/material/CircularProgress';
import PlasticFilterDropdown from '../../components/PlasticFilterDropdown/PlasticFilterDropdown';
import { TextField, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import imageProjectCard from '../../images/Trax_Ghana.png';

interface PlasticProjectData {
  project_id: string;
  project_name: string;
  start_date: string;
  end_date?: string;
  country: string;
  project_use: string;
  electricity: boolean;
  summary?: string;
  plastics?: string[];
  machines?: string[];
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
  },
];

const PlasticProject: React.FC = () => {
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
      filtered = filtered.filter((project) =>
        project.machines?.some((m) => m.includes(filterMachine))
      );
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
                {filteredProjects.map((project) => (
                  <div key={project.project_id} className="plasticCard">
                    <div className="plasticCardOutline">
                      <img className="plasticCardImage" src={imageProjectCard} alt={project.project_name} />
                      <div className="plasticCardBody">
                        <div className="plasticCardTitle">{project.project_name}</div>
                        <div className="plasticCardDescription">{project.summary}</div>
                        <div className="plasticCardTags">
                          {project.plastics?.map((p) => (
                            <span key={p} className="plasticTag">{p}</span>
                          ))}
                        </div>
                        <div className="plasticCardLink">View project &rarr;</div>
                      </div>
                    </div>
                  </div>
                ))}
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

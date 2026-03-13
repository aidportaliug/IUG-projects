const BackendConfig = {
  baseURL: 'http://localhost:8080',
  endpoint: {
    // Auth endpoints
    login: '/login',
    register: '/register',
    me: '/me',

    // Project endpoints
    GetProjectById: '/projects/',
    GetAllProjects: '/projects',
    createProject: '/projects',
    updateProject: '/projects',
    deleteProject: '/projects',

    // Report endpoints
    getAllReports: '/reports',
    getReportById: '/reports/',
    createReport: '/reports',
    updateReport: '/reports/',
    deleteReport: '/reports/',

    // Plastic endpoints
    getAllPlastics: '/plastics',
    getPlasticById: '/plastics/',
    createPlastic: '/plastics',
    updatePlastic: '/plastics/',
    deletePlastic: '/plastics/',

    getAllPlasticProjects: '/plastic-projects',
    getPlasticProjectById: '/plastic-projects/',
    createPlasticProject: '/plastic-projects',
    updatePlasticProject: '/plastic-projects/',
    deletePlasticProject: '/plastic-projects/',

    // Machine endpoints
    getAllMachines: '/machines',
    getMachineById: '/machines/',
    createMachine: '/machines',
    updateMachine: '/machines/',
    deleteMachine: '/machines/',
  },
};

export default BackendConfig;

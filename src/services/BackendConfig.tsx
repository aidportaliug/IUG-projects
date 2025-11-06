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
  },
};

export default BackendConfig;

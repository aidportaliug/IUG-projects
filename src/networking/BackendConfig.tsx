const BackendConfig = {
  baseURL: "http://localhost:8000",
  endpoint: {
    GetProjectById: "/projects/",
    GetAllProjects: "/projects",
    createProject: "/projects",
    updateProject: "/projects",
    getAllReports: "/reports",
    getReportById: "/reports/",
    createReport: "/reports",
    updateReport: "/reports/",
    getUserById: "/users/",
    updateUser: "/users/",
  },
};

export default BackendConfig;

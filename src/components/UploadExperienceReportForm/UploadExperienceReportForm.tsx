import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "../../services/reportService";
import { getProjects } from "../../services/getProjects";
import "./uploadExperienceReportForm.css";

export const UploadExperienceReportForm = () => {
  const [duration, setDuration] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    }
    fetchProjects();
  }, []);

  const handleCancel = () => {
    navigate('/');
  };

  const handleSaveAsDraft = () => {
    alert('Draft functionality not implemented yet');
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setLoading(true);

    try {
      const projectTitle = data.get('projectTitle') as string;
      const shortTitle = data.get('shortTitle') as string;
      const description = data.get('description') as string;
      const summaryDescription = data.get('summaryDescription') as string;
      const durationValue = data.get('duration') as string;
      const thesisLink = data.get('thesisLink') as string;
      const projectId = data.get('project') as string;
      const year = data.get('year') as string;
      const studyField = data.get('studyField') as string;
      const location = data.get('location') as string;

      if (!projectId) {
        alert('Please select a project');
        setLoading(false);
        return;
      }

      await createReport({
        title: projectTitle,
        shortTitle: shortTitle || undefined,
        content: description,
        summaryDescription: summaryDescription || undefined,
        projectId: parseInt(projectId),
        studyField: studyField || 'general',
        location: location || 'global',
        year: year ? parseInt(year) : undefined,
        duration: durationValue ? parseInt(durationValue) : 0,
        thesisLink: thesisLink || undefined
      });

      alert('Successfully uploaded report');
      navigate('/experienceReports');
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <div className="form-header">
        <button type="button" className="header-button" onClick={handleCancel}>
          Cancel
        </button>
        <h1 className="form-title">YOUR EXPERIENCE</h1>
        <button type="button" className="header-button" onClick={handleSaveAsDraft}>
          Save as draft
        </button>
      </div>

      <form onSubmit={handleUpload}>
        <div className="form-group full-width">
          <label htmlFor="project" className="label-text">
            Select Project
          </label>
          <select
            id="project"
            name="project"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="select-field"
            required
          >
            <option value="">Select a project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label htmlFor="projectTitle" className="label-text">
            Report Title
          </label>
          <input
            id="projectTitle"
            name="projectTitle"
            className="input-field"
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="shortTitle" className="label-text">
            Short Title
          </label>
          <input
            id="shortTitle"
            name="shortTitle"
            className="input-field"
          />
        </div>

        <div className="form-group full-width">
          <div className="label-with-line">
            <span>Description/Content</span>
          </div>
          <textarea
            id="description"
            name="description"
            className="textarea-field"
            rows={8}
            required
          />
        </div>

        <div className="form-group full-width">
          <label htmlFor="summaryDescription" className="label-text">
            Summary description
          </label>
          <textarea
            id="summaryDescription"
            name="summaryDescription"
            className="textarea-field"
            rows={4}
          />
        </div>

        <div className="form-group">
          <div style={{ flex: 1 }}>
            <label htmlFor="studyField" className="label-text">
              Study Field
            </label>
            <select
              id="studyField"
              name="studyField"
              className="select-field"
            >
              <option value="general">General</option>
              <option value="it">IT</option>
              <option value="construction_and_infrastructure">Construction and infrastructure</option>
              <option value="geotechnics">Geotechnics</option>
              <option value="machine_and_process_engineering">Machine and process engineering</option>
              <option value="clean_energy">Clean Energy</option>
              <option value="water_and_sanitation">Water and sanitation</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="location" className="label-text">
              Location
            </label>
            <select
              id="location"
              name="location"
              className="select-field"
            >
              <option value="global">Global</option>
              <option value="europe">Europe</option>
              <option value="asia">Asia</option>
              <option value="africa">Africa</option>
              <option value="south_america">South America</option>
              <option value="north_america">North America</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div style={{ flex: 1 }}>
            <label htmlFor="year" className="label-text">
              Year
            </label>
            <input
              type="number"
              id="year"
              name="year"
              className="input-field"
              placeholder="e.g., 2024"
              min="2000"
              max="2100"
            />
          </div>
          <div style={{ flex: 1 }}>
            <label htmlFor="duration" className="label-text">
              Duration
            </label>
            <select
              id="duration"
              name="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="select-field"
              required
            >
              <option value="">Select duration</option>
              <option value="1">1 month</option>
              <option value="2">2 months</option>
              <option value="3">3 months</option>
              <option value="6">6 months</option>
              <option value="12">12 months</option>
            </select>
          </div>
        </div>

        <div className="form-group full-width">
          <label htmlFor="thesisLink" className="label-text">
            Thesis Link
          </label>
          <input
            id="thesisLink"
            name="thesisLink"
            className="input-field"
            type="url"
            placeholder="https://example.com/thesis.pdf"
          />
        </div>

        <div className="divider"></div>

        <div className="button-group">
          <button type="submit" className="upload-button" disabled={loading}>
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadExperienceReportForm;
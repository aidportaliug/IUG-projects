import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./uploadExperienceReportForm.css";

export const UploadExperienceReportForm = () => {
  const [duration, setDuration] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/');
  };

  const handleSaveAsDraft = () => {
    alert('Saved as draft');
  };

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      const projectTitle = data.get('projectTitle') as string;
      const description = data.get('description') as string;
      const summaryDescription = data.get('summaryDescription') as string;
      const durationValue = data.get('duration') as string;
      const thesisLink = data.get('thesisLink') as string;

      // Simulate API call - replace with your actual service
      console.log({
        projectTitle,
        description,
        summaryDescription,
        duration: durationValue,
        thesisLink,
      });

      alert('Successfully uploaded');
      navigate('/');
    } catch (error) {
      console.log(error as string);
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
          <label htmlFor="projectTitle" className="label-text">
            Project Title
          </label>
          <input
            id="projectTitle"
            name="projectTitle"
            className="input-field"
            required
          />
        </div>

        <div className="form-group full-width">
          <div className="label-with-line">
            <span>Description</span>
          </div>
          <textarea
            id="description"
            name="description"
            className="textarea-field"
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
            required
          />
        </div>

        <div className="form-group">
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
          <div style={{ flex: 1 }}>
            <label htmlFor="thesisLink" className="label-text">
              Thesis Link
            </label>
            <input
              id="thesisLink"
              name="thesisLink"
              className="input-field"
              required
            />
          </div>
        </div>

        <div className="divider"></div>

        <div className="button-group">
          <button type="submit" className="upload-button">
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};
export default UploadExperienceReportForm;
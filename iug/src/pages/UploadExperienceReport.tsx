import React from "react";
import "../styles/uploadProject.css";
import UploadExperienceReportForm from "../components/UploadExperienceReportForm";
import { useFirebaseAuth } from "../services/AuthContext";
const UploadExperienceReport = () => {
  //const [user, setUser] = useState<User | null>(null)
  const { user } = useFirebaseAuth();
  if (user) {
    return (
      <div className="outline">
        <div className="title"> Upload Experience Report </div>
        <UploadExperienceReportForm />
      </div>
    );
  }
  return <div>You must be logged in</div>;
};

export default UploadExperienceReport;

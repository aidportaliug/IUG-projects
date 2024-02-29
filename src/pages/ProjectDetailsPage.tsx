import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfessorCard from "../components/ProfessorCard";
import { Project } from "../models/project";
import { getProject } from "../services/getProject";
import InformationBox from "../components/ProjectDetail/InformationBox";
import "../styles/projectDetail.css";
import Trax_Ghana from "./../images/Trax_Ghana.png";
import ProjectImageBox from "../components/ProjectImageBox";
import Meta from "../components/Meta";


const ProjectDetailsPage: React.FC = () => {
  const name = "Trond Are Øritsland";
  const professionalTitle = "Førsteamanuensis";
  const institute = "Institutt for design";
  const email = "trond.are.oritsland@ntnu.no";
  const phoneNumber = "+47 90783975";
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>();
  const imageIcon = Trax_Ghana;

  async function getProjectData(projectId: string) {
    const project = await getProject(projectId);
    setProject(project);
  }
  useEffect(() => {
    if (id) {
      getProjectData(id);
    }
  }, [id]);
  if (project != null) {
    return (
        <>
      <Meta title={"Your profile"}></Meta>
      <div className="projectDetailoutline">
        <div className="Title">{project?.title}</div>
        <ProjectImageBox source={imageIcon} altText={"String"} />
        <Grid container spacing={10}>
          <Grid item xs={8}>
            <img className="projectDetailImage" src={imageIcon} alt="" />
          </Grid>
          <Grid item xs={4}>
            <ProfessorCard
              name={name}
              professionalTitle={professionalTitle}
              institute={institute}
              email={email}
              phoneNumber={phoneNumber}
            />
          </Grid>
        </Grid>
        <InformationBox
          deadline={project.deadline.toDate()}
          location={project.location}
          duration={project.duration}
          studyField={project.studyField}
        ></InformationBox>
        <div style={{ width: "70%", fontSize: "15px" }}>
          {project.description}
        </div>
      </div>
      </>
    );
  }
  return <div>404: page not found</div>;
};

export default ProjectDetailsPage;

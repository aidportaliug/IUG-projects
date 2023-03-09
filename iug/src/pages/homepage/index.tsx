import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "../../styles/homepage.css"
import { getProjects } from "../../services/getProjects";
import { Project } from "../../models/project";
import { studyFields, locations } from "../../models/allowedValues";


function Home() {
  const imagePath : string = "./../../images/Trax_Ghana.png"
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    async function fetchData() {
      const projects = await getProjects();
      setProjects(projects);
    }

    fetchData();
  },[]);


  return (
    <div className="homeBackground">
      <div className="homeOutline">
        <div className="homeTitle"> Projects </div>
        <div className="rowHome">
          {projects.map((project)=>(
            <ProjectCard key={project.id} id={project.id} title={project.shortTitle ?? project.title} description={project.summaryDescription ?? project.description} date={project.deadline.toDate()} topics={[studyFields[project.studyField as keyof typeof studyFields],locations[project.location as keyof typeof locations]]} imagePath = {imagePath}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;

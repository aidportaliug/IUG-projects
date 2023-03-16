import React, { useEffect, useState } from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "../../styles/homepage.css"
import { getProjects } from "../../services/getProjects";
import { Project } from "../../models/project";
import { studyFields, locations } from "../../models/allowedValues";
import FilterDropdown from "../../components/FilterDropdown";

function Home() {
  const imagePath : string = "./../../images/Trax_Ghana.png"
  const [projects, setProjects] = useState<Project[]>([]);
  const [orderBy, setOrderBy] = useState<string>("deadline")
  const [filterLocation, setFilterLocation] = useState<string>("location")
  const [filterStudyField, setFilterStudyField] = useState<string>("study_field")

  useEffect(() => {
    async function fetchData() {
      const projects = await getProjects(orderBy, filterLocation,filterStudyField);
      setProjects(projects);
    }

    fetchData();
  },[filterLocation, filterStudyField, orderBy]);

  return (
    <div className="homeBackground">
      <div className="homeOutline">
        <div className="homeTitle"> Projects </div>
          <FilterDropdown value={orderBy} setValue={setOrderBy} sortBy={true} />
          <FilterDropdown value={filterLocation} setValue={setFilterLocation} location={true} />
          <FilterDropdown value={filterStudyField} setValue={setFilterStudyField} studyField={true} />
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

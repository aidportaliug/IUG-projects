import React from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import "../../styles/homepage.css"



function Home() {
  const description : string  = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id dui sit amet diam convallis facilisis ut non magna. Integer a turpis elit. "
  const date : Date = new Date()
  const topics : string[] = ["MTDT", "Spain"]
  const imagePath : string = "./../../images/Trax_Ghana.png"
  return (
    <div className="homeBackground">
      <div className="homeOutline">
        <div className="homeTitle"> Projects </div>
        <div className="row">
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
          <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
        </div>
      </div>
    </div>
  );
}

export default Home;

import React from "react";
import ProjectCard from "../../components/ProjectCard/ProjectCard";
import Header from "../../components/header";


function Home() {
  const description : string  = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id dui sit amet diam convallis facilisis ut non magna. Integer a turpis elit. "
  const date : Date = new Date()
  const topics : string[] = ["topic 1", "topic 2", "topic 3", "fisk"]
  const imagePath : string = "./../../images/Trax_Ghana.png"
  return (
<>
  <Header/>
    <ProjectCard title = "PROJECT ONE" description = {description} date = {date} topics = {topics} imagePath = {imagePath}/>
    <div className="home">
      <div className="container">
        <div className="row align-items-center my-5">
          <div className="col-lg-7">
            <img
              className="img-fluid rounded mb-4 mb-lg-0"
              src="http://placehold.it/900x400"
              alt=""
            />
          </div>
          <div className="col-lg-5">
            <h1 className="font-weight-light">Home</h1>
            <p>
              Heisann. Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;

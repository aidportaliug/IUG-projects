import React from 'react';
import "../../styles/projectCard.css"
import CalandarDate from "../CalanderDate";
import TopicTag from "./TopicTag";

interface projectProps {
    title: string;
    description: string;
    date: Date;
    topics: string[]
    imagePath: string
}

const ProjectCard = ({title, description, date, topics, imagePath} : projectProps) => {
    const imageProjectCard = require("./../../images/Trax_Ghana.png");
    var topicsDivs = topics.map(function(topic){
        return <TopicTag key={topic} topic={topic}/>;
      })

    return(
        <div className="projectCardContainer">
                <div className = "projectOutline">
                    <img className = "projectPicture" src = {imageProjectCard} alt="Project card"/>
                    <div className = "projectText"> {title} </div>
                    <div className = "projectDescription"> {description} </div>
                </div>
            <div className = "projectCardBottomRow">
                {topicsDivs}
                <div className="alignRight">
                    <CalandarDate date={date}/>
                </div>
            </div>
        </div>
    )
};
export default ProjectCard

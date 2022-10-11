import React from 'react';
import "./projectCard.css"
import CalandarDate from "../CalanderDate";
import TopicTag from "./TopicTag";

const ProjectCard : React.FC = () => {
    const imageProjectCard = require("./../../images/Trax_Ghana.png");
    return(
        <div className="projectCardContainer">
            <div className="flexColumn">
                <div className = "projectOutline">
                    <img className = "projectPicture" src = {imageProjectCard} alt="Project card"/>
                    <div className = "projectText"> Project One </div>
                    <div className = "projectDescription"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean id dui sit amet diam convallis facilisis ut non magna. Integer a turpis elit.</div>
                </div>
            </div>
            <div className = "projectCardBottomRow">
                <TopicTag topic="Topic 1"/>
                <TopicTag topic="Topic 2"/>
                <div className="alignRight">
                <CalandarDate/>
                </div>
            </div>
        </div>
    )
};
export default ProjectCard

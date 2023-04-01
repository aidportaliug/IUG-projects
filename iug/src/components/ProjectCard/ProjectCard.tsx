import React from "react";
import "../../styles/projectCard.css";
import CalandarDate from "../CalanderDate";
import TopicTag from "./TopicTag";
import { useNavigate } from "react-router-dom";
import imageProjectCard from "./../../images/Trax_Ghana.png";

interface projectProps {
  title: string;
  description: string;
  date: Date;
  topics: string[];
  imagePath: string;
  id: string;
}

const ProjectCard = ({
  title,
  description,
  date,
  topics,
  imagePath,
  id,
}: projectProps) => {
  const navigate = useNavigate();
  const topicsDivs = topics.map(function (topic) {
    return <TopicTag key={topic} topic={topic} />;
  });

  function sendToProjectPage() {
    navigate(`/project/${id}`);
  }

  return (
    <div className="projectCardContainer" onClick={sendToProjectPage}>
      <div className="projectOutline">
        <img
          className="projectPicture"
          src={imageProjectCard}
          alt="Project card"
        />
        <div className="projectText"> {title} </div>
        <div className="projectDescription"> {description} </div>
      </div>
      <div className="projectCardBottomRow">
        {topicsDivs}
        <div className="alignRight">
          <CalandarDate date={date} />
        </div>
      </div>
    </div>
  );
};
export default ProjectCard;

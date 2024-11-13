import React from 'react';
import './projectCard.css';
import CalendarDate from '../CalendarDate/CalendarDate';
import TopicTag from './TopicTag';
import { useNavigate } from 'react-router-dom';
import imageProjectCard from './../../images/Trax_Ghana.png';

interface ProjectProps {
  title: string;
  description: string;
  date: Date;
  topics: string[];
  imagePath: string;
  id: string;
}

const ProjectCard: React.FC<ProjectProps> = ({ title, description, date, topics, imagePath, id }) => {
  const navigate = useNavigate();

  const topicsDivs = topics.map((topic) => <TopicTag key={topic} topic={topic} />);

  const sendToProjectPage = () => {
    navigate(`/project/${id}`);
  };

  return (
    <div className="projectCardContainer" onClick={sendToProjectPage}>
      <div className="projectOutline">
        <img className="projectPicture" src={imageProjectCard} alt="Project card" />
        <div className="projectText">{title}</div>
        <div className="projectDescription">{description}</div>
        <div className="wrapperTopicTagDate">
          <div className="topicDivs">{topicsDivs}</div>
          <CalendarDate date={date} />
        </div>
      </div>
      <div className="projectCardBottomRow"></div>
    </div>
  );
};

export default ProjectCard;

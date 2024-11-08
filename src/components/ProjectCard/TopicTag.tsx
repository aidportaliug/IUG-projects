import './projectCard.css';
import React from 'react';

interface topicTagInterface {
  topic: string;
}

const ProjectCard: React.FC<topicTagInterface> = ({ topic }: topicTagInterface) => {
  return <div className="topicTag"> {topic}</div>;
};
export default ProjectCard;

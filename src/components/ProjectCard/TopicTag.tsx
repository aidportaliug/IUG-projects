import './projectCard.css';

interface topicTagInterface {
  topic: string;
}

const ProjectCard = ({ topic }: topicTagInterface) => {
  return <div className="topicTag"> {topic}</div>;
};
export default ProjectCard;

import React from 'react';
import "./projectCard.css"

interface topicTagInterface{
    topic: string
}

const ProjectCard : React.FC <topicTagInterface> = ( { topic } ) => {
    return(

        <div className = "topicTag"> {topic}</div>
    )
};
export default ProjectCard

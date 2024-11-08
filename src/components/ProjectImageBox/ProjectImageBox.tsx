import React from 'react';
import './projectImageBox.css';

interface ProjectImageBoxProps {
  source: string;
  altText: string;
}

const ProjectImageBox: React.FC<ProjectImageBoxProps> = ({ source, altText }) => {
  return (
    <div className="projectImageBox">
      <img src={source} alt={altText} />
    </div>
  );
};

export default ProjectImageBox;

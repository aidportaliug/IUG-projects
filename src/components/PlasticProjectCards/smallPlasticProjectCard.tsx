import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageProjectCard from './../../images/plasticProject.png';
import './../ProjectCard/projectCard.css';

interface SmallPlasticProjectProps {
  id: string;
  title: string;
  picturePath: string;
  country: String;
  year: number;
  plasticType: string;
  product: string;
}

const SmallPlasticProjectCard: React.FC<SmallPlasticProjectProps> = ({
  id,
  title,
  picturePath,
  country,
  year,
  plasticType,
  product,
}) => {
  const navigate = useNavigate();

  const sendToPlasticProjectPage = () => {
    navigate(`/login`);
  };

  return (
    <div className="projectCardContainer" onClick={sendToPlasticProjectPage}>
      <div className="projectOutline">
        <img className="projectPicture" src={imageProjectCard} alt="Project card" />
        <div className="projectTitle">{title}</div>
        <div className="projectDescription">
          <b>Country: </b>
          {country}
        </div>
        <div className="projectDescription">
          <b>Year(s): </b>
          {year}
        </div>
        <div className="projectDescription">
          <b>Plastic type: </b>
          {plasticType}
        </div>
        <div className="projectDescription">
          <b>Product: </b>
          {product}
        </div>
      </div>
      <div className="projectCardBottomRow"></div>
    </div>
  );
};

export default SmallPlasticProjectCard;

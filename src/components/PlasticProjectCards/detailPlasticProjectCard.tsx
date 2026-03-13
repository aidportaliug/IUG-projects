import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageProjectCard from './../../images/plasticProject.png';

interface SmallPlasticProjectProps {
  id: string;
  title: string;
  country: String;
  year: number;
  plasticType: string;
  product: string;
  processing: string;
  financing: string;
  businessModel: string;
  partnershipOwnership: string;
  wasteCollected: number;
}

const SmallPlasticProjectCard: React.FC<SmallPlasticProjectProps> = ({
  id,
  title,
  country,
  year,
  plasticType,
  product,
  processing,
  financing,
  businessModel,
  partnershipOwnership,
  wasteCollected,
}) => {
  const navigate = useNavigate();

  const sendToPlasticProjectPage = () => {
    navigate(`/signUp/}`);
  };

  return (
    <div className="projectCardContainer" onClick={sendToPlasticProjectPage}>
      <div className="projectOutline">
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
        <div className="projectDescription">
          <b>Processing: </b>
          {processing}
        </div>
        <div className="projectDescription">
          <b>Financing: </b>
          {financing}
        </div>
        <div className="projectDescription">
          <b>Business model: </b>
          {businessModel}
        </div>
        <div className="projectDescription">
          <b>Partnership/Ownership: </b>
          {partnershipOwnership}
        </div>
        <div className="projectDescription">
          <b>Waste collected: </b>
          {wasteCollected}
        </div>
      </div>
      <div className="projectCardBottomRow"></div>
    </div>
  );
};

export default SmallPlasticProjectCard;

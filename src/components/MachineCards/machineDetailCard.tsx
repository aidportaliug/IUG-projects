import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageProjectCard from './../../images/machineEx.png';

interface DetailedMachineProps {
  id: string;
  title: string;
  picturePath: string;
  whatDoes: string;
  howWork: string;
  plasticType: string;
  howDoes: string;
  complicLesson: string;
  inUseEWB: string;
}

const DetailedMachineCard: React.FC<DetailedMachineProps> = ({
  id,
  title,
  picturePath,
  plasticType,
  whatDoes,
  howDoes,
  howWork,
  complicLesson,
  inUseEWB,
}) => {
  const navigate = useNavigate();

  const sendToMachinePage = () => {
    navigate(`/signUp/}`);
  };

  return (
    <div className="projectCardContainer" onClick={sendToMachinePage}>
      <div className="projectOutline">
        <div className="projectTitle">{title}</div>

        <div style={{ display: 'flex', flexDirection: 'row', flex: 2, marginTop: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="projectDescription">
              <b>Plastic type: </b>
              {plasticType}
            </div>
            <div className="projectDescription">
              <b>What it does: </b>
              {whatDoes}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <img className="projectPicture" src={imageProjectCard} alt="Project card" />
          </div>
        </div>

        <div className="projectDescription">
          <b>How does it work and how is it required: </b>
          {howDoes}
        </div>
        <div className="projectDescription">
          <b>Operation complications and important lessons from projects: </b>
          {complicLesson}
        </div>
      </div>
      <div className="projectCardBottomRow"></div>
    </div>
  );
};

export default DetailedMachineCard;

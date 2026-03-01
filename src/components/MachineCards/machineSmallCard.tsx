import React from 'react';
import { useNavigate } from 'react-router-dom';
import imageProjectCard from './../../images/machineEx.png';

interface SmallMachineProps {
    id: string;
    title: string;
    picturePath: string;
    whatDoes: string;
    howWork: string;
}

const SmallMachineCard: React.FC<SmallMachineProps> = ({ id, title, picturePath, whatDoes, howWork }) => {
    const navigate = useNavigate();

    const sendToMachinePage = () => {
        navigate(`/signUp/}`);
    };

    return (
        <div className="projectCardContainer" onClick={sendToMachinePage}>
            <div className="projectOutline">
                <div className="projectTitle">{title}</div>
                <img className="projectPicture" src={imageProjectCard} alt="Project card"/>
                <div className="projectDescription"><b>What it does: </b>{whatDoes}</div>
                <div className="projectDescription"><b>How it works: </b>{howWork}</div>
           </div>
           <div className="projectCardBottomRow"></div>
        </div>
    )
};

export default SmallMachineCard;
import React from "react"
import "../styles/professorCard.css"
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
const ProfessorCard : React.FC = () =>{
    const imageProfessorCard = require("../images/trond_profil_bilde.png");
    return(
        <div className="professorCardOutline"> 
        <div className="professorCardFrame">
            <img className= "professorCardImage" src={imageProfessorCard} alt="Professor"></img>
            <div className= "professorCardName"> Trond Are Ørisland </div>
            <div className= "professorCardProffesionalTitle"> Førsteamanuensis </div>
            <div className= "professorCardInstitute"> Institutt for design</div>
            <div className= "professorCardEmailPhone">
                <div className="rowFlex" >   
                    <MailOutlineIcon className="professorCardIcons"/> 
                    <div className="marginLeft"> trond.are.oristland@ntnu.no </div>
                </div>
                <div className="rowFlex" > 
                    <LocalPhoneOutlinedIcon className="professorCardIcons"/> 
                    <div className="marginLeft"> +47 90783975 </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default ProfessorCard

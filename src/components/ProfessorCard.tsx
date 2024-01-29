import React from "react";
import "../styles/professorCard.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import trond_profil_bilde from "../images/trond_profil_bilde.png";

interface professorCardProp {
  name: string;
  professioanlTitle: string;
  institute: string;
  email: string;
  phoneNumber: string;
  //add photo
}
const ProfessorCard = ({
  name,
  professioanlTitle,
  institute,
  email,
  phoneNumber,
}: professorCardProp) => {
  const imageProfessorCard = trond_profil_bilde;
  const altText: string = "picture of" + name;
  return (
    <div className="professorCardOutline">
      <div className="professorCardFrame">
        <img
          className="professorCardImage"
          src={imageProfessorCard}
          alt={altText}
        ></img>
        <div className="professorCardName"> {name} </div>
        <div className="professorCardProffesionalTitle">
          {" "}
          {professioanlTitle}{" "}
        </div>
        <div className="professorCardInstitute"> {institute} </div>
        <div className="professorCardEmailPhone">
          <div className="rowFlex">
            <MailOutlineIcon className="professorCardIcons" />
            <div className="marginLeft"> {email} </div>
          </div>
          <div className="rowFlex">
            <LocalPhoneOutlinedIcon className="professorCardIcons" />
            <div className="marginLeft"> {phoneNumber} </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorCard;

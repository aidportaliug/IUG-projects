import React from "react";
import ProffesorCard from "../components/ProfessorCard";

const ProjectDetailsPage : React.FC = () =>{
    const name = "Trond Are Øritsland"
    const professioanlTitle = "Førsteamanuensis"
    const institute = "Institutt for design"
    const email = "trond.are.oritsland@ntnu.no"
    const phoneNumber = "+47 90783975"
    return(
        <ProffesorCard  name={name}  professioanlTitle={professioanlTitle} institute={institute} email={email} phoneNumber={phoneNumber}/>
    )
}

export default ProjectDetailsPage
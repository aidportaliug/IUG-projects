import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Meta from "../Meta";
import Layout from "../Navbar/Layout";
import Footer from "../Footer";
import InformationBox from "../ProjectDetail/InformationBox";
import ProjectImageBox from "../ProjectImageBox";
import { Project } from "../../models/project";
import { experienceReport } from "../../models/experienceReport";
import { getProject } from "../../services/getProject";
import { getReport } from "../../services/getReport";
import Trax_Ghana from "../../images/Trax_Ghana.png";
import "./ProjectReportPage.css";

type ProjectReportPageProps = {
  type: "project" | "report";
};

const ProjectReportPage: React.FC<ProjectReportPageProps> = ({ type }) => {
  const { id } = useParams();
  const [data, setData] = useState<Project | experienceReport | null>(null);

  async function fetchData(dataId: string) {
    if (type === "project") {
      const project = await getProject(dataId);
      setData(project);
    } else {
      const report = await getReport(dataId);
      setData(report);
    }
  }

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id, type]);

  if (!data) {
    return <div>404: page not found</div>;
  }

  const isProject = type === "project";
  const title = isProject ? (data as Project).title : (data as experienceReport).title;
  const description = isProject
    ? (data as Project).description
    : (data as experienceReport).description;
  const location = isProject ? (data as Project).location : "Somewhere in the World";
  const studyField = isProject ? (data as Project).studyField : (data as experienceReport).studyField;
  const picture = data.picture || Trax_Ghana;

  return (
    <>
      <Meta title={title}></Meta>
      <Layout>
        <div className="projectReportOutline">
          <h1 className="Title">{title}</h1>
          <ProjectImageBox source={picture} altText={title} />
          <InformationBox
            deadline={isProject ? (data as Project).deadline.toDate() : new Date()}
            location={location}
            duration={isProject ? (data as Project).duration : undefined}
            studyField={studyField}
            contactName={isProject ? "Professor Name" : "Student Name"}
          />
          <div className="description">
            <p>{description}</p>
          </div>
        </div>
        <Footer
          nameLink1="Demo_1"
          nameLink1URL="demo.com"
          nameLink2="Demo_2"
          nameLink2URL="demo.com"
          nameLink3="Demo_3"
          nameLink3URL="demo.com"
          nameLink4="Demo_4"
          nameLink4URL="demo.com"
          category1="Category 1"
          category2="Category 2"
        />
      </Layout>
    </>
  );
};

export default ProjectReportPage;

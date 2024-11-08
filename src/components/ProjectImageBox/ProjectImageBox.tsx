import { ReactElement } from "react";
import "./projectImageBox.css";

interface projectImageBoxProp {
  source: string;
  altText: string;
}

const ProjectImageBox = ({
  source,
  altText,
}: projectImageBoxProp): ReactElement => {
  return (
    <div className="projectImageBox">
      <img src={source} alt={altText} />
    </div>
  );
};

export default ProjectImageBox;

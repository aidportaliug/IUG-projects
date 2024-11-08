import { Stack } from "@mui/material";
import React from "react";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import "../../styles/projectDetail.css";
import { locations, studyFields } from "../../models/allowedValues";

interface InformationBoxProps {
  deadline: Date;
  location: string;
  studyField: string;
  contactName: string;
  duration?: number;
}

const InformationBox: React.FC<InformationBoxProps> = ({
  deadline,
  location,
  studyField,
  contactName,
  duration,
}) => {
  return (
    <Stack
      spacing={2}
      style={{
        marginTop: "20px",
        width: "70%",
        borderBottom: "1px solid #3D7844",
        paddingBottom: "20px",
        marginBottom: "20px",
      }}
    >
      <div style={{ fontSize: "20px" }}>
        <div className="projectDetailDate">
          <LocationOnIcon style={{ color: "#3D7844" }} />
          <div style={{ fontSize: "20px" }}>
            {locations[location as keyof typeof locations]}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "20px" }}>
        {studyFields[studyField as keyof typeof studyFields]}
      </div>

      {duration && (
        <div style={{ fontSize: "20px" }}>
          <div className="projectDetailDate">
            <CalendarTodayIcon style={{ color: "#3D7844" }} />
            <div style={{ margin: "10px" }}>{duration} days</div>
          </div>
        </div>
      )}

      <div style={{ fontSize: "20px" }}>
        <div className="projectDetailDate">
          <NotificationsNoneIcon style={{ color: "#3D7844" }} />
          <div style={{ margin: "10px" }}>
            {`Application deadline: ${deadline.getDate()}/${deadline.getMonth() + 1}/${deadline.getFullYear()}`}
          </div>
        </div>
      </div>

      <div style={{ fontSize: "20px", color: "#3D7844" }}>
        <strong>Contact:</strong> {contactName}
      </div>
    </Stack>
  );
};

export default InformationBox;

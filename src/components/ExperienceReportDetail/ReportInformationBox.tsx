import React from 'react';
import { Stack } from '@mui/material';
import { locations, studyFields } from '../../models/allowedValues';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../pages/ProjectDetailsPage/projectDetailPage.css';

interface ReportInformationBoxProps {
  deadline: Date;
  studyField: string;
}

const ReportInformationBox: React.FC<ReportInformationBoxProps> = ({ deadline, studyField }) => {
  return (
    <Stack
      spacing={2}
      style={{
        marginTop: '20px',
        width: '70%',
        marginBottom: '20px',
      }}
    >
      <div style={{ fontSize: '20px' }}>
        <div className="projectDetails">
          <NotificationsNoneIcon style={{ color: '#3D7844' }} />
          <div style={{ marginLeft: '10px' }}>
            Application deadline: {deadline.getDate()}/{deadline.getMonth() + 1}/{deadline.getFullYear()}
          </div>
        </div>
      </div>
      <div style={{ fontSize: '20px' }}>
        <div className="projectDetails">
          <LightbulbIcon style={{ color: '#3D7844' }} />
          <div style={{ marginLeft: '10px' }}>{studyFields[studyField as keyof typeof studyFields]}</div>
        </div>
      </div>
    </Stack>
  );
};

export default ReportInformationBox;

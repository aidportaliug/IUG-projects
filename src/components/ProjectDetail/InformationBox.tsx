import React from 'react';
import { Stack } from '@mui/material';
import { locations, studyFields } from '../../models/allowedValues';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import '../../pages/ProjectDetailsPage/projectDetailPage.css';

interface InformationBoxProps {
  deadline: Date;
  location: string;
  duration: number;
  studyField: string;
}

const InformationBox: React.FC<InformationBoxProps> = ({ deadline, location, duration, studyField }) => {
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
        <div className="projectDetailDate">
          <LocationOnIcon style={{ color: '#3D7844' }} />
          <div style={{ fontSize: '20px' }}>{locations[location as keyof typeof locations]}</div>
        </div>
      </div>

      <div style={{ fontSize: '20px' }}>{studyFields[studyField as keyof typeof studyFields]}</div>
      <div style={{ fontSize: '20px' }}>
        <div className="projectDetailDate">
          <CalendarTodayIcon style={{ color: '#3D7844' }} />
          <div style={{ margin: '10px' }}>{duration}</div>
        </div>
      </div>
      <div style={{ fontSize: '20px' }}>
        <div style={{ fontSize: '20px' }}>
          <div className="projectDetailDate">
            <NotificationsNoneIcon style={{ color: '#3D7844' }} />
            <div style={{ margin: '10px' }}>
              Application deadline: {deadline.getDate()}/{deadline.getMonth() + 1}/{deadline.getFullYear()}
            </div>
          </div>
        </div>
      </div>
    </Stack>
  );
};

export default InformationBox;

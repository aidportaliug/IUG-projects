import React from 'react';
import './calendarDate.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface CalendarDateProps {
  date: Date;
}

const CalendarDate: React.FC<CalendarDateProps> = ({ date }) => {
  return (
    <div className="date">
      <CalendarTodayIcon />
      <div style={{ margin: '10px' }}>
        {date.getDate()}/{date.getMonth()}/{date.getFullYear()}
      </div>
    </div>
  );
};

export default CalendarDate;

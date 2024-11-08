import './calenderDate.css';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface calenderDateProps {
  date: Date;
}

const CalandarDate: React.FC<calenderDateProps> = ({ date }: calenderDateProps) => {
  return (
    <div className="date">
      <CalendarTodayIcon></CalendarTodayIcon>
      <div style={{ margin: '10px' }}>
        {date.getDate()}/{date.getMonth()}/{date.getFullYear()}{' '}
      </div>
    </div>
  );
};
export default CalandarDate;

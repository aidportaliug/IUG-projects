import "./ProjectCard/projectCard.css"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

interface calanderDateProps{
    date : Date;
}

const CalandarDate : React.FC <calanderDateProps> = ({date}) => {
    return(
        <div className="date">    
            <CalendarTodayIcon></CalendarTodayIcon> 
            <div style={{margin: "10px"}}>{date.getDate()}/{date.getMonth()}/{date.getFullYear()} </div>
      </div>
    )
};
export default CalandarDate

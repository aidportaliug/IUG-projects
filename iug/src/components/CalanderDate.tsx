import "./ProjectCard/projectCard.css"
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';


const CalandarDate : React.FC = () => {
    return(
        <div className="date">    
            <CalendarTodayIcon></CalendarTodayIcon> 
            <div>22/10/2022 </div>
      </div>
    )
};
export default CalandarDate

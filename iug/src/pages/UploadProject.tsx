import "../styles/uploadProject.css"
import UploadProjectForm from "../components/uploadProjectFrom";
import { useFirebaseAuth } from "../services/AuthContext";
const UploadProject = () => {
    //const [user, setUser] = useState<User | null>(null)
    const {user} = useFirebaseAuth()
    if (user){
        return(
            <div className="outline">
                <div className="title"> Upload Project </div>
                <UploadProjectForm/>
            </div>
        )
    }
    return (
        <div>You must be logged in</div>
    )
}

export default UploadProject


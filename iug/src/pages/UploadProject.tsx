import "../styles/uploadProject.css"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField, TextFieldProps } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useState } from "react";
import { styled } from '@mui/material/styles';
import { Height } from "@mui/icons-material";
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: '#727171',
      background: "#E3E3E3",
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#727171',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        border: "none",
        borderRadius: "15px",
        background: "#E3E3E3",
        zIndex: "-1",
        height: "3em",
        width: "100%",
      },
      '&:hover fieldset': {
        borderColor: '#727171',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#727171',
      },
    },
  });


const UploadProject = () => {
    // let geoPoint : GeoPoint = new GeoPoint ( -34.85553195363169, -56.207280375137955 );
    // let newDate = new Date();
    // // await addDoc(collection(db, "project2"), {
    //     title: "hello",
    //     location: geoPoint,
    //     durationDays: 9,
    //     deadline: newDate,
    //     field: "field",
    //     status: "done",
    //     professorId: "professor",
    //     description: "blablalba"
    //   });
    const [value, setValue]= useState(Date())

    return(
        <div className="outline">
            <div className="title"> Upload Project </div>
            <form className="uploadProjectform">
                <div className="group">
                    <label> Title </label> <br />
                    <input type="text" name="title" className="inputField" />
                </div>
                <div className="group">
                    <label> Field of study </label> <br />
                    <input type="text" name="name" className="inputField" />
                </div>
                <div className="group">
                    <label> Duration </label> <br />
                    <input type="text" name="name" className="inputField" />
                </div>
                <div className="group">
                    <label> Deadline </label> <br />
                    <DatePicker
                    disablePast
                    value={value}
                    onChange={(newValue: any) => {
                        setValue(newValue);
                    }}
                    renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <CssTextField InputLabelProps={{shrink: false}} {...params} />}
                    inputFormat="DD/MM/YYYY"
                    />
                </div>
                <div className="group">
                    <label> Country </label> <br />
                    <input type="text" name="name" className="inputField" />
                </div>
            </form>

            <form action="/action_page.php">
                <label htmlFor="img">Select image:</label>
                <input type="file" id="img" name="img" accept="image/*"/>
                <input type="submit"></input>
            </form>
          
          
        </div>

    )
}

export default UploadProject


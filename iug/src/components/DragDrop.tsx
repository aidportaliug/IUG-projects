import React from 'react';
import { FileUploader } from "react-drag-drop-files";
import { Button } from '@mui/material';

const fileTypes = ["JPG", "PNG", "GIF"];
interface dragDropProps {
    handleSubmit: () => void;
    setImage: React.Dispatch<React.SetStateAction<Blob | Uint8Array | ArrayBuffer | undefined>>;
  }

const DragDrop = ({handleSubmit, setImage}: dragDropProps) => {
  const handleChange = (file:File) => {
    setImage(file);
  };
  return (
    <>
        <FileUploader handleChange={handleChange} name="file" types={fileTypes}  />
        <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
}


export default DragDrop;

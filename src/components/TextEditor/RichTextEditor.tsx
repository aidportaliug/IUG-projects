import React, { useEffect, useReducer, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/richTextEditor.css";
import CustomToolbar from "./CustomToolbar";

const RichTextEditor = () => {
  const [value, setValue] = useState("");

  const handleChange = (html) => {
    setValue(html);
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "font",
    "size",
  ];

  return (
    <div className="wrapper">
      <ReactQuill
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
      />
    </div>
  );
};

export default RichTextEditor;

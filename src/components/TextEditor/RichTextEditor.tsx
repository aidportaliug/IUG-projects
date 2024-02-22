import React, { useEffect, useReducer, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../../styles/richTextEditor.css";
import CustomToolbar from "./CustomToolbar";

interface Textprops {
  html: string;
}

const RichTextEditor = ({ html }: Textprops) => {
  const [value, setValue] = useState<string>(html);
  const handleChange = (newhtml: string) => {
    setValue(newhtml);
  };

  const modules = {
    toolbar: {
      container: "#toolbar",
    },
  };
  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "indent",
    "list",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  return (
    <div className="wrapper">
      <CustomToolbar />
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

import React, { useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styles/richTextEditor.css";

const RichTextEditor = () => {
  const [value, setValue] = useState("");

  function handler() {
    console.log(value);
  }

  return (
    <div className="wrapper">
      <QuillEditor
        className="editor"
        value={value}
        theme="snow"
        onChange={(value) => setValue(value)}
      />
      <button onClick={handler}>Submit</button>
    </div>
  );
};

export default RichTextEditor;

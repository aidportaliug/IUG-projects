import React from "react";
import formats from "./ToolbarOptions.js";

type FormatDataWithOptions = {
  className: string;
  options: string[];
};

type FormatDataWithValue = {
  className: string;
  value: string;
};

type formatData = FormatDataWithOptions | FormatDataWithValue;

const renderOptions = (formatData: FormatDataWithOptions): JSX.Element => {
  const { className, options } = formatData;
  return (
    <select className={className}>
      <option></option>
      {options.map((value) => {
        return <option value={value}></option>;
      })}
    </select>
  );
};
const renderSingle = (formatData: FormatDataWithValue): JSX.Element => {
  const { className, value } = formatData;
  return <button className={className} value={value}></button>;
};

const hasOptions = (data: formatData): data is FormatDataWithOptions => {
  return "options" in data;
};

const CustomToolbar = () => (
  <div id="toolbar">
    {formats.map((classes) => {
      return (
        <span className="ql-formats">
          {classes.map((formatData) => {
            return hasOptions(formatData)
              ? renderOptions(formatData)
              : renderSingle(formatData);
          })}
        </span>
      );
    })}
  </div>
);
export default CustomToolbar;

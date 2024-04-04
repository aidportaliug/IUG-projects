import React, { useState } from "react";

type FormatDataWithOptions = {
  className: string;
  options: string[];
  value?: string;
};

type FormatDataWithValue = {
  className: string;
  value: string;
};

type FormatDataWithout = {
  className: string;
};

type formatData =
  | FormatDataWithOptions
  | FormatDataWithValue
  | FormatDataWithout;

interface CustomToolbarProps {
  onFontSizeChange: (fontSize: string) => void;
}

const renderOptions = (formatData: FormatDataWithOptions): JSX.Element => {
  const { className, options } = formatData;
  const defaultSelectedValue = "Normal";
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
  };
  return (
    <select
      className={className}
      onChange={handleChange}
      value={defaultSelectedValue}
    >
      <option value=""></option>
      {options.map((label, index) => {
        return (
          <option key={index} value={label}>
            {label.charAt(0).toUpperCase() + label.slice(1)}
          </option>
        );
      })}
    </select>
  );
};
const renderSingle = (formatData: FormatDataWithValue): JSX.Element => {
  const { className, value } = formatData;
  return <button className={className} value={value}></button>;
};

const renderNothing = (formatData: FormatDataWithout): JSX.Element => {
  const { className } = formatData;
  return <button className={className}></button>;
};

const hasOptions = (data: formatData): data is FormatDataWithOptions => {
  return "options" in data;
};

const hasValue = (data: formatData): data is FormatDataWithValue => {
  return "value" in data;
};
const CustomToolbar = () => {
  const colors = ["red", "green", "blue", "orange", "violet"];
  const formats: formatData[][] = [
    [
      {
        className: "ql-font",
        options: ["serif", "monospace"],
      },
      {
        className: "ql-size",
        options: ["small", "large", "huge"],
      },
    ],
    [
      {
        className: "ql-color",
        options: colors,
      },
      {
        className: "ql-background",
        options: colors,
      },
    ],
    [
      {
        className: "ql-script",
        value: "sub",
      },
      {
        className: "ql-script",
        value: "super",
      },
    ],
    [
      {
        className: "ql-header",
        value: "1",
      },
      {
        className: "ql-header",
        value: "2",
      },
    ],
    [
      { className: "ql-bold" },
      { className: "ql-italic" },
      { className: "ql-underline" },
      { className: "ql-strike" },
      { className: "ql-blockquote" },
    ],
    [
      {
        className: "ql-list",
        value: "ordered",
      },
      {
        className: "ql-list",
        value: "bullet",
      },
      {
        className: "ql-indent",
        value: "-1",
      },
      {
        className: "ql-indent",
        value: "+1",
      },
    ],
    [
      {
        className: "ql-direction",
        value: "rtl",
      },
      {
        className: "ql-align",
        options: ["right", "center", "justify"],
      },
    ],
  ];
  return (
    <div id="toolbar">
      {formats.map((classes, outerIndex) => {
        return (
          <span key={outerIndex} className="ql-formats">
            {classes.map((formatData, innerIndex) => {
              return (
                <React.Fragment key={innerIndex}>
                  {hasOptions(formatData)
                    ? renderOptions(formatData)
                    : hasValue(formatData)
                    ? renderSingle(formatData)
                    : renderNothing(formatData)}
                </React.Fragment>
              );
            })}
          </span>
        );
      })}
    </div>
  );
};
export default CustomToolbar;

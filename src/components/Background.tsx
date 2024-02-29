import React from "react";

interface backgroundProp {
  image: string;
}
export const Background = ({ image }: backgroundProp) => {
  return <div style={{ backgroundImage: image }} />;
};

export default Background;

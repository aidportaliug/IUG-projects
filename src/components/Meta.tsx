import React, { useEffect } from "react";

/**
 * This is a simple component that set a title to a page.
 * @param title: A sting that get set as a title.
 */
interface MetaProps {
  title: string;
}

const Meta: React.FC<MetaProps> = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default Meta;

import React, { ReactNode } from "react";
import Navbar from "./Navbar";
import "../../styles/Layout.css";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      <div className="content-below-navbar">{children}</div>
    </div>
  );
}

export default Layout;

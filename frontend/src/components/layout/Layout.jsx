import React from "react";
import "./Layout.css";
import TabNavBar from "../tabNavBar/TabNavBar";
import MobileNavbar from "../mobileNavbar/MobileNavbar";
import SideNavbar from "../sideNavbar/SideNavbar";
import TopNavbar from "../topNavbar/TopNavbar";
function NavLayout({ children }) {
  return (
    <>
      <TopNavbar />
      <main className="main-layout">
        <SideNavbar className="section-1" />
        <TabNavBar className="section-1" />
        <div className="section-2">{children}</div>
      </main>

      <MobileNavbar />
    </>
  );
}

export default NavLayout;

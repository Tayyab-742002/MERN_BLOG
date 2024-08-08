import React from "react";
import Image from "../common/Image";
import "./TabNavBar.css";
import { GrHomeRounded, GrSearch } from "react-icons/gr";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { RiAddLargeFill } from "react-icons/ri";
import Logo from "../../assets/Logo.png";
import { nanoid } from "@reduxjs/toolkit";
import { NavLink } from "react-router-dom";
function TabNavBar() {
  const navItems = [
    {
      text: null,
      Icon: () => <Image src={Logo} alt="logo" className="tab-nav-logo" />,
      path: "",
    },
    { text: "Home", Icon: GrHomeRounded, path: "" },
    { text: "Search", Icon: GrSearch, path: "search" },
    { text: "My Blogs", Icon: TbBrandBlogger, path: "myblogs" },
    { text: "Profile", Icon: FaRegUser, path: "profile" },
    {
      text: null,
      Icon: RiAddLargeFill,
      className: "tab-nav-add-post",
      path: "addpost",
    },
  ];
  return (
    <div className="tab-nav-wrapper">
      <ul className="tab-nav-items">
        {navItems.map(({ text, Icon, className, path }) => {
          return (
            <li key={nanoid()}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  "tab-nav-links " +
                  (!isActive ? "" : "tab-selected-link") +
                  (className ? " tab-nav-add-post" : "")
                }
              >
                <Icon className="tab-nav-icons" />
                {text && <span className="tab-nav-item-text">{text}</span>}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TabNavBar;

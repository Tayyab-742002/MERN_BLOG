import React from "react";
import "./MobileNavbar.css";
import { GrHomeRounded, GrSearch } from "react-icons/gr";
import { TbBrandBlogger } from "react-icons/tb";
import { FaRegUser } from "react-icons/fa";
import { FaRegSquarePlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
function MobileNavbar() {
  const navItems = [
    { text: "Home", Icon: GrHomeRounded, path: "" },
    { text: "Search", Icon: GrSearch, path: "search" },
    { text: null, Icon: FaRegSquarePlus, path: "addpost" },
    { text: "My Blogs", Icon: TbBrandBlogger, path: "myblogs" },
    { text: "Profile", Icon: FaRegUser, path: "profile" },
  ];
  return (
    <div className="mob-nav-wrapper">
      <ul className="mob-nav-items">
        {navItems.map(({ text, Icon, path }) => {
          return (
            <li key={text}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  "mob-nav-links " + (!isActive ? "" : "mob-selected-link")
                }
              >
                <Icon className="mob-nav-icons" />
                <span className="mob-nav-item-text">{text}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MobileNavbar;

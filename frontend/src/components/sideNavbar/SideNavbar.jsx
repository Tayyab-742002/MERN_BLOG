import React, { act } from "react";
import "./SideNavbar.css";
import profile from "../../assets/profile.png";
import Image from "../common/Image";
import {
  CiCirclePlus,
  CiCompass1,
  CiGrid41,
  CiHashtag,
  CiBookmark,
  CiRead,
  CiFacebook,
  CiLinkedin,
  CiInstagram,
  CiUser,
  CiFileOn,
} from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
function SideNavbar() {
  const navItems = [
    {
      text: "",
      active: true,
      items: [
        {
          name: "Home",
          Icon: () => (
            <Image src={profile} alt="profile" className="side-nav-icon" />
          ),
          path: "",
          active: true,
        },
        {
          name: "My Blogs",
          Icon: CiFileOn,
          path: "/myblogs",
          active: true,
        },
        {
          name: "Profile",
          path: "/profile",
          Icon: CiUser,
          active: true,
        },
      ],
    },
    {
      text: "Discover",
      active: true,
      items: [
        {
          name: "Explore",
          Icon: CiCompass1,
          path: "/explore",
          active: true,
        },
        {
          name: "Categories",
          Icon: CiGrid41,
          path: "/categories",
          active: true,
        },
        {
          name: "Tag",
          Icon: CiHashtag,
          path: "/tags",
          active: true,
        },
      ],
    },
    {
      text: "Activity",
      active: true,
      items: [
        {
          name: "Bookmarks",
          path: "/bookmarks",
          Icon: CiBookmark,
          active: true,
        },
        {
          name: "History",
          path: "/history",
          Icon: CiRead,
          active: true,
        },
      ],
    },
  ];
  const socialLinks = [
    {
      name: "Facebook",
      Icon: CiFacebook,
      link: "#",
      active: true,
    },
    {
      name: "Linkedin",
      Icon: CiLinkedin,
      link: "#",
      active: true,
    },
    {
      name: "Twitter",
      Icon: FaXTwitter,
      link: "#",
      active: true,
    },
    {
      name: "Instagram",
      Icon: CiInstagram,
      link: "#",
      active: true,
    },
  ];
  return (
    <aside className="side-nav-wrapper">
      <nav className="side-nav">
        <div>
          {navItems.map((navItem, index) => {
            return (
              navItem.active && (
                <div className="side-nav-item-wrapper" key={index}>
                  <h4>{navItem.text}</h4>
                  <ul className="side-nav-items">
                    {navItem.items.map(
                      ({ name, path, Icon, active }, index) => {
                        return (
                          active && (
                            <li key={index}>
                              <NavLink
                                to={path}
                                className={({ isActive }) =>
                                  "side-nav-link " +
                                  (!isActive ? "" : "selected-link")
                                }
                              >
                                <Icon className="side-nav-icon" />
                                <span className="side-nav-item-text">
                                  {name}
                                </span>
                              </NavLink>
                            </li>
                          )
                        );
                      }
                    )}
                  </ul>
                </div>
              )
            );
          })}
        </div>
        <ul className="side-nav-social-links ">
          {socialLinks.map(({ name, Icon, link, active }, index) => {
            return (
              active && (
                <li key={index}>
                  <Icon className="side-nav-icon" />
                  <a href={link} className="side-nav-item-text">
                    {name}
                  </a>
                </li>
              )
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

export default SideNavbar;

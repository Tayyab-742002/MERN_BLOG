import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo.png";
import profile from "../../assets/profile.png";
import "./TopNavbar.css";
import { CiSearch } from "react-icons/ci";
import Search from "../common/Search";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Menu, MenuItem, MenuButton, SubMenu } from "@szhsin/react-menu";
import LogoutBtn from "../common/LogoutBtn";
function TopNavbar() {
  const navigate = useNavigate();
  const userProfile = useSelector(
    (state) => state?.userData?.data?.profileImage
  );
  const authStatus = useSelector((state) => state.status);
  return (
    <div className="top-nav-wrapper">
      <img className="top-nav-logo" src={Logo} alt="logo" />
      <Search
        type="text"
        placeholder="Search blog"
        Icon={CiSearch}
        className="top-nav-search"
      />
      <div className="top-nav-right">
        <Button
          onClick={() => {
            navigate("/addpost");
          }}
          className="top-nav-btn-post"
        >
          New Post
        </Button>
        <Menu
          className="top-nav-author-dropdown"
          menuButton={
            <MenuButton className="top-nav-author-dropdown-btn">
              <div>
                <img
                  src={userProfile ? userProfile : profile}
                  alt="user image"
                  className="top-nav-avatar"
                />
              </div>
            </MenuButton>
          }
        >
          <MenuItem>
            {authStatus ? (
              <LogoutBtn />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                className="button-outline"
              >
                Login
              </Button>
            )}
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
}

export default TopNavbar;

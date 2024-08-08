import React, { useEffect, useState } from "react";
import "./Profile.css";
import { useSelector } from "react-redux";
import Image from "../../components/common/Image";
import PostService from "../../services/postServices";
import { Link } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
function Profile() {
  const userData = useSelector((state) => state.userData);
  console.log(userData);
  const [myBlogs, setMyBlogs] = useState();
  useEffect(() => {
    PostService.getAllBlogs({ userId: userData.data._id })
      .then((result) => {
        setMyBlogs(result.docs);
      })
      .then((error) => {
        console.log(error);
      });
  }, {});
  return (
    <div className="profile">
      <Image
        src={userData.data.profileImage}
        alt="profile image"
        className="profile-image"
      />
      <section className="user-detail">
        <span className="user-fullname">
          {userData.data.fullname}
          <CiEdit className="profile-edit-btn" />
        </span>
        <span className="user-username">
          {`@${userData.data.username}`} <CiEdit className="profile-edit-btn" />
        </span>
        <span className="user-email">
          {`${userData.data.email}`} <CiEdit className="profile-edit-btn" />
        </span>
        <span className="user-joined">
          {`Joined ${userData.data.createdAt}`}{" "}
        </span>
        <span className="user-bio">
          {userData.data.bio} <CiEdit className="profile-edit-btn" />
        </span>
        <Link className="user-blogs" to="/myblogs">
          {myBlogs &&
            `${
              myBlogs.length === 1
                ? myBlogs.length + " Blog"
                : myBlogs.length + " Blogs"
            } `}
        </Link>
      </section>
    </div>
  );
}

export default Profile;

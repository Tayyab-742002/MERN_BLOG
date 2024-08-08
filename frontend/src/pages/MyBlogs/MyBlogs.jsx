import React, { useEffect, useState } from "react";
import { BlogCard, Empty, GridLayout } from "../../components";
import PostService from "../../services/postServices";
import { useSelector } from "react-redux";
function MyBlogs() {
  const [blogs, setBlogs] = useState([]);
  const userId = useSelector((state) => state?.userData?.data._id);

  useEffect(() => {
    PostService.getAllBlogs({ userId: userId })
      .then((result) => {
        setBlogs(result.docs);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  return (
    <div className="my-blogs-container">
      {blogs.length !== 0 ? (
        <GridLayout>
          {blogs.map((blog) => {
            return <BlogCard blog={blog} key={blog.title} />;
          })}
        </GridLayout>
      ) : (
        <Empty message="It seems there are no blogs posted by you" />
      )}
    </div>
  );
}

export default MyBlogs;

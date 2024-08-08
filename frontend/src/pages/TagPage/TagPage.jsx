import React, { useEffect, useState } from "react";
import "./TagPage.css";
import { useParams } from "react-router-dom";
import TagService from "../../services/tagServices";
import { BlogCard, GridLayout } from "../../components";
import { FaHashtag } from "react-icons/fa";
function TagPage() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    TagService.getBlogsBySlug({ slug })
      .then((result) => {
        setBlogs(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return blogs ? (
    <div className="tag-page-container">
      <header className="tag-page-header">
        <FaHashtag className="tag-page-hash-tag" />
        <span className="tag-page-title">{slug}</span>
      </header>
      <GridLayout>
        {blogs.map((blog) => {
          return <BlogCard blog={blog} key={blog.title} />;
        })}
      </GridLayout>
    </div>
  ) : (
    <h1>Loading....</h1>
  );
}

export default TagPage;

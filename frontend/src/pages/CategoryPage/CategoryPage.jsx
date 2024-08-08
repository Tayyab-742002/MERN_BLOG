import React, { useEffect, useState } from "react";
import "./CategoryPage.css";
import { useParams } from "react-router-dom";

import { BlogCard, Empty, GridLayout } from "../../components";
import { BiCategoryAlt } from "react-icons/bi";
import CategoryService from "../../services/categoryServices";
function CategoryPage() {
  const { slug } = useParams();
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    CategoryService.getBlogsBySlug({ slug })
      .then((result) => {
        setBlogs(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return blogs ? (
    <div className="category-page-container">
      <header className="category-page-header">
        <BiCategoryAlt className="category-page-icon" />
        <span className="category-page-title">{slug.toUpperCase()}</span>
      </header>
      {blogs.length !== 0 ? (
        <GridLayout>
          {blogs.map((blog) => {
            return <BlogCard blog={blog} key={blog.title} />;
          })}
        </GridLayout>
      ) : (
        <Empty message="It seems there are no blogs posted under this category yet" />
      )}
    </div>
  ) : (
    <h1>Loading....</h1>
  );
}

export default CategoryPage;

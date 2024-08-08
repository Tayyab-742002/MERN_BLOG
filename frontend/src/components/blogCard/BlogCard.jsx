import React, { useEffect, useRef, useState } from "react";
import { IconContext } from "react-icons";
import LinesEllipsis from "react-lines-ellipsis";
import { AiOutlineMessage } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { SlLike } from "react-icons/sl";
import "./BlogCard.css";
import Image from "../common/Image";
import { useNavigate } from "react-router-dom";
function BlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <div
      className="blog-card-wrapper"
      onClick={() => navigate(`/blogs/blog/${blog.slug}`)}
    >
      <Image
        src={blog.thumbnail}
        alt="blog-thumbnail"
        className="blog-thumbnail"
      />
      <div className="blog-card">
        <LinesEllipsis
          text={blog.title}
          maxLine="2"
          ellipsis="..."
          trimRight
          basedOn="letters"
          className="blog-card-title"
        />
        <section>
          <LinesEllipsis
            text={blog.excerpt}
            maxLine="2"
            ellipsis="..."
            trimRight
            basedOn="letters"
            className="blog-card-excerpt"
          />
        </section>
        <section className="blog-card-author-section">
          <Image
            src={blog.author.avatar}
            alt="author-image"
            className="blog-card-author-image"
          />
          <span className="blog-card-date">{blog.createdAt}</span>
        </section>
        <section className="blog-tags">
          {blog.tags.map((tag, index) => {
            if (index < 2) {
              return (
                <span className="blog-card-tag" key={index}>
                  {tag}
                </span>
              );
            } else if (index === 2) {
              return (
                <span className="blog-card-tag" key={index}>
                  {` +${blog.tags.length - index}`}
                </span>
              );
            }
          })}
        </section>
        <section className="blog-card-bottom">
          <IconContext.Provider
            value={{
              className: "blog-card-icon-1",
            }}
          >
            <div className="blog-card-icon-1-wrap">
              <SlLike /> <span>{blog.totalLikes}</span>
            </div>
          </IconContext.Provider>
          <IconContext.Provider
            value={{
              className: "blog-card-icon-2",
            }}
          >
            <div className="blog-card-icon-2-wrap">
              <AiOutlineMessage />
              <span>{blog.totalComments}</span>
            </div>
          </IconContext.Provider>
          <IconContext.Provider
            value={{
              className: "blog-card-icon-3",
            }}
          >
            <div className="blog-card-icon-3-wrap">
              <CiBookmark />
            </div>
          </IconContext.Provider>
        </section>
      </div>
    </div>
  );
}

export default BlogCard;

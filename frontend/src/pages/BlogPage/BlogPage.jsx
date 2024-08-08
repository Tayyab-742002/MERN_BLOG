import React, { useEffect, useState } from "react";
import "./BlogPage.css";
import { IoChevronBack } from "react-icons/io5";
import profile from "../../assets/profile.png";
import { Button, Image, Input } from "../../components";
import { AiOutlineMessage } from "react-icons/ai";
import { CiBookmark } from "react-icons/ci";
import { SlLike } from "react-icons/sl";
import { IconContext } from "react-icons";
import { IoSend } from "react-icons/io5";
import { Link, useParams } from "react-router-dom";
import CommentService from "../../services/commentServices";
import PostService from "../../services/postServices";
import parse from "html-react-parser";
import TagService from "../../services/tagServices";
import LikeService from "../../services/likeServices";
import { useSelector } from "react-redux";
function BlogPage() {
  const { slug } = useParams();
  const [blogDetail, setBlogDetail] = useState(null);
  const [commentsDetail, setCommentsDetail] = useState(null);
  const [tags, setTags] = useState(null);
  const [likes, setLikes] = useState(null);
  const authStatus = useSelector((state) => state.status);
  const userData = useSelector((state) => state.userData);
  const [comment, setComment] = useState("");
  useEffect(() => {
    PostService.getBlogBySlug(slug)
      .then((result) => {
        // console.log("BLOG DETAIL : ", result);
        setBlogDetail(result);
        CommentService.getAllComments({ blogId: result._id })
          .then((result) => {
            // console.log("COMMENT DETAIL : ", result);
            setCommentsDetail(result);
          })
          .catch((error) => {
            console.log(error.message);
          });
        TagService.getBlogTags({ blogId: result?._id })
          .then((result) => {
            // console.log(result);
            setTags(result);
          })
          .catch((error) => {
            console.log(error.message);
          });
        LikeService.getLikes({ blogId: result?._id })
          .then((result) => {
            setLikes(result);
          })
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const postComment = async () => {
    // console.log(comment);

    const blogId = blogDetail?._id ? blogDetail._id : "";
    if (!blogId) {
      setComment("");
      return;
    }
    CommentService.postComment({ blogId, content: comment })
      .then((result) => {
        // console.log(result);
        setCommentsDetail((prevComments) => [
          ...prevComments,
          {
            content: result.data.content,
            user: {
              username: userData?.data.username,
              avatar: userData?.data.profileImage,
              fullname: userData?.data.fullname,
            },
          },
        ]);
        // console.log(userData);

        setComment("");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return !blogDetail ? (
    <h1>Loading...</h1>
  ) : (
    <div className="blog-page-container">
      <div className="blog-page-content">
        <div className="blog-page-header">
          <IoChevronBack className="blog-page-back-btn" />
          <h3>{blogDetail.title}</h3>
        </div>
        <section className="blog-page-author-date">
          <Image
            src={blogDetail.author.profileImage}
            alt="author avatar"
            className="blog-page-author-avatar"
          />
          <div>
            <span className="blog-page-author-name">
              {blogDetail.author.fullname}
            </span>
            <span className="blog-page-date">{blogDetail.createdAt}</span>
          </div>
        </section>

        <section className="blog-page-detail">
          <p>{blogDetail.excerpt}</p>
          <Image
            src={blogDetail.thumbnail}
            alt="blog thumnail"
            className="blog-page-thumbnail"
          />
          <div>{parse(blogDetail.content)}</div>
        </section>
      </div>
      <div className="blog-page-side-content">
        <div className="blog-page-tags">
          {tags ? (
            tags.map((tag, index) => {
              return (
                <span className="blog-page-tag" key={index}>
                  {`#${tag.tag.name}`}
                </span>
              );
            })
          ) : (
            <p>none</p>
          )}
        </div>
        <section className="blog-page-comment-like-bookmark">
          <IconContext.Provider
            value={{
              className: "blog-page-icon-1",
            }}
          >
            <div className="blog-page-icon-1-wrap">
              <SlLike /> <span>{likes ? likes : 0}</span>
            </div>
          </IconContext.Provider>
          <IconContext.Provider
            value={{
              className: "blog-page-icon-2",
            }}
          >
            <div className="blog-page-icon-2-wrap">
              <AiOutlineMessage />
              <span>{commentsDetail?.length}</span>
            </div>
          </IconContext.Provider>
          <IconContext.Provider
            value={{
              className: "blog-page-icon-3",
            }}
          >
            <div className="blog-page-icon-3-wrap">
              <CiBookmark />
            </div>
          </IconContext.Provider>
        </section>
        <section className="blog-page-comment-section">
          <div className="blog-page-comments-list">
            {commentsDetail ? (
              commentsDetail.map((comment, index) => {
                return (
                  <div className="comment" key={index}>
                    <Image
                      src={comment.user.avatar}
                      alt="user avatar"
                      className="comment-avatar"
                    />
                    <div>
                      <span className="comment-username">
                        {comment.user.username}
                      </span>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <h1>Loading...</h1>
            )}
          </div>
          {authStatus ? (
            <div className="blog-page-comment">
              <Input
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                type="text"
                Icon={() => (
                  <Image
                    src={profile}
                    alt="author avatar"
                    className="blog-page-comment-author-avatar"
                  />
                )}
                placeholder="Add a comment"
                className="blog-page-comment-post-input"
              />

              <IoSend
                className="blog-page-comment-post-btn"
                onClick={postComment}
              />
            </div>
          ) : (
            <p>
              Please Login to Comment !!{" "}
              <Link
                to="/login"
                style={{
                  color: "#fff",
                  fontStyle: "italic",
                  opacity: "0.3",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export default BlogPage;

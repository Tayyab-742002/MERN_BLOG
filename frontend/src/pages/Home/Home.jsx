import React, { useEffect, useState } from "react";
import "./Home.css";
import { BlogCard, GridLayout } from "../../components";
import PostService from "../../services/postServices";
import { VscListSelection } from "react-icons/vsc";
import InfiniteScroll from "react-infinite-scroll-component";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [hideFilter, setHideFilter] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortType, setSortType] = useState("asc"); // Default sort type
  const [sortBy, setSortBy] = useState("createdAt"); // Default sort by

  const toggleFilter = () => {
    setShowFilter((prevFilter) => {
      setHideFilter(true);
      return !prevFilter;
    });
  };

  const getBlogs = (initialLoad = false) => {
    const limit = initialLoad ? 20 : 15;
    PostService.getAllBlogs({ page, limit, sortType, sortBy })
      .then((result) => {
        console.log("RESPONSE LOG ", result);

        setHasMore(result.hasNextPage);

        setBlogs((prev) => {
          // Combine new and existing blogs
          const combinedBlogs = [...prev, ...result.docs];

          // Create a set to track unique blog IDs
          const uniqueBlogs = new Map();
          combinedBlogs.forEach((blog) => {
            uniqueBlogs.set(blog._id, blog); // Assuming each blog has a unique '_id' property
          });

          // Convert the map back to an array
          return Array.from(uniqueBlogs.values());
        });

        setPage(result.nextPage);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getBlogs(true);
  }, []);

  return (
    <div className="home-container">
      <header>
        <div className="home-select-btn">
          <button onClick={toggleFilter}>
            <VscListSelection />
          </button>
          <span>Popular</span>
        </div>
        <ul
          className={`home-selector ${
            showFilter ? "appear" : hideFilter ? "disappear" : ""
          }`}
        >
          <li>
            <button
              onClick={() => {
                setSortType("popular");
                setSortBy("votes");
              }}
            >
              Popular
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSortType("votes");
                setSortBy("votes");
              }}
            >
              By votes
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSortType("comments");
                setSortBy("comments");
              }}
            >
              By comments
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setSortType("date");
                setSortBy("date");
              }}
            >
              By Date
            </button>
          </li>
        </ul>
      </header>

      <InfiniteScroll
        className="grid-container"
        dataLength={blogs.length}
        next={getBlogs}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        scrollThreshold="200px"
        endMessage={<p>No more blogs to show.</p>}
      >
        {blogs.map((blog) => {
          return <BlogCard blog={blog} key={blog.id} />; // Assuming each blog has a unique 'id' property
        })}
      </InfiniteScroll>
    </div>
  );
}

export default Home;

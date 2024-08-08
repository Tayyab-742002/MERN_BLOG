import React, { useEffect, useState } from "react";
import TagService from "../../services/tagServices";
import "./Tags.css";
import { Link } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
function Tags() {
  const [tags, setTags] = useState([]);

  useEffect(() => {
    TagService.getAllTags()
      .then((result) => {
        const sortedTags = result.sort((a, b) => a.name.localeCompare(b.name));

        // Group tags by their starting letter
        const groupedTags = sortedTags.reduce((acc, tag) => {
          const firstLetter = tag.name.charAt(0).toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(tag);
          return acc;
        }, {});
        setTags(groupedTags);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="tags-container">
      {tags ? (
        <div className="tags">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry columnsCount={3} gutter={"1rem"} >
              {Object.keys(tags).map((letter) => (
                <div key={letter} className="tag-group">
                  <h2>{letter}</h2>
                  <div className="tag-items">
                    {tags[letter].map((tag, index) => (
                      <Link to={`tag/${tag.slug}`} key={index} className="tag">
                        {`#${tag.name}`}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
        </div>
      ) : (
        <h1>Loading..</h1>
      )}
    </div>
  );
}

export default Tags;

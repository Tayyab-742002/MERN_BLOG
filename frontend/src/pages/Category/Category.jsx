import React, { useEffect, useState } from "react";

import "./Category.css";
import { Link } from "react-router-dom";
import CategoryService from "../../services/categoryServices";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
function Category() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    CategoryService.getAllCategory()
      .then((result) => {
        const sortedCategory = result.sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        const groupedCategory = sortedCategory.reduce((acc, category) => {
          const firstLetter = category.name.charAt(0).toUpperCase();
          if (!acc[firstLetter]) {
            acc[firstLetter] = [];
          }
          acc[firstLetter].push(category);
          return acc;
        }, {});
        setCategories(groupedCategory);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="category-container">
      {categories ? (
        <div className="categories">
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry columnsCount={3} gutter={"1rem"}>
              {Object.keys(categories).map((letter) => (
                <div key={letter} className="category-group">
                  <h2>{letter}</h2>
                  <div className="category-items">
                    {categories[letter].map((category, index) => (
                      <Link
                        to={`category/${category.slug}`}
                        key={index}
                        className="category"
                      >
                        {`${category.name}`}
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

export default Category;

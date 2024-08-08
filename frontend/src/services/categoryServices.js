import axios from "axios";
class CategoryServices {
  constructor() {
    this.axios = new axios.create({
      baseURL: `http://localhost:8000/api/v1`,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.controller = new AbortController();
  }

  async getAllCategory() {
    try {
      const response = await this.axios.get("/category");
      if (!response.data) {
        throw Error("ERROR FETCHING ALL CATEGORIES");
      }
      return response.data.data;
    } catch (error) {
      console.log("ERRRO FETCHING ALL CATEGORIES");
      throw error;
    }
  }
  async addPostCategory({ blogId, categoryId }) {
    try {
      console.log("CALL ONE");

      const response = await this.axios.post(
        "/post-category",
        {
          blogId: blogId,
          categoryId: categoryId,
        },
        {
          signal: this.controller.signal,
          withCredentials: true,
        }
      );
      if (!response.data) {
        this.controller.abort();
        throw error;
      }
      return response.data;
    } catch (error) {
      console.log("ERROR ADDING CATEGORY TO BLOG");
    }
  }
  async getBlogsBySlug({ slug }) {
    try {
      const response = await this.axios(`/category/${slug}`);

      if (!response.data) {
        throw Error("ERROR FETCHING BLOGS");
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
}

const CategoryService = new CategoryServices();
export default CategoryService;

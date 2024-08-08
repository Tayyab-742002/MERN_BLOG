import axios from "axios";
class PostServices {
  constructor() {
    this.axios = new axios.create({
      baseURL: `http://localhost:8000/api/v1/blogs`,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.controller = new AbortController();
  }
  async postBlog({ title, content, excerpt = "", thumbnail }) {
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("thumbnail", thumbnail[0]);

      const response = await this.axios.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },

        signal: this.controller.signal,
        withCredentials: true,
      });
      if (!response.data) {
        this.controller.abort();
      }
      return response.data;
    } catch (error) {
      console.log(`ERROR POSTING BLOG : ${error.message}`);
    }
  }
  async deleteBlog({ blogId }) {
    try {
      const response = this.axios.delete("/", {
        params: {
          blogId: blogId,
        },
        signal: this.controller.signal,
      });
      if (!response.data) {
        this.controller.abort();
      }
      return response;
    } catch (error) {
      console.log(`ERROR WHILE DELETING BLOG POST : ${error}`);
    }
  }
  async updateBlog({ title, content, excerpt }) {}
  async getAllBlogs(query) {
    try {
      let response;
      if (query) {
        // console.log("Query", query);

        response = await this.axios.get("", {
          params: query,
        });
      } else {
        response = await this.axios.get("/");
      }

      if (!response.data) {
        console.log("ERROR Getting Blogs");
        this.controller.abort();
        throw Error(response.message);
      }
      // console.log("Blogs :", response.data.data.docs);

      return response.data.data;
    } catch (error) {
      console.log("ERROR Getting Blogs");
    }
  }
  async getBlogById() {}
  async getBlogBySlug(slug) {
    try {
      const response = await this.axios.get(`/blog/${slug}`);

      if (!response.data.success) {
        this.controller.abort();
        throw Error("Blog not Found");
      }
      return response.data.data;
    } catch (error) {
      console.log("ERROR Getting Blog");
    }
  }
}

const PostService = new PostServices();
export default PostService;

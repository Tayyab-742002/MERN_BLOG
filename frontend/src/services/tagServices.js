import axios from "axios";
class TagServices {
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
  async getBlogTags({ blogId }) {
    // console.log(blogId);

    try {
      const response = await this.axios.get(`/post-tags/blog/${blogId}`);
      if (!response.data) {
        throw Error("ERROR FETCHING TAGS");
      }
      return response.data.data;
    } catch (error) {
      console.log("ERROR FETCHING TAGS----");
    }
  }
  async getAllTags() {
    try {
      const response = await this.axios.get("/tags");
      if (!response.data) {
        throw Error("ERROR FETCHING ALL TAGS");
      }
      return response.data.data;
    } catch (error) {
      console.log("ERRRO FETCHING ALL TAGS");
    }
  }
  async getBlogsBySlug({ slug }) {
    try {
      const response = await this.axios(`/tags/tag/${slug}`);

      if (!response.data) {
        throw Error("ERROR FETCHING BLOGS");
      }

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
  async addTag({ name }) {
    try {
      const response = await this.axios.post(
        "/tags",
        {
          name: name,
        },
        {
          signal: this.controller.signal,
          withCredentials: true,
        }
      );
      if (!response.data) {
        this.controller.abort();
      }
      return response.data;
    } catch (error) {
      console.log("ERROR POSTING THE TAG");
    }
  }
  async addPostTag({ blogId, tagId }) {
    try {
      const response = await this.axios.post(
        "/post-tags",
        {
          blogId: blogId,
          tagId: tagId,
        },
        {
          signal: this.controller.signal,
          withCredentials: true,
        }
      );
      if (!response.data) {
        this.controller.abort();
      }
      return response.data;
    } catch (error) {
      console.log("ERROR ADDING TAG TO BLOG");
    }
  }
}

const TagService = new TagServices();
export default TagService;

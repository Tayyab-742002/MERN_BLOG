import axios from "axios";
class CommentServices {
  constructor() {
    this.axios = new axios.create({
      baseURL: `http://localhost:8000/api/v1/blogs/comments`,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.controller = new AbortController();
  }
  async getAllComments({ blogId, query = "" }) {
    try {
      if (!blogId) {
        throw Error("BlogId is required");
      }
      const response = await this.axios.get(
        `/${blogId}`,
        query ? { params: query } : null
      );
      if (!response.data.success) {
        this.controller.abort();
        console.log("ERROR GETTING COMMENTS");
      }
      return response.data.data.docs;
    } catch (error) {
      console.log("ERROR GETTING COMMENTS", error.message);
    }
  }
  async postComment({ blogId, content }) {
    try {
      // console.log(content, " ", blogId);
      if (!content || !blogId) {
        throw Error("Content or BlogId is required");
      }

      const response = await this.axios.post(
        `/${blogId}`,
        {
          content: content,
        },
        {
          signal: this.controller.signal,
          withCredentials: true,
        }
      );
      if (!response) {
        throw Error("ERROR POSTING COMMENT");
      }
      return response.data;
    } catch (error) {
      console.log("ERROR POSTING COMMENT");
    }
  }
  async updateComment() {}
  async deleteComment() {}
}

const CommentService = new CommentServices();
export default CommentService;

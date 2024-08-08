import axios from "axios";
class LikeServices {
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
  async getLikes({ blogId }) {
    try {
      if (!blogId) throw Error("Blog Id required");
      const response = await this.axios.get("/blog/likes", {
        params: {
          blogId: blogId,
        },
      });
      if (!response.data) {
        throw Error("ERROR GETTTING LIKES");
      }
      return response.data.data;
    } catch (error) {
      console.log("ERROR GETTING LIKES");
    }
  }
}

const LikeService = new LikeServices();
export default LikeService;

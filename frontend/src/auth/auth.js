import axios from "axios";
class AuthService {
  constructor() {
    this.axios = axios.create({
      baseURL: `http://localhost:8000/api/v1/users`,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.controller = new AbortController();
    this.axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status == 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(
              "http://localhost:8000/api/v1/users/refresh-token"
            );
            console.log("REFRESH ", response);
          } catch (error) {
            throw error;
          }
        }
      }
    );
  }
  async createUser({ username, fullname, email, password, profileImage }) {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("fullname", fullname);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("profileImage", profileImage[0]);
      const response = await this.axios.post("/register-user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal: this.controller.signal,
      });
      if (!response.data) {
        this.controller.abort();
        throw response;
      }

      return await this.loginUser({ username, email, password });
    } catch (error) {
      throw error.response;
    }
  }
  async loginUser({ username, email, password }) {
    try {
      const response = await this.axios.post(
        "/login-user",
        {
          username: username,
          email: email,
          password: password,
        },
        {
          signal: this.controller.signal,
          withCredentials: true,
        }
      );
      if (!response.data) {
        this.controller.abort();
        throw Error(response.message);
      }
      return response;
    } catch (error) {
      throw error.response;
    }
  }
  async getCurrentUser() {
    try {
      const response = await this.axios.get("/current-user", {
        signal: this.controller.signal,
        withCredentials: true,
      });
      if (response.status === 200 && response.data.success) {
        return response;
      } else {
        throw new Error("User not authenticated");
      }
    } catch (error) {
      throw error.response;
    }
  }
  async refreshAccessToken() {
    try {
      const response = await this.axios.post("/refresh-token");
      if (!response.data) {
        throw Error("ERROR REFRESHING TOKEN");
      }
      return response.data;
    } catch (error) {
      throw Error("ERROR REFRESHING TOKEN");
    }
  }
  async logoutUser() {
    try {
      const response = await this.axios.post(
        "/logout-user",
        {},
        {
          withCredentials: true,
          signal: this.controller.signal,
        }
      );
      return response;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request was aborted");
      } else {
        console.log("ERROR LOGOUT USER", error);
      }
      throw error.response;
    }
  }
}

const authService = new AuthService();
export default authService;

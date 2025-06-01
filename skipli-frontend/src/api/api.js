import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

export const createAccessCode = async (email) => {
  try {
    const response = await api.post("/create-access-code", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error sending access code";
  }
};

export const validateAccessCode = async (email, accessCode) => {
  try {
    const response = await api.post("/validate-access-code", { email, accessCode });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error verifying access code";
  }
};

export const searchGithubUsers = async (query, page = 1, perPage = 10) => {
  try {
    const response = await api.get("/search-github-users", {
      params: { q: query, page, per_page: perPage },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error searching GitHub users";
  }
};

export const getGithubUser = async (id) => {
  try {
    const response = await api.get(`/github-user/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error fetching GitHub user";
  }
};

export const likeGithubUser = async (email, githubUserId) => {
  try {
    const response = await api.post("/like-github-user", { email, githubUserId });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error liking GitHub user";
  }
};

export const getUserProfile = async (email) => {
  try {
    const response = await api.get(`/user-profile/${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Error fetching user profile";
  }
};
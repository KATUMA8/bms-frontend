import { axiosInstance } from "./axiosInstance";

export const userApi = {
  // ログイン
  login: async (credentials) => {
    const response = await axiosInstance.post("/users/login", credentials);
    return response.data;
  },

  // ログアウト
  logout: async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
  },

  // 現在のログインユーザー情報取得
  getCurrentUser: async () => {
    const response = await axiosInstance.get("/users/current");
    return response.data;
  },
};
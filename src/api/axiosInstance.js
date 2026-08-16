import axios from "axios";

// 共通のベースURLを持つAxiosインスタンスを作成
export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 必要に応じて調整
  headers: {
    "Content-Type": "application/json",
  },
});

// レスポンス・エラーのインターセプター（共通エラーハンドリング）
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 403) {
      alert("アクセス権限がありません（403 Forbidden）。");
    } else if (status === 500) {
      alert("サーバー側でエラーが発生しました。");
    }
    // エラーをそのまま呼び出し元に返す（個別にcatchしたい場合のため）
    return Promise.reject(error);
  }
);
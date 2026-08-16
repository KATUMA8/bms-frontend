import { axiosInstance } from "./axiosInstance";

export const clientApi = {
  // 顧客一覧の取得（ページネーション・カナ絞り込み）[cite: 15]
  getList: async (page = 1, kana = "") => {
    const response = await axiosInstance.get("/clients", {
      params: { page, kana },
    });
    return response.data;
  },

  // 顧客の新規登録[cite: 15]
  add: async (clientData) => {
    const response = await axiosInstance.post("/clients", clientData);
    return response.data;
  },

  // 顧客詳細の取得（案件一覧のページネーション）[cite: 15]
  getDetail: async (clientId, page = 1) => {
    const response = await axiosInstance.get(`/clients/${clientId}`, {
      params: { page },
    });
    return response.data;
  },

  // 顧客の関連資料一覧取得[cite: 15]
  getDocuments: async (clientId) => {
    const response = await axiosInstance.get(`/clients/${clientId}/documents`);
    return response.data;
  },

  // 顧客関連資料の登録（ファイルアップロード）[cite: 15]
  addDocument: async (clientId, formData) => {
    const response = await axiosInstance.post(`/clients/${clientId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 顧客関連資料の削除[cite: 15]
  deleteDocument: async (clientId, docId) => {
    const response = await axiosInstance.delete(`/clients/${clientId}/documents/${docId}`);
    return response.data;
  },
};
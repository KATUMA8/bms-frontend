import { axiosInstance } from "./axiosInstance";

export const clientApi = {
  // 顧客一覧の取得（ページネーション・カナ絞り込み）
  getList: async (page = 1, kana = "", isAdmin = true) => {
    const prefix = isAdmin ? "" : "/contractee";
    const params = { page };
    if (kana) {
      params.kana = kana;
    }
    const response = await axiosInstance.get(`${prefix}/clients`, { params });
    return response.data;
  },

  // 顧客の新規登録
  add: async (clientData) => {
    const response = await axiosInstance.post("/clients", clientData);
    return response.data;
  },

  // 顧客詳細の取得（案件一覧のページネーション）
  getDetail: async (clientId, page = 1, isAdmin = true) => {
    const prefix = isAdmin ? "" : "/contractee";
    const response = await axiosInstance.get(`${prefix}/clients/${clientId}`, {
      params: { page },
    });
    return response.data;
  },

  // 顧客の関連資料一覧取得
  getDocuments: async (clientId, isAdmin = true) => {
    const prefix = isAdmin ? "" : "/contractee";
    const response = await axiosInstance.get(`${prefix}/clients/${clientId}/documents`);
    return response.data;
  },

  // 顧客関連資料の登録（ファイルアップロード）
  addDocument: async (clientId, formData) => {
    const response = await axiosInstance.post(`/clients/${clientId}/documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // 顧客関連資料の削除
  deleteDocument: async (clientId, docId) => {
    const response = await axiosInstance.delete(`/clients/${clientId}/documents/${docId}`);
    return response.data;
  },
};
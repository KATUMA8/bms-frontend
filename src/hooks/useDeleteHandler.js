import { useNavigate } from "react-router";
import { axiosInstance } from "../api/axiosInstance";

export function useDeleteHandler(deleteUrl, redirectUrl, successMessage) {
  const navigate = useNavigate();
  const handleDelete = (confirmMessage = "本当に削除しますか？") => {
    if (window.confirm(confirmMessage)) {
      axiosInstance.delete(deleteUrl)
        .then(() => {
          navigate(redirectUrl, { state: { message: successMessage } });
        })
        .catch((error) => {
          console.error("削除エラー:", error);
          alert("削除に失敗しました。");
        });
    }
  };
  return { handleDelete };
}
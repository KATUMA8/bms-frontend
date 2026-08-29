import { normalizeKana } from "../utils/formatUtils";

/**
 * フリガナの入力値自動正規化（全角カタカナ変換など）を行うカスタムフック
 * @param {Function} setFormData フォームのstateを更新するセッター関数
 * @param {string} fieldName 対象のフィールド名（例: "clientKana", "companyKana"）
 */
export function useKanaNormalization(setFormData, fieldName) {
  const handleKanaBlurOrComposition = (e) => {

    if (!fieldName) {
      console.warn("useKanaNormalization: fieldName が指定されていません。");
    }

    const normalized = normalizeKana(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: normalized,
    }));
  };

  return { handleKanaBlurOrComposition };
}
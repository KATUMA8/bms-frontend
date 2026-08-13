import { normalizeKana } from "../utils/formatUtils";

/**
 * フリガナの入力値自動正規化（全角カタカナ変換など）を行うカスタムフック
 * @param {Function} setFormData フォームのstateを更新するセッター関数
 * @param {string} fieldName 対象のフィールド名（デフォルトは "clientKana"）
 */
export function useKanaNormalization(setFormData, fieldName = "clientKana") {
  const handleKanaBlurOrComposition = (e) => {
    const normalized = normalizeKana(e.target.value);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: normalized,
    }));
  };

  return { handleKanaBlurOrComposition };
}
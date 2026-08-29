import { useState } from "react";
import { normalize } from "../utils/formatUtils";
import { fetchAddressFromApi } from "../api/postalApi";

export function usePostalCode(
  initialValue = "",
  onAddressFound,
  onPostalChange,
) {
  const [postalCode, setPostalCode] = useState(initialValue);

  // ① 入力中は一切加工せず、そのまま素直に受け取る
  const handlePostalChange = (e) => {
    setPostalCode(e.target.value);
  };

  // ② 変換確定時やフォーカスアウト時に、はじめて綺麗に半角化＆7桁に整えてAPIを叩く
  const formatAndFetchPostalCode = async (e) => {
    // イベントオブジェクト、または直接渡された値のどちらにも対応できるようにする
    const targetValue =
      e && e.target ? e.target.value : e !== undefined ? e : postalCode;

    const cleaned = normalize(targetValue).slice(0, 7);
    setPostalCode(cleaned);
    if (onPostalChange) onPostalChange(cleaned);

    if (cleaned.length === 7 && onAddressFound) {
      const fullAddress = await fetchAddressFromApi(cleaned);
      if (fullAddress) {
        onAddressFound(fullAddress);
      }
    }
  };

  return {
    postalCode,
    setPostalCode,
    handlePostalChange,
    formatAndFetchPostalCode,
  };
}

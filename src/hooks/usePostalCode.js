import { useState } from "react";
import { normalize } from "../utils/formatUtils";
import { fetchAddressFromApi } from "../api/postalApi"; // ★APIファイルをインポート

export function usePostalCode(initialValue = "", onAddressFound, onPostalChange) {
  const [postalCode, setPostalCode] = useState(initialValue);

  const handlePostalChange = (e) => {
    const cleaned = normalize(e.target.value).slice(0, 7);
    setPostalCode(cleaned);
    if (onPostalChange) onPostalChange(cleaned);
  };

  const formatAndFetchPostalCode = async (valueToFormat) => {
    let cleaned = normalize(valueToFormat !== undefined ? valueToFormat : postalCode).slice(0, 7);
    setPostalCode(cleaned);
    if (onPostalChange) onPostalChange(cleaned);

    if (cleaned.length === 7 && onAddressFound) {
      // APIファイルを呼び出して住所を取得する
      const fullAddress = await fetchAddressFromApi(cleaned);
      if (fullAddress) {
        onAddressFound(fullAddress);
      }
    }
  };

  // 修正：handlePostalCode ではなく handlePostalChange を返す
  return { postalCode, setPostalCode, handlePostalChange, formatAndFetchPostalCode };
}
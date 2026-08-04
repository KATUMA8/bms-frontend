import { useState } from "react";

export function usePostalCode(initialValue = "") {
  const [postalCode, setPostalCode] = useState(initialValue);

  // 郵便番号の入力変更ハンドラー
  const handlePostalChange = (e) => {
    let value = e.target.value;

    // 1. 全角数字を半角数字に変換
    value = value.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));

    // 2. 数字以外の文字（ハイフンなど）をすべて除去
    value = value.replace(/[^0-9]/g, "");

    // 3. 最大7桁までに制限
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    setPostalCode(value);
  };

  return {
    postalCode,
    setPostalCode,
    handlePostalChange,
  };
}
import { useState } from "react";
import { normalize } from "../utils/formatUtils";

export function usePhone(initialValue = "") {
  const [phone, setPhone] = useState(initialValue);

  // ① 入力中は一切加工せず、そのまま素直に受け取る（フリガナと同じ挙動）
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  // ② フォーカスが外れた時（onBlur）に初めて綺麗に半角化＆数字以外を削除する
  const formatPhoneOnBlur = (e) => {
    const cleaned = normalize(e.target.value).slice(0, 11);
    setPhone(cleaned);
  };

  return {
    phone,
    setPhone,
    handlePhoneChange,
    formatPhoneOnBlur, // ← BaseEntityForm 側に返す
  };
}
import { useState } from "react";
import { normalize } from "../utils/formatUtils";

export function usePhone(initialValue = "") {
  const [phone, setPhone] = useState(initialValue);

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    // 数字のみに正規化し、一律で最大11桁に制限する
    const cleaned = normalize(value).slice(0, 11);
    setPhone(cleaned);
  };

  return {
    phone,
    setPhone,
    handlePhoneChange,
  };
}
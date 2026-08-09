import { useState } from "react";
import axios from "axios";
import { normalize } from "../utils/formatUtils"; // ★ normalizeをインポート

export function usePostalCode(initialValue = "", onAddressFound, onPostalChange) {
  const [postalCode, setPostalCode] = useState(initialValue);

  const handlePostalChange = (e) => {
    const value = e.target.value;

    // ★ここで入力された瞬間に normalize を通して、数字以外（ハイフンや全角など）を即座に消去＆半角に変換！
    const cleaned = normalize(value);

    // 最大7桁までに制限
    const limited = cleaned.slice(0, 7);

    setPostalCode(limited);
    if (onPostalChange) {
      onPostalChange(limited);
    }
  };

  const formatAndFetchPostalCode = async (valueToFormat) => {
    const rawValue = valueToFormat !== undefined ? valueToFormat : postalCode;
    let cleaned = normalize(rawValue);

    if (cleaned.length > 7) {
      cleaned = cleaned.slice(0, 7);
    }

    setPostalCode(cleaned);
    if (onPostalChange) {
      onPostalChange(cleaned);
    }

    if (cleaned.length === 7 && onAddressFound) {
      try {
        const response = await axios.get(
          `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleaned}`
        );
        if (response.data.results && response.data.results[0]) {
          const r = response.data.results[0];
          const fullAddress = `${r.address1}${r.address2}${r.address3}`;
          onAddressFound(fullAddress);
        }
      } catch (error) {
        console.error("住所の取得に失敗しました", error);
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

// export function usePostalCode(initialValue = "", onAddressFound, onPostalChange) {
//   const [postalCode, setPostalCode] = useState(initialValue);

//   const handlePostalChange = (e) => {
//     const value = e.target.value;
//     setPostalCode(value);
//     if (onPostalChange) {
//       onPostalChange(value);
//     }
//   };

//   const formatAndFetchPostalCode = async (valueToFormat) => {
//     const rawValue = valueToFormat !== undefined ? valueToFormat : postalCode;

//     // ★ formatUtils.js の normalize を使って一発で数字のみに正規化＆抽出！
//     let cleaned = normalize(rawValue);

//     // どんなに長くても、強制的に「先頭の7文字」だけを切り出す
//     if (cleaned.length > 7) {
//       cleaned = cleaned.slice(0, 7);
//     }

//     setPostalCode(cleaned);
//     if (onPostalChange) {
//       onPostalChange(cleaned);
//     }

//     if (cleaned.length === 7 && onAddressFound) {
//       try {
//         const response = await axios.get(
//           `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${cleaned}`
//         );
//         if (response.data.results && response.data.results[0]) {
//           const r = response.data.results[0];
//           const fullAddress = `${r.address1}${r.address2}${r.address3}`;
//           onAddressFound(fullAddress);
//         }
//       } catch (error) {
//         console.error("住所の取得に失敗しました", error);
//       }
//     }
//   };

//   return {
//     postalCode,
//     setPostalCode,
//     handlePostalChange,
//     formatAndFetchPostalCode,
//   };
// }
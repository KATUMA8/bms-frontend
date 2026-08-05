// //フリガナの登録処理成型フォーマット

// export const normalizeKana = (inputKana) => {
//   if (!inputKana) return "";

//   let result = "";

//   // 1. 1文字ずつループして、許可する文字以外を排除しつつ、ひらがなはカタカナに変換する
//   for (let i = 0; i < inputKana.length; i++) {
//     const c = inputKana.charAt(i);
//     const code = c.charCodeAt(0);

//     // 全角ひらがな（\u3041 〜 \u3096）なら全角カタカナに変換して追加
//     if (code >= 0x3041 && code <= 0x3096) {
//       result += String.fromCharCode(code + 0x60);
//     }
//     // すでに全角カタカナ（\u30A1 〜 \u30F6）、または長音「ー」であればそのまま追加
//     else if ((code >= 0x30A1 && code <= 0x30F6) || c === "ー") {
//       result += c;
//     }
//     // ※それ以外の漢字、英字、記号などは追加しない（＝自動で消える）
//   }

//   // 2. 全角・半角スペースを除去
//   return result.replace(/[\s ]/g, "");
// };


/**
 * 1. 保存用・正規化：全角数字を半角にし、数字以外の文字をすべて削除する
 */
export function normalize(val) {
  if (val === null || val === undefined) return "";
  const stringVal = String(val);

  // 全角数字を半角数字に置換
  const result = stringVal
    .replace(/０/g, "0").replace(/１/g, "1").replace(/２/g, "2")
    .replace(/３/g, "3").replace(/４/g, "4").replace(/５/g, "5")
    .replace(/６/g, "6").replace(/７/g, "7").replace(/８/g, "8")
    .replace(/９/g, "9");

  // 数字以外をすべて削除
  return result.replace(/[^0-9]/g, "");
}

/**
 * 2. 表示用：電話番号の整形（3-4-4や市外局番に応じたハイフン付与）
 */
export function formatPhone(phone) {
  if (!phone) return "";
  const p = normalize(phone);
  const len = p.length;

  // 携帯・IP (11桁) -> 3-4-4
  if (len === 11 && (p.startsWith("090") || p.startsWith("080") || p.startsWith("070") || p.startsWith("050"))) {
    return `${p.substring(0, 3)}-${p.substring(3, 7)}-${p.substring(7)}`;
  }
  // 10桁の固定電話
  if (len === 10) {
    if (p.startsWith("03") || p.startsWith("06")) {
      return `${p.substring(0, 2)}-${p.substring(2, 6)}-${p.substring(6)}`;
    }
    if (p.startsWith("0193")) { // 4桁市外局番の特別処理
      return `${p.substring(0, 4)}-${p.substring(4, 6)}-${p.substring(6)}`;
    }
    return `${p.substring(0, 3)}-${p.substring(3, 6)}-${p.substring(6)}`;
  }
  // 11桁の固定電話 (4桁市外局番など)
  if (len === 11) {
    return `${p.substring(0, 4)}-${p.substring(4, 7)}-${p.substring(7)}`;
  }
  return p;
}

/**
 * 3. 表示用：郵便番号の整形（XXX-XXXXの形にする）
 */
export function formatPostal(code) {
  if (!code) return "";
  const c = normalize(code);
  if (c.length === 7) {
    return `${c.substring(0, 3)}-${c.substring(3)}`;
  }
  return c;
}

/**
 * 4. 読み仮名用の正規化（ひらがな → 全角カタカナ変換 ＆ スペース除去）
 */
export function normalizeKana(kana) {
  if (!kana) return "";

  // 1. 全角ひらがなを全角カタカナに変換
  let sb = "";
  for (let i = 0; i < kana.length; i++) {
    const c = kana.charCodeAt(i);
    // ひらがなのunicode範囲（ぁ〜ん）
    if (c >= 0x3041 && c <= 0x3096) {
      sb += String.fromCharCode(c + 0x60);
    } else {
      sb += kana[i];
    }
  }

  // 2. スペース（半角・全角）を削除
  return sb.replace(/[\s ]/g, "");
}
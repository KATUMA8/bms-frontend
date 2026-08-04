export const normalizeKana = (inputKana) => {
  if (!inputKana) return "";

  let result = "";

  // 1. 1文字ずつループして、許可する文字以外を排除しつつ、ひらがなはカタカナに変換する
  for (let i = 0; i < inputKana.length; i++) {
    const c = inputKana.charAt(i);
    const code = c.charCodeAt(0);

    // 全角ひらがな（\u3041 〜 \u3096）なら全角カタカナに変換して追加
    if (code >= 0x3041 && code <= 0x3096) {
      result += String.fromCharCode(code + 0x60);
    }
    // すでに全角カタカナ（\u30A1 〜 \u30F6）、または長音「ー」であればそのまま追加
    else if ((code >= 0x30A1 && code <= 0x30F6) || c === "ー") {
      result += c;
    }
    // ※それ以外の漢字、英字、記号などは追加しない（＝自動で消える）
  }

  // 2. 全角・半角スペースを除去
  return result.replace(/[\s ]/g, "");
};
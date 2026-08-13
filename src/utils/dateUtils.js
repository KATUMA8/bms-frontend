// 期限日文字列 (YYYY-MM-DD) から判定し、直近のみ専用のテキスト、それ以外は日付を返す共通関数
export const getRemainingDaysText = (deadlineDateStr, todayStr) => {
  if (!deadlineDateStr) return "期限設定なし";

  const deadline = new Date(deadlineDateStr);
  const today = new Date(todayStr);

  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "期限切れ";
  } else if (diffDays === 0) {
    return "本日期限";
  } else if (diffDays === 1) {
    return "あす期限";
  } else {
    // 2日以上先の場合は通常通り日付を返す
    return deadlineDateStr;
  }
};
import { useState } from "react";

export function usePaginationFilter(items, itemsPerPage = 10) {
  const [currentKana, setCurrentKana] = useState("");
  const [currentPage, setCurrentPage] = useState(1);



  // 1. カナ絞り込み
  const filteredItems = items.filter((c) => {
    if (currentKana === "") return true;

// 名前の頭文字、もしくはふりがなの頭文字を取得
    const firstChar = c.clientKana ? c.clientKana.charAt(0) : c.clientName.charAt(0);

    switch (currentKana) {
      case "あ行": return ["あ","い","う","え","お","ア","イ","ウ","エ","オ"].includes(firstChar);
      case "か行": return ["か","き","く","け","こ","カ","キ","ク","ケ","コ"].includes(firstChar);
      case "さ行": return ["さ","し","す","せ","そ","サ","シ","ス","セ","ソ"].includes(firstChar);
      case "た行": return ["た","ち","つ","て","と","タ","チ","ツ","テ","ト"].includes(firstChar);
      case "な行": return ["な","に","ぬ","ね","の","ナ","ニ","ヌ","ネ","ノ"].includes(firstChar);
      case "は行": return ["は","ひ","ふ","へ","ほ","ハ","ヒ","フ","ヘ","ホ"].includes(firstChar);
      case "ま行": return ["ま","み","む","め","も","マ","ミ","ム","メ","モ"].includes(firstChar);
      case "や行": return ["や","ゆ","よ","ヤ","ユ","ヨ"].includes(firstChar);
      case "ら行": return ["ら","り","る","れ","ろ","ラ","リ","ル","レ","ロ"].includes(firstChar);
      case "わ行": return ["わ","を","ん","ワ","ヲ","ン"].includes(firstChar);
      default: return true;
    }
  });

  // 2. ページネーション計算
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // ハンドラー
  const handleSelectKana = (kana) => {
    setCurrentKana(kana);
    setCurrentPage(1); // カナを変えたら1ページ目に戻す
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return {
    currentKana,
    currentPage,
    totalPages,
    currentItems,
    handleSelectKana,
    handlePageChange,
  };
}
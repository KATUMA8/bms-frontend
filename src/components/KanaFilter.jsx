import { Link } from "react-router";

export default function KanaFilter({ currentKana, onSelectKana }) {
  const kanaList = [
    "あ行",
    "か行",
    "さ行",
    "た行",
    "な行",
    "は行",
    "ま行",
    "や行",
    "ら行",
    "わ行",
  ];

  return (
    <div className="kana-filter">
      {/* 全件ボタン */}
      <Link
        to="#"
        onClick={(e) => {
          e.preventDefault();
          onSelectKana("");
        }}
        className={currentKana === "" ? "active" : ""}
      >
        全件
      </Link>

      {/* 各行のボタン */}
      {kanaList.map((k) => (
        <Link
          key={k}
          to="#"
          onClick={(e) => {
            e.preventDefault();
            onSelectKana(k);
          }}
          className={k === currentKana ? "active" : ""}
        >
          {k}
        </Link>
      ))}
    </div>
  );
}

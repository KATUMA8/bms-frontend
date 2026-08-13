import { useState, useEffect } from "react";
import Pagination from "../../components/Pagination";
import KanaFilter from "../../components/KanaFilter";
import AlertMessage from "../../components/AlertMessage";
import { Link, useLocation } from "react-router";
import axios from "axios";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import NoDataMessage from "../../components/NoDataMessage";

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentKana, setCurrentKana] = useState("");

  // ★ 遷移元のstateからメッセージを受け取る
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  // Spring BootのAPIからAxiosを使ってデータを取得
  useEffect(() => {
    const params = {
      page: currentPage,
    };
    if (currentKana) {
      params.kana = currentKana;
    }

    axios
      .get("http://localhost:8080/api/clients", { params })
      .then((res) => {
        setClients(res.data.clients);
        setTotalPages(res.data.totalPages);
      })
      .catch((error) => {
        console.error("通信エラー:", error);
      });
  }, [currentPage, currentKana]); // ページかカナが変わるたびに再取得

  // カナフィルターが選択されたときのハンドラー
  const handleSelectKana = (kana) => {
    setCurrentKana(kana);
    setCurrentPage(1); // 絞り込み時は1ページ目に戻す
  };

  // ページが変更されたときのハンドラー
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="content-wrapper">
      <PageHeader title="顧客管理" />

      {/* ★ 共通化した AlertMessage コンポーネントを使用（5秒後に自動で消えます） */}
      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="action-bar">
        <Button to="/clients/add" variant="primary">
          新規顧客登録
        </Button>
      </div>

      <div className="card">
        <h3>顧客一覧</h3>

        {/* カナフィルター */}
        <KanaFilter currentKana={currentKana} onSelectKana={handleSelectKana} />

        {/* 顧客テーブル */}
        {clients && clients.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>顧客名</th>
                <th>郵便番号</th>
                <th>住所</th>
                <th>電話番号</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.clientId}>
                  <td data-label="顧客名">{c.clientName}</td>
                  <td data-label="郵便番号">{c.formattedClientPostalcode}</td>
                  <td data-label="住所">{c.clientAddress}</td>
                  <td data-label="電話番号">{c.formattedClientPhone}</td>
                  <td data-label="操作">
                    <Button to={`/clients/${c.clientId}`} variant="primary">
                      詳細
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <NoDataMessage />
        )}

        {/* 共通化したページネーションを呼び出す */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

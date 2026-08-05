import { useState } from "react";
import Pagination from "../../components/Pagination";
import KanaFilter from "../../components/KanaFilter";
import { Link } from "react-router";
import { usePaginationFilter } from "../../hooks/usePaginationFilter";

export default function ClientList() {
  // ダミーデータ（本来はAPIやバックエンドから取得します）
  const [clients] = useState([
    {
      clientId: 1,
      clientName: "株式会社テスト商事",
      clientKana: "カブシキガイシャテスト",
      formattedClientPostalcode: "100-0001",
      clientAddress: "東京都千代田区1-1",
      formattedClientPhone: "03-1234-5678",
    },
    {
      clientId: 2,
      clientName: "サンプル工業",
      clientKana: "サンプルコウギョウ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 3,
      clientName: "サンプル工業",
      clientKana: "サンプルコウギョウ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 4,
      clientName: "サンプル工業",
      clientKana: "サンプルコウギョウ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 5,
      clientName: "あ",
      clientKana: "ア",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 6,
      clientName: "か",
      clientKana: "カ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 7,
      clientName: "さ",
      clientKana: "サ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 8,
      clientName: "た",
      clientKana: "タ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
    {
      clientId: 9,
      clientName: "わ",
      clientKana: "ワ",
      formattedClientPostalcode: "530-0001",
      clientAddress: "大阪府大阪市北区2-2",
      formattedClientPhone: "06-9876-5432",
    },
  ]);

  const {
    currentKana,
    currentPage,
    totalPages,
    currentItems: currentClients,
    handleSelectKana,
    handlePageChange,
  } = usePaginationFilter(clients, 8); // 1ページ8件表示の例

  return (
      <div className="content-wrapper">
        <header>
          <h1>顧客管理</h1>
        </header>

        {/* 成功メッセージ用（必要なときに表示） */}
        {/* <div className="alert alert-success">登録が完了しました</div> */}

        <div className="action-bar">
          <Link to="/clients/add" className="btn btn-primary">
            新規顧客登録
          </Link>
        </div>

        <div className="card">
          <h3>顧客一覧</h3>

          {/* カナフィルター */}
          <KanaFilter
            currentKana={currentKana}
            onSelectKana={handleSelectKana}
          />

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
                {currentClients.map((c) => (
                  <tr key={c.clientId}>
                    <td data-label="顧客名">{c.clientName}</td>
                    <td data-label="郵便番号">{c.formattedClientPostalcode}</td>
                    <td data-label="住所">{c.clientAddress}</td>
                    <td data-label="電話番号">{c.formattedClientPhone}</td>
                    <td data-label="操作">
                      <Link
                        to={`/clients/${c.clientId}`}
                        className="btn btn-primary"
                      >
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-data">
              現在、登録されている顧客はありません。
            </div>
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

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

export default function ClientDetail() {

    const { id } = useParams(); // URLから顧客IDを取得 (例: /clients/1 の "1")
    const navigate = useNavigate();

  // ダミーデータまたはAPIから取得するデータ用のステート
  const [client, setClient] = useState({
    clientId: id,
    clientName: "サンプル株式会社",
    clientKana: "サンプルカブシキガイシャ",
    formattedClientPostalcode: "123-4567",
    clientAddress: "東京都文京区...",
    formattedClientPhone: "03-0000-0000",
  });

  const [projects, setProjects] = useState([
    { projectId: 1, projectName: "システム開発案件", status: "進行中" },
    { projectId: 2, projectName: "ホームページ改修", status: "完了" },
  ]);

  const [successMessage, setSuccessMessage] = useState("");

  // 削除処理のハンドラー
  const handleDelete = () => {
    if (window.confirm("本当に削除しますか？")) {
      // 削除API呼び出し等の処理
      navigate("/clients");
    }
  };

  return (
    <div className="content-wrapper">
      <header>
        <h1>顧客詳細</h1>
      </header>

      {/* 成功メッセージ */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* 顧客基本情報カード */}
      <div className="card">
        <h3>顧客基本情報</h3>
        <dl className="detail-list">
          <div className="detail-item">
            <dt>顧客名</dt>
            <dd>{client.clientName}</dd>
          </div>
          <div className="detail-item">
            <dt>読み仮名</dt>
            <dd>{client.clientKana}</dd>
          </div>
          <div className="detail-item">
            <dt>郵便番号</dt>
            <dd>{client.formattedClientPostalcode}</dd>
          </div>
          <div className="detail-item">
            <dt>住所</dt>
            <dd>{client.clientAddress}</dd>
          </div>
          <div className="detail-item">
            <dt>電話番号</dt>
            <dd>{client.formattedClientPhone}</dd>
          </div>
          <div className="detail-item">
            <dt>関連資料</dt>
            <dd>
              <Link to={`/clients/${client.clientId}/documents`}>資料一覧へ</Link>
            </dd>
          </div>
        </dl>

        <div className="action-buttons-form">
          <Link to={`/clients/edit/${client.clientId}`} className="btn">編集</Link>
          <button type="button" className="btn" onClick={handleDelete}>削除</button>
          <Link to="/clients" className="btn">顧客一覧へ戻る</Link>
        </div>
      </div>

      {/* 関連案件一覧カード */}
      <div className="card">
        <h3>関連案件一覧</h3>
        {projects.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>案件名</th>
                <th>ステータス</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.projectId}>
                  <td data-label="案件名">{p.projectName}</td>
                  <td data-label="ステータス">{p.status}</td>
                  <td data-label="操作">
                    <Link to={`/projects/${p.projectId}`} className="btn">詳細</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">現在、この顧客に紐づく案件はありません。</div>
        )}
      </div>
    </div>
  );
}
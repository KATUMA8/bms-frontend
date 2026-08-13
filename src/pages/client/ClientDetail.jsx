import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import { formatPhone, formatPostal } from "../../utils/formatUtils";
import AlertMessage from "../../components/AlertMessage";
import axios from "axios";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import NoDataMessage from "../../components/NoDataMessage";
import Pagination from "../../components/Pagination";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  // Spring BootのAPIから顧客詳細と指定ページの案件データを取得
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/clients/${id}?page=${currentPage}`)
      .then((res) => {
        setClient(res.data.client);
        setProjects(res.data.projects || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
        alert("顧客情報の取得に失敗しました。");
      });
  }, [id, currentPage]);

  // ページネーションのボタンが押されたときのハンドラー
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // 削除処理のハンドラー
  const handleDelete = () => {
    if (window.confirm("本当に削除しますか？")) {
      axios
        .delete(`http://localhost:8080/api/clients/${id}`)
        .then(() => {
          navigate("/clients", {
            state: { message: "顧客情報を削除しました。" },
          });
        })
        .catch((error) => {
          console.error("削除エラー:", error);
          alert("削除に失敗しました。");
        });
    }
  };

  if (!client) {
    return <Loading />;
  }

  return (
    <div className="content-wrapper">
      <PageHeader title="顧客詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      {/* 顧客基本情報カード */}
      <div className="card">
        <h3>顧客基本情報</h3>
        <dl className="detail-list">
          <div className="detail-item">
            <dt>顧客名</dt>
            <dd>{client.clientName}</dd>
          </div>
          <div className="detail-item">
            <dt>フリガナ</dt>
            <dd>{client.clientKana}</dd>
          </div>
          <div className="detail-item">
            <dt>郵便番号</dt>
            <dd>{formatPostal(client.clientPostalcode)}</dd>
          </div>
          <div className="detail-item">
            <dt>住所</dt>
            <dd>{client.clientAddress}</dd>
          </div>
          <div className="detail-item">
            <dt>電話番号</dt>
            <dd>{formatPhone(client.clientPhone)}</dd>
          </div>
          <div className="detail-item">
            <dt>関連資料</dt>
            <dd>
              <Link to={`/clients/${client.clientId}/documents`}>
                資料一覧へ
              </Link>
            </dd>
          </div>
        </dl>

        <div className="action-buttons-form">
          <Button to={`/clients/edit/${client.clientId}`} variant="primary">
            編集
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            削除
          </Button>
          <Button to="/clients" variant="cancel">
            顧客一覧へ戻る
          </Button>
        </div>
      </div>

      {/* 関連案件一覧カード */}
      <div className="card">
        <h3>関連案件一覧</h3>
        {projects.length > 0 ? (
          <>
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
                      <Link to={`/projects/${p.projectId}`} className="btn">
                        詳細
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* サーバーサイド・ページング用コンポーネント */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <NoDataMessage message="現在、この顧客に紐づく案件はありません。" />
        )}
      </div>
    </div>
  );
}
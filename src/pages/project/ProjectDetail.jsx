import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router";
import AlertMessage from "../../components/AlertMessage";
import axios from "axios";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import { getRemainingDaysText } from "../../utils/dateUtils";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 遷移元からのメッセージ
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  // ★ 追加: 見積新規登録用のフォーム入力ステート
  const [quoteFile, setQuoteFile] = useState(null);
  const [deadlineDate, setDeadlineDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // 案件詳細データ取得
  const fetchProjectDetail = () => {
    axios
      .get(`http://localhost:8080/api/projects/${id}`)
      .then((res) => {
        setProjectData(res.data);
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
        alert("案件情報の取得に失敗しました。");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProjectDetail();
  }, [id]);

  // 案件削除処理
  const handleDelete = () => {
    if (window.confirm("案件を削除しますか？")) {
      axios
        .delete(`http://localhost:8080/api/projects/${id}`)
        .then(() => {
          navigate("/projects", {
            state: { message: "案件情報を削除しました。" },
          });
        })
        .catch((error) => {
          console.error("削除エラー:", error);
          alert("削除に失敗しました。");
        });
    }
  };

  // ★ 追加: 見積新規登録の送信処理
  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", quoteFile);
    formData.append("deadlineDate", deadlineDate);
    formData.append("quoteStatus", "未判定"); // ← ステータス「未判定」を追加で送信する

    axios
      .post(`http://localhost:8080/api/projects/${id}/quotes/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSuccessMessage("見積情報を登録しました。");
        setQuoteFile(null);
        setDeadlineDate("");
        fetchProjectDetail(); // データを再取得して画面を更新
      })
      .catch((error) => {
        console.error("見積登録エラー:", error);
        alert("見積の登録に失敗しました。");
      });
  };

  // ★ 追加: 見積削除処理
  const handleQuoteDelete = (quoteId) => {
    if (window.confirm("この見積を削除しますか？")) {
      // ※バックエンド側の見積削除APIのエンドポイントに合わせて調整してください
      axios
        .delete(`http://localhost:8080/api/projects/${id}/quotes/${quoteId}`)
        .then(() => {
          setSuccessMessage("見積情報を削除しました。");
          fetchProjectDetail(); // データを再取得して画面を更新
        })
        .catch((error) => {
          console.error("見積削除エラー:", error);
          alert("見積の削除に失敗しました。");
        });
    }
  };

  if (loading || !projectData) {
    return <Loading />;
  }

  const { project, latestQuote, historyList = [] } = projectData;

  const isExpired =
    latestQuote &&
    latestQuote.deadlineDate &&
    latestQuote.deadlineDate < today &&
    latestQuote.quoteStatus === "未判定";

  return (
    <div className="content-wrapper">
      <PageHeader title="案件詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      {/* 案件情報カード */}
      <div className="card">
        <h3>案件情報</h3>
        <dl className="detail-list">
          <div className="detail-item">
            <dt>顧客名</dt>
            <dd>
              <Link to={`/clients/${project.clientId}`}>
                {project.clientName}
              </Link>
            </dd>
          </div>
          <div className="detail-item">
            <dt>案件名</dt>
            <dd>{project.projectName}</dd>
          </div>
          <div className="detail-item">
            <dt>発注業者</dt>
            <dd>{project.companyName}</dd>
          </div>
          <div className="detail-item">
            <dt>契約種別</dt>
            <dd>{project.contractType}</dd>
          </div>
          <div className="detail-item">
            <dt>担当者名</dt>
            <dd>{project.projectStaffname}</dd>
          </div>
          <div className="detail-item">
            <dt>案件状態</dt>
            <dd>{project.status}</dd>
          </div>
          <div className="detail-item">
            <dt>特記事項</dt>
            <dd style={{ whiteSpace: "pre-wrap" }}>{project.projectRemarks}</dd>
          </div>
        </dl>

        <div className="action-buttons-form">
          <Button to={`/projects/edit/${project.projectId}`} variant="primary">
            案件を編集
          </Button>
          <Button type="button" variant="danger" onClick={handleDelete}>
            案件を削除
          </Button>
          <Button to="/projects" variant="cancel">
            案件一覧へ戻る
          </Button>
        </div>
      </div>

      {/* 見積情報・履歴カード */}
      <div className="card">
        <h3>見積情報・履歴</h3>

        {latestQuote ? (
          <>
            <dl className="detail-list" style={{ marginBottom: "20px" }}>
              <div className="detail-item">
                <dt>見積ファイル</dt>
                <dd>
                  <a
                    href={`http://localhost:8080/${latestQuote.quoteFilepath}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    PDFを表示
                  </a>
                </dd>
              </div>
              <div className="detail-item">
                <dt>現在の判定状態</dt>
                <dd>{latestQuote.quoteStatus}</dd>
              </div>
              <div className="detail-item">
                <dt>判定期限</dt>
                <dd>
                  <span className={isExpired ? "text-danger" : ""}>
                    {getRemainingDaysText(latestQuote.deadlineDate, today)}
                  </span>
                </dd>
              </div>
              <div className="detail-item">
                <dt>最終更新日</dt>
                <dd>{latestQuote.quoteDate}</dd>
              </div>
            </dl>

            <div
              className="action-buttons quote-action-buttons"
              style={{ marginBottom: "20px" }}
            >
              <Button
                to={`/projects/${project.projectId}/quotes/edit/${latestQuote.quoteId}`}
                variant="secondary"
              >
                見積を編集
              </Button>
              {/* ★ 復活：見積を削除するボタン */}
              <Button
                type="button"
                variant="danger"
                onClick={() => handleQuoteDelete(latestQuote.quoteId)}
              >
                見積を削除
              </Button>
            </div>
          </>
        ) : (
          /* ★ 復活：見積未登録時の新規登録フォームエリア */
          <div className="add-quote-area" style={{ marginBottom: "20px" }}>
            <p className="no-quote-msg">
              現在、登録されている見積はありません。
            </p>

            <form onSubmit={handleQuoteSubmit}>
              <div
                className="form-group-block"
                style={{ marginBottom: "15px" }}
              >
                <label>見積PDFファイルを選択</label>
                <input
                  type="file"
                  accept=".pdf"
                  required
                  onChange={(e) => setQuoteFile(e.target.files[0])}
                />
              </div>

              <div
                className="form-group-block"
                style={{ marginBottom: "15px" }}
              >
                <label>判定期限</label>
                <input
                  type="date"
                  value={deadlineDate}
                  onChange={(e) => setDeadlineDate(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="btn-submit-quote"
              >
                登録する
              </Button>
            </form>
          </div>
        )}

        {/* 履歴一覧テーブル */}
        <table className="data-table">
          <thead>
            <tr>
              <th>更新日</th>
              <th>判定状態</th>
              <th>判定者</th>
              <th>ファイル</th>
            </tr>
          </thead>
          <tbody>
            {historyList.length > 0 ? (
              historyList.map((h, index) => (
                <tr key={index}>
                  <td data-label="更新日">{h.quoteDate}</td>
                  <td data-label="判定状態">{h.quoteStatus}</td>
                  <td data-label="判定者">{h.judgeUser || "-"}</td>
                  <td data-label="ファイル">
                    <a
                      href={`http://localhost:8080/${h.quoteFilepath}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      閲覧
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  履歴はありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

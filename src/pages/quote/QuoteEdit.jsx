import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router";
import PageHeader from "../../components/PageHeader";
import axios from "axios";

export default function QuoteEdit() {
  const { pid, id } = useParams(); // URLから projectId と quoteId を取得
  const navigate = useNavigate();

  const [quoteForm, setQuoteForm] = useState({
    quoteId: id,
    projectId: pid,
    quoteStatus: "",
    deadlineDate: "",
    quoteFilepath: "",
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 編集初期データの取得
  useEffect(() => {
    // 必要に応じてSpring Boot側から見積データを取得するAPIを叩く
    axios.get(`http://localhost:8080/api/projects/${pid}/quotes/${id}`)
      .then((res) => {
        setQuoteForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("データ取得エラー:", err);
        setLoading(false);
      });
  }, [pid, id]);

  // 更新処理
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("quoteId", quoteForm.quoteId);
    formData.append("projectId", quoteForm.projectId);
    formData.append("quoteStatus", quoteForm.quoteStatus);
    formData.append("deadlineDate", quoteForm.deadlineDate);
    if (file) {
      formData.append("file", file);
    }

    axios.post(`http://localhost:8080/api/projects/${pid}/quotes/edit/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        navigate(`/projects/${pid}`, { state: { message: "見積情報を更新しました。" } });
      })
      .catch((error) => {
        console.error("更新エラー:", error);
        alert("更新に失敗しました。");
      });
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="content-wrapper">
      <PageHeader title="見積編集" />

      <div className="card">
        <h3>見積内容の編集</h3>

        <form onSubmit={handleSubmit}>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>現在の見積書</dt>
              <dd>
                <a href={`http://localhost:8080/${quoteForm.quoteFilepath}`} target="_blank" rel="noreferrer">
                  PDFを確認
                </a>
              </dd>
            </div>
            <div className="detail-item">
              <dt>ファイルを選択</dt>
              <dd>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </dd>
            </div>
            <div className="detail-item">
              <dt>判定期限</dt>
              <dd>
                <input
                  type="date"
                  value={quoteForm.deadlineDate || ""}
                  required
                  onChange={(e) => setQuoteForm({ ...quoteForm, deadlineDate: e.target.value })}
                />
              </dd>
            </div>
            <div className="detail-item">
              <dt>現在のステータス</dt>
              <dd>{quoteForm.quoteStatus}</dd>
            </div>
          </dl>

          <div className="action-buttons-form">
            <button type="submit" className="btn btn-primary">更新する</button>
            <Link to={`/projects/${pid}`} className="btn">キャンセル</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
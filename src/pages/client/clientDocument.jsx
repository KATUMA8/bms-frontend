import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router";
import AlertMessage from "../../components/AlertMessage";
import axios from "axios";

export default function ClientDocuments() {
  const { id } = useParams(); // URLから顧客IDを取得
  const fileInputRef = useRef(null); // fileInputRef を定義

  // 対象顧客の情報
  const [client, setClient] = useState(null);

  // 登録済み資料一覧の状態
  const [documents, setDocuments] = useState([]);

  // 新規登録フォームの状態
  const [formData, setFormData] = useState({
    docTitle: "",
    docType: "機器一覧表",
    docRemarks: "",
    file: null,
  });

  const [successMessage, setSuccessMessage] = useState("");

  // 初回マウント時にSpring Bootから顧客情報と資料一覧を取得
  useEffect(() => {
    axios.get(`http://localhost:8080/api/clients/${id}/documents`)
      .then((res) => {
        setClient(res.data.client);
        setDocuments(res.data.documents || []);
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
        alert("資料情報の取得に失敗しました。");
      });
  }, [id]);

  // 入力値変更ハンドラー
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] || null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 資料登録ボタン押下時の処理
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.docTitle.trim() || !formData.file) {
      alert("資料名とファイルは必須です。");
      return;
    }

    const data = new FormData();
    data.append("docTitle", formData.docTitle);
    data.append("docType", formData.docType);
    data.append("docRemarks", formData.docRemarks || "");
    data.append("file", formData.file);

    axios.post(`http://localhost:8080/api/clients/${id}/documents`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setSuccessMessage(res.data.message);

        // ファイル（file: null）だけをリセットし、分類等はそのまま保持する
        setFormData((prev) => ({
          ...prev,
          file: null,
        }));

        // ファイル選択の input 要素の表示をクリアする
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // 一覧を再取得
        return axios.get(`http://localhost:8080/api/clients/${id}/documents`);
      })
      .then((res) => {
        if (res) {
          setDocuments(res.data.documents || []);
        }
      })
      .catch((error) => {
        console.error("登録エラー:", error);
        alert("資料の登録に失敗しました。");
      });
  };

  // 削除処理 (axios.delete)
  const handleDelete = (docId) => {
    if (window.confirm("資料を削除しますか？")) {
      axios.delete(`http://localhost:8080/api/clients/${id}/documents/${docId}`)
        .then((res) => {
          setDocuments(documents.filter((doc) => doc.docId !== docId));
          setSuccessMessage(res.data.message);
        })
        .catch((error) => {
          console.error("削除エラー:", error);
          alert("資料の削除に失敗しました。");
        });
    }
  };

  // 読み込み中のガード
  if (!client) {
    return (
      <div className="content-wrapper">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <header>
        <h1>関連資料一覧</h1>
      </header>

      {/* 対象顧客表示 */}
      <div style={{ marginBottom: "25px" }}>
        <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>対象顧客：</span>
        <Link
          to={`/clients/${client.clientId}`}
          style={{ fontWeight: "bold", textDecoration: "none", color: "var(--accent)", fontSize: "1.1rem" }}
        >
          {client.clientName}
        </Link>
      </div>

      {/* ★ 共通化した AlertMessage コンポーネントを使用（自動消去） */}
      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      {/* 資料登録フォーム */}
      <div className="card">
        <h3>資料登録</h3>
        <form onSubmit={handleSubmit}>
          <dl className="detail-list">
            <div className="detail-item">
              <dt>資料名</dt>
              <dd>
                <input
                  type="text"
                  name="docTitle"
                  value={formData.docTitle}
                  onChange={handleChange}
                  required
                  style={{ width: "100%", boxSizing: "border-box" }}
                  placeholder="資料名を入力"
                />
              </dd>
            </div>
            <div className="detail-item">
              <dt>分類</dt>
              <dd>
                <select
                  name="docType"
                  value={formData.docType}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                >
                  <option value="機器一覧表">機器一覧表</option>
                  <option value="機器配置図">機器配置図</option>
                  <option value="画像">画像</option>
                  <option value="その他">その他</option>
                </select>
              </dd>
            </div>
            <div className="detail-item">
              <dt>備考</dt>
              <dd>
                <textarea
                  name="docRemarks"
                  value={formData.docRemarks}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    height: "80px",
                    padding: "10px",
                    border: "1px solid #dcdde1",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                  placeholder="備考を入力（任意）"
                />
              </dd>
            </div>
            <div className="detail-item">
              <dt>ファイルを選択</dt>
              <dd>
                <input
                  type="file"
                  name="file"
                  ref={fileInputRef}
                  onChange={handleChange}
                  accept=".pdf, .jpg, .jpeg, .png"
                  required
                />
              </dd>
            </div>
          </dl>

          <div className="action-buttons">
            <button type="submit" className="btn btn-primary">登録する</button>
            <Link to={`/clients/${client.clientId}`} className="btn btn-secondary">
              顧客詳細へ戻る
            </Link>
          </div>
        </form>
      </div>

      {/* 資料情報一覧 */}
      <div className="card">
        <h3>資料情報</h3>
        {documents.length > 0 ? (
          <div className="doc-grid">
            {documents.map((doc) => {
              const isPdf = doc.docFilePath && doc.docFilePath.toLowerCase().endsWith(".pdf");
              return (
                <div className="doc-item" key={doc.docId}>
                  <div className="preview-box">
                    {isPdf ? (
                      <iframe
                        src={`http://localhost:8080/${doc.docFilePath}#view=Fit&scrollbar=0&toolbar=0&navpanes=0`}
                        scrolling="no"
                        title={doc.docTitle}
                      />
                    ) : (
                      <img src={`http://localhost:8080/${doc.docFilePath}`} alt="プレビュー" />
                    )}
                  </div>

                  <a href={`http://localhost:8080/${doc.docFilePath}`} target="_blank" rel="noopener noreferrer">
                    <strong>{doc.docTitle}</strong>
                  </a>
                  <div className="doc-meta">{doc.docType}</div>
                  <div className="doc-meta">
                    {doc.docCreatedAt ? new Date(doc.docCreatedAt).toLocaleDateString() : ""}
                  </div>

                  <div className="remarks-container">
                    {doc.docRemarks && (
                      <details>
                        <summary>備考を表示</summary>
                        <p><span>{doc.docRemarks}</span></p>
                      </details>
                    )}
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "15px" }}>
                    <button
                      type="button"
                      className="btn-text-danger"
                      onClick={() => handleDelete(doc.docId)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      削除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>登録されている資料はありません。</p>
        )}
      </div>
    </div>
  );
}
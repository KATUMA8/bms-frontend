import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import AlertMessage from "../../components/AlertMessage";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import DetailList from "../../components/DetailList";
import DataTable from "../../components/DataTable";
import { getRemainingDaysText } from "../../utils/dateUtils";
import { useDeleteHandler } from "../../hooks/useDeleteHandler";
import { projectApi } from "../../api/projectApi";
import { useAtomValue } from "jotai";
import loginUserAtom from "../../atoms/loginUserAtom";

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();

  const loginUser = useAtomValue(loginUserAtom) || {
    userId: 2,
    name: "鈴木一郎",
    roleFlag: 2,
    companyId: 1
  };

  const isAdmin = loginUser.roleFlag === 1;

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const [quoteFile, setQuoteFile] = useState(null);
  const [deadlineDate, setDeadlineDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const { handleDelete } = useDeleteHandler(
    `/projects/${id}`,
    "/projects",
    "案件情報を削除しました。"
  );

  const fetchProjectDetail = () => {
    setLoading(true);
    // API側でロールに応じた詳細取得パスを切り替え
    projectApi.getDetail(id, isAdmin)
      .then((data) => {
        setProjectData(data);
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
  }, [id, isAdmin]);

  const handleQuoteSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", quoteFile);
    formData.append("deadlineDate", deadlineDate);
    formData.append("quoteStatus", "未判定");

    projectApi.addQuote(id, formData)
      .then(() => {
        setSuccessMessage("見積情報を登録しました。");
        setQuoteFile(null);
        setDeadlineDate("");
        fetchProjectDetail();
      })
      .catch((error) => {
        console.error("見積登録エラー:", error);
        alert("見積の登録に失敗しました。");
      });
  };

  const handleQuoteDelete = (quoteId) => {
    if (window.confirm("この見積を削除しますか？")) {
      projectApi.deleteQuote(id, quoteId)
        .then(() => {
          setSuccessMessage("見積情報を削除しました。");
          fetchProjectDetail();
        })
        .catch((error) => {
          console.error("見積削除エラー:", error);
          alert("見積の削除に失敗しました。");
        });
    }
  };

  // 【発注業者用】見積判定
  const handleJudge = (quoteId, status) => {
    if (!window.confirm(`この見積を「${status}」にしますか？`)) return;

    projectApi.judgeQuote(id, quoteId, status)
      .then((res) => {
        setSuccessMessage(res.successMessage || "見積ステータスを更新しました。");
        setErrorMessage("");
        fetchProjectDetail();
      })
      .catch((error) => {
        console.error("判定エラー:", error);
        setErrorMessage(error.response?.data?.errorMessage || "判定処理に失敗しました。");
      });
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

  const projectDetailItems = [
    {
      label: "顧客名",
      value: (
        <Link to={`/clients/${project.clientId}`}>{project.clientName}</Link>
      ),
    },
    { label: "案件名", value: project.projectName },
    { label: isAdmin ? "発注業者" : "担当業者", value: project.companyName },
    { label: "契約種別", value: project.contractType },
    { label: "担当者名", value: project.projectStaffname },
    { label: "案件状態", value: project.status },
    {
      label: "特記事項",
      value: <span style={{ whiteSpace: "pre-wrap" }}>{project.projectRemarks}</span>,
    },
  ];

  const latestQuoteDetailItems = latestQuote ? [
    {
      label: "見積ファイル",
      value: (
        <a
          href={`http://localhost:8080/${latestQuote.quoteFilepath}`}
          target="_blank"
          rel="noreferrer"
        >
          PDFを表示
        </a>
      ),
    },
    { label: "現在の判定状態", value: latestQuote.quoteStatus },
    {
      label: "判定期限",
      value: (
        <span>
          <span className={isExpired ? "text-danger" : ""}>
            {latestQuote.deadlineDate ? latestQuote.deadlineDate : "期限設定なし"}
          </span>
          {isExpired && (
            <span className="text-danger" style={{ marginLeft: "5px" }}>
              (期限切れ)
            </span>
          )}
        </span>
      ),
    },
    { label: "最終更新日", value: latestQuote.quoteDate },
  ] : [];

  const historyColumns = [
    { label: "更新日", key: "quoteDate" },
    { label: "判定状態", key: "quoteStatus" },
    { label: "判定者", render: (h) => h.judgeUser || "-" },
    {
      label: "ファイル",
      render: (h) => (
        <a
          href={`http://localhost:8080/${h.quoteFilepath}`}
          target="_blank"
          rel="noreferrer"
        >
          閲覧
        </a>
      ),
    },
  ];

  return (
    <div className={`content-wrapper ${isAdmin ? "" : "theme-contractee"}`}>
      <PageHeader title="案件詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      {errorMessage && (
        <div className="alert alert-danger" style={{ marginBottom: "20px", color: "red" }}>
          {errorMessage}
        </div>
      )}

      <div className="card">
        <h3>案件情報</h3>
        <DetailList items={projectDetailItems} />

        <div className="action-buttons-form" style={{ marginTop: "20px" }}>
          {isAdmin ? (
            <>
              <Button to={`/projects/edit/${project.projectId}`} variant="primary">
                案件を編集
              </Button>
              <Button type="button" variant="danger" onClick={() => handleDelete()}>
                案件を削除
              </Button>
              <Button to="/projects" variant="cancel">
                案件一覧へ戻る
              </Button>
            </>
          ) : (
            <Button to="/projects" className="btn" variant="cancel">
              案件一覧へ戻る
            </Button>
          )}
        </div>
      </div>

      <div className="card">
        <h3>見積情報・履歴</h3>

        {latestQuote ? (
          <>
            <div style={{ marginBottom: "20px" }}>
              <DetailList items={latestQuoteDetailItems} />
            </div>

            {isAdmin ? (
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
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleQuoteDelete(latestQuote.quoteId)}
                >
                  見積を削除
                </Button>
              </div>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                {latestQuote.quoteStatus === "未判定" && !isExpired ? (
                  <>
                    <p style={{ marginBottom: "10px" }}>この見積を判定する</p>
                    <div className="action-buttons quote-action-buttons" style={{ display: "flex", gap: "10px" }}>
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => handleJudge(latestQuote.quoteId, "発注")}
                      >
                        発注
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => handleJudge(latestQuote.quoteId, "失注")}
                      >
                        失注
                      </Button>
                      <Button
                        type="button"
                        variant="danger"
                        onClick={() => handleJudge(latestQuote.quoteId, "差戻し")}
                      >
                        差戻し
                      </Button>
                    </div>
                  </>
                ) : latestQuote.quoteStatus === "未判定" && isExpired ? (
                  <p className="text-danger">※有効期限が過ぎているため、判定はできません。</p>
                ) : null}
              </div>
            )}
          </>
        ) : (
          <div className="add-quote-area" style={{ marginBottom: "20px" }}>
            <p className="no-quote-msg" style={{ color: "#636e72" }}>
              現在、登録されている見積はありません。
            </p>

            {isAdmin && (
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
            )}
          </div>
        )}

        <DataTable
          columns={historyColumns}
          data={historyList}
          noDataMessage="履歴はありません。"
        />
      </div>
    </div>
  );
}
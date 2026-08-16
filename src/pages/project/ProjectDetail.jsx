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

export default function ProjectDetail() {
  const { id } = useParams();
  const location = useLocation();

  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  const [quoteFile, setQuoteFile] = useState(null);
  const [deadlineDate, setDeadlineDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const { handleDelete } = useDeleteHandler(
    `/projects/${id}`,
    "/projects",
    "案件情報を削除しました。"
  );

  const fetchProjectDetail = () => {
    projectApi.getDetail(id)
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
  }, [id]);

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
        <Link to={`/clients/${project.clientId}`}>
          {project.clientName}
        </Link>
      ),
    },
    { label: "案件名", value: project.projectName },
    { label: "発注業者", value: project.companyName },
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
        <span className={isExpired ? "text-danger" : ""}>
          {getRemainingDaysText(latestQuote.deadlineDate, today)}
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
    <div className="content-wrapper">
      <PageHeader title="案件詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="card">
        <h3>案件情報</h3>
        <DetailList items={projectDetailItems} />

        <div className="action-buttons-form">
          <Button to={`/projects/edit/${project.projectId}`} variant="primary">
            案件を編集
          </Button>
          <Button type="button" variant="danger" onClick={() => handleDelete()}>
            案件を削除
          </Button>
          <Button to="/projects" variant="cancel">
            案件一覧へ戻る
          </Button>
        </div>
      </div>

      <div className="card">
        <h3>見積情報・履歴</h3>

        {latestQuote ? (
          <>
            <div style={{ marginBottom: "20px" }}>
              <DetailList items={latestQuoteDetailItems} />
            </div>

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
          </>
        ) : (
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

        {historyList.length > 0 ? (
          <DataTable columns={historyColumns} data={historyList} />
        ) : (
          <table className="data-table">
            <tbody>
              <tr>
                <td style={{ textAlign: "center" }}>
                  履歴はありません。
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
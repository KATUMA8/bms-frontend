import { useState, useEffect } from "react";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import NoDataMessage from "../../components/NoDataMessage";
import Button from "../../atoms/Button";
import Pagination from "../../components/Pagination";
import AlertMessage from "../../components/AlertMessage";
import { useLocation } from "react-router";
import axios from "axios";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  // ★ 今日のおおまかな日付（YYYY-MM-DD）を取得
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/projects", {
          params: { page: currentPage },
        });
        setProjects(response.data.projects || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("通信エラー:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <Loading />;

  return (
    <div className="content-wrapper">
      <PageHeader title="案件管理" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="action-bar">
        <Button to="/projects/add" variant="primary">
          新規案件登録
        </Button>
      </div>

      <div className="card">
        <h3>案件一覧</h3>
        {projects && projects.length > 0 ? (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>顧客名</th>
                  <th>案件名</th>
                  <th>発注業者</th>
                  <th>案件状態</th>
                  <th>見積状態</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => {
                  // ★ Home.jsxと同様の判定ロジックを適用
                  // 例：「見積中」または「未判定」のステータスかつ、deadlineDateが今日より前の場合
                  const isExpired =
                    p.deadlineDate &&
                    p.deadlineDate < today &&
                    (p.latestQuoteStatus === "見積中" ||
                      p.latestQuoteStatus === "未判定"); // 必要に応じてステータス条件を調整してください

                  return (
                    <tr key={p.projectId}>
                      <td data-label="顧客名">{p.clientName}</td>
                      <td data-label="案件名">{p.projectName}</td>
                      <td data-label="発注業者">{p.companyName}</td>
                      <td data-label="案件状態">{p.status}</td>
                      <td data-label="見積状態">
                        {isExpired ? (
                          <span className="text-danger">期限切れ</span>
                        ) : (
                          <span>{p.latestQuoteStatus || "見積中"}</span>
                        )}
                      </td>
                      <td data-label="操作">
                        <Button
                          to={`/projects/${p.projectId}`}
                          variant="primary"
                        >
                          詳細
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        ) : (
          <NoDataMessage />
        )}
      </div>
    </div>
  );
}

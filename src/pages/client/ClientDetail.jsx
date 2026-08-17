import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import { useAtomValue } from "jotai";
import { formatPhone, formatPostal } from "../../utils/formatUtils";
import AlertMessage from "../../components/AlertMessage";
import { clientApi } from "../../api/clientApi";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import NoDataMessage from "../../components/NoDataMessage";
import Pagination from "../../components/Pagination";
import DetailList from "../../components/DetailList";
import DataTable from "../../components/DataTable";
import { useDeleteHandler } from "../../hooks/useDeleteHandler";
import { loginUserAtom } from "../../atoms/loginUserAtom";

export default function ClientDetail() {
  const { id } = useParams();
  const location = useLocation();

  const loginUser = useAtomValue(loginUserAtom);
  const isAdmin = loginUser?.roleFlag === 1;

  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  const { handleDelete } = useDeleteHandler(
    `/clients/${id}`,
    "/clients",
    "顧客情報を削除しました。",
  );

  useEffect(() => {
    clientApi.getDetail(id, currentPage, isAdmin)
      .then((res) => {
        setClient(res.client);
        setProjects(res.projects || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
      });
  }, [isAdmin, id, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!client) {
    return <Loading />;
  }

  const detailItems = [
    { label: "顧客名", value: client.clientName },
    { label: "フリガナ", value: client.clientKana },
    { label: "郵便番号", value: formatPostal(client.clientPostalcode) },
    { label: "住所", value: client.clientAddress },
    { label: "電話番号", value: formatPhone(client.clientPhone) },
    {
      label: "関連資料",
      value: (
        <Link to={`/clients/${client.clientId}/documents`}>資料一覧へ</Link>
      ),
    },
  ];

  const projectColumns = [
    { label: "案件名", key: "projectName" },
    { label: "ステータス", key: "status" },
    {
      label: "操作",
      render: (p) => (
        <Link to={`/projects/${p.projectId}`} className="btn">
          詳細
        </Link>
      ),
    },
  ];

  return (
    <div className={`content-wrapper ${isAdmin ? "" : "theme-contractee"}`}>
      <PageHeader title="顧客詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="card">
        <h3>顧客情報</h3>
        <DetailList items={detailItems} />

        <div className="action-buttons-form">
          {isAdmin && (
            <>
              <Button to={`/clients/edit/${client.clientId}`} variant="primary">
                編集
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => handleDelete()}
              >
                削除
              </Button>
            </>
          )}
          <Button to="/clients" variant="cancel">
            顧客一覧へ戻る
          </Button>
        </div>
      </div>

      <div className="card">
        <h3>関連案件一覧</h3>
        {projects.length > 0 ? (
          <>
            <DataTable columns={projectColumns} data={projects} />

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
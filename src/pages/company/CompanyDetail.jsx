import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router";
import { formatPhone, formatPostal } from "../../utils/formatUtils";
import AlertMessage from "../../components/AlertMessage";
import { companyApi } from "../../api/companyApi";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import Loading from "../../components/Loading";
import NoDataMessage from "../../components/NoDataMessage";
import Pagination from "../../components/Pagination";
import DetailList from "../../components/DetailList";
import DataTable from "../../components/DataTable";
import { useDeleteWithCheck } from "../../hooks/useDeleteWithCheck";

export default function CompanyDetail() {
  const { id } = useParams();
  const location = useLocation();

  const [company, setCompany] = useState(null);
  const [projects, setProjects] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  // 共通化したカスタムフックで2段階削除を適用
  const { handleDeleteWithCheck } = useDeleteWithCheck(
    `/companys/${id}`,
    "/companys",
    "業者情報を削除しました。",
    async () => {
      return projects.length > 0;
    },
  );

  const fetchCompanyDetail = () => {
    companyApi
      .getDetail(id, currentPage)
      .then((res) => {
        setCompany(res.company);
        setProjects(res.projects || []);
        setTotalPages(res.totalPages || 1);
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
      });
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, [id, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (!company) {
    return <Loading />;
  }

  const detailItems = [
    { label: "業者名", value: company.companyName },
    { label: "フリガナ", value: company.companyKana },
    { label: "郵便番号", value: formatPostal(company.companyPostalcode) },
    { label: "住所", value: company.companyAddress },
    { label: "電話番号", value: formatPhone(company.companyPhone) },
  ];

  const projectColumns = [
    { label: "顧客名", key: "clientName" },
    { label: "案件名", key: "projectName" },
    { label: "案件状態", key: "status" },
    {
      label: "操作",
      render: (p) => (
        <Link to={`/projects/${p.projectId}`} className="btn btn-primary">
          詳細
        </Link>
      ),
    },
  ];

  return (
    <div className="content-wrapper">
      <PageHeader title="業者詳細" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      <div className="card">
        <h3>業者情報</h3>
        <DetailList items={detailItems} />

        <div
          className="action-buttons-form"
          style={{ marginTop: "20px", display: "flex", gap: "10px" }}
        >
          <Button to={`/companys/edit/${company.companyId}`} variant="primary">
            編集
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDeleteWithCheck}
          >
            削除
          </Button>
          <Button to="/companys" variant="cancel">
            業者一覧へ戻る
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
          <NoDataMessage message="現在、この業者に紐づく案件はありません。" />
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useLocation } from "react-router";
import Pagination from "../../components/Pagination";
import KanaFilter from "../../components/KanaFilter";
import AlertMessage from "../../components/AlertMessage";
import { clientApi } from "../../api/clientApi";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";
import NoDataMessage from "../../components/NoDataMessage";
import DataTable from "../../components/DataTable";
import { loginUserAtom } from "../../atoms/loginUserAtom";

export default function ClientList() {
 const loginUser = useAtomValue(loginUserAtom);
  const isAdmin = loginUser?.roleFlag === 1;

  const [clients, setClients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentKana, setCurrentKana] = useState("");

  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(
    location.state?.message || "",
  );

  useEffect(() => {
    // API側でルーティングがカプセル化されたため、スッキリ呼び出せる
    clientApi.getList(currentPage, currentKana, isAdmin)
      .then((res) => {
        setClients(res.clients);
        setTotalPages(res.totalPages);
      })
      .catch((error) => {
        console.error("通信エラー:", error);
      });
  }, [isAdmin, currentPage, currentKana]);

  const columns = [
    { label: "顧客名", key: "clientName" },
    { label: "郵便番号", key: "formattedClientPostalcode" },
    { label: "住所", key: "clientAddress" },
    { label: "電話番号", key: "formattedClientPhone" },
    {
      label: "操作",
      render: (c) => (
        <Button to={`/clients/${c.clientId}`} variant="primary">
          詳細
        </Button>
      ),
    },
  ];

  return (
    <div className={`content-wrapper ${isAdmin ? "" : "theme-contractee"}`}>
      <PageHeader title="顧客管理" />

      <AlertMessage
        message={successMessage}
        type="success"
        duration={5000}
        onClose={() => setSuccessMessage("")}
      />

      {isAdmin && (
        <div className="action-bar">
          <Button to="/clients/add" variant="primary">
            新規顧客登録
          </Button>
        </div>
      )}

      <div className="card">
        <h3>顧客一覧</h3>
        <KanaFilter currentKana={currentKana} onSelectKana={(k) => { setCurrentKana(k); setCurrentPage(1); }} />

        {clients && clients.length > 0 ? (
          <DataTable columns={columns} data={clients} />
        ) : (
          <NoDataMessage />
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
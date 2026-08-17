import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import loginUserAtom from "../atoms/loginUserAtom";
import Pagination from "../components/Pagination";
import Button from "../atoms/Button";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { getRemainingDaysText } from "../utils/dateUtils";
import { projectApi } from "../api/projectApi";
import { axiosInstance } from "../api/axiosInstance";

export default function Home() {
  // const loginUser = useAtomValue(loginUserAtom) || {
  //   userId: 2,
  //   name: "鈴木一郎",
  //   roleFlag: 2, // あるいは発注業者としての判定値
  //   companyId: 1
  // };

   const loginUser = useAtomValue(loginUserAtom) || {
    userId: 1,
    name: "受注者",
    roleFlag: 1, // あるいは発注業者としての判定値
    companyId: null
  };

const isAdmin = loginUser?.roleFlag === 1; // 管理者かどうかの判定

  // 上部セクション・下部セクションのページ番号をそれぞれ独立して管理
  const [topPage, setTopPage] = useState(1);
  const [bottomPage, setBottomPage] = useState(1);

  const [topList, setTopList] = useState([]);
  const [topTotalPages, setTopTotalPages] = useState(1);

  const [bottomList, setBottomList] = useState([]);
  const [bottomTotalPages, setBottomTotalPages] = useState(1);

  const today = new Date().toISOString().split("T")[0];

  // ロールが切り替わったときにページを1ページ目にリセットするオプション
  useEffect(() => {
    const qPage = isAdmin ? topPage : bottomPage;
    const pPage = isAdmin ? bottomPage : topPage;

    // 管理者は /home、発注業者は /contractee/home を呼び出す
    const apiCall = isAdmin
      ? projectApi.getHomeData(qPage, pPage)
      : axiosInstance.get("/contractee/home", { params: { qPage, pPage } });

    apiCall
      .then((response) => {
        // axios の場合は response.data、直接オブジェクトの場合は response
        const res = response.data || response;
        if (res) {
          if (isAdmin) {
            // 管理者の場合
            setTopList(res.needQuoteList || []);
            setTopTotalPages(res.qTotalPages || 1);
            setBottomList(res.pendingList || []);
            setBottomTotalPages(res.pTotalPages || 1);
          } else {
            // 発注業者の場合：上部に判定待ち、下部に見積待ち
            setTopList(res.pendingList || []);
            setTopTotalPages(res.pTotalPages || 1);
            setBottomList(res.needQuoteList || []);
            setBottomTotalPages(res.qTotalPages || 1);
          }
        }
      })
      .catch((error) => {
        console.error("ダッシュボードデータの取得に失敗しました", error);
      });
  }, [isAdmin, topPage, bottomPage]);

  // ★ 上部セクション用のカラム定義
  const topColumns = [
    ...(isAdmin ? [] : [{
      label: "期限",
      render: (p) => {
        const isExpired =
          p.quoteStatus === "未判定" &&
          p.deadlineDate &&
          p.deadlineDate < today;
        return (
          <span className={isExpired ? "text-danger" : ""}>
            {getRemainingDaysText(p.deadlineDate, today)}
          </span>
        );
      },
    }]),
    { label: "顧客名", key: "clientName" },
    ...(isAdmin ? [{ label: "発注業者", key: "companyName" }] : []),
    { label: "案件名", key: "projectName" },
    {
      label: "操作",
      render: (p) => (
        <Button to={`/projects/${p.projectId}`} variant="secondary">
          {isAdmin ? "詳細" : "判定"}
        </Button>
      ),
    },
  ];

  // ★ 下部セクション用のカラム定義
  const bottomColumns = [
    ...(isAdmin ? [
      {
        label: "期限",
        render: (p) => {
          const isExpired =
            p.quoteStatus === "未判定" &&
            p.deadlineDate &&
            p.deadlineDate < today;
          return (
            <span className={isExpired ? "text-danger" : ""}>
              {getRemainingDaysText(p.deadlineDate, today)}
            </span>
          );
        },
      }
    ] : []),
    { label: "顧客", key: "clientName" },
    { label: "案件名", key: "projectName" },
    {
      label: "操作",
      render: (p) => (
        <Button to={`/projects/${p.projectId}`} variant="secondary">
          詳細
        </Button>
      ),
    },
  ];
console.log("現在のloginUser:", loginUser);
console.log("isAdmin判定:", isAdmin);
  return (
    <div className={`content-wrapper ${isAdmin ? "" : "theme-contractee"}`}>
      <PageHeader title="ダッシュボード">
        <div className="login-status">
          お疲れ様です、<strong>{loginUser?.name || "ゲスト"}</strong>さん
        </div>
      </PageHeader>

      <div className="dashboard-grid">
        {/* 上部セクション */}
        <section className="card">
          <h3>{isAdmin ? "見積待ち案件" : "判定待ち案件"}</h3>
          {topList.length > 0 ? (
            <DataTable columns={topColumns} data={topList} />
          ) : (
            <p style={{ textAlign: "center", padding: "20px" }}>現在、表示する案件はありません。</p>
          )}

          <Pagination
            currentPage={topPage}
            totalPages={topTotalPages}
            onPageChange={(newPage) => setTopPage(newPage)}
          />
        </section>

        {/* 下部セクション */}
        <section className="card">
          <h3>{isAdmin ? "判定待ち案件" : "見積待ち案件"}</h3>
          {bottomList.length > 0 ? (
            <DataTable columns={bottomColumns} data={bottomList} />
          ) : (
            <p style={{ textAlign: "center", padding: "20px" }}>現在、表示する案件はありません。</p>
          )}

          <Pagination
            currentPage={bottomPage}
            totalPages={bottomTotalPages}
            onPageChange={(newPage) => setBottomPage(newPage)}
          />
        </section>
      </div>
    </div>
  );
}
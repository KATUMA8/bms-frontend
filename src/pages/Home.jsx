import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import Pagination from "../components/Pagination";
import Button from "../atoms/Button";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { getRemainingDaysText } from "../utils/dateUtils";
import { projectApi } from "../api/projectApi";
import { loginUserAtom } from "../atoms/loginUserAtom";

export default function Home() {
  const loginUser = useAtomValue(loginUserAtom);
  const isAdmin = loginUser?.roleFlag === 1;

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

    // projectApi を経由してデータを取得
    projectApi
      .getHomeData(qPage, pPage, isAdmin)
      .then((res) => {
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
    ...(isAdmin
      ? []
      : [
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
          },
        ]),
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
    ...(isAdmin
      ? [
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
          },
        ]
      : []),
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
            <p style={{ textAlign: "center", padding: "20px" }}>
              現在、表示する案件はありません。
            </p>
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
            <p style={{ textAlign: "center", padding: "20px" }}>
              現在、表示する案件はありません。
            </p>
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
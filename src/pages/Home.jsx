import { useState, useEffect } from "react";
import { Link } from "react-router";
import axios from "axios";
import Pagination from "../components/Pagination";
import Button from "../atoms/Button";
import PageHeader from "../components/PageHeader";
import { getRemainingDaysText } from "../utils/dateUtils";

export default function Home() {
  // 見積待ち案件用のステート
  const [needQuoteList, setNeedQuoteList] = useState([]);
  const [quoteCurrentPage, setQuoteCurrentPage] = useState(1);
  const [quoteTotalPages, setQuoteTotalPages] = useState(1);

  // 判定待ち案件用のステート
  const [pendingList, setPendingList] = useState([]);
  const [pendingCurrentPage, setPendingCurrentPage] = useState(1);
  const [pendingTotalPages, setPendingTotalPages] = useState(1);

  // 今日のおおまかな日付文字列（YYYY-MM-DD）を取得
  const today = new Date().toISOString().split("T")[0];

  // コントローラーが受け取るパラメータ名 (qPage, pPage) に合わせる
  useEffect(() => {
    axios
      .get(
        `http://localhost:8080/api/home?qPage=${quoteCurrentPage}&pPage=${pendingCurrentPage}`,
      )
      .then((res) => {
        setNeedQuoteList(res.data.needQuoteList || []);
        setQuoteTotalPages(res.data.qTotalPages || 1);

        setPendingList(res.data.pendingList || []);
        setPendingTotalPages(res.data.pTotalPages || 1);
      })
      .catch((error) => {
        console.error("ダッシュボードデータの取得に失敗しました", error);
      });
  }, [quoteCurrentPage, pendingCurrentPage]);

  return (
    <div className="content-wrapper">
      <PageHeader title="ダッシュボード">
        <div className="login-status">
          お疲れ様です、<strong>山田 太郎</strong>さん
        </div>
      </PageHeader>

      <div className="dashboard-grid">
        {/* 見積待ち案件カード */}
        <section className="card">
          <h3>見積待ち案件</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>顧客名</th>
                <th>発注業者</th>
                <th>案件名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {needQuoteList.length > 0 ? (
                needQuoteList.map((p) => (
                  <tr key={p.projectId}>
                    <td data-label="顧客名">{p.clientName}</td>
                    <td data-label="発注業者">{p.companyName}</td>
                    <td data-label="案件名">{p.projectName}</td>
                    <td data-label="操作">
                      <Button
                        to={`/projects/${p.projectId}`}
                        variant="secondary"
                      >
                        詳細
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">現在、対応が必要な案件はありません。</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 見積待ち用ページネーション */}
          <Pagination
            currentPage={quoteCurrentPage}
            totalPages={quoteTotalPages}
            onPageChange={(newPage) => setQuoteCurrentPage(newPage)}
          />
        </section>

        {/* 判定待ち案件カード */}
        <section className="card">
          <h3>判定待ち案件</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>期限</th>
                <th>顧客</th>
                <th>案件名</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {pendingList.length > 0 ? (
                pendingList.map((p) => {
                  // Thymeleafの isExpired(q) と同様の判定
                  // ステータスが「未判定」かつ 期限日が今日より前のもの
                  const isExpired =
                    p.quoteStatus === "未判定" &&
                    p.deadlineDate &&
                    p.deadlineDate < today;

                  return (
                    <tr key={p.quoteId || p.projectId}>
                      <td
                        data-label="期限"
                        className={isExpired ? "expired" : ""}
                      >
                        <span className={isExpired ? "text-danger" : ""}>
                          {getRemainingDaysText(p.deadlineDate, today)}
                        </span>
                      </td>
                      <td data-label="顧客名">{p.clientName}</td>
                      <td data-label="案件名">{p.projectName}</td>
                      <td data-label="操作">
                        <Button
                          to={`/projects/${p.projectId}`}
                          variant="secondary"
                        >
                          詳細
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">現在、判定待ちの案件はありません。</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* 判定待ち用ページネーション */}
          <Pagination
            currentPage={pendingCurrentPage}
            totalPages={pendingTotalPages}
            onPageChange={(newPage) => setPendingCurrentPage(newPage)}
          />
        </section>
      </div>
    </div>
  );
}

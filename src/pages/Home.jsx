export default function Home() {
  return (
    <>
      {/* 右側のメインコンテンツエリア */}
      <main className="main-content">
        <header>
          <h1>ダッシュボード</h1>
          <div className="login-status">
            お疲れ様です、<strong>山田 太郎</strong>さん
          </div>
        </header>

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
                {/* ダミーのデータ（あとでAPIから取得するように変更します） */}
                <tr>
                  <td colSpan="4">現在、対応が必要な案件はありません。</td>
                </tr>
              </tbody>
            </table>
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
                <tr>
                  <td colSpan="4">現在、判定待ちの案件はありません。</td>
                </tr>
              </tbody>
            </table>
          </section>
        </div>
      </main>
    </>
  );
}

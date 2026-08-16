import { Outlet } from "react-router";
// import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

function App() {
  // ※ 実際はContextやRedux、APIなどから現在のログインユーザーのロールを取得します
  // 例: 1 = 管理者, 2 = 発注業者
  const roleFlag = 2;

  // roleFlagが2（発注業者）なら "theme-contractee" という文字列をセット
  const themeClass = roleFlag === 2 ? "theme-contractee" : "";

  return (
    // テンプレートリテラル（バッククォート ` ）を使ってクラスを結合します
    <div className={`app-container ${themeClass}`}>

      {/* サイドバーにも現在のロールを渡す */}
      <Sidebar roleFlag={roleFlag} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
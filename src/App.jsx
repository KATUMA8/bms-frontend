import { Outlet } from "react-router";
// import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import { useAtomValue } from "jotai";
import { loginUserAtom } from "./atoms/loginUserAtom";

function App() {
 const loginUser = useAtomValue(loginUserAtom);

  // roleFlagが2（発注業者）なら "theme-contractee" という文字列をセット
 const themeClass = loginUser.roleFlag === 2 ? "theme-contractee" : "";

  return (
    // テンプレートリテラル（バッククォート ` ）を使ってクラスを結合します
    <div className={`app-container ${themeClass}`}>

      {/* サイドバーにも現在のロールを渡す */}
      <Sidebar roleFlag={loginUser.roleFlag} />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
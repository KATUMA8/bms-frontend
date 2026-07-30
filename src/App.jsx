import { Outlet } from "react-router";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <>
      {/* 共通のサイドバーやヘッダーを置く場合はここに書きます */}
      <Sidebar roleFlag={1} />

      {/* URLに応じて切り替わる子ページ（Homeなど）がここに表示されます */}
      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default App;

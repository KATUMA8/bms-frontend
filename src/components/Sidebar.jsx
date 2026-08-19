import { NavLink, useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { loginUserAtom } from "../atoms/loginUserAtom";
import { axiosInstance } from "../api/axiosInstance";

export default function Sidebar({ roleFlag }) {
  const isAdmin = roleFlag === 1;
  const setLoginUser = useSetAtom(loginUserAtom);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // サーバー側のセッションを破棄
      await axiosInstance.post("/users/logout");
    } catch (err) {
      console.error("ログアウトに失敗しました", err);
    } finally {
      // フロントエンドの状態をクリアしてログイン画面へ
      setLoginUser(null);
      navigate("/login");
    }
  };

  return (
    <nav className="sidebar">
      <div className="sidebar-logo">BMS System</div>

      {/* メニューとログアウトボタンをまとめるコンテナ */}
      <div className="sidebar-nav-container">
        <ul>
          {/* ホーム */}
          <li>
            <NavLink to="/">ホーム</NavLink>
          </li>
          {/* 顧客管理 */}
          <li>
            <NavLink to="/clients">顧客管理</NavLink>
          </li>
          {/* 案件管理 */}
          <li>
            <NavLink to="/projects">案件管理</NavLink>
          </li>
          {/* 管理者のみ業者管理 */}
          {isAdmin && (
            <li>
              <NavLink to="/companys">業者管理</NavLink>
            </li>
          )}
        </ul>

        {/* ログアウトボタンエリア */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            ログアウト
          </button>
        </div>
      </div>
    </nav>
  );
}

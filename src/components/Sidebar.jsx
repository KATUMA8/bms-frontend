import { NavLink } from "react-router";

export default function Sidebar({ roleFlag }) {
  const isAdmin = roleFlag === 1;
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">BMS System</div>
      <ul>
        {/* ホーム */}
        <li>
          <NavLink to="/">ホーム</NavLink>
        </li>
        {/* 顧客管理（/contractee/ を削除） */}
        <li>
          <NavLink to="/clients">顧客管理</NavLink>
        </li>
        {/* 案件管理（/contractee/ を削除） */}
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
    </nav>
  );
}
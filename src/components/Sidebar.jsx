import { Link } from "react-router";

// roleFlag を外から受け取るようにします（例: 1 = 管理者, 2 = 発注業者）
export default function Sidebar({ roleFlag }) {
  // roleFlag が 1 なら管理者、それ以外（または 2）なら業者、と判定
  const isAdmin = roleFlag === 1;
  return (
    <nav className="sidebar">
      <div className="sidebar-logo">BMS System</div>
      <ul>
        {/* ホームへのリンク */}
        <li>
          <Link to={isAdmin ? "/" : "/contractee/home"}>
            ホーム
          </Link>
        </li>
        {/* 顧客管理へのリンク */}
        <li>
          <Link to={isAdmin ? "/clients" : "/contractee/clients"}>
            顧客管理
          </Link>
        </li>
        {/* 案件管理へのリンク */}
        <li>
          <Link to={isAdmin ? "/projects" : "/contractee/projects"}>
            案件管理
          </Link>
        </li>
        {/* role_flagが 1（管理者）のときだけ「業者管理」を表示する */}
        {isAdmin && (
          <li>
            <Link to="/companys">業者管理</Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

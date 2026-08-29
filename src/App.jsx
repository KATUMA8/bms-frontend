import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar";
import { useAtomValue, useSetAtom } from "jotai";
import { loginUserAtom } from "./atoms/loginUserAtom";
import { axiosInstance } from "./api/axiosInstance";

function App() {
  const loginUser = useAtomValue(loginUserAtom);
  const setLoginUser = useSetAtom(loginUserAtom);
  const navigate = useNavigate();

  // ページがリロードされた時（マウント時）にセッションからログイン情報を復元する
  useEffect(() => {
    // まだ loginUser がない場合のみサーバーに問い合わせる
    if (!loginUser) {
      axiosInstance.get("/users/current")
        .then((res) => {
          setLoginUser(res.data); // サーバーにセッションがあればJotaiに復元
        })
        .catch(() => {
          // セッションがない（未ログイン）場合のみログイン画面へ飛ばす
          navigate("/login");
        });
    }
  }, [loginUser, setLoginUser, navigate]);

  // loginUserがnullの間に描画走るのを防ぐためのガード
  if (!loginUser) {
    return null;
  }

  // roleFlagが2（発注業者）なら "theme-contractee" という文字列をセット
  const themeClass = loginUser.roleFlag === 2 ? "theme-contractee" : "";

  return (
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
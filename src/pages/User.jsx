import { useState } from "react";
import { useNavigate } from "react-router";
import { useSetAtom } from "jotai";
import { loginUserAtom } from "../atoms/loginUserAtom";
import { userApi } from "../api/userApi";
import Button from "../atoms/Button";

export default function User() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setLoginUser = useSetAtom(loginUserAtom);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await userApi.login({ loginId, password });
      setLoginUser(user);
      navigate("/");
    } catch (err) {
      console.error("ログインエラー:", err);
      setError("ログインIDまたはパスワードが間違っています。");
    }
  };

  return (
    <div className="login-page">
      <div className="main-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div className="login-box">
          <h2 style={{ marginBottom: "20px", color: "var(--side-bg)" }}>ログイン</h2>

          {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ textAlign: "left" }}>
              <label>ログインID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                placeholder="例: admin または ks_narita または st_suzuki"
              />
            </div>

            <div className="form-group" style={{ textAlign: "left", marginBottom: "20px" }}>
              <label>パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="パスワードを入力(aaa/bbb/ccc)"
              />
            </div>

            <Button type="submit" variant="primary" className="btn btn-primary" style={{ width: "100%" }}>
              ログイン
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
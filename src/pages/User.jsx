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
      <div className="main-content login-content-wrapper">
        <h1 className="login-image">BMS System</h1>
        <div className="login-box">
          <h2 className="login-title">ログイン</h2>

          {error && <p className="error-text login-error-text">{error}</p>}

          <form onSubmit={handleLogin}>
            <div className="login-form-group">
              <label className="login-label">ログインID</label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                required
                placeholder="例: admin / ks_narita / st_suzuki"
              />
            </div>

            <div className="login-form-group-mb">
              <label className="login-label">パスワード</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="例：aaa / bbb / ccc"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              className="btn btn-primary login-submit-btn"
            >
              ログイン
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { normalizeKana } from "../../utils/formatUtils";

export default function ClientAdd() {
  const navigate = useNavigate();

  // 入力フォームの状態管理
  const [formData, setFormData] = useState({
    clientName: "",
    clientKana: "",
    clientPostalcode: "",
    clientAddress: "",
    clientPhone: "",
  });

  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  // 通常の入力値変更ハンドラー
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フリガナ専用の入力変更ハンドラー（漢字や不要な記号の混入を防ぐ）
  const handleKanaChange = (e) => {
    let value = e.target.value;
    // ひらがなをカタカナに変換しつつ、それ以外の不要な文字を除去する
    value = normalizeKana(value);

    setFormData((prev) => ({
      ...prev,
      clientKana: value,
    }));
  };

  // 郵便番号専用の入力ハンドラー
  const handlePostalChange = (e) => {
    let value = e.target.value;

    // 1. 全角数字を半角数字に変換
    value = value.replace(/[０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0),
    );

    // 2. 数字以外の文字（ハイフンなど）をすべて除去
    value = value.replace(/[^0-9]/g, "");

    // 3. 最大7桁までに制限
    if (value.length > 7) {
      value = value.slice(0, 7);
    }

    // DOM側の値を強制書き換え
    e.target.value = value;

    // Reactのステートを更新
    setFormData((prev) => ({
      ...prev,
      clientPostalcode: value,
    }));
  };

  // 登録ボタン押下時の処理
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = "※顧客名は必須項目です。";
    }
    if (!formData.clientKana.trim()) {
      newErrors.clientKana = "※フリガナは必須項目です。";
    }
    if (!formData.clientPostalcode.trim()) {
      newErrors.clientPostalcode = "※郵便番号は必須項目です。";
    } else if (formData.clientPostalcode.length !== 7) {
      newErrors.clientPostalcode =
        "※郵便番号はハイフンなし(例:1234567)の形式で入力してください。";
    }
    if (!formData.clientAddress.trim()) {
      newErrors.clientAddress = "※住所は必須項目です。";
    }
    if (!formData.clientPhone.trim()) {
      newErrors.clientPhone = "※電話番号は必須項目です。";
    } else if (
      formData.clientPhone.length < 10 ||
      formData.clientPhone.length > 11
    ) {
      newErrors.clientPhone =
        "※電話番号はハイフンなし(例:09012345678)の形式で入力してください。";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setHasError(true);
      return;
    }

    setHasError(false);
    setErrors({});
    alert("登録処理を実行しました（ダミー）");
    navigate("/clients");
  };

  return (
    <div className="content-wrapper">
      <header>
        <h1>新規顧客登録</h1>
      </header>

      <div className="card">
        {/* YubinBangoを有効にするため h-adr クラスを付与 */}
        <form onSubmit={handleSubmit} className="h-adr">
          {hasError && (
            <div className="alert alert-danger">
              <p>
                入力内容にエラーがあります。メッセージの内容を確認してください。
              </p>
            </div>
          )}

          {/* YubinBango用の国名指定 */}
          <input type="hidden" className="p-country-name" value="Japan" />

          <div className="form-vertical-layout">
            <div className="form-group-block">
              <label>
                顧客名 <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="顧客名を入力"
                className={errors.clientName ? "field-error" : ""}
              />
              {errors.clientName && (
                <span className="error-text">{errors.clientName}</span>
              )}
            </div>

            <div className="form-group-block">
              <label>
                フリガナ <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientKana"
                value={formData.clientKana}
                onChange={handleChange}
                // 1. 日本語の変換（IME）が確定した瞬間に、utilsの関数で綺麗に整形する
                onCompositionEnd={(e) => {
                  const normalized = normalizeKana(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    clientKana: normalized,
                  }));
                }}
                // 2. フォーカスが外れたときにも念のため同様に整形する
                onBlur={(e) => {
                  const normalized = normalizeKana(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    clientKana: normalized,
                  }));
                }}
                placeholder="フリガナを入力"
                className={errors.clientKana ? "field-error" : ""}
              />
              {errors.clientKana && (
                <span className="error-text">{errors.clientKana}</span>
              )}
            </div>

            <div className="form-group-block">
              <label>
                郵便番号 <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientPostalcode"
                onChange={handlePostalChange}
                className={`p-postal-code ${errors.clientPostalcode ? "field-error" : ""}`}
                placeholder="郵便番号を入力(ハイフンなし)"
                maxLength="7"
              />
              {errors.clientPostalcode && (
                <span className="error-text">{errors.clientPostalcode}</span>
              )}
            </div>

            <div className="form-group-block">
              <label>
                住所 <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                className={`p-region p-locality p-street-address ${errors.clientAddress ? "field-error" : ""}`}
                placeholder="顧客住所を入力"
              />
              {errors.clientAddress && (
                <span className="error-text">{errors.clientAddress}</span>
              )}
            </div>

            <div className="form-group-block">
              <label>
                電話番号 <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="電話番号を入力(ハイフンなし)"
                className={errors.clientPhone ? "field-error" : ""}
              />
              {errors.clientPhone && (
                <span className="error-text">{errors.clientPhone}</span>
              )}
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn btn-primary">
                登録する
              </button>
              <Link to="/clients" className="btn btn-cancel">
                戻る
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

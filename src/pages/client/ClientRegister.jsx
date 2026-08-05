import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { normalizeKana } from "../../utils/formatUtils";
import { usePostalCode } from "../../hooks/usePostalCode";

export default function ClientRegister() {
  const navigate = useNavigate();

  // 入力フォームの状態管理
  const [formData, setFormData] = useState({
    clientName: "",
    clientKana: "",
    clientAddress: "",
    clientPhone: "",
  });

  // 郵便番号フック：7桁になったら自動で住所をformDataのclientAddressにセットする
  // 郵便番号フック：formatAndFetchPostalCode も一緒に受け取る
  const { postalCode, handlePostalChange, formatAndFetchPostalCode } = usePostalCode(
    formData.clientPostalcode, // 初期値
    (fetchedAddress) => {
      // 住所が見つかった時の処理
      setFormData((prev) => ({
        ...prev,
        clientAddress: fetchedAddress,
      }));
    },
    (cleanedPostal) => {
      // ★ここで親のフォームデータ側も綺麗な郵便番号に強制同期する！
      setFormData((prev) => ({
        ...prev,
        clientPostalcode: cleanedPostal,
      }));
    }
  );

  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  // 通常の入力値変更ハンドラー（顧客名、住所、電話番号用）
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // フリガナ専用の入力変更ハンドラー（utilsの normalizeKana を直接使用）
  const handleKanaBlurOrComposition = (e) => {
    const normalized = normalizeKana(e.target.value);
    setFormData((prev) => ({
      ...prev,
      clientKana: normalized,
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
    if (!postalCode.trim()) {
      newErrors.clientPostalcode = "※郵便番号は必須項目です。";
    } else if (postalCode.length !== 7) {
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

    const submitData = {
      ...formData,
      clientPostalcode: postalCode,
    };
    console.log("送信データ:", submitData);

    alert("登録処理を実行しました（ダミー）");
    navigate("/clients/:id");
  };

  return (
    <div className="content-wrapper">
      <header>
        <h1>新規顧客登録</h1>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit}>
          {hasError && (
            <div className="alert alert-danger">
              <p>
                入力内容にエラーがあります。メッセージの内容を確認してください。
              </p>
            </div>
          )}

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
                onCompositionEnd={handleKanaBlurOrComposition}
                onBlur={handleKanaBlurOrComposition}
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
                value={postalCode}
                onChange={handlePostalChange}
                onBlur={(e) => formatAndFetchPostalCode(e.target.value)}
                onKeyDown={(e) => {
                  // エンターキーが押されたとき
                  if (e.key === "Enter") {
                    e.preventDefault(); // フォームの誤送信を防ぐ
                    formatAndFetchPostalCode(e.target.value); // 成型＆住所取得を実行
                    e.target.blur(); // フォーカスを外して見た目も確定させる
                  }
                }}
                className={errors.clientPostalcode ? "field-error" : ""}
                placeholder="郵便番号を入力(ハイフンなし)"
                autoComplete="off"
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
                className={errors.clientAddress ? "field-error" : ""}
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

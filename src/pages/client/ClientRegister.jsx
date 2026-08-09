import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { normalize, normalizeKana } from "../../utils/formatUtils";
import { usePostalCode } from "../../hooks/usePostalCode";
import axios from "axios";

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
      // 親のフォームデータ側も綺麗な郵便番号に強制同期
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

    // 電話番号（clientPhone）の場合は、入力された瞬間に normalize を通して半角数字のみにする
    const newValue = name === "clientPhone" ? normalize(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // フリガナ専用の入力変更ハンドラー
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

    // Spring BootのAPIへPOST送信
    axios.post("http://localhost:8080/api/clients", submitData)
      .then((res) => {
        console.log("登録成功:", res.data);

        // ★ 遷移先の /clients へメッセージをstateとして渡す
        navigate("/clients", {
          state: { message: "新規顧客情報を登録しました。" }
        });
      })
      .catch((error) => {
        console.error("登録エラー:", error);
        alert("登録に失敗しました。入力内容を確認してください。");
      });
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
                  if (e.key === "Enter") {
                    e.preventDefault();
                    formatAndFetchPostalCode(e.target.value);
                    e.target.blur();
                  }
                }}
                maxLength="7"
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
                maxLength="11"
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
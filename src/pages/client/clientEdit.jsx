import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { normalizeKana, normalize } from "../../utils/formatUtils";
import { usePostalCode } from "../../hooks/usePostalCode";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    clientId: id,
    clientName: "",
    clientKana: "",
    clientPostalcode: "",
    clientAddress: "",
    clientPhone: "",
  });

  const { postalCode, setPostalCode, handlePostalChange, formatAndFetchPostalCode } = usePostalCode(
    "",
    (fetchedAddress) => {
      setFormData((prev) => ({
        ...prev,
        clientAddress: fetchedAddress,
      }));
    },
    (cleanedPostal) => {
      setFormData((prev) => ({
        ...prev,
        clientPostalcode: cleanedPostal,
      }));
    }
  );

  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  // 既存データの取得（Spring Bootの /api/clients/edit/{id} に合わせる）
  useEffect(() => {
    axios.get(`http://localhost:8080/api/clients/edit/${id}`)
      .then((res) => {
        const fetchedData = res.data;

        setFormData({
          clientId: fetchedData.clientId || id,
          clientName: fetchedData.clientName || "",
          clientKana: fetchedData.clientKana || "",
          clientPostalcode: fetchedData.clientPostalcode ? normalize(fetchedData.clientPostalcode) : "",
          clientAddress: fetchedData.clientAddress || "",
          clientPhone: fetchedData.clientPhone ? normalize(fetchedData.clientPhone) : "",
        });

        if (fetchedData.clientPostalcode) {
          setPostalCode(normalize(fetchedData.clientPostalcode));
        }
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
        alert("顧客情報の取得に失敗しました。");
      });
  }, [id, setPostalCode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === "clientPhone" ? normalize(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleKanaBlurOrComposition = (e) => {
    const normalized = normalizeKana(e.target.value);
    setFormData((prev) => ({
      ...prev,
      clientKana: normalized,
    }));
  };

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

    // 更新データの送信（Spring Bootの @PostMapping("/edit/{id}") に合わせる）
    axios.post(`http://localhost:8080/api/clients/edit/${id}`, submitData)
      .then((res) => {
        // ★ 編集完了メッセージをstate経由で詳細画面へ渡す
        navigate(`/clients/${id}`, {
          state: { message: "顧客情報を更新しました。" }
        });
      })
      .catch((error) => {
        console.error("更新エラー:", error);
        alert("顧客情報の更新に失敗しました。");
      });
  };

  return (
    <div className="content-wrapper">
      <header>
        <h1>顧客情報編集</h1>
      </header>

      <div className="card">
        <form onSubmit={handleSubmit} className="edit-form">
          {hasError && (
            <div className="alert alert-danger">
              <p>入力内容にエラーがあります。メッセージの内容を確認してください。</p>
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
                placeholder="郵便番号を入力(ハイフンなし)"
                className={errors.clientPostalcode ? "field-error" : ""}
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
                placeholder="顧客住所を入力"
                className={errors.clientAddress ? "field-error" : ""}
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

            <div className="action-buttons-form">
              <button type="submit" className="btn btn-primary">
                更新する
              </button>
              <Link to={`/clients/${id}`} className="btn btn-cancel">
                戻る
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
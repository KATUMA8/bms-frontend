import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import axios from "axios";
import { normalize } from "../../utils/formatUtils";
import { usePostalCode } from "../../hooks/usePostalCode";
import { usePhone } from "../../hooks/usePhone"; // ★ 電話番号フックをインポート
import FieldError from "../../components/FieldError";
import FormAlert from "./../../components/FormAlert";
import { useKanaNormalization } from "../../hooks/useKanaNormalization";
import { FORM_LABELS } from "../../utils/formLabels";
import { VALIDATION_MESSAGES } from "../../utils/validationMessages";
import Button from "../../atoms/Button";
import PageHeader from "../../components/PageHeader";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 顧客用のラベル定義を取得
  const labels = FORM_LABELS.client;

  const [formData, setFormData] = useState({
    clientId: id,
    clientName: "",
    clientKana: "",
    clientAddress: "",
  });

  // ★ カスタムフックの呼び出し
  const { handleKanaBlurOrComposition } = useKanaNormalization(setFormData);

  // 郵便番号フック
  const {
    postalCode,
    setPostalCode,
    handlePostalChange,
    formatAndFetchPostalCode,
  } = usePostalCode("", (fetchedAddress) => {
    setFormData((prev) => ({ ...prev, clientAddress: fetchedAddress }));
  });

  // ★ 電話番号フック
  const { phone, setPhone, handlePhoneChange } = usePhone("");

  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  // 既存データの取得
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/clients/edit/${id}`)
      .then((res) => {
        const fetchedData = res.data;

        setFormData({
          clientId: fetchedData.clientId || id,
          clientName: fetchedData.clientName || "",
          clientKana: fetchedData.clientKana || "",
          clientAddress: fetchedData.clientAddress || "",
        });

        if (fetchedData.clientPostalcode) {
          setPostalCode(normalize(fetchedData.clientPostalcode));
        }
        if (fetchedData.clientPhone) {
          setPhone(normalize(fetchedData.clientPhone)); // ★ 電話番号の初期値をセット
        }
      })
      .catch((error) => {
        console.error("データ取得エラー:", error);
        alert("顧客情報の取得に失敗しました。");
      });
  }, [id, setPostalCode, setPhone]);

  // ★ 電話番号の個別分岐が不要になり、非常にシンプルに
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.clientName.trim()) {
      newErrors.clientName = VALIDATION_MESSAGES.required(labels.clientName);
    }
    if (!formData.clientKana.trim()) {
      newErrors.clientKana = VALIDATION_MESSAGES.required(labels.clientKana);
    }
    if (!postalCode.trim()) {
      newErrors.clientPostalcode = VALIDATION_MESSAGES.required(
        labels.clientPostalcode,
      );
    } else if (postalCode.length !== 7) {
      newErrors.clientPostalcode = VALIDATION_MESSAGES.postalCodeFormat(
        labels.clientPostalcode,
      );
    }
    if (!formData.clientAddress.trim()) {
      newErrors.clientAddress = VALIDATION_MESSAGES.required(
        labels.clientAddress,
      );
    }
    // ★ バリデーション時はフックから取得した `phone` をチェック
    if (!phone.trim()) {
      newErrors.clientPhone = VALIDATION_MESSAGES.required(labels.clientPhone);
    } else if (phone.length < 10 || phone.length > 11) {
      newErrors.clientPhone = VALIDATION_MESSAGES.phoneFormat(
        labels.clientPhone,
      );
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setHasError(true);
      return;
    }

    setHasError(false);
    setErrors({});

    // ★ 送信データに postalCode と phone を合流させる
    const submitData = {
      ...formData,
      clientPostalcode: postalCode,
      clientPhone: phone,
    };

    axios
      .post(`http://localhost:8080/api/clients/edit/${id}`, submitData)
      .then((res) => {
        navigate(`/clients/${id}`, {
          state: { message: "顧客情報を更新しました。" },
        });
      })
      .catch((error) => {
        console.error("更新エラー:", error);
        alert("顧客情報の更新に失敗しました。");
      });
  };

  return (
    <div className="content-wrapper">
      <PageHeader title="顧客情報編集" />

      <div className="card">
        <form onSubmit={handleSubmit} className="edit-form">
          <FormAlert hasError={hasError} />

          <div className="form-vertical-layout">
            <div className="form-group-block">
              <label>
                {labels.clientName} <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="顧客名を入力"
                className={errors.clientName ? "field-error" : ""}
              />
              <FieldError message={errors.clientName} />
            </div>

            <div className="form-group-block">
              <label>
                {labels.clientKana} <span className="required">(必須)</span>
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
              <FieldError message={errors.clientKana} />
            </div>

            <div className="form-group-block">
              <label>
                {labels.clientPostalcode}{" "}
                <span className="required">(必須)</span>
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
              <FieldError message={errors.clientPostalcode} />
            </div>

            <div className="form-group-block">
              <label>
                {labels.clientAddress} <span className="required">(必須)</span>
              </label>
              <input
                type="text"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleChange}
                placeholder="顧客住所を入力"
                className={errors.clientAddress ? "field-error" : ""}
              />
              <FieldError message={errors.clientAddress} />
            </div>

            <div className="form-group-block">
              <label>
                {labels.clientPhone} <span className="required">(必須)</span>
              </label>
              {/* ★ 電話番号はフックの値とハンドラーを直接バインド */}
              <input
                type="text"
                name="clientPhone"
                value={phone}
                onChange={handlePhoneChange}
                maxLength="11"
                placeholder="電話番号を入力(ハイフンなし)"
                className={errors.clientPhone ? "field-error" : ""}
              />
              <FieldError message={errors.clientPhone} />
            </div>

            <div className="action-buttons-form">
              <Button type="submit" variant="primary">
                更新する
              </Button>
              <Button to={`/clients/${id}`} variant="cancel">
                戻る
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

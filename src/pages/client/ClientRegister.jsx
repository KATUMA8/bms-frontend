import { useState } from "react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { usePostalCode } from "../../hooks/usePostalCode";
import { usePhone } from "../../hooks/usePhone"; // ★ 電話番号フックをインポート
import { useKanaNormalization } from "../../hooks/useKanaNormalization";
import FieldError from "../../components/FieldError";
import FormAlert from "../../components/FormAlert";
import { FORM_LABELS } from "../../utils/formLabels";
import { VALIDATION_MESSAGES } from "../../utils/validationMessages";
import Button from "../../atoms/Button";

export default function ClientRegister() {
  const navigate = useNavigate();

  // 顧客用のラベル定義を取得
  const labels = FORM_LABELS.client;

  // 入力フォームの状態管理（電話番号と郵便番号をフック側に分離するためフォームデータから除外）
  const [formData, setFormData] = useState({
    clientName: "",
    clientKana: "",
    clientAddress: "",
  });

  // ★ カスタムフックを呼び出し
  const { handleKanaBlurOrComposition } = useKanaNormalization(setFormData);

  // 郵便番号フック
  const { postalCode, handlePostalChange, formatAndFetchPostalCode } =
    usePostalCode("", (fetchedAddress) => {
      setFormData((prev) => ({
        ...prev,
        clientAddress: fetchedAddress,
      }));
    });

  // ★ 電話番号フックを呼び出し
  const { phone, handlePhoneChange } = usePhone("");

  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);

  // 通常の入力値変更ハンドラー（顧客名、住所用）
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 登録ボタン押下時の処理
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
    console.log("送信データ:", submitData);

    // Spring BootのAPIへPOST送信
    axios
      .post("http://localhost:8080/api/clients", submitData)
      .then((res) => {
        console.log("登録成功:", res.data);

        // ★ サーバーから返却された新しく採番されたIDを取得する
        const newClientId = res.data.clientId; // ※バックエンドのレスポンス仕様に合わせてres.data.clientIdまたはres.data等に変更してください

        // ★ 一覧ではなく、登録した顧客の詳細画面へ遷移する
        navigate(`/clients/${newClientId}`, {
          state: { message: "新規顧客情報を登録しました。" },
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
                className={errors.clientPostalcode ? "field-error" : ""}
                placeholder="郵便番号を入力(ハイフンなし)"
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
                className={errors.clientAddress ? "field-error" : ""}
                placeholder="顧客住所を入力"
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

            <div className="action-buttons">
              <Button type="submit" variant="primary">
                登録する
              </Button>
              <Button to="/clients" variant="cancel">
                戻る
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

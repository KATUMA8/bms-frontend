import { useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { useAtomValue } from "jotai";
import { loginUserAtom } from "../../atoms/loginUserAtom";
import { FORM_LABELS } from "../../utils/formLabels";
import { VALIDATION_MESSAGES } from "../../utils/validationMessages";
import { projectApi } from "../../api/projectApi";
import BaseProjectForm from "../../components/BaseProjectForm";
import { useAdminGuard } from "../../hooks/useAdminGuard";

export default function ProjectRegister() {
  // 管理者以外は案件一覧へリダイレクト
  useAdminGuard("/projects");

  const navigate = useNavigate(); // ★ 1. 宣言を追加
  const loginUser = useAtomValue(loginUserAtom);
  const isAdmin = loginUser?.roleFlag === 1;

  const labels = FORM_LABELS.project;

  const [projectForm, setProjectForm] = useState({
    projectName: "",
    clientId: "",
    companyId: "",
    projectStaffname: "",
    contractType: "",
    status: "",
    projectRemarks: "",
  });

  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const [hasError, setHasError] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    projectApi
      .getFormData()
      .then((data) => {
        setClients(data.clients);
        setCompanies(data.companies);
      })
      .catch((err) => {
        console.error("フォームデータ取得エラー:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectForm({ ...projectForm, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    const newErrors = {};

    if (!projectForm.projectName.trim())
      newErrors.projectName = VALIDATION_MESSAGES.required(labels.projectName);
    if (!projectForm.clientId)
      newErrors.clientId = VALIDATION_MESSAGES.required(labels.clientId);
    if (!projectForm.companyId)
      newErrors.companyId = VALIDATION_MESSAGES.required(labels.companyId);
    if (!projectForm.projectStaffname.trim())
      newErrors.projectStaffname = VALIDATION_MESSAGES.required(
        labels.projectStaffname,
      );
    if (!projectForm.contractType)
      newErrors.contractType = VALIDATION_MESSAGES.required(
        labels.contractType,
      );
    if (!projectForm.status)
      newErrors.status = VALIDATION_MESSAGES.required(labels.status);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setHasError(true);
      return;
    }

    setHasError(false);
    setErrors({});
    setServerError("");

    projectApi
      .add(projectForm)
      .then((res) => {
        // ★ レスポンスの構造に合わせてIDの取得先を調整（res または res.data など）
        const createdId = res?.projectId || res?.data?.projectId;

        if (createdId) {
          navigate(`/projects/${createdId}`, {
            state: { message: "新規案件を登録しました。" },
          });
        } else {
          // 万が一IDが取れなくても登録自体は成功しているので一覧へ飛ばす場合
          navigate("/projects", {
            state: { message: "新規案件を登録しました。" },
          });
        }
      })
      .catch((err) => {
        console.error("登録エラー詳細:", err); // デバッグ用にコンソール出力
        if (err.response && err.response.status === 400) {
          const errorData = err.response.data;
          if (Array.isArray(errorData)) {
            const errorMap = {};
            errorData.forEach((error) => {
              errorMap[error.field] = error.defaultMessage;
            });
            setErrors(errorMap);
            setHasError(true);
          } else {
            setServerError("入力内容にエラーがあります。");
            setHasError(true);
          }
        } else {
          setServerError("登録処理に失敗しました。");
          setHasError(true);
        }
      });
  };

  return (
    <BaseProjectForm
      title="新規案件登録"
      projectForm={projectForm}
      clients={clients}
      companies={companies}
      errors={errors}
      hasError={hasError}
      serverError={serverError}
      labels={labels}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEdit={false}
      cancelTo="/projects"
    />
  );
}
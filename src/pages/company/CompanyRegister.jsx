import BaseEntityForm from "../../components/BaseEntityForm";
import { FORM_LABELS } from "../../utils/formLabels";
import { useAdminGuard } from "../../hooks/useAdminGuard";

export default function CompanyRegister() {
  // 管理者以外は自動で "/companys" へリダイレクト
  useAdminGuard("/companys");

  return (
    <BaseEntityForm
      title="新規業者登録"
      apiEndpoint="/companys"
      idKey="companyId"
      labels={FORM_LABELS.company}
    />
  );
}
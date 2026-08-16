import BaseEntityForm from "../../components/BaseEntityForm";
import { FORM_LABELS } from "../../utils/formLabels";

export default function CompanyRegister() {
  return (
    <BaseEntityForm
      title="新規業者登録"
      apiEndpoint="/companys"
      idKey="companyId"
      labels={FORM_LABELS.company}
    />
  );
}
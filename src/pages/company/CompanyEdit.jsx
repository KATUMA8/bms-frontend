import BaseEntityForm from "../../components/BaseEntityForm";
import { FORM_LABELS } from "../../utils/formLabels";

export default function CompanyEdit() {
  return (
    <BaseEntityForm
      title="業者情報編集"
      apiEndpoint="/companys"
      idKey="companyId"
      labels={FORM_LABELS.company}
      isEdit={true}
    />
  );
}
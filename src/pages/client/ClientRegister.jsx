import BaseEntityForm from "../../components/BaseEntityForm";
import { FORM_LABELS } from "../../utils/formLabels";

export default function ClientRegister() {
  return (
    <BaseEntityForm
      title="新規顧客登録"
      apiEndpoint="/clients"
      idKey="clientId"
      labels={FORM_LABELS.client}
    />
  );
}
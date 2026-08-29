export default function FormAlert({ hasError }) {
  if (!hasError) return null;

  return (
    <div className="alert alert-danger">
      <p>入力内容にエラーがあります。メッセージの内容を確認してください。</p>
    </div>
  );
}
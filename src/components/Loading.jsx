export default function Loading({ message = "読み込み中..." }) {
  return (
    <div className="content-wrapper">
      <p>{message}</p>
    </div>
  );
}
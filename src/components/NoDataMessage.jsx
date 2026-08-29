export default function NoDataMessage({ message = "現在、登録されているデータはありません。" }) {
  return (
    <div className="no-data" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>
      {message}
    </div>
  );
}
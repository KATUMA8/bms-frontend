import Button from "../atoms/Button"; // 必要に応じてボタン等を利用

export default function DataTable({ columns, data, pagination }) {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex} data-label={col.label}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: "center" }}>
                データがありません。
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ページネーション部分の共通化（必要に応じて実装） */}
      {pagination && (
        <div className="pagination">
          {/* ページネーションボタン等の描画 */}
        </div>
      )}
    </div>
  );
}
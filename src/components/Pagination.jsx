export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 0) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination">
      {/* 前のページ */}
      {currentPage > 1 && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage - 1);
          }}
        >
          前のページ
        </a>
      )}

      {/* ページ番号ループ */}
      {totalPages > 1 &&
        pageNumbers.map((i) => {
          const isCurrent = i === currentPage;
          const label = `| ${i} `;

          if (isCurrent) {
            return <span key={i}>{label}</span>;
          } else {
            return (
              <a
                key={i}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(i);
                }}
              >
                {label}
              </a>
            );
          }
        })}

      {/* 次のページ */}
      {currentPage < totalPages && (
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onPageChange(currentPage + 1);
          }}
        >
          次のページ
        </a>
      )}
    </div>
  );
}

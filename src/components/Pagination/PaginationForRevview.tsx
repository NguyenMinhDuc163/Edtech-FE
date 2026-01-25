export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const buttons = [];

  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <button
        key={i}
        className={`page-btn ${i === page ? "active" : ""}`}
        onClick={() => onChange(i)}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="pagination-container">
      <button
        className="page-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        ‹
      </button>

      {buttons}

      <button
        className="page-btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        ›
      </button>
    </div>
  );
}

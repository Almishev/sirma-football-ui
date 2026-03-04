function Pagination({ page, totalPages, onPageChange }) {
  const canGoPrev = page > 0
  const canGoNext = totalPages > 0 ? page < totalPages - 1 : true

  const handlePrev = () => {
    if (!canGoPrev) return
    onPageChange(Math.max(page - 1, 0))
  }

  const handleNext = () => {
    if (!canGoNext) return
    const nextPage =
      totalPages > 0 ? Math.min(page + 1, totalPages - 1) : page + 1
    onPageChange(nextPage)
  }

  return (
    <div className="pagination">
      <button type="button" onClick={handlePrev} disabled={!canGoPrev}>
        Previous
      </button>
      <span>
        Page {page + 1}
        {totalPages > 0 ? ` of ${totalPages}` : ''}
      </span>
      <button type="button" onClick={handleNext} disabled={!canGoNext}>
        Next
      </button>
    </div>
  )
}

export default Pagination


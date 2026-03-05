function formatToday() {
  const now = new Date()
  return new Intl.DateTimeFormat('bg-BG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(now)
}

function TopStrip() {
  return (
    <div className="top-strip">
      <div className="top-strip-inner">
        <div className="top-strip-left">
          <span className="top-strip-date">{formatToday()}</span>
          <span className="top-strip-text">
            Fan portal for Football Tournaments – contact:{' '}
            <a href="mailto:admin@pirinpixel.com">admin@pirinpixel.com</a>
          </span>
        </div>
        <div className="top-strip-right">
          <a
            className="top-strip-icon"
            href="https://www.facebook.com/pirinpixel/"
            aria-label="Facebook"
            target="_blank"
            rel="noreferrer"
          >
            f
          </a>
          <a
            className="top-strip-icon"
            href="https://www.linkedin.com/in/anton-almishev-596aa5262/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noreferrer"
          >
            in
          </a>
        </div>
      </div>
    </div>
  )
}

export default TopStrip


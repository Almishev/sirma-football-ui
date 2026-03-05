import { Link } from 'react-router-dom'

function TopBanner() {
  return (
    <div className="top-banner">
      <div className="top-banner-inner">
        <div className="top-banner-left">
          <h1 className="top-banner-title">
            <Link to="/">Football Tournament</Link>
          </h1>
          <p className="top-banner-subtitle">Euro Football Tournament 2026</p>
        </div>
        <div className="top-banner-right">
          <img src="/sample-add.jpg" alt="Advertisement banner" />
        </div>
      </div>
    </div>
  )
}

export default TopBanner


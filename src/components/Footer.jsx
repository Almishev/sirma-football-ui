function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <span>Euro Football Tournament</span>
      <span> © {year}</span>
    </footer>
  )
}

export default Footer


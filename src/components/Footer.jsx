import { useEffect, useState } from 'react'

function Footer() {
  const year = new Date().getFullYear()
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const timeString = now.toLocaleTimeString('bg-BG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  return (
    <footer className="app-footer">
      <span>Euro Football Tournament</span>
      <span> © {year}</span>
      <span> · {timeString}</span>
    </footer>
  )
}

export default Footer


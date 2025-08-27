import React from 'react'

const Footer = ({ year,ME }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between text-sm text-slate-500">
        <p>© {year} {ME.name}. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a className="hover:text-slate-700" href="#home">Back to top</a>
          <a className="hover:text-slate-700" href={ME.github} target="_blank" rel="noreferrer">GitHub</a>
          <a className="hover:text-slate-700" href={ME.linkedIn} target="_blank" rel="noreferrer">LinkedIn</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
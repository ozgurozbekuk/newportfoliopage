import React from 'react'
import { Github, Linkedin } from "lucide-react";


export const Header = ({ME}) => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#home" className="font-medium tracking-tight text-slate-900">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
            {ME.name}
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <a className="hover:text-slate-900" href="#home">About</a>
          <a className="hover:text-slate-900" href="#projects">Projects</a>
          <a className="hover:text-slate-900" href="#contact">Contact</a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={ME.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={ME.linkedIn}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="p-2 rounded-xl hover:bg-slate-100"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  )
}

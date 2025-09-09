import { useState } from "react";
import { Link } from "react-router-dom";
import { Github, Linkedin, Menu, X } from "lucide-react";

const Header = ({ ME }) => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-white/70 border-b border-slate-200">
      <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="font-medium tracking-tight text-slate-900">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-slate-900 animate-pulse" />
            {ME.name}
          </span>
        </a>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-600">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/" className="hover:text-slate-900">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-slate-900">About</Link>
            </li>
            <li>
              <Link to="/projects" className="hover:text-slate-900">Projects</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-slate-900">Contact</Link>
            </li>
          </ul>
        </nav>

        {/* Social icons */}
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

          {/* Hamburger button (mobil) */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-slate-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3">
          <ul className="flex flex-col gap-3 text-sm text-slate-600">
            <li>
              <Link to="/" onClick={() => setOpen(false)}>Home</Link>
            </li>
            <li>
              <Link to="/about" onClick={() => setOpen(false)}>About</Link>
            </li>
            <li>
              <Link to="/projects" onClick={() => setOpen(false)}>Projects</Link>
            </li>
            <li>
              <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;

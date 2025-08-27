import { useMemo, useState } from "react";
import {
  Github,
  Linkedin,
  ExternalLink,
  Mail,
  Code2,
  ArrowDown,
} from "lucide-react";
import { motion } from "framer-motion";
import PROJECTS from "../data/project";
import { Header } from "./header/Header";
import Footer from "./footer/Footer";

// --- EASY TO EDIT ---
const ME = {
  name: "Özgür Özbek",
  title: "Full Stack / React Developer",
  description:
    "I build modern, responsive websites and web applications using React, Next.js, and WordPress. Passionate about clean design, user experience, and performance. With a problem-solving mindset, I deliver fast, functional, and visually appealing results. I'm excited to collaborate and create something great together!",
  email: "ozgurozbekuk@gmail.com",
  linkedIn: "https://www.linkedin.com/in/ozgurozbekuk/",
  github: "https://github.com/ozgurozbekuk",
  heroImages: [
    "https://images.unsplash.com/photo-1522199755839-a2bacb67c546?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
  ],
};

// Categories
const CATEGORIES = [
  "All",
  "Real Life",
  "React",
  "Next.js",
  "Fullstack",
  "WordPress",
  "AI",
];

export default function PortfolioApp() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(
      (p) => activeCategory === "All" || p.categories?.includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-800 scroll-smooth">
      <Header ME={ME} />

      {/* HERO / ABOUT */}
      <section id="home" className="relative pt-28 pb-24">
        <div className="container mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
              <Code2 className="h-4 w-4" /> React • Next.js • Node.js
            </span>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
              Hi, I am <span className="text-slate-900">{ME.name}</span>
            </h1>
            <p className="text-lg text-slate-600">{ME.title}</p>
            <p className="max-w-xl text-slate-600/90">{ME.description}</p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${ME.email}`}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-sm font-medium shadow-sm transition"
              >
                <Mail className="h-4 w-4" /> Contact Me
              </a>
              <a
                href={ME.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-100 px-5 py-3 text-sm font-medium transition"
              >
                <Github className="h-4 w-4" /> GitHub
              </a>
              <a
                href={ME.linkedIn}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-100 px-5 py-3 text-sm font-medium transition"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="grid grid-cols-2 gap-4"
          >
            {ME.heroImages.map((src, i) => (
              <div
                key={i}
                className={`relative overflow-hidden rounded-2xl ring-1 ring-slate-200 shadow-sm aspect-[4/3] ${
                  i === 1 ? "mt-6" : ""
                }`}
              >
                {/* Decoration */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.08),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.06),transparent_40%)]" />
                <img
                  src={src}
                  alt={`Portfolio image ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </motion.div>
        </div>
        {/* Down Arrow */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <a
            href="#projects"
            className="animate-bounce inline-flex flex-col items-center text-slate-500 hover:text-slate-700"
          >
            <ArrowDown className="h-8 w-8" />
          </a>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-8 flex items-center justify-between gap-4 flex-wrap border-b border-slate-300 pb-10">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Projects (In Progress)
            </h2>
            {/* Category Buttons */}
            <div className="flex flex-wrap items-center gap-2 ">
              {CATEGORIES.map((c) => {
                const active = c === activeCategory;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCategory(c)}
                    aria-pressed={active}
                    className={
                      "px-4 py-2 text-sm rounded-full border transition cursor-pointer " +
                      (active
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100")
                    }
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-14">
            {filteredProjects.map((p, idx) => (
              <motion.article
                key={p.title + idx}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55 }}
                className={`grid items-center gap-8 md:gap-10 lg:grid-cols-2 border-b border-slate-300 pb-10 ${
                  idx % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm">
                  <img
                    src={p.image}
                    alt={`${p.title} image`}
                    className="w-full h-[260px] md:h-[320px] object-cover"
                    loading="lazy"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center text-xs font-medium px-3 py-1 text-slate-600">
                      <ul className="flex flex-wrap gap-2 pt-1">
                        {p.categories.map((c) => (
                          <li
                            key={c}
                            className="text-xs font-medium rounded-full border border-slate-300 bg-white px-3 py-1"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </span>
                  </div>
                  <h3 className="text-2xl md:text-3xl font-medium tracking-tight">
                    {p.title}
                  </h3>
                  <p className="text-slate-600/90">{p.description}</p>
                  <ul className="flex flex-wrap gap-2 pt-1">
                    {p.tech.map((t) => (
                      <li
                        key={t}
                        className="text-xs font-medium tracking-wide rounded-full border border-slate-300 bg-white px-3 py-1"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={p.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 hover:bg-slate-100 px-4 py-2 text-sm font-medium"
                    >
                      <Github className="h-4 w-4" /> Source Code
                    </a>
                    <a
                      href={p.demo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-sm font-medium shadow-sm"
                    >
                      <ExternalLink className="h-4 w-4" /> Live Demo
                    </a>
                  </div>
                </div>
              </motion.article>
            ))}

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <div className="text-center text-slate-500 py-16">
                No projects available in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-16 md:py-20 bg-slate-50">
        <div className="container mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 tracking-tight">
            Contact
          </h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <p className="text-slate-600 mb-5">
              Do you have a project idea or want to collaborate? Feel free to
              reach out to me via email.
            </p>
            <a
              href={`mailto:${ME.email}`}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 text-sm font-medium shadow-sm"
            >
              <Mail className="h-4 w-4" /> {ME.email}
            </a>
          </div>
        </div>
      </section>

      <Footer ME={ME} year={year} />
    </div>
  );
}

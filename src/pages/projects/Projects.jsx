import { useMemo, useState } from "react";
import PROJECTS from "../../data/project";
import { motion } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

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

const Projects = ({}) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter(
      (p) => activeCategory === "All" || p.categories?.includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <section id="projects" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap border-b border-slate-300 pb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Projects
            </h2>
            <p className="text-sm text-gray-500">
              Note: Some of the projects are still in progress and currently
              under development.
            </p>
          </div>
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
              <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-200 bg-white shadow-sm ">
                <a target="_blank" href={p.demo} rel="noopener noreferrer">
                  <img
                    src={p.image}
                    alt={`${p.title} image`}
                    className="w-full h-[260px] md:h-[320px] object-cover transition-transform duration-500 ease-in-out hover:scale-110 "
                    loading="lazy"
                  />
                </a>
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
  );
};

export default Projects;

import { motion } from "framer-motion";
import { Code2, Github, Linkedin, Mail } from "lucide-react";
import LogoLoop from '../../components/LogoLoop';
import { SiReact, SiNextdotjs, SiJavascript, SiTailwindcss,SiPython } from 'react-icons/si';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://www.javascript.com/" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiPython />, title: "Python", href: "https://www.python.org/" },
];

const About = ({ ME }) => {
  return (
    <section id="home" className="relative pt-10 pb-24">
      <div className="container mx-auto mb-10 max-w-6xl px-4 grid lg:grid-cols-2 gap-10 items-center">
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
      <div style={{ height: '200px', position: 'relative', overflow: 'hidden'}}>
      <LogoLoop
        logos={techLogos}
        speed={90}
        direction="left"
        logoHeight={48}
        gap={30}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
    </section>
  );
};

export default About;

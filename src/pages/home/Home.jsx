
import { Github, Linkedin, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import ChatHero from "../../components/chatai/ChatHero";

const PROFILE_IMAGE = "/images/ozgurozbek.png";

export default function Home({ ME }) {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="h-[calc(100dvh-4rem)] overflow-hidden bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_40%,#f8fafc_100%)] text-slate-800">
      <div className="mx-auto grid h-full max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[2fr_1fr] lg:gap-4">
        <aside className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <div className="flex h-full flex-col justify-start bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(14,165,233,0.12),transparent_30%)] px-5 py-3 sm:px-6 sm:py-4 lg:px-8 lg:py-4">
            <div className="mx-auto flex w-full max-w-xl flex-col">
              <div className="relative mb-3 mx-auto h-36 w-36 overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-100 shadow-sm sm:h-40 sm:w-40 lg:h-44 lg:w-44">
                {!imageError ? (
                  <img
                    src={PROFILE_IMAGE}
                    alt={ME.name}
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(160deg,#0f172a,#334155)] text-white">
                    <div className="text-center">
                      <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-white/10">
                        <UserRound className="h-8 w-8" />
                      </div>
                      <p className="text-xl font-semibold tracking-wide">ÖÖ</p>
                      <p className="mt-1 px-4 text-xs text-slate-300">
                        `public/images/ozgur-profile.jpg`
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
                  About Me
                </p>
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                  {ME.name}
                </h1>
                <p className="mt-1 text-base font-medium text-slate-700">
                  {ME.title}
                </p>
                <p className="mt-3 text-base leading-7 font-medium text-slate-600">
                  I build modern web applications and enjoy working with React,
                  Next.js, Node.js, and AI-driven products. I am especially
                  interested in building AI agents, chatbots, and RAG-based
                  applications. Creating clean, fast, and user-focused
                  interfaces matters a lot to me. In my spare time, I explore
                  new technologies, turn ideas into prototypes, and keep
                  improving the way digital products look and feel. I also enjoy
                  reading books, going for walks, and playing tennis.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <a
                    href={`mailto:${ME.email}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800"
                  >
                    <Mail className="h-4 w-4" /> Contact Me
                  </a>
                  <a
                    href={ME.github}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                  >
                    <Github className="h-4 w-4" /> GitHub
                  </a>
                  <a
                    href={ME.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-800 transition hover:bg-slate-100"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="h-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur">
          <ChatHero />
        </div>
      </div>
    </section>
  );
}

import { Mail } from 'lucide-react'

const Contact = ({ME}) => {
  return (
    <section id="contact" className="h-[80vh] py-16 md:py-20 bg-slate-50">
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
  )
}

export default Contact
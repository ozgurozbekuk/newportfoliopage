
import { Link } from "react-router-dom";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch { return iso; }
}

export default function NoteCard({ post }) {


  return (
    <Link
      to={`/notes/${post.slug}`}
      className="group block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide text-gray-500">
          {formatDate(post.date)}
        </span>
        <div className="flex gap-1.5">
          {post.tags?.slice(0, 2).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
              {t}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 group-hover:underline underline-offset-4">
        {post.title}
      </h3>

      <p className="mt-2 text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-gray-100">
          ↗
        </span>
        <span>Read</span>
      </div>
    </Link>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "../../data/posts";


const loaders = import.meta.glob("/src/data/notescontent/*.txt", {
  query: "?raw",
  import: "default",
});
export default function NotePage() {
  const { slug } = useParams();
  const meta = posts.find((p) => p.slug === slug);
  const [content, setContent] = useState("Loading…");


  const loader = useMemo(
    () => loaders[`/src/data/notescontent/${slug}.txt`] ?? null,
    [slug]
  );
 

  useEffect(() => {
    (async () => {
      if (!loader) return setContent(`Not found: ${slug}`);
      const txt = await loader(); 
      setContent(txt);
      
    })();
  }, [loader, slug]);

  if (!meta) {
    return <div className="p-8">Note not found</div>;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 prose">
      <Link to="/notes" className="no-underline hover:underline text-sm text-gray-600">
        ← Back
      </Link>
      <h1 className="mb-2 text-3xl font-bold">{meta.title}</h1>
      <p className="mt-0 text-sm text-gray-500">
        {new Date(meta.date).toLocaleDateString()}
      </p>

      <div className="whitespace-pre-line text-xl">{content}</div>
    </article>
  );
}

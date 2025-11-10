import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { posts } from "../../data/posts";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";


const loaders = import.meta.glob("/src/data/notescontent/*.{txt,md}", {
  query: "?raw",
  import: "default",
});

export default function NotePage() {
  const { slug } = useParams();
  const meta = posts.find((p) => p.slug === slug);

  const [content, setContent] = useState("Loading…");
  const [isMarkdown, setIsMarkdown] = useState(false);

  // check is it txt or md
  const loaderInfo = useMemo(() => {
    const mdKey = `/src/data/notescontent/${slug}.md`;
    const txtKey = `/src/data/notescontent/${slug}.txt`;

    if (loaders[mdKey]) {
      return { loader: loaders[mdKey], isMarkdown: true };
    }
    if (loaders[txtKey]) {
      return { loader: loaders[txtKey], isMarkdown: false };
    }
    return { loader: null, isMarkdown: false };
  }, [slug]);

  useEffect(() => {
    (async () => {
      if (!loaderInfo.loader) {
        setContent(`Not found: ${slug}`);
        setIsMarkdown(false);
        return;
      }

      const txt = await loaderInfo.loader();
      setContent(txt);
      setIsMarkdown(loaderInfo.isMarkdown);
    })();
  }, [loaderInfo, slug]);

  if (!meta) {
    return <div className="p-8">Note not found</div>;
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 prose">
      <Link
        to="/notes"
        className="no-underline hover:underline text-sm text-gray-600"
      >
        ← Back
      </Link>

      <h1 className="mb-2 text-3xl font-bold">{meta.title}</h1>

      <p className="mt-0 text-sm text-gray-500">
        {new Date(meta.date).toLocaleDateString()}
      </p>

      {/* Content */}
      <div className="mt-6">
        {isMarkdown ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className="bg-gray-200 px-1 py-0.5 rounded text-sm">
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          <div className="whitespace-pre-line text-xl">{content}</div>
        )}
      </div>
    </article>
  );
}

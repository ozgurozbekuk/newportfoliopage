import { useParams, Link } from "react-router-dom";
import { posts } from "../../data/posts.js";

function Paragraphs({ text }) {
  return text
    .split(/\n{2,}/)
    .map((para, i) => (
      <p key={i} className="my-3 whitespace-pre-line">
        {para}
      </p>
    ));
}



export default function NotePage() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/notes" className="text-sm text-gray-600 hover:underline">← Back</Link>
        <h1 className="mt-4 text-xl font-semibold">Coming Soon</h1>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-10 prose prose-neutral">
      <Link to="/notes" className="no-underline text-sm text-gray-600 hover:underline">← Back</Link>
      <h1 className="mb-2 font-bold text-2xl">{post.title}</h1>
      <p className="mt-0 text-sm text-gray-500">
        {new Date(post.date).toLocaleDateString()}
      </p>
      <Paragraphs text={post.content} />
    </article>
  );
}

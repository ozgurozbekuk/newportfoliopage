import { posts } from "../../data/posts";
import NoteCard from "./NoteCard";




export default function NotesList() {


  return (
    <section className="h-[80vh] mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">My Notes & Blog Posts</h1>
        <p className="mt-1 text-gray-600">
          Welcome to my learning journal. I capture concepts I’m exploring in short, practical notes—snippets, patterns, and ‘aha’ moments—and occasionally publish longer posts when a topic needs more depth.
        </p>
      </header>
      {posts.length === 0 && <div><p className="text-center text-5xl font-bold my-10">Coming Soon!</p></div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {posts?.map((p) => (
          <NoteCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}

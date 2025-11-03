import { useMemo, useState } from "react";
import { posts } from "../../data/posts";
import NoteCard from "./NoteCard";




export default function NotesList() {
  const categories = ["All", "JavaScript", "Python", "AI"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const sortedPosts = useMemo(() => posts.slice().reverse(), []);
  const filteredPosts =
    selectedCategory === "All"
      ? sortedPosts
      : sortedPosts.filter((post) => post.category === selectedCategory);


  return (
    <section className=" mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold">My Notes & Blog Posts</h1>
        <p className="mt-1 text-gray-600">
          Welcome to my learning journal. I capture concepts I’m exploring in short, practical notes—snippets, patterns, and ‘aha’ moments—and occasionally publish longer posts when a topic needs more depth.
        </p>
      </header>

      <div className="mb-8 flex flex-wrap gap-3">
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-gray-900 bg-gray-900 text-white shadow"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {sortedPosts.length === 0 && (
        <div>
          <p className="my-10 text-center text-5xl font-bold">Coming Soon!</p>
        </div>
      )}
      {sortedPosts.length > 0 && filteredPosts.length === 0 && (
        <div>
          <p className="my-10 text-center text-lg text-gray-600">
            No notes in this category yet — check back soon.
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map((p) => (
          <NoteCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}

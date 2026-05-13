import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import Reveal from "../components/Reveal.jsx";

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortProjects(projects, mode) {
  const list = [...(projects || [])];
  list.sort((a, b) => {
    const ad = toDate(a.createdAt)?.getTime() || 0;
    const bd = toDate(b.createdAt)?.getTime() || 0;
    return mode === "oldest" ? ad - bd : bd - ad;
  });
  return list;
}

export default function ProjectsPage({ content }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("latest");
  const [tag, setTag] = useState("all");

  const tagMap = useMemo(() => {
    const map = new Map();
    (content.skillTags || []).forEach((t) => map.set(t.id, t.name));
    return map;
  }, [content.skillTags]);

  const sorted = useMemo(() => sortProjects(content.projects, sort), [content.projects, sort]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sorted.filter((p) => {
      const matchesQuery = !q
        ? true
        : `${p.title} ${p.tagline} ${(p.tech || []).join(" ")}`.toLowerCase().includes(q);
      const matchesTag = tag === "all" ? true : (p.skillTagIds || []).includes(tag);
      return matchesQuery && matchesTag;
    });
  }, [query, sorted, tag]);

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar activeId="projects" resumeUrl={content.resumeUrl} />

      <main className="pt-32">
        <section className="container-page">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-secondaryText">Projects</div>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {content.projectsHeading || "Projects"}
                </h1>
                <p className="muted mt-3 max-w-3xl">{content.projectsSubheading || ""}</p>
              </div>
              <Link className="btn-secondary w-full sm:w-auto justify-center" to="/">
                Back Home
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mt-10 grid gap-4 rounded-2xl bg-surface/50 p-4 ring-1 ring-white/10 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="text-xs font-semibold text-secondaryText">Search</div>
                <input
                  className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                  placeholder="Search by title, tech, keyword"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <div className="md:col-span-4">
                <div className="text-xs font-semibold text-secondaryText">Filter by skill</div>
                <select
                  className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                >
                  <option value="all" className="bg-surface text-white">All</option>
                  {(content.skillTags || []).map((t) => (
                    <option key={t.id} value={t.id} className="bg-surface text-white">
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:col-span-3">
                <div className="text-xs font-semibold text-secondaryText">Sort</div>
                <select
                  className="mt-2 w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                >
                  <option value="latest" className="bg-surface text-white">Latest</option>
                  <option value="oldest" className="bg-surface text-white">Oldest</option>
                </select>
              </div>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p, idx) => (
              <Reveal key={p.slug} delay={0.02 * idx}>
                <ProjectCard project={{ ...p, tech: p.tech || [] }} />
                {(p.skillTagIds || []).length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(p.skillTagIds || []).slice(0, 4).map((id) => (
                      <span key={id} className="chip">
                        {tagMap.get(id) || id}
                      </span>
                    ))}
                  </div>
                ) : null}
              </Reveal>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12 text-sm text-secondaryText">No projects match your filters.</div>
          ) : null}
        </section>
      </main>
    </div>
  );
}

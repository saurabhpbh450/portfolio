import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Reveal from "../components/Reveal.jsx";

export default function ProjectDetailPage({ content }) {
  const params = useParams();
  const slug = params.slug;

  const tagMap = useMemo(() => {
    const map = new Map();
    (content.skillTags || []).forEach((t) => map.set(t.id, t.name));
    return map;
  }, [content.skillTags]);

  const project = useMemo(
    () => (content.projects || []).find((p) => p.slug === slug),
    [content.projects, slug]
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar activeId="projects" resumeUrl={content.resumeUrl} />
        <main className="pt-32">
          <div className="container-page">
            <div className="card p-8">
              <h1 className="text-2xl font-extrabold text-white">Project not found</h1>
              <p className="mt-3 text-secondaryText">This project may have been renamed.</p>
              <Link className="btn-secondary mt-6 inline-flex" to="/projects">
                Back to Projects
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const gallery = [project.coverImageUrl, ...(project.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar activeId="projects" resumeUrl={content.resumeUrl} />
      <main className="pt-32">
        <section className="container-page">
          <Reveal>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="text-xs font-semibold text-secondaryText">Project</div>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {project.title}
                </h1>
                <p className="muted mt-3 max-w-3xl">{project.tagline}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link className="btn-secondary" to="/projects">
                  View All
                </Link>
                {project.liveUrl ? (
                  <a className="btn-primary" href={project.liveUrl} target="_blank" rel="noreferrer">
                    Live Demo
                  </a>
                ) : null}
                {project.githubUrl ? (
                  <a className="btn-secondary" href={project.githubUrl} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                ) : null}
              </div>
            </div>
          </Reveal>

          {(project.skillTagIds || []).length ? (
            <Reveal delay={0.05}>
              <div className="mt-6 flex flex-wrap gap-2">
                {(project.skillTagIds || []).map((id) => (
                  <span key={id} className="chip">
                    {tagMap.get(id) || id}
                  </span>
                ))}
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.08}>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {gallery.slice(0, 6).map((src) => (
                <div key={src} className="card overflow-hidden">
                  <img src={src} alt="Project" className="h-56 w-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="card p-7 text-left">
                <div className="text-xs font-semibold text-secondaryText">Impact</div>
                <ul className="mt-4 space-y-3">
                  {(project.bullets || []).map((b, idx) => (
                    <li key={idx} className="flex gap-3 text-sm text-white/90">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                {project.details ? (
                  <div className="mt-8">
                    <div className="text-xs font-semibold text-secondaryText">Details</div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-white/90">{project.details}</p>
                  </div>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.05} className="lg:col-span-5">
              <div className="card p-7 text-left">
                <div className="text-xs font-semibold text-secondaryText">Tech stack</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(project.tech || []).map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-8 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                  <div className="text-xs font-semibold text-secondaryText">Slug</div>
                  <div className="mt-1 text-sm text-white/90">{project.slug}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}

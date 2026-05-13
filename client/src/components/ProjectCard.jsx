import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProjectCard({ project, showDetails = true }) {
  const hasLinks = Boolean(project.liveUrl || project.githubUrl);

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/30 to-black/70" />
        {project.coverImageUrl ? (
          <img
            alt={project.title}
            src={project.coverImageUrl}
            className="h-44 w-full object-cover opacity-90 transition duration-300 group-hover:opacity-100"
            loading="lazy"
          />
        ) : (
          <div className="h-44 w-full bg-[radial-gradient(circle_at_20%_10%,rgba(101,195,186,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(212,175,55,0.20),transparent_55%),linear-gradient(to_bottom,rgba(255,255,255,0.06),transparent)]" />
        )}
        <div className="absolute left-0 right-0 top-0 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {project.tech?.slice(0, 4).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6 text-left">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight text-white">
              {project.title}
            </h3>
            <p className="muted mt-1 line-clamp-2 min-h-[48px]">{project.tagline}</p>
          </div>
          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 transition group-hover:bg-white/10">
            <span className="text-gold">↗</span>
          </span>
        </div>

        <ul className="mt-5 flex-1 space-y-2">
          {(project.bullets || []).slice(0, 4).map((b, idx) => (
            <li key={idx} className="flex gap-3 text-sm text-white/90">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
              <span className="line-clamp-2">{b}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3 pt-2">
          {showDetails ? (
            <Link className="btn-secondary" to={`/projects/${project.slug}`}>
              Details
            </Link>
          ) : null}
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
          {!hasLinks && !showDetails ? (
            <div className="text-xs text-secondaryText">Add links in admin panel.</div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

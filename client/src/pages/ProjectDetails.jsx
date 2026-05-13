import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Reveal from "../components/Reveal.jsx";
import { apiGetPortfolio } from "../lib/api.js";
import ReactMarkdown from 'react-markdown';

export default function ProjectDetails() {
  const { slug } = useParams();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    apiGetPortfolio()
      .then((data) => {
        if (!mounted) return;
        setContent(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load project details");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const project = content?.projects?.find((p) => p.slug === slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar resumeUrl={content?.resumeUrl} />
        <div className="py-32 text-center text-sm text-secondaryText">Loading project...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-bg">
        <Navbar resumeUrl={content?.resumeUrl} />
        <div className="py-32 text-center">
          <p className="text-sm text-red-400">{error || "Project not found"}</p>
          <Link to="/projects" className="mt-4 inline-block btn-secondary">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar activeId="" resumeUrl={content?.resumeUrl} />

      <main className="pt-32 pb-20">
        <div className="container-page max-w-4xl">
          <Reveal>
            <Link to="/projects" className="text-sm font-semibold text-gold hover:text-goldLight mb-6 inline-flex items-center gap-2">
              &larr; Back to all projects
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech?.map((t) => (
                <span key={t} className="chip bg-white/10 text-white font-semibold ring-0">
                  {t}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4 sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="text-xl text-secondaryText mb-8 max-w-2xl">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="w-full rounded-2xl overflow-hidden ring-1 ring-white/10 mb-12">
               {project.coverImageUrl ? (
                 <img src={project.coverImageUrl} alt={project.title} className="w-full object-cover" />
               ) : (
                 <div className="w-full h-64 bg-white/5 flex items-center justify-center text-secondaryText">No cover image</div>
               )}
            </div>
          </Reveal>

          <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
            <Reveal delay={0.15}>
               <div className="prose prose-invert prose-teal max-w-none">
                 {project.details ? (
                   <ReactMarkdown>{project.details}</ReactMarkdown>
                 ) : (
                   <p className="text-secondaryText text-sm">No detailed description provided yet.</p>
                 )}
                 
                 {project.bullets && project.bullets.length > 0 && (
                   <>
                     <h3 className="text-white mt-12 mb-4 font-bold text-xl">Key Impact</h3>
                     <ul className="space-y-2">
                       {project.bullets.map((b, idx) => (
                         <li key={idx} className="flex gap-3 text-white/90">
                           <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                           <span>{b}</span>
                         </li>
                       ))}
                     </ul>
                   </>
                 )}
               </div>

               {project.images && project.images.length > 0 && (
                 <div className="mt-16">
                    <h3 className="text-white font-bold text-xl mb-6">Gallery</h3>
                    <div className="grid gap-6 sm:grid-cols-2">
                       {project.images.map((img, idx) => (
                         <div key={idx} className="rounded-2xl overflow-hidden ring-1 ring-white/10">
                            <img src={img} alt={`${project.title} screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </Reveal>

            <Reveal delay={0.2}>
               <div className="card p-6 sticky top-32">
                 <h3 className="text-sm font-bold text-white mb-4">Project Links</h3>
                 <div className="flex flex-col gap-3">
                    {project.liveUrl ? (
                      <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-primary text-center justify-center">
                        Visit Live App ↗
                      </a>
                    ) : null}
                    {project.githubUrl ? (
                      <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary text-center justify-center bg-white/5 hover:bg-white/10 ring-white/10">
                        View Source Code
                      </a>
                    ) : null}
                    {!project.liveUrl && !project.githubUrl && (
                      <div className="text-xs text-secondaryText">No external links available.</div>
                    )}
                 </div>
               </div>
            </Reveal>
          </div>
        </div>
      </main>
    </div>
  );
}

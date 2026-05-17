import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";
import Reveal from "../components/Reveal.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import SkillsGrid from "../components/SkillsGrid.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { apiGetPortfolio } from "../lib/api.js";

const EMPTY = {
  name: "",
  title: "",
  profilePicUrl: "/images/profile/avatar.png",
  tagline: "",
  availability: "",
  heroSubtext: "",
  heroFocus: "",
  heroStrength: "",
  heroMindset: "",
  aboutHeading: "",
  aboutSubheading: "",
  aboutIntro: "",
  aboutBullets: [],
  quickFacts: [],
  skillsHeading: "",
  skillsSubheading: "",
  skills: [],
  skillTags: [],
  projectsHeading: "",
  projectsSubheading: "",
  projects: [],
  internshipsHeading: "",
  internshipsSubheading: "",
  internships: [],
  educationHeading: "",
  educationSubheading: "",
  education: [],
  certificationsHeading: "",
  certificationsSubheading: "",
  certifications: [],
  contactEmail: "",
  links: [],
  resumeUrl: ""
};

const SECTION_IDS = [
  "hero",
  "about",
  "skills",
  "projects",
  "internships",
  "education",
  "certifications",
  "contact"
];

function useActiveSection() {
  const [activeId, setActiveId] = useState("hero");

  useEffect(() => {
    const elements = SECTION_IDS.map((id) =>
      document.getElementById(id)
    ).filter(Boolean);

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return activeId;
}

function toDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function latestProjects(projects, count) {
  const list = [...(projects || [])];
  list.sort((a, b) => {
    const ad = toDate(a.createdAt)?.getTime() || 0;
    const bd = toDate(b.createdAt)?.getTime() || 0;
    return bd - ad;
  });
  return list.slice(0, count);
}

function latestCerts(certs) {
  const list = [...(certs || [])];
  list.sort((a, b) => {
    const ad = toDate(a.date)?.getTime() || toDate(a.year)?.getTime() || 0;
    const bd = toDate(b.date)?.getTime() || toDate(b.year)?.getTime() || 0;
    return bd - ad;
  });
  return list;
}

function latestInternships(internships) {
  const list = [...(internships || [])];
  list.sort((a, b) => {
    const ad = toDate(a.createdAt)?.getTime() || 0;
    const bd = toDate(b.createdAt)?.getTime() || 0;
    return bd - ad;
  });
  return list;
}

export default function Home() {
  const [content, setContent] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const activeId = useActiveSection();

  useEffect(() => {
    let mounted = true;
    apiGetPortfolio()
      .then((data) => {
        if (!mounted) return;
        if (data) setContent(data);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || "Failed to load portfolio");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const primaryLinks = useMemo(() => {
    const map = new Map((content.links || []).map((link) => [link.label.toLowerCase(), link.url]));
    return { github: map.get("github") || "", linkedin: map.get("linkedin") || "" };
  }, [content.links]);

  const topProjects = useMemo(() => latestProjects(content.projects, 3), [content.projects]);
  const sortedCerts = useMemo(() => latestCerts(content.certifications), [content.certifications]);

  const sortedInternships = useMemo(() => latestInternships(content.internships), [content.internships]);

  return (
    <div className="min-h-screen bg-bg overflow-x-hidden">
      <Navbar activeId={activeId} resumeUrl={content.resumeUrl} />

      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-teal/10 blur-3xl" />
        <div className="absolute right-[-120px] top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="absolute left-1/3 top-[520px] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      <main className="pt-32">
        <section id="hero" className="container-page scroll-mt-28">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <Reveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/10">
                  <span className="text-gold">{content.availability || "Immediate Joiner"}</span>
                  <span className="text-secondaryText">|</span>
                  <span className="text-secondaryText">{content.title}</span>
                </div>
              </Reveal>

              <Reveal delay={0.05}>
                <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {content.tagline}
                </h1>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="muted mt-5 max-w-2xl text-base sm:text-lg">{content.heroSubtext}</p>
              </Reveal>

              <Reveal delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/projects" className="btn-primary w-full sm:w-auto">
                    View Projects
                  </Link>
                  {content.resumeUrl ? (
                    <a className="btn-secondary w-full sm:w-auto" href={content.resumeUrl} download>
                      View Resume
                    </a>
                  ) : (
                    <a className="btn-secondary w-full sm:w-auto" href={`mailto:${content.contactEmail}`}>
                      Email Me
                    </a>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="mt-10 flex flex-wrap items-center gap-3 text-sm">
                  <span className="muted">Links:</span>
                  {primaryLinks.github ? (
                    <a className="chip hover:bg-white/10" href={primaryLinks.github} target="_blank" rel="noreferrer">
                      GitHub
                    </a>
                  ) : null}
                  {primaryLinks.linkedin ? (
                    <a className="chip hover:bg-white/10" href={primaryLinks.linkedin} target="_blank" rel="noreferrer">
                      LinkedIn
                    </a>
                  ) : null}
                  {loading ? <span className="chip bg-white/0 ring-0 text-secondaryText">Syncing...</span> : null}
                  {error ? <span className="chip bg-red-500/10 text-red-200 ring-red-400/25">{error}</span> : null}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-5">
              <Reveal delay={0.05}>
                <div className="card p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-secondaryText">{content.name}</div>
                      <div className="mt-1 text-xl font-extrabold tracking-tight text-white">{content.title}</div>
                    </div>
                    <img
                      alt="Profile"
                      src={content.profilePicUrl || "/images/profile/avatar.png"}
                      className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10"
                      loading="lazy"
                    />
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="text-xs font-semibold text-secondaryText">Focus</div>
                      <div className="mt-1 text-sm text-white/90">{content.heroFocus}</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="text-xs font-semibold text-secondaryText">Strength</div>
                      <div className="mt-1 text-sm text-white/90">{content.heroStrength}</div>
                    </div>
                    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                      <div className="text-xs font-semibold text-secondaryText">Mindset</div>
                      <div className="mt-1 text-sm text-white/90">{content.heroMindset}</div>
                    </div>
                  </div>

                 
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="About"
                title={content.aboutHeading || "About"}
                subtitle={content.aboutSubheading || ""}
              />
            </Reveal>

            <div className="grid items-stretch gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-8 min-w-0">
                <div className="card flex h-full flex-col p-7 lg:p-8 text-left">
                  {content.aboutIntro ? (
                    <p className="max-w-3xl text-base leading-7 text-white/90">{content.aboutIntro}</p>
                  ) : null}

                  <ul className="mt-6 space-y-4">
                    {(content.aboutBullets || []).map((bullet, index) => (
                      <li key={index} className="flex gap-3 text-sm text-white/90">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              <Reveal delay={0.05} className="lg:col-span-4 min-w-0">
                <div className="card flex h-full flex-col p-7 lg:p-8 text-left">
                  <div className="text-xs font-semibold text-secondaryText">Quick facts</div>
                  <div className="mt-4 grid flex-1 content-start gap-3">
                    {(content.quickFacts || []).map((fact) => (
                      <div key={fact.label} className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                        <div className="text-xs text-secondaryText">{fact.label}</div>
                        <div className="mt-1 text-sm text-white/90">{fact.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section id="skills" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Skills"
                title={content.skillsHeading || "Skills"}
                subtitle={content.skillsSubheading || ""}
              />
            </Reveal>
            <Reveal delay={0.05}>
              <SkillsGrid skills={content.skills} />
            </Reveal>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Projects"
                title={content.projectsHeading || "Projects"}
                subtitle={content.projectsSubheading || ""}
              />
            </Reveal>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-secondaryText">Showing latest 3 projects</div>
              <Link className="btn-secondary w-full sm:w-auto justify-center" to="/projects">
                View All Projects
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topProjects.map((project, index) => (
                <Reveal key={project.slug || index} delay={0.03 * index}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="internships" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Internships"
                title={content.internshipsHeading || "Internships"}
                subtitle={content.internshipsSubheading || ""}
              />
            </Reveal>


            <div className="grid gap-6 md:grid-cols-2">
              {sortedInternships.map((exp, index) => (
                <Reveal key={index} delay={0.03 * index}>
                  <div className="card p-7 text-left">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base font-extrabold text-white">{exp.title}</h3>
                        <p className="muted mt-1 text-sm">
                          {[exp.company, exp.location, exp.period, exp.duration].filter(Boolean).join(" | ")}
                        </p>
                      </div>
                      {exp.workType ? (
                        <div className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80">
                          {exp.workType}
                        </div>
                      ) : null}
                    </div>
                    <ul className="mt-5 space-y-3">
                      {(exp.bullets || []).map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex gap-3 text-sm text-white/90">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="education" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Education"
                title={content.educationHeading || "Education"}
                subtitle={content.educationSubheading || ""}
              />
            </Reveal>

            <div className="grid gap-5 sm:grid-cols-2">
              {(content.education || []).map((item, index) => (
                <Reveal key={index} delay={0.03 * index}>
                  <div className="card p-7 text-left">
                    <div className="text-sm font-extrabold text-white">{item.title}</div>
                    <div className="muted mt-2 text-sm">
                      {[item.degree, item.school, item.universityBoard, item.duration, item.meta]
                        .filter(Boolean)
                        .join(" | ")}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Certifications"
                title={content.certificationsHeading || "Certifications"}
                subtitle={content.certificationsSubheading || ""}
              />
            </Reveal>

            {sortedCerts.length ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedCerts.map((c, idx) => (
                  <Reveal key={`${c.title}_${idx}`} delay={0.03 * idx}>
                    <div className="card group h-full flex flex-col p-7">
                      <div className="relative z-10 flex-1 flex flex-col text-left">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-gold mb-3">
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          Certification
                        </div>
                        <h3 className="text-lg font-extrabold text-white tracking-tight">{c.title}</h3>
                        <div className="muted mt-2 text-sm flex-1">
                          {[
                            c.issuer,
                            c.date ? new Date(c.date).getFullYear() : c.year
                          ].filter(Boolean).join(" • ")}
                        </div>
                        {c.url ? (
                          <div className="mt-6">
                            <a 
                              className="inline-flex items-center gap-2 text-sm font-semibold text-teal hover:text-white transition-colors" 
                              href={c.url} 
                              target="_blank" 
                              rel="noreferrer"
                            >
                              View Credential
                              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </a>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : (
              <div className="text-sm text-secondaryText">Add certifications from admin dashboard.</div>
            )}
          </div>
        </section>

        <section id="contact" className="section">
          <div className="container-page">
            <Reveal>
              <SectionTitle
                kicker="Contact"
                title="Let us build something impactful together"
                subtitle="Fastest response: email. You can also reach out on GitHub or LinkedIn."
              />
            </Reveal>

            <div className="grid items-stretch gap-6 lg:grid-cols-12">
              <Reveal className="lg:col-span-7 min-w-0">
                <div className="card flex h-full flex-col p-7 text-left">
                  <div className="text-sm font-semibold text-secondaryText">Email</div>
                  <a className="mt-2 inline-flex text-lg font-extrabold text-white hover:text-goldLight" href={`mailto:${content.contactEmail}`}>
                    {content.contactEmail}
                  </a>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {(content.links || []).map((link) => (
                      <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="btn-secondary">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.05} className="lg:col-span-5 min-w-0">
                <div className="card flex h-full flex-col p-7 text-left">
                  <div className="text-sm font-semibold text-secondaryText">CTA</div>
                  <p className="mt-4 max-w-md text-sm leading-7 text-white/90">
                    If you are hiring for a role where execution, API thinking, and clean UI matter, I can contribute immediately.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <a className="btn-primary" href={`mailto:${content.contactEmail}`}>
                      Email Saurabh
                    </a>
                    <Link className="btn-secondary" to="/projects">
                      See Projects
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            <footer className="mt-12 border-t border-white/10 pt-8">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-sm font-semibold text-white">{content.name}</div>
                  <div className="muted mt-1 text-xs">Copyright {new Date().getFullYear()}</div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(content.links || []).map((link) => (
                    <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="chip hover:bg-white/10">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}

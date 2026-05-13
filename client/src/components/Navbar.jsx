import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "internships", label: "Internships" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "contact", label: "Contact" }
];



export default function Navbar({ activeId, resumeUrl }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const go = (id) => {
    navigate(`/#${id}`);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

 

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 rounded-2xl bg-surface/70 shadow-soft ring-1 ring-white/10 backdrop-blur">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <Link
                className="flex items-center gap-2 text-sm font-semibold tracking-tight"
                to="/#hero"
              >
                <span className="h-2 w-2 rounded-full bg-teal shadow-[0_0_30px_rgba(101,195,186,0.55)]" />
                <span className="text-white">Saurabh</span>
                <span className="hidden text-secondaryText sm:inline">/ portfolio</span>
              </Link>

              <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
                {NAV.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      className={
                        "rounded-2xl px-3 py-2 text-xs font-semibold transition " +
                        (active
                          ? "bg-white/10 text-white ring-1 ring-white/15"
                          : "text-secondaryText hover:bg-white/5 hover:text-white")
                      }
                      onClick={() => go(item.id)}
                      type="button"
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="flex items-center gap-2">
                <button
                  className="btn-secondary md:hidden"
                  type="button"
                  onClick={() => setOpen(true)}
                  aria-label="Open menu"
                >
                  Menu
                </button>

                {resumeUrl ? (
                  <a className="btn-secondary hidden sm:inline-flex" href={resumeUrl} target="_blank">
                    View Resume
                  </a>
                ) : null}

                <button className="btn-primary" onClick={() => go("projects")} type="button">
                  View Projects
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur"
            onClick={() => setOpen(false)}
            type="button"
            aria-label="Close menu"
          />

          <div className="absolute left-0 right-0 top-4 mx-auto max-w-7xl px-4 sm:px-6">
            <div className="rounded-2xl bg-surface/90 p-4 shadow-soft ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-white">Navigate</div>
                <button
                  className="btn-secondary px-4 py-2"
                  type="button"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>

              <div className="mt-4 grid gap-2">
                {NAV.map((item) => {
                  const active = item.id === activeId;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => go(item.id)}
                      className={
                        "w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold ring-1 transition " +
                        (active
                          ? "bg-white/10 text-white ring-white/20"
                          : "bg-white/5 text-white/90 ring-white/10 hover:bg-white/10")
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                {resumeUrl ? (
                  <a className="btn-secondary w-full justify-center" href={resumeUrl}>
                    Download Resume
                  </a>
                ) : null}
                <button
                  className="btn-primary w-full justify-center"
                  type="button"
                  onClick={() => go("projects")}
                >
                  View Projects
                </button>
              </div>

            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

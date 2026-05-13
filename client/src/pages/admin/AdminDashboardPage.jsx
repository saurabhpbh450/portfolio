
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AdminField,
  AdminInput,
  AdminSection,
  AdminTextArea,
  linesValue,
  parseLines
} from "../../components/admin/FormControls.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import {
  apiGetAdminPortfolio,
  apiSaveAdminPortfolio,
  apiUploadProjectImage
} from "../../lib/api.js";

function nowIso() {
  return new Date().toISOString();
}

function emptyPortfolio() {
  return {
    name: "",
    title: "",
    profilePicUrl: "",
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
}

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function arrayReplace(list, index, nextItem) {
  return list.map((item, idx) => (idx === index ? nextItem : item));
}

function sortLatestFirst(items) {
  const list = [...(items || [])];
  list.sort((a, b) => {
    const ad = new Date(a.createdAt || 0).getTime();
    const bd = new Date(b.createdAt || 0).getTime();
    return bd - ad;
  });
  return list;
}

function calculatePeriodAndDuration(startDate, endDate, isCurrent) {
  if (!startDate) return { period: "", duration: "" };
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return { period: "", duration: "" };

  const startStr = start.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  let endStr = "Present";
  let end = new Date();

  if (!isCurrent && endDate) {
    const parsedEnd = new Date(endDate);
    if (!isNaN(parsedEnd.getTime())) {
      end = parsedEnd;
      endStr = end.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    }
  }

  const period = `${startStr} - ${endStr}`;

  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
  const dMonths = Math.max(1, months);
  const yrs = Math.floor(dMonths / 12);
  const mos = dMonths % 12;

  let duration = "";
  if (yrs > 0) {
    duration += `${yrs} year${yrs > 1 ? "s" : ""}`;
    if (mos > 0) {
      duration += ` ${mos} month${mos > 1 ? "s" : ""}`;
    }
  } else {
    duration = `${mos} month${mos > 1 ? "s" : ""}`;
  }

  return { period, duration: duration.trim() };
}

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { toastError, toastInfo, toastSuccess } = useToast();

  const [portfolio, setPortfolio] = useState(emptyPortfolio());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiGetAdminPortfolio()
      .then((data) => {
        const next = data || emptyPortfolio();
        next.projects = sortLatestFirst(next.projects);
        next.internships = sortLatestFirst(next.internships);
        setPortfolio(next);
      })
      .catch((error) => {
        toastError(error.message || "Failed to load portfolio");
      })
      .finally(() => setLoading(false));
  }, [toastError]);

  const aboutText = useMemo(
    () => linesValue(portfolio.aboutBullets),
    [portfolio.aboutBullets]
  );

  async function onSave() {
    setSaving(true);
    try {
      const saved = await apiSaveAdminPortfolio(portfolio);
      saved.projects = sortLatestFirst(saved.projects);
      saved.internships = sortLatestFirst(saved.internships);
      setPortfolio(saved);
      toastSuccess("Portfolio updated successfully.");
    } catch (error) {
      toastError(error.message || "Failed to save portfolio");
    } finally {
      setSaving(false);
    }
  }

  async function onLogout() {
    try {
      await signOut();
      toastInfo("Signed out.");
      navigate("/admin", { replace: true });
    } catch {
      navigate("/admin", { replace: true });
    }
  }

  async function onUploadFile(setter, file) {
    if (!file) return;
    try {
      toastInfo("Uploading image...");
      const { url } = await apiUploadProjectImage(file);
      setter(url);
      toastSuccess("Image uploaded.");
    } catch (error) {
      toastError(error.message || "Image upload failed");
    }
  }

  async function uploadProjectCover(projectIndex, file) {
    return onUploadFile(
      (url) =>
        setPortfolio((current) => ({
          ...current,
          projects: current.projects.map((project, idx) =>
            idx === projectIndex ? { ...project, coverImageUrl: url } : project
          )
        })),
      file
    );
  }

  async function uploadProjectGalleryImage(projectIndex, file) {
    return onUploadFile(
      (url) =>
        setPortfolio((current) => ({
          ...current,
          projects: current.projects.map((project, idx) =>
            idx === projectIndex
              ? { ...project, images: [...(project.images || []), url] }
              : project
          )
        })),
      file
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="container-page py-20 text-sm text-secondaryText">
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="container-page py-6 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-secondaryText">
              Admin Dashboard
            </div>
            <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
              Portfolio CMS
            </h1>
            <p className="mt-2 text-xs text-secondaryText">
              Signed in as {user?.email || "admin"}. Every section is editable.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={onLogout} type="button">
              Logout
            </button>
            <button
              className="btn-primary"
              onClick={onSave}
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="grid gap-5">
          <AdminSection title="Profile" subtitle="Profile picture and identity">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField
                label="Profile picture URL"
                hint="Cloudinary URL or /images/..."
              >
                <AdminInput
                  value={portfolio.profilePicUrl || ""}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, profilePicUrl: e.target.value }))
                  }
                  placeholder="https://res.cloudinary.com/..."
                />
              </AdminField>
              <AdminField label="Upload profile picture">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    onUploadFile(
                      (url) => setPortfolio((c) => ({ ...c, profilePicUrl: url })),
                      e.target.files?.[0]
                    )
                  }
                  className="block w-full min-w-0 text-xs text-secondaryText file:mr-4 file:rounded-2xl file:border-0 file:bg-white/10 file:px-4 file:py-3 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                />
              </AdminField>
            </div>
          </AdminSection>

          <AdminSection title="Hero" subtitle="Main identity and first impression">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Name">
                <AdminInput
                  value={portfolio.name}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, name: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Title">
                <AdminInput
                  value={portfolio.title}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, title: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Tagline">
                <AdminInput
                  value={portfolio.tagline}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, tagline: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Availability badge">
                <AdminInput
                  value={portfolio.availability}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, availability: e.target.value }))
                  }
                />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Hero subtext">
                  <AdminTextArea
                    rows={3}
                    value={portfolio.heroSubtext}
                    onChange={(e) =>
                      setPortfolio((c) => ({ ...c, heroSubtext: e.target.value }))
                    }
                  />
                </AdminField>
              </div>
              <AdminField label="Focus">
                <AdminInput
                  value={portfolio.heroFocus}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, heroFocus: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Strength">
                <AdminInput
                  value={portfolio.heroStrength}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, heroStrength: e.target.value }))
                  }
                />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Mindset">
                  <AdminInput
                    value={portfolio.heroMindset}
                    onChange={(e) =>
                      setPortfolio((c) => ({ ...c, heroMindset: e.target.value }))
                    }
                  />
                </AdminField>
              </div>
            </div>
          </AdminSection>

          <AdminSection title="About" subtitle="Heading, intro, bullets and quick facts">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.aboutHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, aboutHeading: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.aboutSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, aboutSubheading: e.target.value }))
                  }
                />
              </AdminField>
              <div className="md:col-span-2">
                <AdminField label="Intro">
                  <AdminTextArea
                    rows={3}
                    value={portfolio.aboutIntro}
                    onChange={(e) =>
                      setPortfolio((c) => ({ ...c, aboutIntro: e.target.value }))
                    }
                  />
                </AdminField>
              </div>
            </div>

            <div className="mt-5">
              <AdminField label="About bullets" hint="One bullet per line">
                <AdminTextArea
                  rows={6}
                  value={aboutText}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      aboutBullets: parseLines(e.target.value)
                    }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold text-white">Quick facts</div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setPortfolio((c) => ({
                      ...c,
                      quickFacts: [...(c.quickFacts || []), { label: "New", value: "" }]
                    }))
                  }
                >
                  Add fact
                </button>
              </div>

              <div className="mt-3 grid gap-3">
                {(portfolio.quickFacts || []).map((fact, idx) => (
                  <div
                    key={`${fact.label}_${idx}`}
                    className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                  >
                    <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                      <AdminInput
                        placeholder="Label"
                        value={fact.label}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            quickFacts: arrayReplace(c.quickFacts, idx, {
                              ...fact,
                              label: e.target.value
                            })
                          }))
                        }
                      />
                      <AdminInput
                        placeholder="Value"
                        value={fact.value}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            quickFacts: arrayReplace(c.quickFacts, idx, {
                              ...fact,
                              value: e.target.value
                            })
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            quickFacts: c.quickFacts.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </AdminSection>
          <AdminSection title="Skills" subtitle="Heading and categories">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.skillsHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, skillsHeading: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.skillsSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, skillsSubheading: e.target.value }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">Skill categories</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    skills: [...(c.skills || []), { title: "New Category", items: [] }]
                  }))
                }
              >
                Add category
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              {(portfolio.skills || []).map((skill, idx) => (
                <div
                  key={`${skill.title}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Category title">
                      <AdminInput
                        value={skill.title}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            skills: arrayReplace(c.skills, idx, {
                              ...skill,
                              title: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <div className="flex items-end justify-end">
                      <button
                        type="button"
                        className="btn-secondary w-full md:w-auto"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            skills: c.skills.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete
                      </button>
                    </div>
                    <div className="md:col-span-2">
                      <AdminField label="Items" hint="Comma separated">
                        <AdminInput
                          value={(skill.items || []).join(", ")}
                          onChange={(e) =>
                            setPortfolio((c) => ({
                              ...c,
                              skills: arrayReplace(c.skills, idx, {
                                ...skill,
                                items: e.target.value
                                  .split(",")
                                  .map((t) => t.trim())
                                  .filter(Boolean)
                              })
                            }))
                          }
                        />
                      </AdminField>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Skill tags" subtitle="Used for filtering projects">
            <div className="flex items-center justify-between">
              <div className="text-xs text-secondaryText">
                Each tag has an id (slug) and a display name.
              </div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    skillTags: [...(c.skillTags || []), { id: "new-tag", name: "New Tag" }]
                  }))
                }
              >
                Add tag
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {(portfolio.skillTags || []).map((tag, idx) => (
                <div
                  key={`${tag.id}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                    <AdminInput
                      placeholder="id (e.g. react)"
                      value={tag.id}
                      onChange={(e) =>
                        setPortfolio((c) => ({
                          ...c,
                          skillTags: arrayReplace(c.skillTags, idx, {
                            ...tag,
                            id: slugify(e.target.value) || tag.id
                          })
                        }))
                      }
                    />
                    <AdminInput
                      placeholder="Name"
                      value={tag.name}
                      onChange={(e) =>
                        setPortfolio((c) => ({
                          ...c,
                          skillTags: arrayReplace(c.skillTags, idx, {
                            ...tag,
                            name: e.target.value
                          })
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setPortfolio((c) => ({
                          ...c,
                          skillTags: c.skillTags.filter((_, i) => i !== idx)
                        }))
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>
          <AdminSection
            title="Projects"
            subtitle="Latest projects show on Home and top of Projects page"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.projectsHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      projectsHeading: e.target.value
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.projectsSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      projectsSubheading: e.target.value
                    }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">All projects</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    projects: sortLatestFirst([
                      {
                        slug: `project-${(c.projects || []).length + 1}`,
                        title: "New Project",
                        tagline: "Project tagline",
                        createdAt: nowIso(),
                        bullets: [],
                        tech: [],
                        skillTagIds: [],
                        liveUrl: "",
                        githubUrl: "",
                        coverImageUrl: "",
                        images: [],
                        details: ""
                      },
                      ...(c.projects || [])
                    ])
                  }))
                }
              >
                Add project
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              {(portfolio.projects || []).map((project, idx) => (
                <div
                  key={`${project.slug}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Title">
                      <AdminInput
                        value={project.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              title,
                              slug: slugify(title) || project.slug
                            })
                          }));
                        }}
                      />
                    </AdminField>
                    <AdminField label="Slug">
                      <AdminInput
                        value={project.slug}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              slug: slugify(e.target.value) || project.slug
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2">
                      <AdminField label="Tagline">
                        <AdminInput
                          value={project.tagline}
                          onChange={(e) =>
                            setPortfolio((c) => ({
                              ...c,
                              projects: arrayReplace(c.projects, idx, {
                                ...project,
                                tagline: e.target.value
                              })
                            }))
                          }
                        />
                      </AdminField>
                    </div>

                    <AdminField label="Live URL">
                      <AdminInput
                        value={project.liveUrl || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              liveUrl: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="GitHub URL">
                      <AdminInput
                        value={project.githubUrl || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              githubUrl: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2">
                      <AdminField label="Bullets" hint="One per line">
                        <AdminTextArea
                          rows={4}
                          value={linesValue(project.bullets || [])}
                          onChange={(e) =>
                            setPortfolio((c) => ({
                              ...c,
                              projects: arrayReplace(c.projects, idx, {
                                ...project,
                                bullets: parseLines(e.target.value)
                              })
                            }))
                          }
                        />
                      </AdminField>
                    </div>

                    <AdminField label="Tech tags" hint="Comma separated">
                      <AdminInput
                        value={(project.tech || []).join(", ")}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              tech: e.target.value
                                .split(",")
                                .map((t) => t.trim())
                                .filter(Boolean)
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <AdminField
                      label="Skill tag ids"
                      hint="Comma separated ids (for filters)"
                    >
                      <AdminInput
                        value={(project.skillTagIds || []).join(", ")}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              skillTagIds: e.target.value
                                .split(",")
                                .map((t) => slugify(t.trim()))
                                .filter(Boolean)
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <AdminField label="Cover image URL">
                      <AdminInput
                        value={project.coverImageUrl || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: arrayReplace(c.projects, idx, {
                              ...project,
                              coverImageUrl: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2">
                      <AdminField label="Upload cover">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            uploadProjectCover(idx, e.target.files?.[0])
                          }
                          className="block w-full min-w-0 text-xs text-secondaryText file:mr-4 file:rounded-2xl file:border-0 file:bg-white/10 file:px-4 file:py-3 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                        />
                      </AdminField>
                    </div>

                    <div className="md:col-span-2">
                      <AdminField
                        label="Gallery images"
                        hint="Upload multiple images for the project detail page"
                      >
                        <div className="flex flex-col gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              uploadProjectGalleryImage(idx, e.target.files?.[0])
                            }
                            className="block w-full min-w-0 text-xs text-secondaryText file:mr-4 file:rounded-2xl file:border-0 file:bg-white/10 file:px-4 file:py-3 file:text-xs file:font-semibold file:text-white hover:file:bg-white/15"
                          />

                          {(project.images || []).length ? (
                            <div className="flex flex-wrap gap-2">
                              {(project.images || []).map((img) => (
                                <button
                                  key={img}
                                  type="button"
                                  className="chip hover:bg-white/10"
                                  onClick={() =>
                                    setPortfolio((c) => ({
                                      ...c,
                                      projects: arrayReplace(c.projects, idx, {
                                        ...project,
                                        images: (project.images || []).filter(
                                          (x) => x !== img
                                        )
                                      })
                                    }))
                                  }
                                  title="Remove image"
                                >
                                  Remove
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </AdminField>
                    </div>

                    <div className="md:col-span-2">
                      <AdminField
                        label="Details"
                        hint="Long description for the project detail page"
                      >
                        <AdminTextArea
                          rows={4}
                          value={project.details || ""}
                          onChange={(e) =>
                            setPortfolio((c) => ({
                              ...c,
                              projects: arrayReplace(c.projects, idx, {
                                ...project,
                                details: e.target.value
                              })
                            }))
                          }
                        />
                      </AdminField>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4 mt-2">
                      <div className="w-48">
                        <AdminField label="Created Date (Sort Position)">
                          <input
                            type="date"
                            className="block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                            value={project.createdAt ? String(project.createdAt).slice(0, 10) : ""}
                            onChange={(e) =>
                              setPortfolio((c) => ({
                                ...c,
                                projects: arrayReplace(c.projects, idx, {
                                  ...project,
                                  createdAt: e.target.value ? new Date(e.target.value).toISOString() : project.createdAt
                                })
                              }))
                            }
                          />
                        </AdminField>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            projects: c.projects.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Internships" subtitle="Work experience highlights">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.internshipsHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      internshipsHeading: e.target.value
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.internshipsSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      internshipsSubheading: e.target.value
                    }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">All internships</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    internships: sortLatestFirst([
                      {
                        title: "New Internship",
                        company: "",
                        startDate: "",
                        endDate: "",
                        isCurrent: false,
                        period: "",
                        duration: "",
                        location: "",
                        workType: "",
                        createdAt: nowIso(),
                        bullets: []
                      },
                      ...(c.internships || [])
                    ])
                  }))
                }
              >
                Add internship
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              {(portfolio.internships || []).map((internship, idx) => (
                <div
                  key={`${internship.title}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Title">
                      <AdminInput
                        value={internship.title}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            internships: arrayReplace(c.internships, idx, {
                              ...internship,
                              title: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Company">
                      <AdminInput
                        value={internship.company || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            internships: arrayReplace(c.internships, idx, {
                              ...internship,
                              company: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Start Date">
                      <input
                        type="month"
                        className="block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                        value={internship.startDate || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          const { period, duration } = calculatePeriodAndDuration(val, internship.endDate, internship.isCurrent);
                          setPortfolio((c) => ({
                            ...c,
                            internships: arrayReplace(c.internships, idx, {
                              ...internship,
                              startDate: val,
                              period,
                              duration
                            })
                          }));
                        }}
                      />
                    </AdminField>
                    <AdminField label="End Date">
                      <div className="flex items-center gap-3">
                        <input
                          type="month"
                          disabled={internship.isCurrent}
                          className="block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          value={internship.endDate || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            const { period, duration } = calculatePeriodAndDuration(internship.startDate, val, internship.isCurrent);
                            setPortfolio((c) => ({
                              ...c,
                              internships: arrayReplace(c.internships, idx, {
                                ...internship,
                                endDate: val,
                                period,
                                duration
                              })
                            }));
                          }}
                        />
                        <label className="flex items-center gap-2 text-sm text-white whitespace-nowrap cursor-pointer">
                          <input
                            type="checkbox"
                            checked={internship.isCurrent || false}
                            onChange={(e) => {
                              const val = e.target.checked;
                              const { period, duration } = calculatePeriodAndDuration(internship.startDate, internship.endDate, val);
                              setPortfolio((c) => ({
                                ...c,
                                internships: arrayReplace(c.internships, idx, {
                                  ...internship,
                                  isCurrent: val,
                                  period,
                                  duration
                                })
                              }));
                            }}
                            className="rounded border-white/10 bg-white/5 text-teal focus:ring-teal/20 focus:ring-offset-0"
                          />
                          Present
                        </label>
                      </div>
                    </AdminField>
                    <AdminField label="Period (Computed)">
                      <AdminInput value={internship.period || ""} disabled className="opacity-70" />
                    </AdminField>
                    <AdminField label="Duration (Computed)">
                      <AdminInput value={internship.duration || ""} disabled className="opacity-70" />
                    </AdminField>
                    <AdminField label="Location">
                      <AdminInput
                        value={internship.location || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            internships: arrayReplace(c.internships, idx, {
                              ...internship,
                              location: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Work Type (e.g. Remote, Physical)">
                      <AdminInput
                        value={internship.workType || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            internships: arrayReplace(c.internships, idx, {
                              ...internship,
                              workType: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2">
                      <AdminField label="Bullets" hint="One per line">
                        <AdminTextArea
                          rows={4}
                          value={linesValue(internship.bullets || [])}
                          onChange={(e) =>
                            setPortfolio((c) => ({
                              ...c,
                              internships: arrayReplace(c.internships, idx, {
                                ...internship,
                                bullets: parseLines(e.target.value)
                              })
                            }))
                          }
                        />
                      </AdminField>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-4 mt-2">
                      <div className="w-48">
                        <AdminField label="Created Date (Sort Position)">
                          <input
                            type="date"
                            className="block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                            value={internship.createdAt ? String(internship.createdAt).slice(0, 10) : ""}
                            onChange={(e) =>
                              setPortfolio((c) => ({
                                ...c,
                                internships: arrayReplace(c.internships, idx, {
                                  ...internship,
                                  createdAt: e.target.value ? new Date(e.target.value).toISOString() : internship.createdAt
                                })
                              }))
                            }
                          />
                        </AdminField>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            internships: c.internships.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete internship
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Education" subtitle="Academic background">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.educationHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      educationHeading: e.target.value
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.educationSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      educationSubheading: e.target.value
                    }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">Entries</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    education: [
                      ...(c.education || []),
                      { title: "New Education", degree: "", school: "", universityBoard: "", duration: "", meta: "" }
                    ]
                  }))
                }
              >
                Add education
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              {(portfolio.education || []).map((edu, idx) => (
                <div
                  key={`${edu.title}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Title / Level">
                      <AdminInput
                        value={edu.title}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              title: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Degree / Stream">
                      <AdminInput
                        value={edu.degree || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              degree: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="School / College">
                      <AdminInput
                        value={edu.school || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              school: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="University / Board">
                      <AdminInput
                        value={edu.universityBoard || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              universityBoard: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Duration (e.g. 2018 - 2022)">
                      <AdminInput
                        value={edu.duration || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              duration: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Meta / Grade">
                      <AdminInput
                        value={edu.meta || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            education: arrayReplace(c.education, idx, {
                              ...edu,
                              meta: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2 flex justify-end mt-2 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            education: c.education.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>
          <AdminSection title="Certifications" subtitle="New section">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Heading">
                <AdminInput
                  value={portfolio.certificationsHeading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      certificationsHeading: e.target.value
                    }))
                  }
                />
              </AdminField>
              <AdminField label="Subheading">
                <AdminInput
                  value={portfolio.certificationsSubheading}
                  onChange={(e) =>
                    setPortfolio((c) => ({
                      ...c,
                      certificationsSubheading: e.target.value
                    }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">Entries</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    certifications: [
                      ...(c.certifications || []),
                      { title: "New Certification", issuer: "", year: "", date: nowIso(), url: "" }
                    ]
                  }))
                }
              >
                Add certification
              </button>
            </div>

            <div className="mt-4 grid gap-4">
              {(portfolio.certifications || []).map((cert, idx) => (
                <div
                  key={`${cert.title}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <AdminField label="Title">
                      <AdminInput
                        value={cert.title}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            certifications: arrayReplace(c.certifications, idx, {
                              ...cert,
                              title: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Issuer">
                      <AdminInput
                        value={cert.issuer || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            certifications: arrayReplace(c.certifications, idx, {
                              ...cert,
                              issuer: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="Issue Date">
                      <input
                        type="date"
                        className="block w-full rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20"
                        value={cert.date ? String(cert.date).slice(0, 10) : ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            certifications: arrayReplace(c.certifications, idx, {
                              ...cert,
                              date: e.target.value ? new Date(e.target.value).toISOString() : cert.date
                            })
                          }))
                        }
                      />
                    </AdminField>
                    <AdminField label="URL">
                      <AdminInput
                        value={cert.url || ""}
                        onChange={(e) =>
                          setPortfolio((c) => ({
                            ...c,
                            certifications: arrayReplace(c.certifications, idx, {
                              ...cert,
                              url: e.target.value
                            })
                          }))
                        }
                      />
                    </AdminField>

                    <div className="md:col-span-2 flex justify-end mt-2 pt-4 border-t border-white/10">
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          setPortfolio((c) => ({
                            ...c,
                            certifications: c.certifications.filter((_, i) => i !== idx)
                          }))
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <AdminSection title="Contact and Links" subtitle="Email, resume URL, and social links">
            <div className="grid gap-4 md:grid-cols-2">
              <AdminField label="Contact email">
                <AdminInput
                  value={portfolio.contactEmail}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, contactEmail: e.target.value }))
                  }
                />
              </AdminField>
              <AdminField label="Resume URL">
                <AdminInput
                  value={portfolio.resumeUrl || ""}
                  onChange={(e) =>
                    setPortfolio((c) => ({ ...c, resumeUrl: e.target.value }))
                  }
                />
              </AdminField>
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="text-sm font-extrabold text-white">Links</div>
              <button
                type="button"
                className="btn-secondary"
                onClick={() =>
                  setPortfolio((c) => ({
                    ...c,
                    links: [...(c.links || []), { label: "New Link", url: "" }]
                  }))
                }
              >
                Add link
              </button>
            </div>

            <div className="mt-4 grid gap-3">
              {(portfolio.links || []).map((link, idx) => (
                <div
                  key={`${link.label}_${idx}`}
                  className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10"
                >
                  <div className="grid gap-3 md:grid-cols-[1fr_2fr_auto]">
                    <AdminInput
                      value={link.label}
                      placeholder="Label"
                      onChange={(e) =>
                        setPortfolio((c) => ({
                          ...c,
                          links: arrayReplace(c.links, idx, {
                            ...link,
                            label: e.target.value
                          })
                        }))
                      }
                    />
                    <AdminInput
                      value={link.url || ""}
                      placeholder="https://example.com"
                      onChange={(e) =>
                        setPortfolio((c) => ({
                          ...c,
                          links: arrayReplace(c.links, idx, {
                            ...link,
                            url: e.target.value
                          })
                        }))
                      }
                    />
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        setPortfolio((c) => ({
                          ...c,
                          links: c.links.filter((_, i) => i !== idx)
                        }))
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminSection>

          <div className="flex flex-wrap justify-end gap-2 pb-6">
            <button className="btn-secondary" onClick={onLogout} type="button">
              Logout
            </button>
            <button
              className="btn-primary"
              onClick={onSave}
              type="button"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

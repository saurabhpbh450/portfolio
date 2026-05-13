import { motion } from "framer-motion";

export default function SkillsGrid({ skills }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {(skills || []).map((cat) => (
        <div
          key={cat.title}
          className="card group p-6 text-left"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold tracking-tight text-white">
              {cat.title}
            </h3>
            <span className="h-9 w-9 rounded-2xl bg-white/5 ring-1 ring-white/10" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(cat.items || []).map((s) => (
              <span key={s} className="chip">
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

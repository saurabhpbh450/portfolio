export function AdminField({ label, hint, children }) {
  return (
    <label className="block min-w-0">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-white">{label}</div>
        {hint ? <div className="text-xs text-secondaryText">{hint}</div> : null}
      </div>
      {children}
    </label>
  );
}

export function AdminInput(props) {
  return (
    <input
      {...props}
      className={
        "w-full min-w-0 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20 " +
        (props.className || "")
      }
    />
  );
}

export function AdminTextArea(props) {
  return (
    <textarea
      {...props}
      className={
        "w-full min-w-0 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white outline-none ring-1 ring-white/10 focus:ring-white/20 " +
        (props.className || "")
      }
    />
  );
}

export function AdminSection({ title, subtitle, children, action }) {
  return (
    <section className="card p-6 sm:p-7">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-white sm:text-lg">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-secondaryText">{subtitle}</p> : null}
        </div>
        {action || null}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}

export function parseLines(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function linesValue(items) {
  return (items || []).join("\n");
}

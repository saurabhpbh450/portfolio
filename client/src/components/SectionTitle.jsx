export default function SectionTitle({ kicker, title, subtitle }) {
  return (
    <div className="mb-10">
      {kicker ? (
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 ring-1 ring-white/10">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          {kicker}
        </div>
      ) : null}
      <h2 className="heading text-3xl font-extrabold tracking-tight sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="muted mt-3 max-w-3xl">{subtitle}</p> : null}
    </div>
  );
}

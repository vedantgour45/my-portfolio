export default function Footer({ personal = {} }) {
  return (
    <footer className="py-10 border-t border-current/10 relative">
      <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
        <p
          className="text-[11px] uppercase tracking-widest font-medium"
          style={{ color: "var(--muted)" }}
        >
          Designed &amp; built by{" "}
          <span className="text-current">
            {personal.name || "Vedant Gour"}
          </span>
        </p>
        <p
          className="text-[10px] tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          &copy; {new Date().getFullYear()} &middot; All rights reserved.
        </p>
      </div>
    </footer>
  );
}

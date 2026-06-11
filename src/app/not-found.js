import Link from "next/link";

export const metadata = {
  title: "404 — Vedant Gour",
};

export default function NotFound() {
  return (
    <main className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6">
      <span className="eyebrow justify-center">Lost in the starfield</span>
      <h1 className="display-tight text-[clamp(5rem,20vw,12rem)] leading-none mt-4 text-gradient">
        404
      </h1>
      <p
        className="mt-4 mb-10 text-sm md:text-base font-light max-w-md leading-relaxed"
        style={{ color: "var(--muted)" }}
      >
        This page drifted out of orbit. The work, however, is exactly where
        you left it.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link href="/" className="btn btn-primary">
          <span>Back Home</span>
          <span aria-hidden="true">→</span>
        </Link>
        <Link href="/#projects" className="btn btn-ghost">
          View Projects
        </Link>
      </div>
    </main>
  );
}

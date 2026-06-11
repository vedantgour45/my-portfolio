"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { getIcon } from "@/lib/icons";

export default function ContactSection({ personal, socials = [] }) {
  const sectionRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const headlineY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      setStatus("sent");
      e.target.reset();
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <section id="contact" ref={sectionRef} className="section">
      <div className="max-w-7xl mx-auto">
        <motion.div style={{ y: headlineY }} className="mb-10 text-center">
          <span className="eyebrow">Contact</span>
          <h2 className="display-tight text-4xl md:text-6xl mt-4 max-w-3xl mx-auto">
            Let&apos;s build{" "}
            <span className="cursive text-accent-strong">
              something extraordinary
            </span>{" "}
            together<span className="text-accent">.</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Info column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 flex flex-col gap-6"
          >
            <div className="glass rounded-3xl p-8 flex-1 flex flex-col">
              <div className="display text-3xl mb-1">{personal.name}</div>
              <p className="text-xl cursive tracking-wide font-medium text-accent-strong mb-6">
                {personal.role}
              </p>
              <p
                className="leading-relaxed text-sm font-light mb-8"
                style={{ color: "var(--muted)" }}
              >
                Available for frontend developer roles and freelance
                opportunities. Drop a note &mdash; I&apos;d love to hear from you!
              </p>

              <a
                href={`mailto:${personal.email}`}
                className="block text-base font-medium hover:text-accent-strong transition-colors break-all mt-auto"
              >
                {personal.email} →
              </a>
            </div>

            <div className="glass rounded-3xl p-8">
              <p
                className="text-[10px] uppercase tracking-[0.3em] font-medium mb-5"
                style={{ color: "var(--muted)" }}
              >
                Elsewhere
              </p>
              <div className="flex gap-2 flex-wrap">
                {socials.map((s) => {
                  const Icon = getIcon(s.icon);
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full border border-current/10 px-4 py-2.5 text-xs font-medium hover:border-accent/50 hover:text-accent-strong transition-all"
                    >
                      {Icon && <Icon size={14} aria-hidden="true" />}
                      <span>{s.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Form column */}
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 glass rounded-3xl p-8 flex flex-col gap-5"
          >
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Name" name="name" placeholder="Your name" required />
              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="you@email.com"
                required
              />
            </div>
            <Field
              label="Subject"
              name="subject"
              placeholder="What's this about?"
            />
            <Field
              label="Message"
              name="message"
              placeholder="Tell me about your project..."
              textarea
              required
            />

            {/* Screen readers hear every status change; sighted users see
                the inline error / button morph below. */}
            <div aria-live="polite" className="sr-only">
              {status === "sending" && "Sending message…"}
              {status === "sent" &&
                "Message sent. I'll get back to you soon."}
              {status === "error" && errorMsg}
            </div>

            {status === "error" && (
              <motion.p
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -8, 8, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
                className="text-xs text-red-400 -mt-2"
                role="alert"
              >
                {errorMsg}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={status === "sending" || status === "sent"}
              className="btn btn-primary mt-auto disabled:cursor-not-allowed"
              style={
                status === "sent"
                  ? { background: "#10b981", color: "#fff", opacity: 1 }
                  : status === "sending"
                    ? { opacity: 0.6 }
                    : undefined
              }
            >
              {status === "sending" && <span>Sending…</span>}
              {status === "sent" && (
                <span className="inline-flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <motion.path
                      d="M4 12.5L9.5 18L20 6.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    />
                  </svg>
                  <span>Message Sent</span>
                </span>
              )}
              {(status === "idle" || status === "error") && (
                <>
                  <span>Send Message</span>
                  <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text", placeholder, required, textarea }) {
  const id = `contact-${name}`;
  const baseClasses =
    "form-input rounded-xl px-4 py-3 outline-none transition-all text-sm font-light focus:border-accent/60 focus:ring-1 focus:ring-accent/30";
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[11px] uppercase tracking-[0.2em] font-medium"
        style={{ color: "var(--muted)" }}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-accent-strong">
            {" "}
            *
          </span>
        )}
      </label>
      {textarea ? (
        <textarea
          id={id}
          name={name}
          rows={5}
          required={required}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          className={baseClasses}
        />
      )}
    </div>
  );
}

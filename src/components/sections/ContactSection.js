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
      setTimeout(() => setStatus("idle"), 4000);
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
            <span className="cursive text-orange-400">
              something extraordinary
            </span>{" "}
            together<span className="text-orange-500">.</span>
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
              <p className="text-xl cursive tracking-wide font-medium text-orange-400 mb-6">
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
                className="block text-base font-medium hover:text-orange-400 transition-colors break-all mt-auto"
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
                      className="flex items-center gap-2 rounded-full border border-current/10 px-4 py-2.5 text-[11px] font-medium hover:border-orange-500/50 hover:text-orange-400 transition-all"
                    >
                      {Icon && <Icon size={14} />}
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

            {status === "error" && (
              <p className="text-xs text-red-400 -mt-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="btn btn-primary mt-auto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending" && "Sending…"}
              {status === "sent" && "✓ Message Sent"}
              {(status === "idle" || status === "error") && (
                <>
                  <span>Send Message</span>
                  <span>→</span>
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
  const baseClasses =
    "form-input rounded-xl px-4 py-3 outline-none transition-all text-sm font-light focus:border-orange-500/60 focus:ring-1 focus:ring-orange-500/30";
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[10px] uppercase tracking-[0.25em] font-medium"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </label>
      {textarea ? (
        <textarea
          name={name}
          rows={5}
          required={required}
          placeholder={placeholder}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
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

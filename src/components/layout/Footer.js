import { socials, personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-16 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">
          {/* Back to top */}
          <a
            href="#home"
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-all group border-white/5"
          >
            <span className="text-indigo-400 group-hover:scale-110 transition-transform text-lg">
              ↑
            </span>
          </a>

          {/* Socials */}
          <div className="flex gap-6">
            {socials.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-400 transition-colors"
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-600 font-bold">
              Designed & Built by{" "}
              <span className="text-gray-400">{personalInfo.name}</span>
            </p>
            <p className="text-[9px] tracking-[0.3em] text-gray-700">
              &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

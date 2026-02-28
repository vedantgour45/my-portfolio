import { socials, personalInfo } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="py-7 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center gap-8">

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
            <p className="text-xs tracking-wider text-gray-500 font-bold">
              Designed & Built by{" "}
              <span className="text-gray-300 uppercase">{personalInfo.name}</span>
            </p>
            <p className="text-[10px] tracking-widest text-gray-500">
              &copy; {new Date().getFullYear()} All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

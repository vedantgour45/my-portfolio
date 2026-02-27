import { FaLinkedin, FaGithub, FaServer, FaCubes } from "react-icons/fa";
import { BiLogoGmail } from "react-icons/bi";
import { SiReact, SiNextdotjs, SiJavascript, SiTypescript, SiHtml5, SiTailwindcss, SiThreedotjs, SiGreensock, SiFramer, SiRedux, SiFigma, SiNodedotjs, SiMongodb, SiPython, SiFirebase, SiVercel } from "react-icons/si";

export const personalInfo = {
  name: "Vedant Gour",
  role: "Frontend Developer",
  tagline: "Building immersive web experiences with modern tools and creative vision.",
  logo: "/assets/main-logo2-white.png",
  resumePath: "/assets/resume.pdf",
  profileImage: "/assets/profile.jpg",
  email: "vedantgour45@gmail.com",
  about: [
    "I'm a passionate Frontend Developer specializing in React.js, Next.js, and modern web technologies. I love building interactive, performant, and visually stunning user interfaces.",
    "With a growing interest in AI/ML, I combine creative design thinking with engineering precision to craft digital experiences that push boundaries.",
  ],
  stats: [
    { label: "Projects", value: "10+" },
    { label: "Technologies", value: "15+" },
    { label: "GitHub Stars", value: "50+" },
  ],
};

export const socials = [
  { name: "LinkedIn", url: "https://www.linkedin.com/in/vedantgour45", icon: FaLinkedin },
  { name: "GitHub", url: "https://github.com/vedantgour45", icon: FaGithub },
  { name: "Email", url: "mailto:vedantgour45@gmail.com", icon: BiLogoGmail },
];

export const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React.js", level: 90, icon: SiReact },
      { name: "Next.js", level: 85, icon: SiNextdotjs },
      { name: "JavaScript", level: 90, icon: SiJavascript },
      { name: "TypeScript", level: 70, icon: SiTypescript },
      { name: "HTML/CSS", level: 95, icon: SiHtml5 },
      { name: "Tailwind CSS", level: 90, icon: SiTailwindcss },
    ],
  },
  {
    title: "Tools & Libraries",
    skills: [
      { name: "Three.js", level: 60, icon: FaCubes },
      { name: "GSAP", level: 65, icon: FaCubes },
      { name: "Framer Motion", level: 75, icon: SiFramer },
      { name: "Redux", level: 70, icon: SiRedux },
      { name: "Git/GitHub", level: 85, icon: FaGithub },
      { name: "Figma", level: 60, icon: SiFigma },
    ],
  },
  {
    title: "Backend & Other",
    skills: [
      { name: "Node.js", level: 65, icon: SiNodedotjs },
      { name: "MongoDB", level: 60, icon: SiMongodb },
      { name: "REST APIs", level: 80, icon: FaServer },
      { name: "Python", level: 55, icon: SiPython },
      { name: "Firebase", level: 60, icon: SiFirebase },
      { name: "Vercel", level: 80, icon: SiVercel },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Movix",
    subtitle: "Movies & TV Shows App",
    description: "A web application for exploring movies and TV shows with trailers, cast details, ratings, and more.",
    tech: ["React.js", "Redux", "SCSS", "IMDB API"],
    image: "/assets/project-movix.png",
    demo: "https://movix-movies.netlify.app/",
    code: "https://github.com/vedantgour45/movie-app",
    slug: "movix",
  },
  {
    id: 2,
    title: "LinkedIn Clone",
    subtitle: "Social Network UI",
    description: "A pixel-perfect clone of LinkedIn's interface with responsive design and interactive components.",
    tech: ["React.js", "CSS", "Firebase"],
    image: "/assets/project1-linkedin.jpg",
    demo: "#",
    code: "https://github.com/vedantgour45",
    slug: "linkedin",
  },
  {
    id: 3,
    title: "Typing Test",
    subtitle: "Speed Typing Game",
    description: "A typing speed test application with WPM tracking, accuracy metrics, and competitive leaderboards.",
    tech: ["JavaScript", "HTML", "CSS"],
    image: "/assets/project2-typingtest.png",
    demo: "#",
    code: "https://github.com/vedantgour45",
    slug: "typingtest",
  },
  {
    id: 4,
    title: "Bankist",
    subtitle: "Banking UI",
    description: "A minimalist banking interface with login, transfers, loans, and account management features.",
    tech: ["JavaScript", "HTML", "CSS"],
    image: "/assets/project3-bankist.png",
    demo: "#",
    code: "https://github.com/vedantgour45",
    slug: "bankist",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

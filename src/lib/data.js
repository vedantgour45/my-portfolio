import {
  SiLinkedin,
  SiReact,
  SiNextdotjs,
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiRedux,
  SiFigma,
  SiMongodb,
  SiPrettier,
  FaBitbucket,
  SiFirebase,
  SiVercel,
  SiApollographql,
  SiAxios,
  SiReactquery,
  SiSass,
  SiCanva,
  SiClaude,
  SiMui,
  SiBootstrap,
  SiReacthookform,
  SiAndroidstudio,
  SiEslint,
  SiJira,
  SiVite,
  SiOpenai,
  SiGooglegemini,
  SiGithubcopilot,
  SiZod,
  SiGit,
  SiNetlify,
  SiGithubactions,
  SiPostman,
  SiBitbucket,
  SiGithub,
  SiGmail,
  SiFastapi,
} from "react-icons/si";
import { MdVerifiedUser } from "react-icons/md";

export const personalInfo = {
  name: "Vedant Gour",
  role: "Frontend Developer",
  tagline:
    "Building immersive web experiences with modern tools and creative vision.",
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
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/vedantgour45",
    icon: SiLinkedin,
  },
  { name: "GitHub", url: "https://github.com/vedantgour45", icon: SiGithub },
  { name: "Email", url: "mailto:vedantgour45@gmail.com", icon: SiGmail },
];

export const skillCategories = [
  {
    title: "Core Web Technologies",
    skills: [
      { name: "HTML", level: 95, icon: SiHtml5 },
      { name: "CSS", level: 90, icon: SiCss3 },
      { name: "JavaScript", level: 90, icon: SiJavascript },
      { name: "TypeScript", level: 80, icon: SiTypescript },
    ],
  },

  {
    title: "Frontend Frameworks & Libraries",
    skills: [
      { name: "React.js", level: 90, icon: SiReact },
      { name: "Next.js", level: 85, icon: SiNextdotjs },
      { name: "Redux Toolkit", level: 80, icon: SiRedux },
      { name: "React Query", level: 75, icon: SiReactquery },
      { name: "React Hook Form", level: 75, icon: SiReacthookform },
    ],
  },
  {
    title: "Styling & UI",
    skills: [
      { name: "SCSS / Sass", level: 75, icon: SiSass },
      { name: "Tailwind CSS", level: 95, icon: SiTailwindcss },
      { name: "Material UI", level: 75, icon: SiMui },
      { name: "Bootstrap", level: 75, icon: SiBootstrap },
    ],
  },
  {
    title: "UI/UX & Design Collaboration",
    skills: [
      { name: "Figma", level: 65, icon: SiFigma },
      { name: "Canva", level: 65, icon: SiCanva },
    ],
  },
  {
    title: "API & Data Handling",
    skills: [
      { name: "REST APIs", level: 85, icon: SiFastapi },
      { name: "GraphQL", level: 70, icon: SiApollographql },
      { name: "Axios", level: 90, icon: SiAxios },
      { name: "Postman", level: 85, icon: SiPostman },
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      { name: "Vite", level: 85, icon: SiVite },
      { name: "GitHub", level: 90, icon: SiGithub },
      { name: "Bitbucket", level: 75, icon: SiBitbucket },
      { name: "Firebase", level: 75, icon: SiFirebase },
      { name: "Jira", level: 70, icon: SiJira },
      { name: "Android Studio", level: 70, icon: SiAndroidstudio },
    ],
  },
  {
    title: "Type Safety & Code Quality",
    skills: [
      { name: "ESLint", level: 80, icon: SiEslint },
      { name: "Prettier", level: 85, icon: SiPrettier },
      { name: "Zod", level: 70, icon: SiZod },
      { name: "Yup", level: 70, icon: MdVerifiedUser },
      { name: "Husky (Pre-commit Hooks)", level: 70, icon: SiGit },
    ],
  },
  {
    title: "Deployment",
    skills: [
      { name: "Vercel", level: 85, icon: SiVercel },
      { name: "Netlify", level: 80, icon: SiNetlify },
      { name: "Firebase Hosting", level: 75, icon: SiFirebase },
      {
        name: "GitHub Actions",
        level: 65,
        icon: SiGithubactions,
      },
    ],
  },
  {
    title: "AI & Productivity Tools",
    skills: [
      { name: "ChatGPT", level: 90, icon: SiOpenai },
      { name: "Claude", level: 90, icon: SiClaude },
      { name: "Gemini", level: 90, icon: SiGooglegemini },
      { name: "Github Copilot", level: 90, icon: SiGithubcopilot },
    ],
  },
];

export const projects = [
  {
    id: 1,
    title: "Movix",
    subtitle: "Movies & TV Shows App",
    description:
      "A web application for exploring movies and TV shows with trailers, cast details, ratings, and more.",
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
    description:
      "A pixel-perfect clone of LinkedIn's interface with responsive design and interactive components.",
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
    description:
      "A typing speed test application with WPM tracking, accuracy metrics, and competitive leaderboards.",
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
    description:
      "A minimalist banking interface with login, transfers, loans, and account management features.",
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

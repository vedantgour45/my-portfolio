import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import SkillsSection from "@/components/sections/SkillsSection";
import CareerSection from "@/components/sections/CareerSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import ContactSection from "@/components/sections/ContactSection";
import Footer from "@/components/layout/Footer";
import {
  getPersonal,
  getSkills,
  getProjects,
  getSocials,
  getExperience,
  getEducation,
} from "@/lib/content";

export default async function Home() {
  const [personal, skills, projects, socials, experience, education] =
    await Promise.all([
      getPersonal(),
      getSkills(),
      getProjects(),
      getSocials(),
      getExperience(),
      getEducation(),
    ]);

  return (
    <main id="main" className="w-full">
      <HeroSection personal={personal} />
      <AboutSection personal={personal} />
      <SkillsSection categories={skills} />
      <CareerSection experience={experience} education={education} />
      <ProjectsSection projects={projects} />
      <ContactSection personal={personal} socials={socials} />
      <Footer personal={personal} socials={socials} />
    </main>
  );
}

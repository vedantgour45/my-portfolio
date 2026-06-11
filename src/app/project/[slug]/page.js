import { notFound } from "next/navigation";
import {
  getProjectBySlug,
  getProjectSlugs,
  getProjects,
  getSocials,
  getPersonal,
} from "@/lib/content";
import ProjectDetail from "@/components/sections/ProjectDetail";
import Footer from "@/components/layout/Footer";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };
  return {
    title: `${project.title} — Vedant Gour`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image],
    },
  };
}

export default async function ProjectPage({ params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const [personal, socials, projects] = await Promise.all([
    getPersonal(),
    getSocials(),
    getProjects(),
  ]);

  // Prev/next within the full project order for the pager nav
  const index = projects.findIndex((p) => p.slug === params.slug);
  const prevProject = index > 0 ? projects[index - 1] : null;
  const nextProject =
    index >= 0 && index < projects.length - 1 ? projects[index + 1] : null;

  return (
    <>
      <ProjectDetail
        project={project}
        prevProject={prevProject}
        nextProject={nextProject}
      />
      <Footer personal={personal} socials={socials} />
    </>
  );
}

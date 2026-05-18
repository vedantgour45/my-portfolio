import { notFound } from "next/navigation";
import { getProjectBySlug, getProjectSlugs, getSocials, getPersonal } from "@/lib/content";
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

  const [personal, socials] = await Promise.all([getPersonal(), getSocials()]);

  return (
    <>
      <ProjectDetail project={project} />
      <Footer personal={personal} socials={socials} />
    </>
  );
}

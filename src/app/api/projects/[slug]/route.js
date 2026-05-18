import { NextResponse } from "next/server";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function GET(_req, { params }) {
  const project = await getProjectBySlug(params.slug);
  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }
  return NextResponse.json(project);
}

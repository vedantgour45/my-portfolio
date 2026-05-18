import "server-only";
import { cache } from "react";
import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

async function readJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
}

export const getPersonal = cache(async () => readJSON("personal.json"));
export const getNav = cache(async () => readJSON("nav.json"));
export const getSocials = cache(async () => readJSON("socials.json"));
export const getSkills = cache(async () => readJSON("skills.json"));
export const getProjects = cache(async () => readJSON("projects.json"));
export const getExperience = cache(async () => readJSON("experience.json"));
export const getEducation = cache(async () => readJSON("education.json"));

export const getProjectBySlug = cache(async (slug) => {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
});

export const getProjectSlugs = cache(async () => {
  const projects = await getProjects();
  return projects.map((p) => p.slug);
});

import { NextResponse } from "next/server";
import { getProjects } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getProjects();
  return NextResponse.json(data);
}

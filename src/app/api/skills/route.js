import { NextResponse } from "next/server";
import { getSkills } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getSkills();
  return NextResponse.json(data);
}

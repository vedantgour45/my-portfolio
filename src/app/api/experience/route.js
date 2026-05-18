import { NextResponse } from "next/server";
import { getExperience } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getExperience();
  return NextResponse.json(data);
}

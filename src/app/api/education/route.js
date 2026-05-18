import { NextResponse } from "next/server";
import { getEducation } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getEducation();
  return NextResponse.json(data);
}

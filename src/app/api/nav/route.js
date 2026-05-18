import { NextResponse } from "next/server";
import { getNav } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getNav();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";
import { getSocials } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getSocials();
  return NextResponse.json(data);
}

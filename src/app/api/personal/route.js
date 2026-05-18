import { NextResponse } from "next/server";
import { getPersonal } from "@/lib/content";

export const dynamic = "force-static";
export const revalidate = false;

export async function GET() {
  const data = await getPersonal();
  return NextResponse.json(data);
}

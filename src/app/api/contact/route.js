import { NextResponse } from "next/server";

export const runtime = "nodejs";

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body || {};

    if (!name || typeof name !== "string" || name.length < 2) {
      return NextResponse.json(
        { ok: false, error: "Please provide your name." },
        { status: 400 },
      );
    }
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { ok: false, error: "Please provide a valid email." },
        { status: 400 },
      );
    }
    if (!message || typeof message !== "string" || message.length < 5) {
      return NextResponse.json(
        { ok: false, error: "Message is too short." },
        { status: 400 },
      );
    }

    console.log("[contact]", {
      at: new Date().toISOString(),
      name,
      email,
      subject: subject || "(no subject)",
      message,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }
}

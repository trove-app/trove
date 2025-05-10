import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function GET(req: NextRequest) {
  try {
    const beRes = await fetch(`${BACKEND_URL}/api/v1/tables`);
    const data = await beRes.json();
    return new NextResponse(JSON.stringify(data), {
      status: beRes.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: any) {
    return new NextResponse(
      JSON.stringify({ detail: err.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
} 
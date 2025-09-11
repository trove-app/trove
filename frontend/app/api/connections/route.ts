import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

export async function GET() {
  try {
    console.log("BACKEND_URL", BACKEND_URL);
    const beRes = await fetch(`${BACKEND_URL}/api/v1/connections/`);
    const data = await beRes.json();
    return new NextResponse(JSON.stringify(data), {
      status: beRes.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Proxy error");
    return new NextResponse(
      JSON.stringify({ detail: error.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("BACKEND_URL", BACKEND_URL);
    const beRes = await fetch(`${BACKEND_URL}/api/v1/connections/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await beRes.json();
    return new NextResponse(JSON.stringify(data), {
      status: beRes.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Proxy error");
    return new NextResponse(
      JSON.stringify({ detail: error.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
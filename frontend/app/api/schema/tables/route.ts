import { NextResponse } from "next/server";

// In Docker, services can communicate using service names
// For local development, we use localhost
const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

export async function GET() {
  try {
    console.log("BACKEND_URL", BACKEND_URL);
    const beRes = await fetch(`${BACKEND_URL}/api/v1/tables`);
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
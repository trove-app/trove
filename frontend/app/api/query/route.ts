import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("[API/query] Incoming body:", body);
    
    // Forward connection ID from header
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const connectionId = req.headers.get('X-Connection-ID');
    if (connectionId) {
      headers['X-Connection-ID'] = connectionId;
    }

    console.log(headers)
    
    const beRes = await fetch(`${BACKEND_URL}/api/v1/query`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    const data = await beRes.json();
    console.log("[API/query] BE status:", beRes.status, "BE data:", data);
    return new NextResponse(JSON.stringify(data), {
      status: beRes.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("[API/query] Error:", error);
    return new NextResponse(
      JSON.stringify({ detail: error.message || "Proxy error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  return new NextResponse(
    JSON.stringify({ detail: "Method Not Allowed" }),
    { status: 405, headers: { "Content-Type": "application/json" } }
  );
} 
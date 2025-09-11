import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

export async function GET(request: Request) {
  try {
    console.log("BACKEND_URL", BACKEND_URL);
    
    // Forward connection ID from header
    const connectionId = request.headers.get('X-Connection-ID');
    const headers: Record<string, string> = {};
    if (connectionId) {
      headers['X-Connection-ID'] = connectionId;
    }


    console.log(headers)
    
    const beRes = await fetch(`${BACKEND_URL}/api/v1/tables`, { headers });
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
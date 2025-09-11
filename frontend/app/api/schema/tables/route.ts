import { NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://backend:8000";

export async function GET(request: Request) {
  try {
    console.log("BACKEND_URL", BACKEND_URL);
    const { searchParams } = new URL(request.url);
    const connectionId = searchParams.get('connection_id');
    
    let url = `${BACKEND_URL}/api/v1/tables`;
    if (connectionId) {
      url += `?connection_id=${connectionId}`;
    }
    
    const beRes = await fetch(url);
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
import { NextRequest, NextResponse } from "next/server"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002"
const API_KEY = process.env.CLYMB_API_KEY || ""

async function proxy(request: NextRequest, method: string) {
  const { pathname, search } = request.nextUrl
  const path = pathname.replace(/^\/api\/store\//, "")
  const url = `${API_BASE}/api/v1/store/${path}${search}`
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (API_KEY) headers["Authorization"] = `Bearer ${API_KEY}`

  try {
    const body = method === "GET" || method === "HEAD" ? undefined : await request.json()
    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to reach store API" },
      { status: 502 },
    )
  }
}

export async function GET(request: NextRequest) { return proxy(request, "GET") }
export async function POST(request: NextRequest) { return proxy(request, "POST") }
export async function PATCH(request: NextRequest) { return proxy(request, "PATCH") }
export async function DELETE(request: NextRequest) { return proxy(request, "DELETE") }

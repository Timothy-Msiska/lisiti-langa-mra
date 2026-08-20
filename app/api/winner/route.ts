import { NextResponse } from "next/server"
import { selectWinner } from "@/lib/draw"

export async function POST(request: Request) {
  const form = await request.formData()
  const position = String(form.get("position") ?? "")
  if (!position) {
    return NextResponse.json({ error: "Missing position" }, { status: 400 })
  }
  try {
    const result = selectWinner(position)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

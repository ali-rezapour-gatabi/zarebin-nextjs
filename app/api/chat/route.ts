import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { message } = await request.json()

  const text =
    typeof message === "string" && message.trim().length > 0 ? message.trim() : "your message"

  const reply = [
    "This is a mock AI response tailored to",
    `"${text.slice(0, 120)}".`,
    "In a real application, this is where you would call your model API and stream tokens back to the client.",
  ].join(" ")

  return NextResponse.json({ reply, }, { status: 200, })
}


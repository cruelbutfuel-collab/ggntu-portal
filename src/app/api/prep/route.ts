import { NextRequest, NextResponse } from 'next/server'

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwwsMK_pyM1oJA52ASth0qWT1N_1C-9Ax0aEJoiNhlbra38oD-5tHIK5pKSX5bfQd278g/exec'

export async function POST(req: NextRequest) {
  const data = await req.json()
  await fetch(SHEET_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return NextResponse.json({ ok: true })
}

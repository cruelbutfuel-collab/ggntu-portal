import { NextRequest, NextResponse } from 'next/server'

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwwsMK_pyM1oJA52ASth0qWT1N_1C-9Ax0aEJoiNhlbra38oD-5tHIK5pKSX5bfQd278g/exec'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const params = new URLSearchParams({
      name:        data.name        ?? '',
      grade:       data.grade       ?? '',
      age:         String(data.age  ?? ''),
      subject:     data.subject     ?? '',
      phone:       data.phone       ?? '',
      parentPhone: data.parentPhone ?? '',
    })
    await fetch(`${SHEET_URL}?${params.toString()}`, { redirect: 'follow' })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

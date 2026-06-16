import { NextRequest, NextResponse } from 'next/server'
import { generateDestinationDescription } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const { name, country, highlights } = await req.json()
  const description = await generateDestinationDescription(name, country, highlights ?? [])
  return NextResponse.json({ description })
}

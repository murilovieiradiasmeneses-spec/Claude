import { NextRequest, NextResponse } from 'next/server'
import { generateOfferContent } from '@/lib/ai'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const content = await generateOfferContent(
    body.offerTitle,
    body.destination,
    body.country,
    body.startDate,
    body.endDate,
    body.price,
    body.currency,
    body.includes,
    body.itinerary
  )
  return NextResponse.json(content)
}

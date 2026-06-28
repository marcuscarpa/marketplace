import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.error('CSP Violation:', JSON.stringify(body));
  } catch {
  }

  return new NextResponse(null, { status: 204 });
}

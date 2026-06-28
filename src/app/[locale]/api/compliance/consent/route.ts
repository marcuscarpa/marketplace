import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { logAuditEvent } from '@/lib/compliance/audit';
import { recordConsent } from '@/lib/compliance/consent';

const CONSENT_VERSION = '1.0';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await request.json();
    const customerId = cookieStore.get('shopify_customer_id')?.value;
    const userId = customerId;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const consent = body.consent === true;
    const version = body.version ?? CONSENT_VERSION;

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const userAgent = request.headers.get('user-agent') ?? undefined;

    await recordConsent(userId, consent, version, { ip, userAgent });
    await logAuditEvent(
      consent ? 'consent_recorded' : 'consent_declined',
      userId,
      { version },
      { ip: ip ?? undefined }
    );

    return NextResponse.json({ recorded: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to record consent' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { checkRateLimit } from '@/lib/security/bot-protection';
import { collectUserData, logAuditEvent } from '@/lib/compliance/audit';

export async function GET(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown';
  const { blocked } = await checkRateLimit(ip);
  if (blocked) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;

    if (!accessToken) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = request.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const accessTokenHash = cookieStore.get('access_token_hash')?.value;
    if (accessTokenHash) {
      const encoder = new TextEncoder();
      const data = encoder.encode(accessToken);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const expectedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      if (expectedHash !== accessTokenHash) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
    }

    const customerId = cookieStore.get('shopify_customer_id')?.value;
    if (customerId && customerId !== userId) {
      return NextResponse.json({ error: 'Forbidden: userId mismatch' }, { status: 403 });
    }

    const data = await collectUserData(userId);

    await logAuditEvent('data_exported', userId, {
      consentRecords: data.consent ? 1 : 0,
      auditEvents: data.auditHistory.length,
    });

    return NextResponse.json({
      data,
      exportedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

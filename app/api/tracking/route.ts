import { getTrackingInfo } from '@/lib/tracking';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get('tracking');
  const carrier = searchParams.get('carrier');

  if (!trackingNumber || !carrier) {
    return NextResponse.json(
      { error: 'Missing tracking number or carrier' },
      { status: 400 }
    );
  }

  const tracking = await getTrackingInfo(trackingNumber, carrier);
  return NextResponse.json(tracking);
} 
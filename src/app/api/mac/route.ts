import { NextResponse } from 'next/server';
import { getMacAddresses } from 'utils';

export async function GET() {
  const mac = await getMacAddresses();

  if (!mac) {
    return NextResponse.json({ error: 'MAC address not found' }, { status: 404 });
  }

  return NextResponse.json({ mac });
}
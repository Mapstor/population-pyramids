import { NextResponse } from 'next/server';
import { loadStates } from '@/lib/state-data-loader';

export async function GET() {
  try {
    const states = await loadStates();
    return NextResponse.json(states);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load states data' }, { status: 500 });
  }
}
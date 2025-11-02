import { NextResponse } from 'next/server';
import { loadCountries } from '@/lib/data-loader';

export async function GET() {
  try {
    const countries = await loadCountries();
    return NextResponse.json(countries);
  } catch (error) {
    console.error('Failed to load countries:', error);
    return NextResponse.json(
      { error: 'Failed to load countries' },
      { status: 500 }
    );
  }
}
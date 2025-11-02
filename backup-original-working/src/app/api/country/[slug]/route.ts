import { NextResponse } from 'next/server';
import { loadCountryData } from '@/lib/data-loader';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const countryData = await loadCountryData(params.slug);
    return NextResponse.json(countryData);
  } catch (error) {
    console.error(`Failed to load data for ${params.slug}:`, error);
    return NextResponse.json(
      { error: `Country data not found: ${params.slug}` },
      { status: 404 }
    );
  }
}
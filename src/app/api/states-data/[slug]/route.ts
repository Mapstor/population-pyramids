import { NextResponse } from 'next/server';
import { loadStateData } from '@/lib/state-data-loader';
import { cleanStateYearData } from '@/lib/state-data-cleaner';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const stateData = await loadStateData(params.slug);
    
    // Clean the data for each year
    const cleanedYears: any = {};
    Object.keys(stateData.years).forEach(year => {
      cleanedYears[year] = cleanStateYearData(stateData.years[year]);
    });
    
    const cleanedData = {
      ...stateData,
      years: cleanedYears
    };
    
    return NextResponse.json(cleanedData);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load state data' }, { status: 500 });
  }
}
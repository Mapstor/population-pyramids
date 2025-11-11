import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { state: string } }
) {
  try {
    const stateName = params.state;
    const dataPath = path.join(process.cwd(), 'src', 'data', 'states', `${stateName}.json`);
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ error: 'State not found' }, { status: 404 });
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    return NextResponse.json(data.years);
  } catch (error) {
    console.error('Error loading state data:', error);
    return NextResponse.json({ error: 'Failed to load state data' }, { status: 500 });
  }
}
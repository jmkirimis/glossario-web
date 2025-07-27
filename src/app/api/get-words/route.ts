import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') || '1';
  const search = searchParams.get('search') || '';

  const response = await fetch(`https://ecee-api.onrender.com/api/words?page=${page}&limit=20&search=${encodeURIComponent(search)}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': process.env.API_SECRET_KEY as string,
    },
  });

  const data = await response.json();
  return NextResponse.json(data.words, { status: response.status });
}
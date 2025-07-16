import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const response = await fetch(`https://ecee-api.onrender.com/api/word/import`, {
    method: 'POST',
    headers: {
      'X-Webhook-Secret': process.env.API_SECRET_KEY as string,
    },
    body: formData, // agora enviando corretamente como multipart/form-data
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

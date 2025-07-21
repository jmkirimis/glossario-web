import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('token')?.value;
  const formData = await req.formData();

  const response = await fetch(`https://ecee-api.onrender.com/words/import`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData, // agora enviando corretamente como multipart/form-data
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

// app/api/user-delete/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  const body = await req.json();

  const response = await fetch('http://localhost:5000/user', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Webhook-Secret': process.env.API_SECRET_KEY as string,
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
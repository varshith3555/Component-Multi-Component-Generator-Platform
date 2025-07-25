import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const url = `${backendUrl}/api/auth/${params.route.join('/')}`;
  const body = await req.text();
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.text();
  return new NextResponse(data, { status: res.status, headers: { 'Content-Type': 'application/json' } });
} 
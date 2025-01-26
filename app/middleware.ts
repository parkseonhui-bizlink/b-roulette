import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const correctPassword = process.env.MEMBER_PASSWORD || '';
  const password = req.cookies.get('password')?.value; // 쿠키 값을 문자열로 변환

  if (url.pathname.startsWith('/members')) {
    if (password !== correctPassword) {
      url.pathname = '/password';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

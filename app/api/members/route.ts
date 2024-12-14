import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: 모든 멤버 가져오기
export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(members);
}

// POST: 새 멤버 추가
export async function POST(request: Request) {
  const { name, chatworkId } = await request.json();
  const newMember = await prisma.member.create({
    data: {
      name,
      chatworkId,
      excluded: false,
      excludedUntil: null, // 기본값으로 null 설정
    },
  });
  return NextResponse.json(newMember);
}

// PUT: 멤버 정보 업데이트 (excluded 또는 excludedUntil 갱신)
export async function PUT(request: Request) {
  const { id, excluded, excludedUntil } = await request.json();

  // 멤버 정보 업데이트
  const updatedMember = await prisma.member.update({
    where: { id },
    data: {
      excluded,
      excludedUntil: excludedUntil ? new Date(excludedUntil) : null,
    },
  });

  return NextResponse.json(updatedMember);
}

// DELETE: 멤버 삭제
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.member.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

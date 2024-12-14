import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// PUT: 멤버 제외 기한 설정
export async function PUT(request: Request) {
  const { id, excludedUntil } = await request.json();

  try {
    const updatedMember = await prisma.member.update({
      where: { id },
      data: {
        excluded: !!excludedUntil, // excluded 상태를 설정
        excludedUntil: excludedUntil ? new Date(excludedUntil) : null,
      },
    });

    return NextResponse.json(updatedMember);
  } catch (error) {
    console.error('Error updating exclusion:', error);
    return NextResponse.json({ error: 'Failed to update exclusion' }, { status: 500 });
  }
}

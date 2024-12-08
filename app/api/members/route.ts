import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const members = await prisma.member.findMany({
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(members);
}

export async function POST(request: Request) {
  const { name } = await request.json();
  const newMember = await prisma.member.create({
    data: { name, excluded: false },
  });
  return NextResponse.json(newMember);
}

export async function PUT(request: Request) {
  const { id, excluded } = await request.json();
  const updatedMember = await prisma.member.update({
    where: { id },
    data: { excluded },
  });
  return NextResponse.json(updatedMember);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.member.delete({
    where: { id },
  });
  return NextResponse.json({ success: true });
}

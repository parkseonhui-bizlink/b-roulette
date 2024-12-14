import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { winner } = await request.json();

  if (!winner) {
    return NextResponse.json({ error: 'Winner is required' }, { status: 400 });
  }

  const roomId = process.env.CHATWORK_ROOM_ID;
  const apiToken = process.env.CHATWORK_API_KEY;

  if (!roomId || !apiToken) {
    return NextResponse.json({ error: 'Chatwork credentials are missing' }, { status: 500 });
  }

  const member = await prisma.member.findFirst({
    where: { name: winner },
  });

  if (!member || !member.chatworkId) {
    return NextResponse.json({ error: `Chatwork ID not found for winner: ${winner}` }, { status: 404 });
  }

  const uri = `https://api.chatwork.com/v2/rooms/${roomId}/tasks`;
  const header = {
    'X-ChatWorkToken': apiToken,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const taskBody = `${winner}さん、次回の司会をお願いします！(bow)\n以下のスプレッドシートを確認してください\nhttps://docs.google.com/spreadsheets/d/your_spreadsheet_id`;

  const body = `body=${encodeURIComponent(taskBody)}&limit_type=none&to_ids=${member.chatworkId}`;

  try {
    const response = await fetch(uri, {
      method: 'POST',
      headers: header,
      body: body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to create task:', errorText);
      throw new Error(`Failed to create task: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating task in Chatwork:', (error as Error).message);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

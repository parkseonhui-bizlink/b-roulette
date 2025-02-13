import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { winner, taskType } = await request.json();

  // winner와 taskType 유효성 검사
  if (!winner) {
    return NextResponse.json({ error: 'Winner is required' }, { status: 400 });
  }
  if (!taskType) {
    return NextResponse.json({ error: 'Task type is required' }, { status: 400 });
  }

  // 환경 변수 확인
  const roomId = process.env.CHATWORK_ROOM_ID;
  const apiToken = process.env.CHATWORK_API_KEY;

  if (!roomId || !apiToken) {
    return NextResponse.json({ error: 'Chatwork credentials are missing' }, { status: 500 });
  }

  // Prisma를 통해 멤버 조회
  const member = await prisma.member.findFirst({
    where: { name: winner },
  });

  if (!member || !member.chatworkId) {
    return NextResponse.json({ error: `Chatwork ID not found for winner: ${winner}` }, { status: 404 });
  }

  // taskType에 따른 메시지 내용 설정
  let taskBody = '';
  switch (taskType) {
    case 'type1':
      taskBody = `${winner}さん、次回の司会をお願いします！(bow)\n⭐️朝会開始の5分前までに休憩スペースに集まっていただけますようお願いいたします！⭐️\n\n以下のスプレッドシートを確認してください\n▼朝会タイムテーブル\nhttps://docs.google.com/spreadsheets/d/1D0PodSNye0jou5fpnDRNC0MxA2M4LpyVs9UDvxjvAOk/edit?gid=839297873#gid=839297873`;
      break;
    case 'type2':
      taskBody = `${winner}さん、月初の司会をお願いいたします！(bow)\n⭐️朝会開始の5分前までに休憩スペースに集まっていただけますようお願いいたします！⭐️\n\n以下のスプレッドシートを確認してください\n▼月初タイムテーブル\nhttps://docs.google.com/spreadsheets/d/1D0PodSNye0jou5fpnDRNC0MxA2M4LpyVs9UDvxjvAOk/edit?gid=518040338#gid=518040338`;
      break;
    case 'type3':
      taskBody = `${winner}さん、月末の司会をお願いいたします！(bow)\n⭐️朝会開始の5分前までに休憩スペースに集まっていただけますようお願いいたします！⭐️\n\n以下のスプレッドシートを確認してください\n▼月末タイムテーブル\nhttps://docs.google.com/spreadsheets/d/1D0PodSNye0jou5fpnDRNC0MxA2M4LpyVs9UDvxjvAOk/edit?gid=790912625#gid=790912625`;
      break;
    default:
      return NextResponse.json({ error: 'Invalid task type' }, { status: 400 });
  }

  // Chatwork API 요청
  const uri = `https://api.chatwork.com/v2/rooms/${roomId}/tasks`;
  const header = {
    'X-ChatWorkToken': apiToken,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

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

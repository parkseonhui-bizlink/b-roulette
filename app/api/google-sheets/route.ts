import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { winner } = await request.json();

    if (!winner) {
      return NextResponse.json({ error: 'No winner provided' }, { status: 400 });
    }

    // 환경 변수에서 GAS URL 가져오기
    const GAS_URL = process.env.GAS_URL;

    if (!GAS_URL) {
      throw new Error('GAS URL is not defined in environment variables.');
    }

    // GAS로 데이터 전송
    const gasResponse = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner }),
    });

    const gasResult = await gasResponse.json();

    if (!gasResponse.ok || gasResult.error) {
      throw new Error(gasResult.error || 'Failed to update Google Sheets.');
    }

    return NextResponse.json({ message: 'Google Sheets updated successfully!' });
  } catch (error) {
    console.error('Error updating Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to update Google Sheets.' }, { status: 500 });
  }
}

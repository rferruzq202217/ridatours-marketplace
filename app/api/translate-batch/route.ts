import { NextRequest, NextResponse } from 'next/server';
import { translateBatch } from '@/lib/translate';

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang } = await request.json();

    if (!texts || !targetLang) {
      return NextResponse.json({ error: 'Missing texts or targetLang' }, { status: 400 });
    }

    const translated = await translateBatch(texts, targetLang);

    return NextResponse.json({ translated, count: translated.length });
  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

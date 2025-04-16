// File: app/api/chat/route.js
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(req) {
    try {
        const body = await req.json();
        const { message } = body;

        const completion = await client.chat.completions.create({
            temperature: 0.6,
            model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
            messages: [
                {
                    role: 'user',
                    content: message || 'Hello!',
                },
            ],
        });

        return NextResponse.json({ content: completion.choices[0].message.content });
    } catch (error) {
        return NextResponse.json(
            { error: 'Lỗi xử lý chat', details: error.message },
            { status: 500 }
        );
    }
}

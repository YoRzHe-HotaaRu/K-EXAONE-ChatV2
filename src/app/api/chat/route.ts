import { NextRequest, NextResponse } from 'next/server';

// Default system prompt
const DEFAULT_SYSTEM_PROMPT = `You are K-EXAONE, a helpful, harmless, and honest AI assistant developed by LG AI Research. You provide accurate, thoughtful, and detailed responses while maintaining a friendly and professional tone.

When responding:
- Be clear and concise while being thorough
- Use markdown formatting when appropriate
- Break down complex topics into digestible parts
- Acknowledge uncertainty when you don't know something
- Provide examples when helpful`;

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        // Prepend system message if not present
        const hasSystemMessage = messages.some(
            (m: { role: string }) => m.role === 'system'
        );
        const apiMessages = hasSystemMessage
            ? messages
            : [{ role: 'system', content: DEFAULT_SYSTEM_PROMPT }, ...messages];

        // Make request directly to Friendli API for better streaming control
        const response = await fetch('https://api.friendli.ai/serverless/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.FRIENDLI_TOKEN}`,
            },
            body: JSON.stringify({
                model: 'LGAI-EXAONE/K-EXAONE-236B-A23B',
                messages: apiMessages,
                stream: true,
                parse_reasoning: true,
                chat_template_kwargs: {
                    enable_thinking: true,
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', errorText);
            return NextResponse.json(
                { error: errorText || 'API request failed' },
                { status: response.status }
            );
        }

        // Stream the response
        const reader = response.body?.getReader();
        if (!reader) {
            return NextResponse.json(
                { error: 'No response body' },
                { status: 500 }
            );
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();

        const readable = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;

                        const chunk = decoder.decode(value, { stream: true });
                        const lines = chunk.split('\n');

                        for (const line of lines) {
                            if (line.startsWith('data: ')) {
                                const data = line.slice(6);
                                if (data === '[DONE]') {
                                    controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                                    continue;
                                }

                                try {
                                    const parsed = JSON.parse(data);
                                    const delta = parsed.choices?.[0]?.delta || {};

                                    const outputData = JSON.stringify({
                                        id: parsed.id,
                                        content: delta.content || '',
                                        reasoning_content: delta.reasoning_content || '',
                                        finish_reason: parsed.choices?.[0]?.finish_reason,
                                    });

                                    controller.enqueue(encoder.encode(`data: ${outputData}\n\n`));
                                } catch {
                                    // Skip unparseable chunks
                                }
                            }
                        }
                    }
                    controller.close();
                } catch (error) {
                    console.error('Streaming error:', error);
                    const errorData = JSON.stringify({
                        error: error instanceof Error ? error.message : 'Streaming failed',
                    });
                    controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
                    controller.close();
                }
            },
        });

        return new Response(readable, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

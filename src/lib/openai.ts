import OpenAI from 'openai';

/**
 * OpenAI client configured for K-EXAONE via Friendli API
 */
export const openai = new OpenAI({
    apiKey: process.env.FRIENDLI_TOKEN,
    baseURL: 'https://api.friendli.ai/serverless/v1',
});

/**
 * Model configuration for K-EXAONE
 */
export const MODEL_CONFIG = {
    model: 'LGAI-EXAONE/K-EXAONE-236B-A23B',
    parse_reasoning: true,
    chat_template_kwargs: {
        enable_thinking: true,
    },
} as const;

/**
 * Default system prompt for K-EXAONE
 */
export const DEFAULT_SYSTEM_PROMPT = `You are K-EXAONE, a helpful, harmless, and honest AI assistant developed by LG AI Research. You provide accurate, thoughtful, and detailed responses while maintaining a friendly and professional tone.

When responding:
- Be clear and concise while being thorough
- Use markdown formatting when appropriate
- Break down complex topics into digestible parts
- Acknowledge uncertainty when you don't know something
- Provide examples when helpful`;

/**
 * Get chat completion with streaming
 */
export async function getChatCompletion(
    messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
    stream: boolean = true
) {
    return openai.chat.completions.create({
        ...MODEL_CONFIG,
        messages,
        stream,
    } as Parameters<typeof openai.chat.completions.create>[0]);
}

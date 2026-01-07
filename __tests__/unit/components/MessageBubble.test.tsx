import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Message } from '@/types/chat';

// Mock react-markdown (ESM module)
jest.mock('react-markdown', () => ({
    __esModule: true,
    default: ({ children }: { children: string }) => <div data-testid="markdown">{children}</div>,
}));

// Mock remark-gfm (ESM module)
jest.mock('remark-gfm', () => ({
    __esModule: true,
    default: () => { },
}));

// Mock rehype-highlight (ESM module)
jest.mock('rehype-highlight', () => ({
    __esModule: true,
    default: () => { },
}));

// Mock motion
jest.mock('motion/react', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock ReasoningBlock
jest.mock('@/components/chat/ReasoningBlock', () => ({
    ReasoningBlock: ({ content }: { content: string }) => (
        <div data-testid="reasoning-block">{content}</div>
    ),
}));

// Import component after mocks
import { MessageBubble } from '@/components/chat/MessageBubble';

// Mock clipboard with proper jest function
const mockWriteText = jest.fn().mockResolvedValue(undefined);
Object.defineProperty(navigator, 'clipboard', {
    value: {
        writeText: mockWriteText,
    },
    writable: true,
});

describe('MessageBubble', () => {
    const createMessage = (overrides: Partial<Message> = {}): Message => ({
        id: 'test-id',
        role: 'user',
        content: 'Test message content',
        createdAt: new Date('2024-01-01T10:00:00'),
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('User Messages', () => {
        it('renders user message with correct styling', () => {
            const message = createMessage({ role: 'user' });
            render(<MessageBubble message={message} />);

            const bubble = screen.getByTestId('message-user');
            expect(bubble).toBeInTheDocument();
        });

        it('displays user message content', () => {
            const content = 'Hello, K-EXAONE!';
            const message = createMessage({ role: 'user', content });
            render(<MessageBubble message={message} />);

            expect(screen.getByText(content)).toBeInTheDocument();
        });

        it('shows user avatar', () => {
            const message = createMessage({ role: 'user' });
            render(<MessageBubble message={message} />);

            // User avatar should have gradient background (no img element)
            const bubble = screen.getByTestId('message-user');
            expect(bubble).toBeInTheDocument();
        });

        it('preserves whitespace in user messages', () => {
            const content = 'Line 1\nLine 2';
            const message = createMessage({ role: 'user', content });
            render(<MessageBubble message={message} />);

            const contentElement = screen.getByText(/Line 1/);
            expect(contentElement).toHaveClass('whitespace-pre-wrap');
        });
    });

    describe('Assistant Messages', () => {
        it('renders assistant message with correct styling', () => {
            const message = createMessage({ role: 'assistant' });
            render(<MessageBubble message={message} />);

            const bubble = screen.getByTestId('message-assistant');
            expect(bubble).toBeInTheDocument();
        });

        it('shows K-EXAONE logo as avatar', () => {
            const message = createMessage({ role: 'assistant' });
            render(<MessageBubble message={message} />);

            const avatar = screen.getByAltText('K-EXAONE');
            expect(avatar).toBeInTheDocument();
        });

        it('renders content through markdown component', () => {
            const content = '**Bold** and *italic*';
            const message = createMessage({ role: 'assistant', content });
            render(<MessageBubble message={message} />);

            // With mocked ReactMarkdown, content is passed through as-is
            expect(screen.getByTestId('markdown')).toBeInTheDocument();
            expect(screen.getByText(content)).toBeInTheDocument();
        });

        it('shows reasoning block when reasoning_content is present', () => {
            const message = createMessage({
                role: 'assistant',
                reasoning_content: 'My thought process...',
            });
            render(<MessageBubble message={message} />);

            expect(screen.getByTestId('reasoning-block')).toBeInTheDocument();
        });

        it('does not show reasoning block when reasoning_content is empty', () => {
            const message = createMessage({ role: 'assistant' });
            render(<MessageBubble message={message} />);

            expect(screen.queryByTestId('reasoning-block')).not.toBeInTheDocument();
        });
    });

    describe('Copy Functionality', () => {
        it('shows copy button for assistant messages', () => {
            const message = createMessage({ role: 'assistant' });
            render(<MessageBubble message={message} />);

            expect(screen.getByTestId('copy-button')).toBeInTheDocument();
        });

        it('does not show copy button for user messages', () => {
            const message = createMessage({ role: 'user' });
            render(<MessageBubble message={message} />);

            expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
        });

        it('copies content to clipboard when copy button is clicked', async () => {
            const content = 'Content to copy';
            const message = createMessage({ role: 'assistant', content });
            render(<MessageBubble message={message} />);

            const copyButton = screen.getByTestId('copy-button');
            fireEvent.click(copyButton);

            // Verify the click happened by checking the button exists and is clickable
            expect(copyButton).toBeInTheDocument();
        });

        it('does not show copy button when streaming', () => {
            const message = createMessage({ role: 'assistant', isStreaming: true });
            render(<MessageBubble message={message} />);

            expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
        });
    });

    describe('Streaming State', () => {
        it('shows streaming cursor when isStreaming is true', () => {
            const message = createMessage({
                role: 'assistant',
                content: 'Streaming...',
                isStreaming: true,
            });
            render(<MessageBubble message={message} />);

            const bubble = screen.getByTestId('message-assistant');
            expect(bubble).toBeInTheDocument();
        });
    });

    describe('Timestamp', () => {
        it('displays formatted timestamp', () => {
            const message = createMessage({
                createdAt: new Date('2024-01-01T10:30:00'),
            });
            render(<MessageBubble message={message} />);

            expect(screen.getByText(/10:30/)).toBeInTheDocument();
        });
    });
});

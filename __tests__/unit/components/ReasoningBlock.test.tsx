import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReasoningBlock } from '@/components/chat/ReasoningBlock';

// Mock motion
jest.mock('motion/react', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
        span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <span {...props}>{children}</span>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('ReasoningBlock', () => {
    it('renders nothing when content is empty and not streaming', () => {
        const { container } = render(<ReasoningBlock content="" />);
        expect(container.firstChild).toBeNull();
    });

    it('renders when content is provided', () => {
        render(<ReasoningBlock content="This is my reasoning process..." />);
        expect(screen.getByTestId('reasoning-block')).toBeInTheDocument();
    });

    it('displays the reasoning content', () => {
        const content = 'Let me think about this step by step...';
        render(<ReasoningBlock content={content} />);
        expect(screen.getByText(content)).toBeInTheDocument();
    });

    it('shows "Thinking..." label when streaming', () => {
        render(<ReasoningBlock content="" isStreaming={true} />);
        expect(screen.getByText('Thinking...')).toBeInTheDocument();
    });

    it('shows "Reasoning" label when not streaming', () => {
        render(<ReasoningBlock content="Some reasoning" isStreaming={false} />);
        expect(screen.getByText('Reasoning')).toBeInTheDocument();
    });

    it('starts expanded by default', () => {
        render(<ReasoningBlock content="Test content" />);
        const toggle = screen.getByTestId('reasoning-toggle');
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses when toggle is clicked', async () => {
        const user = userEvent.setup();
        render(<ReasoningBlock content="Test content" />);

        const toggle = screen.getByTestId('reasoning-toggle');
        await user.click(toggle);

        expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands when toggle is clicked again', async () => {
        const user = userEvent.setup();
        render(<ReasoningBlock content="Test content" />);

        const toggle = screen.getByTestId('reasoning-toggle');
        await user.click(toggle); // Collapse
        await user.click(toggle); // Expand

        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('renders with streaming indicator', () => {
        render(<ReasoningBlock content="Thinking..." isStreaming={true} />);
        expect(screen.getByTestId('reasoning-block')).toBeInTheDocument();
    });

    it('preserves whitespace in content', () => {
        const content = 'Line 1\nLine 2\nLine 3';
        render(<ReasoningBlock content={content} />);

        const container = screen.getByText(/Line 1/);
        expect(container).toHaveClass('whitespace-pre-wrap');
    });

    it('shows processing indicator when streaming with no content', () => {
        render(<ReasoningBlock content="" isStreaming={true} />);
        expect(screen.getByText('Processing...')).toBeInTheDocument();
    });
});

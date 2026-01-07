import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInput } from '@/components/chat/ChatInput';

// Mock motion
jest.mock('motion/react', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('ChatInput', () => {
    const mockOnSend = jest.fn();
    const mockOnAbort = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the input field', () => {
        render(<ChatInput onSend={mockOnSend} />);
        expect(screen.getByTestId('chat-input')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
        render(<ChatInput onSend={mockOnSend} placeholder="Ask me anything..." />);
        expect(screen.getByPlaceholderText('Ask me anything...')).toBeInTheDocument();
    });

    it('updates input value on change', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Hello, K-EXAONE!');

        expect(input).toHaveValue('Hello, K-EXAONE!');
    });

    it('calls onSend with input value when submit button is clicked', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Test message');

        const sendButton = screen.getByTestId('send-button');
        await user.click(sendButton);

        expect(mockOnSend).toHaveBeenCalledWith('Test message');
    });

    it('clears input after sending', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Test message');

        const sendButton = screen.getByTestId('send-button');
        await user.click(sendButton);

        expect(input).toHaveValue('');
    });

    it('does not send empty messages', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const sendButton = screen.getByTestId('send-button');
        await user.click(sendButton);

        expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('does not send whitespace-only messages', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, '   ');

        const sendButton = screen.getByTestId('send-button');
        await user.click(sendButton);

        expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('sends message on Enter key press', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Enter test{enter}');

        expect(mockOnSend).toHaveBeenCalledWith('Enter test');
    });

    it('does not send on Shift+Enter (allows new line)', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Line 1{shift>}{enter}{/shift}Line 2');

        expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('shows stop button when streaming', () => {
        render(<ChatInput onSend={mockOnSend} onAbort={mockOnAbort} isStreaming={true} />);

        const stopButton = screen.getByLabelText('Stop generating');
        expect(stopButton).toBeInTheDocument();
    });

    it('calls onAbort when stop button is clicked during streaming', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} onAbort={mockOnAbort} isStreaming={true} />);

        const stopButton = screen.getByLabelText('Stop generating');
        await user.click(stopButton);

        expect(mockOnAbort).toHaveBeenCalled();
    });

    it('disables input when disabled prop is true', () => {
        render(<ChatInput onSend={mockOnSend} disabled={true} />);

        const input = screen.getByTestId('chat-input');
        expect(input).toBeDisabled();
    });

    it('shows character count when typing', async () => {
        const user = userEvent.setup();
        render(<ChatInput onSend={mockOnSend} />);

        const input = screen.getByTestId('chat-input');
        await user.type(input, 'Hello');

        expect(screen.getByText('5 characters')).toBeInTheDocument();
    });
});
